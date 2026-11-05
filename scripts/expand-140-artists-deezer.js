const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

const REQUESTED_ARTISTS_RAW = `Rex Orange County, Goo Goo Dolls, Mariah Deborah, Adie, Yung Kai, Ava Max, Zack Tabudlo, Cup of Joe, Sombr, Joji, Daniel Caesar, Marino, Elvis Presley, CARYS, MIIA, Sofia Carson, Elley Duhé, Madison Beer, Bahari, Indila, Henry Moodie, Sasha Alex Sloan, Bea Miller, 6LACK, Gigi Perez, Ali Gatie, Glass Animals, Panic! At The Disco, Lizzo, Tove Lo, NEONI, J Balvin, Alex Warren, Faouzia, Benny Blanco, Chelsea Cutler, Suzi, Fetty Wap, Benson Boone, Doja Cat, Everybody Loves An Outlaw, Lxandra, Zara Larsson, ADÉLA, Pia Mia, Chris Brown, Tyga, Aya Nakamura, WALK THE MOON, Chord Overstreet, Ellie Goulding, Diplo, Swae Lee, Jex, Aaron Smith, Bishop Briggs, LSD, Labrinth, Machine Gun Kelly, Fall Out Boy, Egzod, Maestro Chives, Halsey, Gnash, Olivia O'Brien, Britney Spears, Jonas Brothers, Joe Jonas, Calum Scott, Rachel Platten, Bastille, Natalie Taylor, JP Saxe, Caleb Hearn, ROSIE, Charli XCX, John Legend, Owl City, Carly Rae Jepsen, Christina Perri, Vanessa Carlton, Evanescence, Hoobastank, Kodaline, Meghan Trainor, Sarah Geronimo, Gotye, Doechii, Djo, Charlotte Lawrence, Loreen, Rosa Linn, Lil Nas X, Cardi B, Dhruv, SLANDER, Alex Crichton, Hozier, KATSEYE, Leona Lewis, Måneskin, Rema, Lukas Graham, Sub Urban, Chappell Roan, Kehlani, Maximillian, Alex & Sierra, Jess Glynne, We The Kings, Jessie J, The Kid LAROI, Jagwar Twin, Billy Ray Cyrus, Miles Away, Claire Ridgely, fun., Jack Harlow, Jack & Jack, Sean Kingston, SAYGRACE, Zoe Wees, Sam Tinnesz, Yacht Money, Kina, Alexander 23, AURORA, Duncan Laurence, Stephen Sanchez, Kat Dahlia, Astrid S, Rudimental, Macklemore, Dan Caplen, Olivia Dean, Rye, Flo Rida, Alicia Keys, Kesha, Pitbull`;

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

// Genre mapper
function mapGenre(artistName) {
  const an = (artistName || '').toLowerCase();

  if (an.includes('billy ray cyrus') || an.includes('country')) {
    return { id: 'genre-country', name: 'Country' };
  }
  if (
    an.includes('evanescence') ||
    an.includes('fall out boy') ||
    an.includes('hoobastank') ||
    an.includes('goo goo dolls') ||
    an.includes('we the kings') ||
    an.includes('panic! at the disco') ||
    an.includes('bastille') ||
    an.includes('kodaline') ||
    an.includes('glass animals') ||
    an.includes('walk the moon') ||
    an.includes('fun.')
  ) {
    return { id: 'genre-rock', name: 'Rock & Indie' };
  }
  if (
    an.includes('tyga') ||
    an.includes('fetty wap') ||
    an.includes('jack harlow') ||
    an.includes('cardi b') ||
    an.includes('lil nas x') ||
    an.includes('macklemore') ||
    an.includes('flo rida') ||
    an.includes('pitbull') ||
    an.includes('doja cat')
  ) {
    return { id: 'genre-hiphop', name: 'Hip-Hop' };
  }
  if (
    an.includes('kehlani') ||
    an.includes('chris brown') ||
    an.includes('daniel caesar') ||
    an.includes('6lack') ||
    an.includes('alicia keys') ||
    an.includes('john legend') ||
    an.includes('leona lewis') ||
    an.includes('joji')
  ) {
    return { id: 'genre-rnb', name: 'R&B & Soul' };
  }
  if (
    an.includes('diplo') ||
    an.includes('slander') ||
    an.includes('egzod') ||
    an.includes('rudimental') ||
    an.includes('lsd') ||
    an.includes('labrinth')
  ) {
    return { id: 'genre-electronic', name: 'Electronic' };
  }
  if (
    an.includes('stephen sanchez') ||
    an.includes('caleb hearn') ||
    an.includes('calum scott') ||
    an.includes('henry moodie') ||
    an.includes('sasha alex sloan') ||
    an.includes('rex orange county') ||
    an.includes('adie') ||
    an.includes('yung kai') ||
    an.includes('cup of joe')
  ) {
    return { id: 'genre-acoustic', name: 'Acoustic' };
  }
  return { id: 'genre-pop', name: 'Pop' };
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log(`Starting Deezer Expansion for ${ARTIST_LIST.length} artists...`);
  console.log('Loading database from:', DB_PATH);
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  const existingSongIds = new Set(data.songs.map((s) => s.id));
  const existingAlbumIds = new Set(data.albums.map((a) => a.id));

  // Map existing artists
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

    let artist =
      artistMapByName.get(normalizeArtistForMatch(artistName)) ||
      data.artists.find((a) => a.id === artistId);

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
      console.log(`[Created Artist] ${artistName} (${artist.id})`);
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
      `[${aIdx + 1}/${ARTIST_LIST.length}] ${artist.name}: currently has ${currentCount} songs, fetching up to ${needed} more via Deezer...`
    );

    const existingTitles = new Set(existingSongs.map((s) => normalizeTitle(s.title)));

    // 1. Search Deezer for artist
    const artistSearch = await fetchJson(
      `https://api.deezer.com/search/artist?q=${encodeURIComponent(artist.name)}&limit=5`
    );

    let deezerArtist = null;
    if (artistSearch?.data?.length > 0) {
      const targetNorm = normalizeArtistForMatch(artist.name);
      deezerArtist = artistSearch.data.find(
        (da) => normalizeArtistForMatch(da.name) === targetNorm
      ) || artistSearch.data[0];
    }

    if (deezerArtist) {
      if (artist.avatar.includes('unsplash') && deezerArtist.picture_xl) {
        artist.avatar = deezerArtist.picture_xl || deezerArtist.picture_big;
      }
      if (deezerArtist.picture_xl) {
        artist.coverImage = deezerArtist.picture_xl;
      }
    }

    let addedForArtist = 0;

    // Helper to process a Deezer track
    const processDeezerTrack = (track, albumData) => {
      if (currentCount >= 300) return false;
      if (!track || !track.preview) return false;

      const trackName = (track.title || track.title_short || '').trim();
      if (!trackName) return false;

      const norm = normalizeTitle(trackName);
      if (!norm || existingTitles.has(norm)) return false;

      // Filter out live, remixes, karaoke, instrumental
      const lower = trackName.toLowerCase();
      if (
        /\b(live|en vivo|live at|live from|\(live\)|\[live\]|live concert|unplugged|live session)\b/i.test(lower) ||
        /\b(remix|remixes|club mix|extended mix|vip mix|mashup|sped up|slowed|reverb)\b/i.test(lower) ||
        /\b(karaoke|tribute|instrumental|reaction|snippet|preview|interview|commentary|clean edit)\b/i.test(lower)
      ) {
        return false;
      }

      // Check artist match
      if (track.artist?.name) {
        const itemNorm = normalizeArtistForMatch(track.artist.name);
        const targetNorm = normalizeArtistForMatch(artist.name);
        const match =
          itemNorm === targetNorm ||
          itemNorm.startsWith(targetNorm + ' ') ||
          itemNorm.includes(' ' + targetNorm + ' ') ||
          itemNorm.endsWith(' ' + targetNorm) ||
          itemNorm.includes(targetNorm + ' &') ||
          itemNorm.includes('& ' + targetNorm) ||
          itemNorm.includes(targetNorm + ',') ||
          itemNorm.includes(', ' + targetNorm);
        if (!match) return false;
      }

      existingTitles.add(norm);

      const songId = `song-dz-${track.id}`;
      if (existingSongIds.has(songId)) return false;
      existingSongIds.add(songId);

      // Album title and metadata
      const rawAlbumTitle = (albumData?.title || track.album?.title || 'Official Releases').trim();
      if (/\b(live|world tour|unplugged|live concert|live in|live at)\b/i.test(rawAlbumTitle)) {
        return false;
      }

      const albumSlug = slugify(rawAlbumTitle);
      const albumId = `album-${artistSlug}-${albumSlug || 'releases'}`;

      let album = data.albums.find((a) => a.id === albumId);
      if (!album) {
        const coverImg =
          albumData?.cover_xl ||
          albumData?.cover_big ||
          track.album?.cover_xl ||
          track.album?.cover_big ||
          artist.avatar;

        const defaultGenre = mapGenre(artist.name);
        album = {
          id: albumId,
          title: rawAlbumTitle,
          artistId: artist.id,
          artistName: artist.name,
          coverImage: coverImg,
          description: `Official studio album "${rawAlbumTitle}" by ${artist.name}.`,
          genreId: defaultGenre.id,
          genreName: defaultGenre.name,
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
        if (!artist.albumIds.includes(albumId)) {
          artist.albumIds.push(albumId);
        }
      }

      if (!album.songIds.includes(songId)) {
        album.songIds.push(songId);
      }

      const songGenre = mapGenre(artist.name);
      const songCover =
        albumData?.cover_xl ||
        albumData?.cover_big ||
        track.album?.cover_xl ||
        track.album?.cover_big ||
        album.coverImage;

      const newSong = {
        id: songId,
        title: trackName,
        artistId: artist.id,
        artistName: artist.name,
        albumId: album.id,
        albumName: album.title,
        genreId: songGenre.id,
        genreName: songGenre.name,
        duration: track.duration || 180,
        audioUrl: track.preview,
        coverImage: songCover,
        releaseDate: (album.releaseDate || '2024-01-01').split('T')[0],
        playCount: Math.floor(Math.random() * 450000) + 15000,
        likesCount: Math.floor(Math.random() * 80000) + 2000,
        status: 'published',
        isFeatured: currentCount < 5,
        trackNumber: track.track_position || album.songIds.length,
        explicit: !!track.explicit_lyrics,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.songs.push(newSong);
      currentCount++;
      addedForArtist++;
      totalSongsAdded++;
      return true;
    };

    // 2. Fetch tracks through artist's albums
    if (deezerArtist) {
      const albumsRes = await fetchJson(
        `https://api.deezer.com/artist/${deezerArtist.id}/albums?limit=60`
      );
      const albumsList = albumsRes?.data || [];

      for (const alb of albumsList) {
        if (currentCount >= 300) break;
        if (/\b(live|tour|remix|tribute|karaoke)\b/i.test(alb.title)) continue;

        await sleep(60);
        const tracksRes = await fetchJson(
          `https://api.deezer.com/album/${alb.id}/tracks?limit=60`
        );
        const tracks = tracksRes?.data || [];
        for (const t of tracks) {
          processDeezerTrack(t, alb);
          if (currentCount >= 300) break;
        }
      }
    }

    // 3. If still needed, search Deezer track catalogue
    if (currentCount < 300) {
      for (let offset = 0; offset < 300 && currentCount < 300; offset += 50) {
        await sleep(60);
        const sRes = await fetchJson(
          `https://api.deezer.com/search?q=${encodeURIComponent(artist.name)}&limit=50&index=${offset}`
        );
        const sTracks = sRes?.data || [];
        if (sTracks.length === 0) break;

        for (const t of sTracks) {
          processDeezerTrack(t, t.album);
          if (currentCount >= 300) break;
        }
      }
    }

    console.log(`  -> Added ${addedForArtist} studio tracks for ${artist.name} (Total now: ${currentCount})`);
  }

  console.log(`Expansion complete! Total songs added: ${totalSongsAdded}. Total artists created: ${newArtistsCreated}.`);
  console.log('Writing back to database file safely...');
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('Database successfully saved! Total songs in DB:', data.songs.length);
}

main().catch((err) => {
  console.error('Fatal error in expansion:', err);
  process.exit(1);
});

