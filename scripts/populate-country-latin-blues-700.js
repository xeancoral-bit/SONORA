const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const TARGET_SONGS_PER_GENRE = 700;

const GENRE_DEFINITIONS = {
  'genre-country': {
    id: 'genre-country',
    name: 'Country',
    slug: 'country',
    color: 'from-amber-700 to-yellow-900',
    accentColor: '#D97706',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    description: 'Storytelling, twangy guitars, heartland roots, and southern soul.',
    artists: [
      'Johnny Cash',
      'Dolly Parton',
      'Zach Bryan',
      'Carrie Underwood',
      'Shania Twain',
      'Keith Urban',
      'Kacey Musgraves',
      'Tim McGraw',
      'Willie Nelson',
      'Kenny Chesney',
      'Miranda Lambert',
      'Blake Shelton',
      'Chris Stapleton',
      'Luke Combs',
      'Morgan Wallen'
    ]
  },
  'genre-latin': {
    id: 'genre-latin',
    name: 'Latin',
    slug: 'latin',
    color: 'from-rose-600 to-orange-800',
    accentColor: '#F43F5E',
    coverImage: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop&q=80',
    description: 'Infectious rhythms, reggaeton heat, salsa beats, and tropical passion.',
    artists: [
      'Bad Bunny',
      'Shakira',
      'J Balvin',
      'Daddy Yankee',
      'Karol G',
      'Rosalía',
      'Maluma',
      'Luis Fonsi',
      'Rauw Alejandro',
      'Peso Pluma',
      'Ozuna',
      'Enrique Iglesias',
      'Camila Cabello',
      'Anuel AA',
      'Ricky Martin',
      'Marc Anthony',
      'Juanes',
      'Becky G'
    ]
  },
  'genre-blues': {
    id: 'genre-blues',
    name: 'Blues',
    slug: 'blues',
    color: 'from-blue-700 to-slate-900',
    accentColor: '#3B82F6',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    description: 'Soulful bends, vintage tube amps, delta slide, and heartfelt expression.',
    artists: [
      'B.B. King',
      'Muddy Waters',
      'Stevie Ray Vaughan',
      'Buddy Guy',
      'John Lee Hooker',
      'Etta James',
      'Albert King',
      'Eric Clapton',
      'Gary Clark Jr.',
      'Joe Bonamassa',
      'Howlin\' Wolf',
      'Robert Johnson',
      'Freddie King',
      'Koko Taylor',
      'Taj Mahal',
      'Robert Cray',
      'Elmore James'
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
        await delay(2500 * attempt);
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
  console.log('🎵 POPULATING COUNTRY, LATIN, AND BLUES (700 SONGS EACH)');
  console.log('========================================================');

  let db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  db.songs = db.songs || [];
  db.albums = db.albums || [];
  db.artists = db.artists || [];
  db.genres = db.genres || [];

  // Register genres in db.genres
  for (const [gid, gcfg] of Object.entries(GENRE_DEFINITIONS)) {
    let g = db.genres.find(item => item.id === gid);
    if (!g) {
      db.genres.push({
        id: gcfg.id,
        name: gcfg.name,
        slug: gcfg.slug,
        color: gcfg.color,
        accentColor: gcfg.accentColor,
        coverImage: gcfg.coverImage,
        description: gcfg.description
      });
      console.log(`Registered new genre: ${gcfg.name} (${gid})`);
    } else {
      g.coverImage = gcfg.coverImage;
      g.name = gcfg.name;
      g.slug = gcfg.slug;
      g.color = gcfg.color;
      g.accentColor = gcfg.accentColor;
      g.description = gcfg.description;
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

    let genreSongs = db.songs.filter(s => s.genreId === genreId);
    console.log(`Initial songs in ${genreConfig.name}: ${genreSongs.length}`);

    if (genreSongs.length >= TARGET_SONGS_PER_GENRE) {
      if (genreSongs.length > TARGET_SONGS_PER_GENRE) {
        console.log(`Trimming from ${genreSongs.length} to exactly ${TARGET_SONGS_PER_GENRE}...`);
        const keepIds = new Set(genreSongs.slice(0, TARGET_SONGS_PER_GENRE).map(s => s.id));
        db.songs = db.songs.filter(s => s.genreId !== genreId || keepIds.has(s.id));
      }
      console.log(`Genre ${genreConfig.name} has exactly ${TARGET_SONGS_PER_GENRE} songs.`);
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
          bio: `${bestDz.name} is a renowned recording artist in the ${genreConfig.name} genre with over ${(bestDz.nb_fan || 150000).toLocaleString()} global listeners.`,
          genreId: genreId,
          genreName: genreConfig.name,
          isVerified: true,
          monthlyListeners: bestDz.nb_fan ? bestDz.nb_fan * 4 : 500000,
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

      await delay(120);
      const albumsRes = await fetchJson(`https://api.deezer.com/artist/${bestDz.id}/albums?limit=100`);
      const dzAlbums = albumsRes?.data || [];
      console.log(`    Found ${dzAlbums.length} albums on Deezer.`);

      for (const dzAlbum of dzAlbums) {
        if (genreSongs.length >= TARGET_SONGS_PER_GENRE) break;

        const rawAlbumTitle = (dzAlbum.title || '').trim();
        if (!rawAlbumTitle) continue;

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
            const existing = db.songs.find(s => s.id === songId);
            if (existing && existing.genreId !== genreId) {
              existing.genreId = genreId;
              existing.genreName = genreConfig.name;
              seenTitles.add(normTitle);
              genreSongs.push(existing);
              if (!album.songIds.includes(songId)) album.songIds.push(songId);
              continue;
            }
          }

          seenTitles.add(normTitle);

          const newSong = {
            id: songId,
            title: trackTitle,
            originalFilename: `${slugify(trackTitle)}.mp3`,
            audioUrl: tr.preview || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artist.name} ${trackTitle}`)}`,
            audioPath: tr.preview || undefined,
            coverImage: dzAlbum.cover_xl || dzAlbum.cover_big || albumCover,
            artistId: artist.id,
            artistName: artist.name,
            albumId: album.id,
            albumTitle: album.title,
            genreId: genreId,
            genreName: genreConfig.name,
            duration: tr.duration || 210,
            releaseDate: releaseDate,
            description: `Track #${tr.track_position || 1} from "${album.title}" by ${artist.name}.`,
            lyrics: '',
            syncedLyrics: [],
            explicit: tr.explicit_lyrics || false,
            status: 'published',
            playCount: Math.floor(Math.random() * 400000) + 75000,
            likesCount: Math.floor(Math.random() * 25000) + 3500,
            uploadedBy: 'system-official',
            uploadType: 'url',
            sourceType: 'external_url',
            sourcePlatform: 'direct',
            isFeatured: false,
            createdAt: `${releaseDate}T00:00:00.000Z`,
            updatedAt: new Date().toISOString(),
          };

          db.songs.push(newSong);
          existingSongIds.add(songId);
          genreSongs.push(newSong);
          if (!album.songIds.includes(songId)) {
            album.songIds.push(songId);
          }
        }

        album.tracksCount = album.songIds.length;
      }

      console.log(`  Current ${genreConfig.name} songs count: ${genreSongs.length}/${TARGET_SONGS_PER_GENRE}`);
    }

    // Exact count guarantee
    const currentGenreSongs = db.songs.filter(s => s.genreId === genreId);
    if (currentGenreSongs.length > TARGET_SONGS_PER_GENRE) {
      console.log(`Trimming ${genreConfig.name} from ${currentGenreSongs.length} to exactly ${TARGET_SONGS_PER_GENRE}...`);
      const keepIds = new Set(currentGenreSongs.slice(0, TARGET_SONGS_PER_GENRE).map(s => s.id));
      db.songs = db.songs.filter(s => s.genreId !== genreId || keepIds.has(s.id));
    }

    const finalCount = db.songs.filter(s => s.genreId === genreId).length;
    console.log(`\n>>> FINAL ${genreConfig.name} SONGS COUNT: ${finalCount} / ${TARGET_SONGS_PER_GENRE}`);
  }

  // Update all album trackCounts and artist albumIds
  for (const album of db.albums) {
    album.tracksCount = album.songIds ? album.songIds.length : 0;
  }

  console.log('\nWriting database backup and main database...');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('Successfully saved to data/sonora.json and data/sonora.backup.json!');

  // Verification report
  console.log('\n================ FINAL VERIFICATION ================');
  for (const [gid, gcfg] of Object.entries(GENRE_DEFINITIONS)) {
    const count = db.songs.filter(s => s.genreId === gid).length;
    const albumCount = db.albums.filter(a => a.genreId === gid).length;
    const artistCount = db.artists.filter(a => a.genreId === gid).length;
    console.log(`🎸 ${gcfg.name} (${gid}): ${count} songs | ${albumCount} albums | ${artistCount} artists`);
  }
  console.log('====================================================\n');
}

main().catch(console.error);

