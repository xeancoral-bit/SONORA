const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeFetch(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'SonoraMusic/2.0' } });
      if (res.status === 429) {
        console.log(`Rate limited on ${url}, waiting 3s...`);
        await delay(3000);
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      if (attempt === 3) return null;
      await delay(1000 * attempt);
    }
  }
  return null;
}

async function main() {
  console.log('Reading Sonora database...');
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  // Calculate song counts per artist
  const artistSongCounts = {};
  db.songs.forEach(s => {
    artistSongCounts[s.artistId] = (artistSongCounts[s.artistId] || 0) + 1;
  });

  // Find all artists with < 100 songs, sorted by fewest songs first
  const targetArtists = db.artists
    .map(a => ({
      artist: a,
      count: artistSongCounts[a.id] || 0
    }))
    .filter(item => item.count < 100)
    .sort((a, b) => a.count - b.count);

  console.log(`Found ${targetArtists.length} artists with < 100 songs to expand.`);

  const seenSongKeys = new Set();
  db.songs.forEach(s => {
    seenSongKeys.add(`${s.artistId}_${s.title.trim().toLowerCase()}`);
  });

  const existingAlbumIds = new Set(db.albums.map(a => a.id));
  let totalNewSongsAdded = 0;
  let totalNewAlbumsAdded = 0;
  let processedCount = 0;

  for (const { artist, count } of targetArtists) {
    processedCount++;
    console.log(`[${processedCount}/${targetArtists.length}] Expanding ${artist.name} (currently ${count} songs)...`);

    // Clean artist name for search (remove collaborative suffixes if any)
    const cleanSearchName = artist.name.split(',')[0].split('&')[0].split('feat.')[0].trim();
    const searchData = await safeFetch(`https://api.deezer.com/search/artist?q=${encodeURIComponent(cleanSearchName)}`);
    if (!searchData || !searchData.data || searchData.data.length === 0) {
      console.log(`  No Deezer artist found for "${cleanSearchName}". Skipping.`);
      continue;
    }

    // Best matching artist: match name or highest fan count
    const exactMatches = searchData.data.filter(d => d.name.toLowerCase() === cleanSearchName.toLowerCase());
    const bestDzArtist = exactMatches.length > 0
      ? exactMatches.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0]
      : searchData.data.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0];

    if (!bestDzArtist) continue;

    // Fetch releases
    const albumsData = await safeFetch(`https://api.deezer.com/artist/${bestDzArtist.id}/albums?limit=100`);
    if (!albumsData || !albumsData.data || albumsData.data.length === 0) {
      console.log(`  No albums found for Deezer artist ${bestDzArtist.name} (ID: ${bestDzArtist.id})`);
      continue;
    }

    const artistNewAlbums = [];
    const artistNewSongs = [];
    let currentTotal = count;

    for (const dzAlbum of albumsData.data) {
      if (currentTotal >= 115) break; // Reached goal of 100+ songs

      const releaseDate = dzAlbum.release_date || '2022-01-01';
      const releaseYear = parseInt(releaseDate.split('-')[0], 10) || 2022;
      const albumSlug = `album-${slugify(artist.name)}-${slugify(dzAlbum.title)}`;
      const coverImage = dzAlbum.cover_xl || dzAlbum.cover_big || dzAlbum.cover_medium || artist.avatar || artist.headerImage;

      let albumRecord = db.albums.find(a => a.id === albumSlug || (a.artistId === artist.id && a.title.toLowerCase() === dzAlbum.title.toLowerCase()));
      if (!albumRecord) {
        albumRecord = {
          id: albumSlug,
          title: dzAlbum.title,
          artistId: artist.id,
          artistName: artist.name,
          coverImage: coverImage,
          releaseDate: releaseDate,
          releaseYear: releaseYear,
          genreId: artist.genreId || 'genre-pop',
          genreName: artist.genreName || 'Pop',
          status: 'published',
          tracksCount: 0,
          description: `Official ${dzAlbum.record_type || 'release'} by ${artist.name} (${releaseYear}).`,
          createdAt: `${releaseDate}T00:00:00.000Z`,
          updatedAt: new Date().toISOString()
        };
        artistNewAlbums.push(albumRecord);
        existingAlbumIds.add(albumSlug);
      }

      // Fetch tracks for this album
      await delay(120); // polite rate limit
      const tracksData = await safeFetch(`https://api.deezer.com/album/${dzAlbum.id}/tracks?limit=100`);
      if (!tracksData || !tracksData.data) continue;

      let tracksAddedForAlbum = 0;
      for (const tr of tracksData.data) {
        const cleanTrackTitle = tr.title.trim();
        const songKey = `${artist.id}_${cleanTrackTitle.toLowerCase()}`;
        if (seenSongKeys.has(songKey)) continue;
        seenSongKeys.add(songKey);

        const songSlug = `song-${slugify(artist.name)}-${slugify(cleanTrackTitle)}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

        const songRecord = {
          id: songSlug,
          title: cleanTrackTitle,
          artistId: artist.id,
          artistName: artist.name,
          albumId: albumRecord.id,
          albumTitle: albumRecord.title,
          genreId: artist.genreId || 'genre-pop',
          genreName: artist.genreName || 'Pop',
          duration: tr.duration || 210,
          releaseDate: releaseDate,
          coverImage: coverImage,
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

        artistNewSongs.push(songRecord);
        tracksAddedForAlbum++;
        currentTotal++;

        if (currentTotal >= 115) break;
      }

      if (albumRecord.tracksCount === 0) {
        albumRecord.tracksCount = tracksAddedForAlbum;
      }
    }

    if (artistNewAlbums.length > 0 || artistNewSongs.length > 0) {
      db.albums.push(...artistNewAlbums);
      db.songs.push(...artistNewSongs);
      totalNewAlbumsAdded += artistNewAlbums.length;
      totalNewSongsAdded += artistNewSongs.length;
      console.log(`  -> Added ${artistNewAlbums.length} albums, ${artistNewSongs.length} songs. Total now: ${currentTotal}`);
    }

    // Save every 15 artists
    if (processedCount % 15 === 0) {
      console.log(`Saving checkpoint (processed ${processedCount} artists)...`);
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    }
  }

  console.log('\nFinal Save of Sonora database...');
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Successfully expanded all artists!`);
  console.log(`- New albums added: ${totalNewAlbumsAdded}`);
  console.log(`- New songs added: ${totalNewSongsAdded}`);
  console.log(`- Total library albums: ${db.albums.length}`);
  console.log(`- Total library songs: ${db.songs.length}`);
}

main().catch(console.error);
