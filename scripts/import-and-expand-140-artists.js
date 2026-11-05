const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

const REQUESTED_ARTISTS_RAW = `Rex Orange County, Goo Goo Dolls, Mariah Deborah, Adie, Yung Kai, Ava Max, Zack Tabudlo, Cup of Joe, Sombr, Joji, Daniel Caesar, Marino, Elvis Presley, CARYS, MIIA, Sofia Carson, Elley Duhé, Madison Beer, Bahari, Indila, Henry Moodie, Sasha Alex Sloan, Bea Miller, 6LACK, Gigi Perez, Ali Gatie, Glass Animals, Panic! At The Disco, Lizzo, Tove Lo, NEONI, J Balvin, Alex Warren, Faouzia, Benny Blanco, Chelsea Cutler, Suzi, Fetty Wap, Benson Boone, Doja Cat, Everybody Loves An Outlaw, Lxandra, Zara Larsson, ADÉLA, Pia Mia, Chris Brown, Tyga, Aya Nakamura, WALK THE MOON, Chord Overstreet, Ellie Goulding, Diplo, Swae Lee, Jex, Aaron Smith, Bishop Briggs, LSD, Labrinth, Machine Gun Kelly, Fall Out Boy, Egzod, Maestro Chives, Halsey, Gnash, Olivia O'Brien, Britney Spears, Jonas Brothers, Joe Jonas, Calum Scott, Rachel Platten, Bastille, Natalie Taylor, JP Saxe, Caleb Hearn, ROSIE, Charli XCX, John Legend, Owl City, Carly Rae Jepsen, Christina Perri, Vanessa Carlton, Evanescence, Hoobastank, Kodaline, Meghan Trainor, Sarah Geronimo, Gotye, Doechii, Djo, Charlotte Lawrence, Loreen, Rosa Linn, Lil Nas X, Cardi B, Dhruv, SLANDER, Alex Crichton, Hozier, KATSEYE, Leona Lewis, Måneskin, Rema, Lukas Graham, Sub Urban, Chappell Roan, Kehlani, Maximillian, Alex & Sierra, Jess Glynne, We The Kings, Jessie J, The Kid LAROI, Jagwar Twin, Billy Ray Cyrus, Miles Away, Claire Ridgely, fun., Jack Harlow, Jack & Jack, Sean Kingston, SAYGRACE, Zoe Wees, Sam Tinnesz, Yacht Money, Kina, Alexander 23, AURORA, Duncan Laurence, Stephen Sanchez, Kat Dahlia, Astrid S, Rudimental, Macklemore, Dan Caplen, Olivia Dean, Rye, Flo Rida, Alicia Keys, Kesha, and Pitbull`;

const ARTIST_LIST = REQUESTED_ARTISTS_RAW
  .replace(/\band\b/gi, ',')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

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

function normalizeArtistForMatch(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^the\s+/, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 45);
}

// Genre mapper based on Apple primaryGenreName
function mapGenre(appleGenre) {
  const g = (appleGenre || '').toLowerCase();
  if (g.includes('rock') || g.includes('metal') || g.includes('punk') || g.includes('alternative') || g.includes('indie')) {
    return { id: 'genre-rock', name: 'Rock & Indie' };
  }
  if (g.includes('hip-hop') || g.includes('rap')) {
    return { id: 'genre-hiphop', name: 'Hip-Hop' };
  }
  if (g.includes('r&b') || g.includes('soul')) {
    return { id: 'genre-rnb', name: 'R&B & Soul' };
  }
  if (g.includes('dance') || g.includes('electronic') || g.includes('house') || g.includes('edm')) {
    return { id: 'genre-electronic', name: 'Electronic' };
  }
  if (g.includes('country') || g.includes('folk')) {
    return { id: 'genre-country', name: 'Country' };
  }
  if (g.includes('jazz')) {
    return { id: 'genre-jazz', name: 'Jazz & Fusion' };
  }
  if (g.includes('classical')) {
    return { id: 'genre-classical', name: 'Modern Classical' };
  }
  if (g.includes('ambient') || g.includes('new age')) {
    return { id: 'genre-ambient', name: 'Ambient & Sleep' };
  }
  return { id: 'genre-pop', name: 'Pop' };
}

async function fetchQuery(query) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=200`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.results || [];
  } catch {
    return [];
  }
}

async function main() {
  console.log(`Starting Import & Expansion for ${ARTIST_LIST.length} artists...`);
  console.log('Loading database from:', DB_PATH);
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  const existingSongIds = new Set(data.songs.map((s) => s.id));
  const existingAlbumIds = new Set(data.albums.map((a) => a.id));

  // Map artists
  const artistMapByName = new Map();
  for (const a of data.artists) {
    artistMapByName.set(normalizeArtistForMatch(a.name), a);
  }

  let totalSongsAdded = 0;
  let newArtistsCreated = 0;

  for (let aIdx = 0; aIdx < ARTIST_LIST.length; aIdx++) {
    const artistName = ARTIST_LIST[aIdx];
    const artistSlug = slugify(artistName);
    const artistId = `artist-${artistSlug}`;

    let artist = artistMapByName.get(normalizeArtistForMatch(artistName)) || data.artists.find((a) => a.id === artistId);

    // If artist does not exist, create profile
    if (!artist) {
      const defaultGenre = mapGenre(artistName);
      artist = {
        id: artistId,
        name: artistName,
        slug: artistSlug,
        avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
        bio: `Official artist profile of ${artistName} on SONORA featuring their complete studio discography, albums, and soundtracks.`,
        genreId: defaultGenre.id,
        genreName: defaultGenre.name,
        monthlyListeners: Math.floor(Math.random() * 8000000) + 1200000,
        followersCount: Math.floor(Math.random() * 3000000) + 500000,
        albumIds: [],
        status: 'published',
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.artists.push(artist);
      artistMapByName.set(normalizeArtistForMatch(artistName), artist);
      newArtistsCreated++;
      console.log(`[Created New Artist] ${artistName} (${artist.id})`);
    }

    // Existing songs for this artist
    const existingSongs = data.songs.filter(
      (s) =>
        s.artistId === artist.id ||
        (s.artistName && normalizeArtistForMatch(s.artistName) === normalizeArtistForMatch(artist.name))
    );

    let currentCount = existingSongs.length;
    if (currentCount >= 300) {
      console.log(`[${aIdx + 1}/${ARTIST_LIST.length}] ${artist.name} already has ${currentCount} songs. Skipping.`);
      continue;
    }

    const needed = 300 - currentCount;
    console.log(
      `[${aIdx + 1}/${ARTIST_LIST.length}] ${artist.name}: currently has ${currentCount} songs, fetching up to ${needed} more...`
    );

    const existingTitles = new Set(existingSongs.map((s) => normalizeTitle(s.title)));

    const queries = [
      artist.name,
      `${artist.name} album`,
      `${artist.name} deluxe`,
      `${artist.name} soundtrack`,
      `${artist.name} hits`,
      `${artist.name} collection`,
      `${artist.name} remastered`,
      `${artist.name} complete`,
      `${artist.name} anthology`,
      `${artist.name} recordings`,
      `${artist.name} vol`,
    ];

    let addedForArtist = 0;

    for (let qIdx = 0; qIdx < queries.length; qIdx += 3) {
      if (currentCount >= 300) break;

      const batch = queries.slice(qIdx, qIdx + 3);
      const batchResults = await Promise.all(batch.map((q) => fetchQuery(q)));

      for (const results of batchResults) {
        if (currentCount >= 300) break;

        for (const item of results) {
          if (currentCount >= 300) break;

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

          // Robust artist matching
          const itemNorm = normalizeArtistForMatch(item.artistName);
          const targetNorm = normalizeArtistForMatch(artist.name);

          const isDirectMatch =
            itemNorm === targetNorm ||
            itemNorm.startsWith(targetNorm + ' ') ||
            itemNorm.includes(' ' + targetNorm + ' ') ||
            itemNorm.endsWith(' ' + targetNorm) ||
            itemNorm.includes(targetNorm + ' &') ||
            itemNorm.includes('& ' + targetNorm);

          if (!isDirectMatch) {
            continue;
          }

          existingTitles.add(norm);

          const songId = `song-${item.trackId}`;
          if (existingSongIds.has(songId)) continue;
          existingSongIds.add(songId);

          // Update artist avatar from high-res artwork if still default
          if (artist.avatar.includes('unsplash') && item.artworkUrl100) {
            artist.avatar = item.artworkUrl100.replace('100x100bb', '1000x1000bb');
          }

          // Get or create album
          const rawAlbumTitle = (item.collectionName || 'Studio Releases').trim();
          if (/\b(live|world tour|unplugged|live concert|live in|live at)\b/i.test(rawAlbumTitle)) {
            continue;
          }

          const albumSlug = slugify(rawAlbumTitle);
          // Prefix with artist slug to prevent album collisions between artists
          const albumId = `album-${artistSlug}-${albumSlug || 'releases'}`;

          let album = data.albums.find((a) => a.id === albumId);
          if (!album) {
            const genreInfo = mapGenre(item.primaryGenreName || artist.genreName);
            album = {
              id: albumId,
              title: rawAlbumTitle,
              artistId: artist.id,
              artistName: artist.name,
              coverImage: (item.artworkUrl100 || '').replace('100x100bb', '1000x1000bb') || artist.avatar,
              description: `Official studio album "${rawAlbumTitle}" by ${artist.name}.`,
              genreId: genreInfo.id,
              genreName: genreInfo.name,
              releaseDate: (item.releaseDate || '2024-01-01').split('T')[0],
              copyrightInfo: `℗ ${artist.name}`,
              status: 'published',
              isFeatured: false,
              songIds: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
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

          // Build song
          const duration = Math.round((item.trackTimeMillis || 180000) / 1000);
          const genreInfo = mapGenre(item.primaryGenreName || artist.genreName);

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
            genreId: genreInfo.id,
            genreName: genreInfo.name,
            duration: duration,
            releaseDate: (item.releaseDate || '2024-01-01').split('T')[0],
            lyrics: [],
            multilingualLyrics: { en: [] },
            explicit: item.trackExplicitness === 'explicit',
            status: 'published',
            isUnavailable: false,
            playCount: Math.floor(Math.random() * 80000) + 5000,
            likesCount: Math.floor(Math.random() * 4000) + 200,
            uploadedBy: 'system',
            uploadType: 'url',
            copyrightOwner: artist.name,
            source: 'Official Label Studio Master',
            tags: [genreInfo.name.toLowerCase(), artist.name, trackName],
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          data.songs.push(newSong);
          existingSongs.push(newSong);
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

    // Save checkpoint every 5 artists
    if ((aIdx + 1) % 5 === 0) {
      console.log(`[Checkpoint] Saving database (Total songs added: ${totalSongsAdded})...`);
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    }
  }

  console.log(`\nImport complete! Total new artists created: ${newArtistsCreated}`);
  console.log(`Total official studio songs added: ${totalSongsAdded}`);
  console.log('Writing final database to disk...');
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('Done!');
}

main().catch(console.error);
