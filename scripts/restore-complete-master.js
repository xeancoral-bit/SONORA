const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');
const SOURCE_PATH = path.join(__dirname, '..', 'data', 'temp-401b54c.json');

console.log('====================================================');
console.log('🎵 RESTORING FULL SONORA MUSIC LIBRARY');
console.log('====================================================');

if (!fs.existsSync(SOURCE_PATH)) {
  console.error('Source backup temp file not found:', SOURCE_PATH);
  process.exit(1);
}

// 1. Read existing DB to preserve active users
let currentUsers = [];
let currentPlaylists = [];
let currentCollections = [];
let currentLiked = [];
let currentHistory = [];

try {
  const currentDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  currentUsers = currentDb.users || [];
  currentPlaylists = currentDb.playlists || [];
  currentCollections = currentDb.collections || [];
  currentLiked = currentDb.likedSongs || [];
  currentHistory = currentDb.history || [];
} catch (e) {
  console.warn('Could not read existing DB for users:', e.message);
}

// 2. Read full 401b54c dataset (handling potential UTF-16LE / BOM)
console.log('Reading master catalog...');
let rawSource = fs.readFileSync(SOURCE_PATH, 'utf16le');
if (rawSource.charCodeAt(0) === 0xFEFF) {
  rawSource = rawSource.slice(1);
}

const masterDb = JSON.parse(rawSource);
console.log(`Loaded from master backup:`);
console.log(` - Songs: ${masterDb.songs?.length || 0}`);
console.log(` - Albums: ${masterDb.albums?.length || 0}`);
console.log(` - Artists: ${masterDb.artists?.length || 0}`);
console.log(` - Genres: ${masterDb.genres?.length || 0}`);

// 3. Merge users: keep all current users, add any missing from backup
const userMap = new Map();
(masterDb.users || []).forEach(u => userMap.set(u.id, u));
currentUsers.forEach(u => userMap.set(u.id, u)); // Overwrite with fresh user sessions
masterDb.users = Array.from(userMap.values());

// Keep playlists and collections
if (currentPlaylists.length > 0) masterDb.playlists = currentPlaylists;
if (currentCollections.length > 0) masterDb.collections = currentCollections;
if (currentLiked.length > 0) masterDb.likedSongs = currentLiked;
if (currentHistory.length > 0) masterDb.history = currentHistory;

// 4. Apply Curated Accurate Soundtracks
console.log('Applying soundtrack and audio accuracy alignments...');
const CURATED_MEDIA_MAP = {
  'troye sivan::there for you': 'pNNMr5glICM',
  'troye sivan::youth': 'XYAghEq5Lfw',
  'the neighbourhood::sweater weather': 'GCdwKhTtNNw',
  'ariana grande::one last time': 'BPgAM3135d4',
  'ariana grande::7 rings': 'QYh6mYIJG2Y',
  'bruno mars::just the way you are': 'LjhCEhWiKXk',
  'bruno mars::locked out of heaven': 'e-fA-gBCkj0',
  'bruno mars::that\'s what i like': 'PMivT7MJ41M',
  'bruno mars::24k magic': 'UqyT8IEBkvY',
  'bruno mars & lady gaga::die with a smile': 'kPa7bsKwL-8',
  'lady gaga & bruno mars::die with a smile': 'kPa7bsKwL-8',
  'rosé & bruno mars::apt.': 'ekr2nIex040',
  'bruno mars & rosé::apt.': 'ekr2nIex040',
  'taylor swift::cruel summer': 'ic8j13piAhQ',
  'taylor swift::anti-hero': 'b1kbLwvqugk',
  'ed sheeran::shape of you': 'JGwWNGJdvx8',
  'ed sheeran::perfect': '2Vv-BfVoq4g',
  'coldplay::yellow': 'yKNxeF4KMsY',
  'coldplay::viva la vida': 'dvgZkm1xWPE',
  'maroon 5::sugar': '09R8_2nJtjg',
  'maroon 5::memories': 'SlPhMPnQ58k',
  'billie eilish::bad guy': 'DYed5whEf4g',
  'billie eilish::birds of a feather': 'd5gf9dXHevw',
  'olivia rodrigo::drivers license': 'ZmDBbnmKpqQ',
  'olivia rodrigo::vampire': 'rXb5_2uXU-k',
  'sabrina carpenter::espresso': 'eVli-tstM5E',
  'sabrina carpenter::please please please': 'cF1Na4AIecM',
  'chappell roan::good luck, babe!': '1RKqOmSkGgM',
  'benson boone::beautiful things': 'Oa_RSwwpPaA',
  'hozier::too sweet': 'aezstCBHopQ',
  'djo::end of beginning': 'e8xni3EcIbc',
  'adie::paraluman': 'w89b0N_2NQI',
  'zack tabudlo::binibini': 'Esd05ZgCvh4',
  'cup of joe::tingin': 'iR-w-pA4J9A',
  'joji::glimpse of us': 'FvOpPeKSf_4',
  'daniel caesar::best part': 'vBy7FaapGRo',
  'rex orange county::the shade': '2jN-p3O6FkE',
  'yung kai::blue': 'Z_2L6F4mU_g'
};

let curatedFixCount = 0;
for (const song of masterDb.songs) {
  const normKey = `${(song.artistName || '').toLowerCase()}::${(song.title || '').toLowerCase()}`;
  if (CURATED_MEDIA_MAP[normKey]) {
    const videoId = CURATED_MEDIA_MAP[normKey];
    song.externalMediaId = videoId;
    song.audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
    song.sourcePlatform = 'youtube';
    song.isUnavailable = false;
    curatedFixCount++;
  }
}
console.log(`Applied curated high-fidelity media IDs to ${curatedFixCount} key soundtracks.`);

// 5. Ensure all artists have their albumIds properly populated
const albumIdsByArtist = new Map();
for (const album of masterDb.albums) {
  if (!albumIdsByArtist.has(album.artistId)) {
    albumIdsByArtist.set(album.artistId, []);
  }
  albumIdsByArtist.get(album.artistId).push(album.id);
}

for (const artist of masterDb.artists) {
  if (albumIdsByArtist.has(artist.id)) {
    artist.albumIds = albumIdsByArtist.get(artist.id);
  }
}

// 6. Write to sonora.json and sonora.backup.json in standard UTF-8
console.log('Writing restored database to disk (UTF-8)...');
const outputJson = JSON.stringify(masterDb, null, 2);
fs.writeFileSync(DB_PATH, outputJson, 'utf8');
fs.writeFileSync(BACKUP_PATH, outputJson, 'utf8');

console.log('Cleaning up temporary dump...');
try {
  fs.unlinkSync(SOURCE_PATH);
} catch (e) {
  // Ignore
}

console.log('\n====================================================');
console.log('✅ RESTORATION COMPLETE AND ACCURATE');
console.log(`Total Tracks: ${masterDb.songs.length}`);
console.log(`Total Albums: ${masterDb.albums.length}`);
console.log(`Total Artists: ${masterDb.artists.length}`);
console.log(`Total Users Preserved: ${masterDb.users.length}`);
console.log('====================================================');

