const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const TARGET_SONGS_PER_ARTIST = 250;

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 45);
}

function normalizeTitle(title) {
  return (title || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SonoraMusic/2.5' }
      });
      if (res.status === 429) {
        await delay(3000 * attempt);
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch {
      if (attempt === 3) return null;
      await delay(1000 * attempt);
    }
  }
  return null;
}

async function main() {
  console.log('========================================================');
  console.log('🎵 SONORA EXPAND DISCOGRAPHIES TO 300 TRACKS PER ARTIST');
  console.log('========================================================');

  let db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  db.songs = db.songs || [];
  db.albums = db.albums || [];
  db.artists = db.artists || [];

  const artistSongCounts = new Map();
  const existingSongTitlesByArtist = new Map();
  const existingSongIds = new Set(db.songs.map(s => s.id));
  const existingAlbumIds = new Set(db.albums.map(a => a.id));

  for (const s of db.songs) {
    artistSongCounts.set(s.artistId, (artistSongCounts.get(s.artistId) || 0) + 1);
    if (!existingSongTitlesByArtist.has(s.artistId)) {
      existingSongTitlesByArtist.set(s.artistId, new Set());
    }
    existingSongTitlesByArtist.get(s.artistId).add(normalizeTitle(s.title));
  }

  // Filter artists that have < TARGET_SONGS_PER_ARTIST
  const candidateArtists = db.artists
    .map(a => ({
      artist: a,
      count: artistSongCounts.get(a.id) || 0
    }))
    .filter(item => item.count < TARGET_SONGS_PER_ARTIST)
    .sort((a, b) => a.count - b.count);

  console.log(`Total artists in library: ${db.artists.length}`);
  console.log(`Artists needing expansion (< ${TARGET_SONGS_PER_ARTIST} tracks): ${candidateArtists.length}`);

  let totalSongsAdded = 0;
  let totalAlbumsAdded = 0;
  let processedCount = 0;

  for (const { artist, count } of candidateArtists) {
    processedCount++;
    let currentCount = count;
    console.log(`\n[${processedCount}/${candidateArtists.length}] Expanding "${artist.name}" (current: ${currentCount} songs)...`);

    // Clean search query
    const cleanSearch = artist.name.split(',')[0].split('&')[0].split('feat.')[0].trim();
    const searchRes = await fetchJson(`https://api.deezer.com/search/artist?q=${encodeURIComponent(cleanSearch)}`);
    const artistsList = searchRes?.data || [];

    if (artistsList.length === 0) {
      console.log(`  -> No Deezer profile found for "${cleanSearch}". Skipping.`);
      continue;
    }

    // Match exact or highest fan count
    const exactMatches = artistsList.filter(d => d.name.toLowerCase() === cleanSearch.toLowerCase());
    const dzArtist = exactMatches.length > 0
      ? exactMatches.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0]
      : artistsList.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0];

    if (!dzArtist) continue;

    // Fetch official albums
    await delay(100);
    const albumsRes = await fetchJson(`https://api.deezer.com/artist/${dzArtist.id}/albums?limit=100`);
    const dzAlbums = albumsRes?.data || [];

    if (dzAlbums.length === 0) {
      console.log(`  -> No albums found on Deezer for ${artist.name}`);
      continue;
    }

    if (!existingSongTitlesByArtist.has(artist.id)) {
      existingSongTitlesByArtist.set(artist.id, new Set());
    }
    const artistSongTitles = existingSongTitlesByArtist.get(artist.id);
    const artistSlug = slugify(artist.name);

    let artistAddedSongs = 0;
    let artistAddedAlbums = 0;

    for (const dzAlbum of dzAlbums) {
      if (currentCount >= TARGET_SONGS_PER_ARTIST) break;

      const rawAlbumTitle = (dzAlbum.title || '').trim();
      if (!rawAlbumTitle) continue;

      const lowerAlbum = rawAlbumTitle.toLowerCase();
      // Skip karaoke, live bootlegs, commentary
      if (/\b(karaoke|tribute|instrumental version|sound-a-like)\b/i.test(lowerAlbum)) continue;

      const albumSlug = slugify(rawAlbumTitle);
      const albumId = `album-${artistSlug}-${albumSlug || 'release'}`;

      let album = db.albums.find(a => a.id === albumId);
      const albumCover = dzAlbum.cover_xl || dzAlbum.cover_big || dzAlbum.cover_medium || artist.avatar;
      const releaseDate = dzAlbum.release_date || '2024-01-01';
      const releaseYear = parseInt(releaseDate.split('-')[0], 10) || 2024;

      if (!album) {
        album = {
          id: albumId,
          title: rawAlbumTitle,
          artistId: artist.id,
          artistName: artist.name,
          coverImage: albumCover,
          description: `Official studio album "${rawAlbumTitle}" by ${artist.name} (${releaseYear}).`,
          genreId: artist.genreId || 'genre-pop',
          genreName: artist.genreName || 'Pop',
          releaseDate: releaseDate,
          releaseYear: releaseYear,
          copyrightInfo: `℗ ${artist.name}`,
          status: 'published',
          isFeatured: false,
          songIds: [],
          tracksCount: 0,
          createdAt: `${releaseDate}T00:00:00.000Z`,
          updatedAt: new Date().toISOString(),
        };
        db.albums.push(album);
        existingAlbumIds.add(albumId);
        artistAddedAlbums++;
        totalAlbumsAdded++;
      }

      if (!artist.albumIds) artist.albumIds = [];
      if (!artist.albumIds.includes(album.id)) {
        artist.albumIds.push(album.id);
      }

      // Fetch tracks for this album
      await delay(120);
      const tracksRes = await fetchJson(`https://api.deezer.com/album/${dzAlbum.id}/tracks?limit=100`);
      const dzTracks = tracksRes?.data || [];

      for (const tr of dzTracks) {
        if (currentCount >= TARGET_SONGS_PER_ARTIST) break;
        if (!tr || !tr.title) continue;

        const trackTitle = (tr.title || tr.title_short || '').trim();
        if (!trackTitle) continue;

        const normTitle = normalizeTitle(trackTitle);
        if (artistSongTitles.has(normTitle)) continue;

        const lowerTrack = trackTitle.toLowerCase();
        if (/\b(live|en vivo|live at|live from|\(live\)|\[live\]|unplugged|live concert)\b/i.test(lowerTrack) ||
            /\b(remix|remixes|club mix|extended mix|vip mix|mashup|sped up|slowed|reverb)\b/i.test(lowerTrack) ||
            /\b(karaoke|reaction|snippet|preview|interview|commentary)\b/i.test(lowerTrack)) {
          continue;
        }

        const songId = `song-dz-${tr.id}`;
        if (existingSongIds.has(songId)) continue;

        const song = {
          id: songId,
          title: trackTitle,
          artistId: artist.id,
          artistName: artist.name,
          albumId: album.id,
          albumTitle: album.title,
          albumName: album.title,
          genreId: artist.genreId || 'genre-pop',
          genreName: artist.genreName || 'Pop',
          duration: tr.duration || 210,
          releaseDate: releaseDate,
          coverImage: albumCover,
          audioUrl: tr.preview || '',
          sourcePlatform: 'direct',
          uploadType: 'url',
          sourceType: 'external_url',
          lyrics: '',
          syncedLyrics: [],
          multilingualLyrics: { en: [] },
          status: 'published',
          playCount: tr.rank || Math.floor(Math.random() * 400000 + 80000),
          likesCount: Math.floor((tr.rank || 200000) * 0.08),
          explicit: tr.explicit_lyrics || false,
          isFeatured: tr.rank > 500000,
          createdAt: `${releaseDate}T00:00:00.000Z`,
          updatedAt: new Date().toISOString()
        };

        db.songs.push(song);
        existingSongIds.add(songId);
        artistSongTitles.add(normTitle);

        if (!album.songIds) album.songIds = [];
        if (!album.songIds.includes(songId)) {
          album.songIds.push(songId);
        }
        album.tracksCount = album.songIds.length;

        currentCount++;
        artistAddedSongs++;
        totalSongsAdded++;
      }
    }

    console.log(`  -> Added ${artistAddedSongs} songs, ${artistAddedAlbums} albums (New Total: ${currentCount})`);

    // Checkpoint save every 10 artists
    if (processedCount % 10 === 0) {
      console.log(`\n💾 Checkpoint save: ${db.songs.length} songs, ${db.albums.length} albums in database...`);
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
      fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
    }
  }

  // Final persist
  console.log('\n========================================================');
  console.log('✅ EXPANSION COMPLETE!');
  console.log(`Total New Songs Added: ${totalSongsAdded}`);
  console.log(`Total New Albums Added: ${totalAlbumsAdded}`);
  console.log(`Final Database Songs: ${db.songs.length}`);
  console.log(`Final Database Albums: ${db.albums.length}`);
  console.log(`Final Database Artists: ${db.artists.length}`);
  console.log('========================================================');

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
}

main().catch(console.error);

