const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
console.log('Reading database from:', DB_PATH);
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

let fixedCount = 0;
let removedCount = 0;

// 1. Giveon songs incorrectly assigned to IVE ('artist-ive')
const giveonArtist = db.artists.find(a => a.id === 'artist-giveon');
const iveArtist = db.artists.find(a => a.id === 'artist-ive');

if (giveonArtist && iveArtist) {
  for (const s of db.songs) {
    if (s.artistId === 'artist-ive' && (s.artistName.toLowerCase().includes('giv') || s.artistName.toLowerCase().includes('giveon'))) {
      s.artistId = 'artist-giveon';
      s.artistName = 'Giveon';
      s.genreId = 'genre-rnb';
      s.genreName = 'R&B & Soul';
      fixedCount++;
    }
  }
}

// 2. Normalize aliases
for (const s of db.songs) {
  if (s.artistId === 'artist-jay-z' && s.artistName === 'JAŸ-Z') {
    s.artistName = 'Jay-Z';
    fixedCount++;
  }
  if (s.artistId === 'artist-txt' && s.artistName === 'TOMORROW X TOGETHER') {
    s.artistName = 'TXT';
    fixedCount++;
  }
  if (s.artistId === 'artist-gi-dle' && s.artistName === 'i-dle') {
    s.artistName = '(G)I-DLE';
    fixedCount++;
  }
}

// 3. Remove impostor/mismatched songs from wrong artists
// - Lisa Kelly from Lisa (BLACKPINK)
// - Marina Raye from RAYE
// - Luis Miguel from Miguel
// - Creed Fisher from Fisher
// - The Dave Brubeck Quartet from Dave
// - A Gift of Love from Demi Moore
const impostorSongIds = new Set();
for (const s of db.songs) {
  const normS = (s.artistName || '').toLowerCase().trim();
  
  if (s.artistId === 'artist-lisa' && normS.includes('lisa kelly')) {
    impostorSongIds.add(s.id);
  } else if (s.artistId === 'artist-raye' && normS.includes('marina raye')) {
    impostorSongIds.add(s.id);
  } else if (s.artistId === 'artist-miguel' && normS.includes('luis miguel')) {
    impostorSongIds.add(s.id);
  } else if (s.artistId === 'artist-fisher' && normS.includes('creed fisher')) {
    impostorSongIds.add(s.id);
  } else if (s.artistId === 'artist-dave' && normS.includes('dave brubeck')) {
    impostorSongIds.add(s.id);
  } else if (s.artistId === 'artist-demi-moore' && normS.includes('a gift of love')) {
    impostorSongIds.add(s.id);
  } else if (s.artistId === 'artist-playboi-carti' && normS.includes('pi’erre bourne')) {
    impostorSongIds.add(s.id);
  }
}

console.log('Identified', impostorSongIds.size, 'impostor/mismatched songs to purge.');
db.songs = db.songs.filter(s => !impostorSongIds.has(s.id));
removedCount += impostorSongIds.size;

// 4. Fix Album Collisions & Contamination
// A. DJ Snake vs Eminem 'Encore'
const djSnakeAlbumId = 'album-dj-snake-encore';
let djSnakeAlbum = db.albums.find(a => a.id === djSnakeAlbumId);
if (!djSnakeAlbum) {
  djSnakeAlbum = {
    id: djSnakeAlbumId,
    title: 'Encore',
    artistId: 'artist-dj-snake',
    artistName: 'DJ Snake',
    coverImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ec/36/b7/ec36b701-d779-1148-7359-5735cfb0cbb4/16UMGIM35368.rgb.jpg/1000x1000bb.jpg',
    description: 'Official studio album "Encore" by DJ Snake.',
    genreId: 'genre-electronic',
    genreName: 'Electronic',
    releaseDate: '2016-08-05',
    copyrightInfo: '℗ 2016 DJ Snake Music under exclusive license to Interscope Records',
    status: 'published',
    isFeatured: true,
    songIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.albums.push(djSnakeAlbum);
}

const eminemAlbum = db.albums.find(a => a.id === 'album-encore');
if (eminemAlbum) {
  eminemAlbum.artistId = 'artist-eminem';
  eminemAlbum.artistName = 'Eminem';
}

// Re-assign DJ Snake songs from album-encore to album-dj-snake-encore
for (const s of db.songs) {
  if (s.artistName.toLowerCase().includes('dj snake') && s.albumId === 'album-encore') {
    s.albumId = djSnakeAlbumId;
    s.albumTitle = 'Encore';
    if (!djSnakeAlbum.songIds.includes(s.id)) {
      djSnakeAlbum.songIds.push(s.id);
    }
  }
}

// B. Ed Sheeran '=' album (was 'album-')
let equalsAlbum = db.albums.find(a => a.id === 'album-' || a.id === 'album-ed-sheeran-equals');
if (equalsAlbum) {
  equalsAlbum.id = 'album-ed-sheeran-equals';
  equalsAlbum.title = '=';
  equalsAlbum.artistId = 'artist-ed-sheeran';
  equalsAlbum.artistName = 'Ed Sheeran';
  for (const s of db.songs) {
    if (s.albumId === 'album-') {
      if (s.artistId === 'artist-ed-sheeran' || s.artistName.toLowerCase().includes('sheeran')) {
        s.albumId = 'album-ed-sheeran-equals';
      } else {
        // Maroon 5 songs assigned to a proper Maroon 5 album
        s.albumId = 'album-maroon-5-singles';
      }
    }
  }
}

// 5. Clean up every album's songIds so it only contains songs that actually exist and belong to that album
const validSongIds = new Set(db.songs.map(s => s.id));
const songToAlbum = new Map(db.songs.map(s => [s.id, s.albumId]));

for (const a of db.albums) {
  a.songIds = (a.songIds || []).filter(sid => validSongIds.has(sid) && songToAlbum.get(sid) === a.id);
}

// 6. Ensure every artist's albumIds accurately reflects their real albums
const artistAlbumMap = new Map();
for (const a of db.albums) {
  if (!artistAlbumMap.has(a.artistId)) artistAlbumMap.set(a.artistId, new Set());
  artistAlbumMap.get(a.artistId).add(a.id);
}
for (const artist of db.artists) {
  const realAlbums = artistAlbumMap.get(artist.id);
  if (realAlbums) {
    artist.albumIds = Array.from(realAlbums);
  }
}

console.log(`Audited & fixed ${fixedCount} song metadata associations.`);
console.log(`Purged ${removedCount} impostor tracks.`);
console.log('Writing updated database to disk...');
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log('Database integrity restoration complete!');

