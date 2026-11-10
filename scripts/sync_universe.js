const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'sonora.json');
if (!fs.existsSync(dbPath)) {
  console.error('Database not found at:', dbPath);
  process.exit(1);
}

console.log('Loading live Sonora database...');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!db.artists) db.artists = [];
if (!db.albums) db.albums = [];
if (!db.songs) db.songs = [];
if (!db.genres) db.genres = [];

// 1. Ensure K-Pop exists in db.genres
const hasKpopGenre = db.genres.some(g => g.id === 'genre-kpop' || g.slug === 'k-pop' || g.slug === 'kpop');
if (!hasKpopGenre) {
  db.genres.push({
    id: 'genre-kpop',
    name: 'K-Pop',
    slug: 'k-pop',
    color: 'from-pink-600 via-rose-600 to-purple-700',
    accentColor: '#EC4899',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    description: 'The global phenomenon of Korean pop music: high-energy choreographies, genre-bending concepts, and chart-topping hits.'
  });
  console.log('Added official K-Pop genre to db.genres');
}

// 2. Load all 5 modular datasets
console.log('Importing expansion modules...');
const ppop = require('./data/ppop_expansion');
const kpop = require('./data/kpop_expansion');
const opm = require('./data/opm_expansion');
const latin = require('./data/latin_expansion');
const bands = require('./data/bands_expansion');

const modules = [
  { name: 'P-Pop', data: ppop },
  { name: 'K-Pop', data: kpop },
  { name: 'OPM', data: opm },
  { name: 'Latin', data: latin },
  { name: 'Bands & Rock', data: bands }
];

let totalNewArtists = 0;
let totalNewAlbums = 0;
let totalNewSongs = 0;

for (const mod of modules) {
  console.log(`\nProcessing module: ${mod.name}...`);
  const { artists, albums, songs } = mod.data;

  // Process artists
  for (const art of artists) {
    const existingIdx = db.artists.findIndex(
      a => (a.id && a.id === art.id) || 
           (a.name && a.name.toLowerCase() === art.name.toLowerCase()) ||
           (a.slug && a.slug.toLowerCase() === art.slug.toLowerCase())
    );

    if (existingIdx >= 0) {
      db.artists[existingIdx] = {
        ...db.artists[existingIdx],
        ...art,
        updatedAt: new Date().toISOString()
      };
    } else {
      db.artists.push({
        ...art,
        createdAt: art.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      totalNewArtists++;
    }
  }

  // Process albums
  for (const alb of albums) {
    const existingIdx = db.albums.findIndex(
      a => (a.id && a.id === alb.id) ||
           (a.slug && a.slug.toLowerCase() === alb.slug.toLowerCase())
    );

    if (existingIdx >= 0) {
      db.albums[existingIdx] = {
        ...db.albums[existingIdx],
        ...alb,
        updatedAt: new Date().toISOString()
      };
    } else {
      db.albums.push({
        ...alb,
        createdAt: alb.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      totalNewAlbums++;
    }
  }

  // Process songs
  for (const sng of songs) {
    const existingIdx = db.songs.findIndex(
      s => (s.id && s.id === sng.id) ||
           (s.slug && s.slug.toLowerCase() === sng.slug.toLowerCase())
    );

    if (existingIdx >= 0) {
      db.songs[existingIdx] = {
        ...db.songs[existingIdx],
        ...sng,
        updatedAt: new Date().toISOString()
      };
    } else {
      db.songs.push({
        ...sng,
        createdAt: sng.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      totalNewSongs++;
    }
  }
}

console.log(`\nMerged records: +${totalNewArtists} artists, +${totalNewAlbums} albums, +${totalNewSongs} songs.`);

// 3. Fast O(N) map linking: artists to songs & albums
console.log('Resolving artist relations...');
const artistNameToId = new Map();
const artistSlugToId = new Map();
for (const art of db.artists) {
  if (art.name) artistNameToId.set(art.name.toLowerCase(), art.id);
  if (art.slug) artistSlugToId.set(art.slug.toLowerCase(), art.id);
}

for (const s of db.songs) {
  if (s.artistName && !s.artistId) {
    const id = artistNameToId.get(s.artistName.toLowerCase());
    if (id) s.artistId = id;
  }
}

for (const a of db.albums) {
  if (a.artistName && !a.artistId) {
    const id = artistNameToId.get(a.artistName.toLowerCase());
    if (id) a.artistId = id;
  }
}

// 4. Fast O(N) map linking: songs to albums, update songIds and tracksCount
console.log('Resolving album tracklists...');
const albumSongMap = new Map();
for (const s of db.songs) {
  if (s.albumId) {
    let arr = albumSongMap.get(s.albumId);
    if (!arr) {
      arr = [];
      albumSongMap.set(s.albumId, arr);
    }
    arr.push(s.id);
  }
}

for (const alb of db.albums) {
  const matchingSongs = albumSongMap.get(alb.id);
  if (matchingSongs && matchingSongs.length > 0) {
    alb.songIds = Array.from(new Set([...(alb.songIds || []), ...matchingSongs]));
    alb.tracksCount = alb.songIds.length;
  }
}

// 5. Save back to data/sonora.json
console.log('Writing updated database to data/sonora.json...');
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('====================================================');
console.log('  SONORA UNIVERSE EXPANSION COMPLETED SUCCESSFULLY  ');
console.log('====================================================');
console.log(`Total Artists in Library: ${db.artists.length}`);
console.log(`Total Albums in Library:  ${db.albums.length}`);
console.log(`Total Songs in Library:   ${db.songs.length}`);

// 6. Verify sample across all 5 categories
const verifySample = [
  'BINI', 'ALAMAT', 'BGYO', 'G22',
  'TOMORROW X TOGETHER', 'Jungkook', 'V', 'ILLIT', 'DAY6',
  'juan karlos', 'Up Dharma Down', 'Orange & Lemons', 'Nobita',
  'Karol G', 'Rosalía', 'Maluma', 'Peso Pluma', 'Bizarrap',
  'Blink-182', 'Nirvana', 'Foo Fighters', 'Red Hot Chili Peppers', 'LANY', 'Cigarettes After Sex'
];

console.log('\n--- VERIFICATION OF TARGET ARTISTS ---');
let allFound = true;
for (const name of verifySample) {
  const art = db.artists.find(a => a.name && a.name.toLowerCase() === name.toLowerCase());
  if (!art) {
    console.error(`❌ MISSING ARTIST: ${name}`);
    allFound = false;
    continue;
  }
  const albs = db.albums.filter(a => a.artistId === art.id || (a.artistName && a.artistName.toLowerCase() === name.toLowerCase()));
  const sngs = db.songs.filter(s => s.artistId === art.id || (s.artistName && s.artistName.toLowerCase() === name.toLowerCase()));
  console.log(`✅ [${art.name}] -> ID: ${art.id} | Albums: ${albs.length} | Soundtracks: ${sngs.length} | Genre: ${art.genreName}`);
}

if (allFound) {
  console.log('\n🌟 ALL TARGET AUDIT SAMPLES ARE VERIFIED AND FUNCTIONAL!');
}

