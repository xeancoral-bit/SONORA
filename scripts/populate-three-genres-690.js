const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const TARGET_SONGS_PER_GENRE = 690;

const GENRE_DEFINITIONS = {
  'genre-ambient': {
    id: 'genre-ambient',
    name: 'Ambient & Sleep',
    slug: 'ambient',
    color: 'from-slate-600 to-zinc-900',
    accentColor: '#64748B',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    description: 'Calm soundscapes, meditative drones, and gentle night chords.',
    artists: [
      'Brian Eno',
      'Marconi Union',
      'Stars of the Lid',
      'Harold Budd',
      'Steve Roach',
      'Tim Hecker',
      'Biosphere',
      'Carbon Based Lifeforms',
      'Helios',
      'Hammock',
      'Julianna Barwick',
      'William Basinski',
      'Liquid Mind',
      'Deuter',
      'Loscil',
      'Eluvium',
      'A Winged Victory for the Sullen',
      'Robert Rich',
      'C418',
      'Aphex Twin'
    ]
  },
  'genre-jazz': {
    id: 'genre-jazz',
    name: 'Jazz & Fusion',
    slug: 'jazz',
    color: 'from-yellow-600 to-amber-900',
    accentColor: '#EAB308',
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80',
    description: 'Improvisational brass, smooth chords, and sophisticated grooves.',
    artists: [
      'Miles Davis',
      'John Coltrane',
      'Herbie Hancock',
      'Dave Brubeck',
      'Bill Evans',
      'Thelonious Monk',
      'Weather Report',
      'Chick Corea',
      'Chet Baker',
      'Ella Fitzgerald',
      'Louis Armstrong',
      'Duke Ellington',
      'Charlie Parker',
      'Stan Getz',
      'Astrud Gilberto',
      'Norah Jones',
      'Kamasi Washington',
      'Snarky Puppy',
      'Casiopea',
      'Pat Metheny',
      'Wes Montgomery',
      'Charles Mingus'
    ]
  },
  'genre-classical': {
    id: 'genre-classical',
    name: 'Modern Classical',
    slug: 'classical',
    color: 'from-stone-500 to-stone-800',
    accentColor: '#A8A29E',
    coverImage: '/genres/genre-classical.jpg',
    description: 'Cinematic strings, grand pianos, and orchestral elegance.',
    artists: [
      'Ludovico Einaudi',
      'Ólafur Arnalds',
      'Yiruma',
      'Philip Glass',
      'Yann Tiersen',
      'Joep Beving',
      'Nils Frahm',
      'Dustin O\'Halloran',
      'Ryuichi Sakamoto',
      'Ennio Morricone',
      'Hans Zimmer',
      'Alexis Ffrench',
      'Chad Lawson',
      'Luke Howard',
      'Fabrizio Paterlini',
      'Maxence Cyrin',
      'Dirk Maassen',
      'Michael Nyman',
      'Arvo Pärt'
    ]
  }
};

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
  console.log('🎵 POPULATING 3 GENRES WITH EXACTLY 690 SONGS EACH');
  console.log('========================================================');

  let db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  db.songs = db.songs || [];
  db.albums = db.albums || [];
  db.artists = db.artists || [];
  db.genres = db.genres || [];

  // Update classical genre cover image to working local file
  const classicalGenre = db.genres.find(g => g.id === 'genre-classical');
  if (classicalGenre) {
    classicalGenre.coverImage = '/genres/genre-classical.jpg';
  }

  // Also verify ambient and jazz genre configs in db.genres
  for (const [gid, gcfg] of Object.entries(GENRE_DEFINITIONS)) {
    let g = db.genres.find(item => item.id === gid);
    if (!g) {
      db.genres.push({ ...gcfg });
    } else {
      g.coverImage = gcfg.coverImage;
      g.name = gcfg.name;
      g.slug = gcfg.slug;
    }
  }

  const existingSongIds = new Set(db.songs.map(s => s.id));
  const existingAlbumIds = new Set(db.albums.map(a => a.id));
  const artistMap = new Map();
  db.artists.forEach(a => {
    artistMap.set(a.id, a);
    artistMap.set(a.name.toLowerCase().trim(), a);
  });

  for (const [genreId, genreConfig] of Object.entries(GENRE_DEFINITIONS)) {
    console.log(`\n--------------------------------------------------------`);
    console.log(`Processing Genre: ${genreConfig.name} (${genreId})`);
    console.log(`--------------------------------------------------------`);

    // Count existing songs in this genre
    let genreSongs = db.songs.filter(s => s.genreId === genreId);
    console.log(`Initial songs in ${genreConfig.name}: ${genreSongs.length}`);

    if (genreSongs.length >= TARGET_SONGS_PER_GENRE) {
      if (genreSongs.length > TARGET_SONGS_PER_GENRE) {
        // Trim to exactly TARGET_SONGS_PER_GENRE
        console.log(`Trimming from ${genreSongs.length} to exactly ${TARGET_SONGS_PER_GENRE}...`);
        const keepIds = new Set(genreSongs.slice(0, TARGET_SONGS_PER_GENRE).map(s => s.id));
        db.songs = db.songs.filter(s => s.genreId !== genreId || keepIds.has(s.id));
      }
      console.log(`Already has ${TARGET_SONGS_PER_GENRE} songs.`);
      continue;
    }

    const seenTitles = new Set(genreSongs.map(s => normalizeTitle(s.title)));

    for (const artistName of genreConfig.artists) {
      if (genreSongs.length >= TARGET_SONGS_PER_GENRE) break;

      console.log(`\n  Searching artist: "${artistName}"...`);
      await delay(120);
      const searchRes = await fetchJson(`https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}`);
      const dzArtists = searchRes?.data || [];
      if (dzArtists.length === 0) continue;

      const exact = dzArtists.filter(d => d.name.toLowerCase() === artistName.toLowerCase());
      const bestDz = exact.length > 0
        ? exact.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0]
        : dzArtists.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0];

      if (!bestDz) continue;

      // Find or create artist in DB
      let artist = artistMap.get(bestDz.name.toLowerCase().trim()) || artistMap.get(artistName.toLowerCase().trim());
      const artistSlug = slugify(bestDz.name || artistName);
      const artistId = artist ? artist.id : `artist-${artistSlug}`;

      if (!artist) {
        artist = {
          id: artistId,
          name: bestDz.name || artistName,
          slug: artistSlug,
          avatar: bestDz.picture_xl || bestDz.picture_big,
          coverImage: bestDz.picture_xl || bestDz.picture_big,
          headerImage: bestDz.picture_xl || bestDz.picture_big,
          banner: bestDz.picture_xl || bestDz.picture_big,
          bio: `${bestDz.name} is a renowned recording artist in the ${genreConfig.name} genre with over ${(bestDz.nb_fan || 100000).toLocaleString()} global listeners.`,
          genreId: genreId,
          genreName: genreConfig.name,
          isVerified: true,
          monthlyListeners: bestDz.nb_fan ? bestDz.nb_fan * 4 : 450000,
          albumIds: [],
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.artists.push(artist);
        artistMap.set(artist.id, artist);
        artistMap.set(artist.name.toLowerCase().trim(), artist);
      } else {
        artist.genreId = genreId;
        artist.genreName = genreConfig.name;
        if (!artist.avatar || artist.avatar.includes('unsplash')) {
          artist.avatar = bestDz.picture_xl || bestDz.picture_big || artist.avatar;
          artist.coverImage = artist.avatar;
        }
      }

      if (!artist.albumIds) artist.albumIds = [];

      // Fetch albums for this artist
      await delay(120);
      const albumsRes = await fetchJson(`https://api.deezer.com/artist/${bestDz.id}/albums?limit=100`);
      const dzAlbums = albumsRes?.data || [];
      console.log(`    Found ${dzAlbums.length} albums on Deezer.`);

      for (const dzAlbum of dzAlbums) {
        if (genreSongs.length >= TARGET_SONGS_PER_GENRE) break;

        const rawAlbumTitle = (dzAlbum.title || '').trim();
        if (!rawAlbumTitle) continue;

        // Skip karaoke or live bootlegs
        const lowerAlbum = rawAlbumTitle.toLowerCase();
        if (/\b(karaoke|tribute|sound-a-like)\b/i.test(lowerAlbum)) continue;

        const albumSlug = slugify(rawAlbumTitle);
        const albumId = `album-${artistSlug}-${albumSlug || 'release'}`;

        let album = db.albums.find(a => a.id === albumId);
        const albumCover = dzAlbum.cover_xl || dzAlbum.cover_big || artist.avatar;
        const releaseDate = dzAlbum.release_date || '2023-01-01';
        const releaseYear = parseInt(releaseDate.split('-')[0], 10) || 2023;

        if (!album) {
          album = {
            id: albumId,
            title: rawAlbumTitle,
            artistId: artist.id,
            artistName: artist.name,
            coverImage: albumCover,
            description: `Official studio album "${rawAlbumTitle}" by ${artist.name} (${releaseYear}).`,
            genreId: genreId,
            genreName: genreConfig.name,
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
        } else {
          album.genreId = genreId;
          album.genreName = genreConfig.name;
        }

        if (!artist.albumIds.includes(album.id)) {
          artist.albumIds.push(album.id);
        }

        // Fetch album tracks
        await delay(120);
        const tracksRes = await fetchJson(`https://api.deezer.com/album/${dzAlbum.id}/tracks?limit=100`);
        const dzTracks = tracksRes?.data || [];

        for (const tr of dzTracks) {
          if (genreSongs.length >= TARGET_SONGS_PER_GENRE) break;
          if (!tr || !tr.title) continue;

          const trackTitle = (tr.title || tr.title_short || '').trim();
          if (!trackTitle) continue;

          const normTitle = normalizeTitle(trackTitle);
          if (seenTitles.has(normTitle)) continue;

          const lowerTrack = trackTitle.toLowerCase();
          if (/\b(karaoke|reaction|snippet|interview|commentary)\b/i.test(lowerTrack)) continue;

          const songId = `song-dz-${tr.id}`;
          if (existingSongIds.has(songId)) {
            // If already in db under another genre or generic pop, reassign to this specialized genre
            const existing = db.songs.find(s => s.id === songId);
            if (existing && existing.genreId !== genreId) {
              existing.genreId = genreId;
              existing.genreName = genreConfig.name;
              seenTitles.add(normTitle);
              genreSongs.push(existing);
              continue;
            }
          }

          const song = {
            id: songId,
            title: trackTitle,
            artistId: artist.id,
            artistName: artist.name,
            albumId: album.id,
            albumTitle: album.title,
            albumName: album.title,
            genreId: genreId,
            genreName: genreConfig.name,
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
            playCount: tr.rank || Math.floor(Math.random() * 300000 + 50000),
            likesCount: Math.floor((tr.rank || 200000) * 0.08),
            explicit: tr.explicit_lyrics || false,
            isFeatured: tr.rank > 500000,
            createdAt: `${releaseDate}T00:00:00.000Z`,
            updatedAt: new Date().toISOString()
          };

          db.songs.push(song);
          existingSongIds.add(songId);
          seenTitles.add(normTitle);
          genreSongs.push(song);

          if (!album.songIds) album.songIds = [];
          if (!album.songIds.includes(songId)) {
            album.songIds.push(songId);
          }
          album.tracksCount = album.songIds.length;
        }

        console.log(`      ${album.title} -> Genre songs count now: ${genreSongs.length}/${TARGET_SONGS_PER_GENRE}`);
      }
    }

    console.log(`Finished ${genreConfig.name}: Total songs = ${db.songs.filter(s => s.genreId === genreId).length}`);
  }

  // Final check and trim to exact TARGET_SONGS_PER_GENRE if any slight overshoot
  for (const genreId of Object.keys(GENRE_DEFINITIONS)) {
    const list = db.songs.filter(s => s.genreId === genreId);
    if (list.length > TARGET_SONGS_PER_GENRE) {
      const keep = new Set(list.slice(0, TARGET_SONGS_PER_GENRE).map(s => s.id));
      db.songs = db.songs.filter(s => s.genreId !== genreId || keep.has(s.id));
    }
  }

  console.log('\n========================================================');
  console.log('FINAL GENRE SONG COUNTS:');
  for (const [gid, gcfg] of Object.entries(GENRE_DEFINITIONS)) {
    const count = db.songs.filter(s => s.genreId === gid).length;
    console.log(`  - ${gcfg.name} (${gid}): ${count} songs`);
  }
  console.log(`Total Database Songs: ${db.songs.length}`);
  console.log(`Total Database Albums: ${db.albums.length}`);
  console.log(`Total Database Artists: ${db.artists.length}`);
  console.log('========================================================');

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
}

main().catch(console.error);
