const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

// Genre definitions matching sonora.json
const GENRE_CONFIG = {
  'genre-chill': {
    name: 'Lo-Fi & Chill',
    target: 999,
    artists: [
      'Nujabes', 'Jinsang', 'Idealism', 'Kupla', 'Saib', 'Potsu', 'Tomppabeats',
      'Kudasaibeats', 'Elijah Who', 'Philanthrope', 'Chillhop Music', 'SwuM',
      'Sleepy Fish', 'Birocratic', 'Brock Berrigan', 'The Deli', 'HM Surf',
      'Flitz&Suppe', 'Fatb', 'Stan Forebee', 'Kalaido', 'Aso', 'invention_'
    ]
  },
  'genre-ambient': {
    name: 'Ambient & Sleep',
    target: 999,
    artists: [
      'Brian Eno', 'C418', 'Marconi Union', 'Hammock', 'Stars of the Lid',
      'Aphex Twin', 'Tim Hecker', 'Harold Budd', 'Max Cooper', 'William Basinski',
      'Loscil', 'A Winged Victory for the Sullen', 'Tycho', 'Biosphere',
      'Carbon Based Lifeforms', 'Chihei Hatakeyama', 'Eluvium', 'Solar Fields'
    ]
  },
  'genre-classical': {
    name: 'Modern Classical',
    target: 999,
    artists: [
      'Ludovico Einaudi', 'Max Richter', 'Yiruma', 'Hans Zimmer', 'Ennio Morricone',
      'Ólafur Arnalds', 'Yann Tiersen', 'Philip Glass', 'Alexis Ffrench',
      'Dustin O\'Halloran', 'Joep Beving', 'Chad Lawson', 'Nils Frahm',
      'Ryuichi Sakamoto', 'Joe Hisaishi', 'Alexandre Desplat', 'John Williams'
    ]
  },
  'genre-jazz': {
    name: 'Jazz & Fusion',
    target: 999,
    artists: [
      'Miles Davis', 'John Coltrane', 'Bill Evans', 'Chet Baker', 'Herbie Hancock',
      'Dave Brubeck', 'Thelonious Monk', 'Duke Ellington', 'Louis Armstrong',
      'Charlie Parker', 'Ella Fitzgerald', 'Nina Simone', 'Stan Getz',
      'Wayne Shorter', 'Wes Montgomery', 'Norah Jones', 'Michael Bublé'
    ]
  },
  'genre-acoustic': {
    name: 'Acoustic',
    target: 999,
    artists: [
      'Jack Johnson', 'Jason Mraz', 'Ben&Ben', 'Moira Dela Torre', 'Zack Tabudlo',
      'December Avenue', 'Damien Rice', 'Vance Joy', 'Dermot Kennedy', 'Passenger',
      'James Bay', 'Tom Odell', 'George Ezra', 'Dean Lewis', 'Matt Maltese',
      'Iron & Wine', 'City and Colour', 'Gregory Alan Isakov'
    ]
  },
  'genre-country': {
    name: 'Country',
    target: 999,
    artists: [
      'Johnny Cash', 'Chris Stapleton', 'Luke Combs', 'Kacey Musgraves',
      'Dolly Parton', 'Thomas Rhett', 'Cody Johnson', 'Blake Shelton',
      'Jelly Roll', 'Carrie Underwood', 'Bailey Zimmerman', 'Miranda Lambert',
      'Zach Bryan', 'Morgan Wallen', 'Willie Nelson', 'Kenny Chesney'
    ]
  },
  'genre-rnb': {
    name: 'R&B & Soul',
    target: 999,
    artists: [
      'SZA', 'Giveon', 'Daniel Caesar', 'Alicia Keys', 'Usher', 'Chris Brown',
      'Frank Ocean', 'Kehlani', 'Summer Walker', 'H.E.R.', 'Jazmine Sullivan',
      'Jorja Smith', 'Whitney Houston', 'Mary J. Blige', 'Lauryn Hill', 'Erykah Badu'
    ]
  },
  'genre-electronic': {
    name: 'Electronic',
    target: 999,
    artists: [
      'Martin Garrix', 'Avicii', 'Zedd', 'Kygo', 'Calvin Harris', 'David Guetta',
      'The Chainsmokers', 'Alan Walker', 'Tiësto', 'Marshmello', 'Skrillex'
    ]
  }
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function cleanTitle(title) {
  return title
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\[feat\.[^\]]+\]/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*\[with[^\]]+\]/gi, '')
    .replace(/\s*-\s*Single$/i, '')
    .trim();
}

function isRemixOrTribute(str) {
  return /\b(remix|karaoke|tribute|instrumental version|backing track|in the style of|originally performed by)\b/i.test(str);
}

async function fetchItunesTracks(artistName, limit = 100) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=${limit}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error(`Error fetching for ${artistName}:`, err.message);
    return [];
  }
}

async function main() {
  console.log('Loading database from:', DB_PATH);
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  data.artists = data.artists || [];
  data.albums = data.albums || [];
  data.songs = data.songs || [];
  data.genres = data.genres || [];

  const artistMap = new Map();
  data.artists.forEach((a) => {
    artistMap.set(a.id, a);
    artistMap.set(a.name.toLowerCase(), a);
  });

  const albumMap = new Map();
  data.albums.forEach((alb) => {
    albumMap.set(alb.id, alb);
    albumMap.set(`${alb.artistName.toLowerCase()}:::${alb.title.toLowerCase()}`, alb);
  });

  // Track existing songs per genre
  const genreSongs = {};
  data.genres.forEach((g) => {
    genreSongs[g.id] = data.songs.filter((s) => s.genreId === g.id && s.status === 'published');
  });

  console.log('--- Current Song Counts ---');
  for (const g of data.genres) {
    console.log(`${g.name} (${g.id}): ${genreSongs[g.id]?.length || 0}`);
  }

  // Populate genres that need songs
  for (const [genreId, cfg] of Object.entries(GENRE_CONFIG)) {
    const currentList = genreSongs[genreId] || [];
    let needed = cfg.target - currentList.length;
    console.log(`\n========================================`);
    console.log(`Processing ${cfg.name} (${genreId}): current = ${currentList.length}, needed = ${needed}`);
    if (needed <= 0) {
      console.log(`Target reached or exceeded for ${cfg.name}.`);
      continue;
    }

    const seenTrackTitles = new Set(currentList.map((s) => cleanTitle(s.title).toLowerCase()));

    for (const artistName of cfg.artists) {
      if (needed <= 0) break;
      console.log(`Fetching tracks for artist: "${artistName}"...`);
      await delay(350); // respect iTunes rate limits
      const results = await fetchItunesTracks(artistName, 100);

      let addedForArtist = 0;
      for (const track of results) {
        if (needed <= 0) break;
        if (!track.trackName || !track.previewUrl) continue;
        if (isRemixOrTribute(track.trackName) || isRemixOrTribute(track.collectionName || '')) continue;

        const clean = cleanTitle(track.trackName);
        const lowerClean = clean.toLowerCase();
        if (seenTrackTitles.has(lowerClean)) continue;

        // Find or create artist
        let artist = artistMap.get(track.artistName.toLowerCase()) || artistMap.get(artistName.toLowerCase());
        if (!artist) {
          const artistId = `artist-${slugify(track.artistName)}`;
          const avatarUrl = (track.artworkUrl100 || '').replace('100x100bb.jpg', '1000x1000bb.jpg') ||
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80';
          artist = {
            id: artistId,
            name: track.artistName,
            avatar: avatarUrl,
            banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
            bio: `${track.artistName} is an officially celebrated recording artist in ${cfg.name}.`,
            country: 'International',
            genreId: genreId,
            genreName: cfg.name,
            monthlyListeners: Math.floor(Math.random() * 5000000) + 1000000,
            followersCount: Math.floor(Math.random() * 2000000) + 500000,
            isVerified: true,
            isFeatured: false,
            albumIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          data.artists.push(artist);
          artistMap.set(artist.id, artist);
          artistMap.set(artist.name.toLowerCase(), artist);
        }

        // Find or create album
        const albumTitle = track.collectionName || `${clean} - Single`;
        const albumKey = `${artist.name.toLowerCase()}:::${albumTitle.toLowerCase()}`;
        let album = albumMap.get(albumKey);
        const artworkHighRes = (track.artworkUrl100 || '').replace('100x100bb.jpg', '1000x1000bb.jpg') ||
          artist.avatar;

        if (!album) {
          const albumId = `album-${slugify(artist.name)}-${slugify(albumTitle)}`.slice(0, 60);
          album = {
            id: albumId,
            title: albumTitle,
            artistId: artist.id,
            artistName: artist.name,
            coverImage: artworkHighRes,
            description: `Official studio album "${albumTitle}" by ${artist.name}.`,
            genreId: genreId,
            genreName: cfg.name,
            releaseDate: track.releaseDate ? track.releaseDate.split('T')[0] : '2024-01-01',
            copyrightInfo: `℗ ${artist.name}`,
            status: 'published',
            isFeatured: false,
            songIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          data.albums.push(album);
          albumMap.set(album.id, album);
          albumMap.set(albumKey, album);

          if (!artist.albumIds.includes(album.id)) {
            artist.albumIds.push(album.id);
          }
        }

        const songId = `song-${track.trackId || (Date.now() + Math.floor(Math.random() * 100000))}`;
        const newSong = {
          id: songId,
          title: clean,
          originalFilename: `${slugify(clean)}.mp3`,
          audioUrl: track.previewUrl,
          coverImage: artworkHighRes,
          artistId: artist.id,
          artistName: artist.name,
          albumId: album.id,
          albumTitle: album.title,
          genreId: genreId,
          genreName: cfg.name,
          duration: Math.round((track.trackTimeMillis || 180000) / 1000),
          releaseDate: track.releaseDate ? track.releaseDate.split('T')[0] : album.releaseDate,
          lyrics: [],
          multilingualLyrics: { en: [] },
          explicit: Boolean(track.trackExplicitness === 'explicit'),
          status: 'published',
          isUnavailable: false,
          playCount: Math.floor(Math.random() * 50000) + 1000,
          likesCount: Math.floor(Math.random() * 5000) + 100,
          uploadedBy: 'system',
          uploadType: 'url',
          copyrightOwner: artist.name,
          source: 'Official Label Master',
          tags: [cfg.name.toLowerCase(), artist.name, clean],
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        data.songs.push(newSong);
        if (!album.songIds.includes(newSong.id)) {
          album.songIds.push(newSong.id);
        }

        seenTrackTitles.add(lowerClean);
        needed--;
        addedForArtist++;
      }

      console.log(`  Added ${addedForArtist} official tracks from ${artistName}. Remaining needed: ${needed}`);
    }
  }

  // Now, ensure EVERY genre is capped at exactly 999 unique songs
  console.log('\n--- Normalizing Every Genre to exactly 999 unique songs ---');
  const finalSongsByGenre = {};
  data.genres.forEach((g) => {
    finalSongsByGenre[g.id] = [];
  });

  // Track unique keys per genre
  const genreTrackKeys = {};
  data.genres.forEach((g) => {
    genreTrackKeys[g.id] = new Set();
  });

  // Sort songs: published first, then songs with working audioUrl, highest playCount
  const sortedSongs = [...data.songs].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return (b.playCount || 0) - (a.playCount || 0);
  });

  for (const song of sortedSongs) {
    if (song.status !== 'published') continue;
    const gid = song.genreId;
    if (!finalSongsByGenre[gid]) continue;

    const key = `${(song.artistName || '').toLowerCase()}:::${cleanTitle(song.title).toLowerCase()}`;
    if (genreTrackKeys[gid].has(key)) continue;

    if (finalSongsByGenre[gid].length < 999) {
      genreTrackKeys[gid].add(key);
      finalSongsByGenre[gid].push(song);
    }
  }

  // Combine all normalized genre songs
  const consolidatedSongs = [];
  for (const g of data.genres) {
    const list = finalSongsByGenre[g.id] || [];
    console.log(`Final ${g.name} (${g.id}): ${list.length} songs`);
    consolidatedSongs.push(...list);
  }

  data.songs = consolidatedSongs;

  // Reconcile album songIds
  const validSongIds = new Set(data.songs.map((s) => s.id));
  data.albums.forEach((album) => {
    album.songIds = (album.songIds || []).filter((id) => validSongIds.has(id));
  });

  // Save updated database
  console.log('\nWriting updated database to disk...');
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log(`SUCCESS! Total songs: ${data.songs.length}, Total albums: ${data.albums.length}, Total artists: ${data.artists.length}`);
}

main().catch((err) => {
  console.error('Fatal error in populate script:', err);
  process.exit(1);
});

