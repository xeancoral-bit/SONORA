const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function fetchQuery(query) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=200`;
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.results || [];
  } catch {
    return [];
  }
}

async function main() {
  console.log('Loading database from:', DB_PATH);
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  const artists = data.artists || [];
  console.log(`Found ${artists.length} artists in database.`);

  const existingSongIds = new Set(data.songs.map((s) => s.id));
  const existingAlbumIds = new Set(data.albums.map((a) => a.id));

  // Map existing songs by artistId for instant lookup
  const artistSongsMap = new Map();
  for (const s of data.songs) {
    if (!artistSongsMap.has(s.artistId)) {
      artistSongsMap.set(s.artistId, []);
    }
    artistSongsMap.get(s.artistId).push(s);
  }

  let totalSongsAdded = 0;
  let artistsProcessed = 0;

  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i];
    const artistSongs = artistSongsMap.get(artist.id) || [];
    let currentCount = artistSongs.length;

    if (currentCount >= 500) {
      console.log(`[${i + 1}/${artists.length}] ${artist.name} already has ${currentCount} songs. Skipping.`);
      continue;
    }

    const needed = 500 - currentCount;
    console.log(
      `[${i + 1}/${artists.length}] ${artist.name}: currently has ${currentCount} songs, fetching up to ${needed} more...`
    );

    const existingTitles = new Set(artistSongs.map((s) => normalizeTitle(s.title)));

    const queries = [
      artist.name,
      `${artist.name} album`,
      `${artist.name} deluxe`,
      `${artist.name} soundtrack`,
      `${artist.name} hits`,
      `${artist.name} collection`,
      `${artist.name} remastered`,
      `${artist.name} vol`,
      `${artist.name} essential`,
      `${artist.name} anthology`,
      `${artist.name} platinum`,
      `${artist.name} complete`,
      `${artist.name} recordings`,
      `${artist.name} discography`
    ];

    let addedForArtist = 0;

    // Fetch queries in parallel batches of 3
    for (let qIdx = 0; qIdx < queries.length; qIdx += 3) {
      if (currentCount >= 500) break;

      const batch = queries.slice(qIdx, qIdx + 3);
      const batchResults = await Promise.all(batch.map((q) => fetchQuery(q)));

      for (const results of batchResults) {
        if (currentCount >= 500) break;

        for (const item of results) {
          if (currentCount >= 500) break;

          const trackName = (item.trackName || '').trim();
          if (!trackName || !item.previewUrl) continue;

          const norm = normalizeTitle(trackName);
          if (!norm || existingTitles.has(norm)) continue;

          // Strict filter: No live audio, no remixes, no karaoke, no commentary
          const lowerTrack = trackName.toLowerCase();
          if (
            /\b(live|en vivo|live at|live from|\(live\)|\[live\]|live concert|unplugged|live session)\b/i.test(
              lowerTrack
            ) ||
            /\b(remix|remixes|club mix|extended mix|vip mix|mashup|sped up|slowed|reverb)\b/i.test(lowerTrack) ||
            /\b(karaoke|tribute|instrumental|reaction|snippet|preview|interview|commentary|clean edit)\b/i.test(
              lowerTrack
            )
          ) {
            continue;
          }

          // Ensure it's actually by this artist
          const itemArtist = (item.artistName || '').toLowerCase();
          const targetArtist = artist.name.toLowerCase();
          if (
            !itemArtist.includes(targetArtist) &&
            !targetArtist.includes(itemArtist) &&
            !itemArtist.startsWith(targetArtist.slice(0, 5))
          ) {
            continue;
          }

          existingTitles.add(norm);

          const songId = `song-${item.trackId}`;
          if (existingSongIds.has(songId)) continue;
          existingSongIds.add(songId);

          // Get or create album
          const rawAlbumTitle = (item.collectionName || 'Studio Releases').trim();
          if (/\b(live|world tour|unplugged|live concert|live in|live at)\b/i.test(rawAlbumTitle)) {
            continue;
          }

          const albumSlug = rawAlbumTitle
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 40);
          const albumId = `album-${artist.id.replace('artist-', '')}-${albumSlug || 'releases'}`;

          let album = data.albums.find((a) => a.id === albumId);
          if (!album) {
            album = {
              id: albumId,
              title: rawAlbumTitle,
              artistId: artist.id,
              artistName: artist.name,
              coverImage: (item.artworkUrl100 || '').replace('100x100bb', '1000x1000bb') || artist.avatar,
              description: `Official studio album "${rawAlbumTitle}" by ${artist.name}.`,
              genreId: artist.genreId || 'genre-pop',
              genreName: artist.genreName || 'Pop',
              releaseDate: (item.releaseDate || '2024-01-01').split('T')[0],
              copyrightInfo: `℗ ${artist.name}`,
              status: 'published',
              isFeatured: false,
              songIds: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            data.albums.push(album);
            existingAlbumIds.add(albumId);
            if (!artist.albumIds.includes(albumId)) {
              artist.albumIds.push(albumId);
            }
          }

          if (!album.songIds.includes(songId)) {
            album.songIds.push(songId);
          }

          // Build song object
          const duration = Math.round((item.trackTimeMillis || 180000) / 1000);
          const newSong = {
            id: songId,
            title: trackName,
            originalFilename: `${norm.replace(/\s+/g, '-')}.mp3`,
            audioUrl: item.previewUrl,
            audioPath: item.previewUrl,
            coverImage:
              (item.artworkUrl100 || '').replace('100x100bb', '1000x1000bb') || album.coverImage || artist.avatar,
            artistId: artist.id,
            artistName: artist.name,
            albumId: album.id,
            albumTitle: album.title,
            genreId: artist.genreId || 'genre-pop',
            genreName: artist.genreName || 'Pop',
            duration: duration,
            releaseDate: (item.releaseDate || '2024-01-01').split('T')[0],
            lyrics: [],
            multilingualLyrics: { en: [] },
            explicit: item.trackExplicitness === 'explicit',
            status: 'published',
            isUnavailable: false,
            playCount: Math.floor(Math.random() * 50000) + 1200,
            likesCount: Math.floor(Math.random() * 2500) + 100,
            uploadedBy: 'system',
            uploadType: 'url',
            copyrightOwner: artist.name,
            source: 'Official Label Studio Master',
            tags: [
              (artist.genreName || 'pop').toLowerCase(),
              artist.name,
              trackName
            ],
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          data.songs.push(newSong);
          artistSongs.push(newSong);
          currentCount++;
          addedForArtist++;
          totalSongsAdded++;
        }
      }

      await sleep(100);
    }

    console.log(
      `  -> Added ${addedForArtist} official studio tracks for ${artist.name} (Total now: ${currentCount})`
    );

    artistsProcessed++;
    // Save checkpoint every 10 artists
    if (artistsProcessed % 10 === 0) {
      console.log(`[Checkpoint] Saving database (Total songs added so far: ${totalSongsAdded})...`);
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    }
  }

  console.log(`\nAll artists processed! Total songs added: ${totalSongsAdded}`);
  console.log('Writing final database to disk...');
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('Done!');
}

main().catch(console.error);
