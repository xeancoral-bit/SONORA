const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

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

async function fetchJsonWithRetry(url, maxRetries = 5) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000),
      });
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 1500 * i));
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      if (i === maxRetries) return null;
      await new Promise(r => setTimeout(r, 800 * i));
    }
  }
  return null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('=== TOPPING UP ALL ARTISTS WITH < 50 TRACKS ===');

  const songCounts = {};
  data.songs.forEach(s => songCounts[s.artistId] = (songCounts[s.artistId] || 0) + 1);

  // Filter to artists with < 50 tracks
  const lowArtists = data.artists.filter(a => (songCounts[a.id] || 0) < 50);
  console.log(`Found ${lowArtists.length} artists needing top-up.`);

  const existingSongIds = new Set(data.songs.map(s => s.id));
  const existingAlbumIds = new Set(data.albums.map(a => a.id));

  let totalAdded = 0;

  for (let i = 0; i < lowArtists.length; i++) {
    const artist = lowArtists[i];
    const artistSlug = slugify(artist.name);
    let currentCount = songCounts[artist.id] || 0;

    console.log(`[${i + 1}/${lowArtists.length}] ${artist.name} (currently ${currentCount} tracks)...`);

    // Search Deezer for artist, picking candidate with highest fans
    const searchData = await fetchJsonWithRetry(`https://api.deezer.com/search/artist?q=${encodeURIComponent(artist.name)}&limit=10`);
    if (!searchData?.data?.length) {
      console.log(`   No Deezer results for ${artist.name}`);
      continue;
    }

    // Sort by fans to find the primary verified artist
    const candidates = searchData.data.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0));
    const targetNorm = artist.name.toLowerCase().trim();
    const deezerArtist = candidates.find(c => c.name.toLowerCase().trim() === targetNorm) || candidates[0];

    if (!deezerArtist) continue;

    if (deezerArtist.picture_xl && (!artist.avatar || artist.avatar.includes('unsplash'))) {
      artist.avatar = deezerArtist.picture_xl;
      artist.coverImage = deezerArtist.picture_xl;
      artist.banner = deezerArtist.picture_xl;
    }

    const artistSongTitles = new Set(
      data.songs.filter(s => s.artistId === artist.id).map(s => normalizeTitle(s.title))
    );

    const addDeezerTrack = (track, albumData) => {
      if (!track || !track.title) return false;
      const trackTitle = (track.title || track.title_short || '').trim();
      if (!trackTitle) return false;

      const norm = normalizeTitle(trackTitle);
      if (artistSongTitles.has(norm)) return false;

      const lower = trackTitle.toLowerCase();
      if (/\b(live|en vivo|live at|live from|\(live\)|\[live\]|unplugged|live concert)\b/i.test(lower) ||
          /\b(remix|remixes|club mix|extended mix|vip mix|mashup|sped up|slowed|reverb)\b/i.test(lower) ||
          /\b(karaoke|instrumental|reaction|snippet|preview|interview|commentary)\b/i.test(lower)) {
        return false;
      }

      const songId = `song-dz-${track.id}`;
      if (existingSongIds.has(songId)) return false;

      const rawAlbumTitle = (albumData?.title || track.album?.title || `${trackTitle} - Single`).trim();
      const albumSlug = slugify(rawAlbumTitle);
      const albumId = `album-${artistSlug}-${albumSlug || 'releases'}`;

      let album = data.albums.find(a => a.id === albumId);
      const albumCover = albumData?.cover_xl || albumData?.cover_big || track.album?.cover_xl || track.album?.cover_big || artist.avatar;

      if (!album) {
        album = {
          id: albumId,
          title: rawAlbumTitle,
          artistId: artist.id,
          artistName: artist.name,
          coverImage: albumCover,
          description: `Official studio album "${rawAlbumTitle}" by ${artist.name}.`,
          genreId: artist.genreId || 'genre-pop',
          genreName: artist.genreName || 'Pop',
          releaseDate: (albumData?.release_date || '2024-01-01').split('T')[0],
          copyrightInfo: `℗ ${artist.name}`,
          status: 'published',
          isFeatured: false,
          songIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        data.albums.push(album);
        existingAlbumIds.add(albumId);
      }

      if (!artist.albumIds) artist.albumIds = [];
      if (!artist.albumIds.includes(album.id)) {
        artist.albumIds.push(album.id);
      }

      if (!album.songIds) album.songIds = [];
      if (!album.songIds.includes(songId)) {
        album.songIds.push(songId);
      }

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
        duration: track.duration || 180,
        audioUrl: track.preview || '',
        coverImage: albumCover,
        releaseDate: (album.releaseDate || '2024-01-01').split('T')[0],
        playCount: Math.floor(Math.random() * 500000) + 20000,
        likesCount: Math.floor(Math.random() * 90000) + 4000,
        status: 'published',
        isFeatured: currentCount < 5,
        trackNumber: track.track_position || album.songIds.length,
        explicit: !!track.explicit_lyrics,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.songs.push(song);
      existingSongIds.add(songId);
      artistSongTitles.add(norm);
      currentCount++;
      totalAdded++;
      return true;
    };

    // 1. Fetch top tracks
    const topData = await fetchJsonWithRetry(`https://api.deezer.com/artist/${deezerArtist.id}/top?limit=100`);
    for (const t of topData?.data || []) {
      addDeezerTrack(t, t.album);
      if (currentCount >= 80) break;
    }

    // 2. Fetch albums if needed
    if (currentCount < 60) {
      await sleep(50);
      const albumsData = await fetchJsonWithRetry(`https://api.deezer.com/artist/${deezerArtist.id}/albums?limit=25`);
      for (const alb of albumsData?.data || []) {
        if (currentCount >= 60) break;
        if (/\b(live|tour|remix|tribute|karaoke)\b/i.test(alb.title)) continue;

        await sleep(50);
        const trkData = await fetchJsonWithRetry(`https://api.deezer.com/album/${alb.id}/tracks?limit=30`);
        for (const t of trkData?.data || []) {
          addDeezerTrack(t, alb);
          if (currentCount >= 60) break;
        }
      }
    }

    console.log(`   -> Total now for ${artist.name}: ${currentCount}`);

    // Periodic write every 10 artists
    if (i % 10 === 0) {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      fs.writeFileSync(BACKUP_PATH, JSON.stringify(data, null, 2), 'utf8');
    }
    await sleep(60);
  }

  // Final referential integrity
  console.log('\nValidating album songIds and artist albumIds...');
  const albumSongMap = new Map();
  data.songs.forEach(s => {
    if (!albumSongMap.has(s.albumId)) albumSongMap.set(s.albumId, []);
    albumSongMap.get(s.albumId).push(s.id);
  });
  data.albums.forEach(a => {
    a.songIds = albumSongMap.get(a.id) || [];
  });

  const artistAlbumMap = new Map();
  data.albums.forEach(alb => {
    if (!artistAlbumMap.has(alb.artistId)) artistAlbumMap.set(alb.artistId, []);
    artistAlbumMap.get(alb.artistId).push(alb.id);
  });
  data.artists.forEach(art => {
    art.albumIds = artistAlbumMap.get(art.id) || [];
  });

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(data, null, 2), 'utf8');

  console.log('====================================================');
  console.log('🎉 TOP-UP COMPLETE!');
  console.log(`Added ${totalAdded} songs.`);
  console.log(`Total Songs: ${data.songs.length}`);
  console.log(`Total Albums: ${data.albums.length}`);
  console.log(`Total Artists: ${data.artists.length}`);
  console.log('====================================================');
}

run().catch(err => {
  console.error('Fatal error in topup:', err);
  process.exit(1);
});

