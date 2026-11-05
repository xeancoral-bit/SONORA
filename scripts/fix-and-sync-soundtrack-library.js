const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const d = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log('--- Starting SONORA Soundtrack Library Deep Audit & Synchronization ---');

let fixedCount = 0;
let removedCount = 0;

// 1. SPECIFIC CRITICAL SOUNDTRACK MATCHES

// A. Troye Sivan - There For You (Was playing Youth!)
const troyeThereForYou = d.songs.find(s => s.id === 'song-1238673347' || (s.title.toLowerCase().includes('there for you') && s.artistName.toLowerCase().includes('troye sivan')));
if (troyeThereForYou) {
  troyeThereForYou.title = 'There for You';
  troyeThereForYou.artistName = 'Martin Garrix & Troye Sivan';
  troyeThereForYou.albumTitle = 'There for You - Single';
  troyeThereForYou.albumName = 'There for You - Single';
  troyeThereForYou.externalMediaId = 'pNNMr5glICM'; // Martin Garrix & Troye Sivan - There For You (Official Video)
  troyeThereForYou.audioUrl = 'https://www.youtube.com/watch?v=pNNMr5glICM';
  troyeThereForYou.sourcePlatform = 'youtube';
  troyeThereForYou.isUnavailable = false;
  fixedCount++;
  console.log('[FIXED] Troye Sivan - "There for You" -> Martin Garrix & Troye Sivan Official Soundtrack (pNNMr5glICM)');
}

// B. Troye Sivan - YOUTH (Was playing One of Your Girls!)
const troyeYouth = d.songs.find(s => s.id === 'song-1876132247' || (s.title.toUpperCase() === 'YOUTH' && s.artistName.toLowerCase().includes('troye sivan')));
if (troyeYouth) {
  troyeYouth.title = 'YOUTH';
  troyeYouth.artistName = 'Troye Sivan';
  troyeYouth.albumTitle = 'Blue Neighbourhood';
  troyeYouth.albumName = 'Blue Neighbourhood';
  troyeYouth.externalMediaId = 'XYAghEq5Lfw'; // Troye Sivan - YOUTH (Official Video)
  troyeYouth.audioUrl = 'https://www.youtube.com/watch?v=XYAghEq5Lfw';
  troyeYouth.sourcePlatform = 'youtube';
  troyeYouth.isUnavailable = false;
  fixedCount++;
  console.log('[FIXED] Troye Sivan - "YOUTH" -> Troye Sivan - YOUTH Official Video (XYAghEq5Lfw)');
}

// C. Troye Sivan - Seventeen (Was playing Embarrassingly!)
const troyeSeventeen = d.songs.find(s => s.id === 'song-1396292352');
if (troyeSeventeen) {
  troyeSeventeen.title = 'Seventeen';
  troyeSeventeen.artistName = 'Troye Sivan';
  troyeSeventeen.externalMediaId = '4pxdGNVqwnA'; // Troye Sivan - Seventeen Official Studio Audio
  troyeSeventeen.audioUrl = 'https://www.youtube.com/watch?v=4pxdGNVqwnA';
  troyeSeventeen.sourcePlatform = 'youtube';
  troyeSeventeen.isUnavailable = false;
  fixedCount++;
  console.log('[FIXED] Troye Sivan - "Seventeen" -> Troye Sivan - Seventeen Official Audio (4pxdGNVqwnA)');
}

// D. Troye Sivan - BLUE (Was playing Embarrassingly!)
const troyeBlue = d.songs.find(s => s.id === 'song-troye-sivan-blue');
if (troyeBlue) {
  troyeBlue.title = 'BLUE (feat. Alex Hope)';
  troyeBlue.artistName = 'Troye Sivan';
  troyeBlue.externalMediaId = 'aPkekDUBwXI'; // Troye Sivan - BLUE Official Audio
  troyeBlue.audioUrl = 'https://www.youtube.com/watch?v=aPkekDUBwXI';
  troyeBlue.sourcePlatform = 'youtube';
  troyeBlue.isUnavailable = false;
  fixedCount++;
  console.log('[FIXED] Troye Sivan - "BLUE" -> Troye Sivan - BLUE Official Audio (aPkekDUBwXI)');
}

// E. The Neighbourhood - Sweater Weather (Was playing Reflections!)
const nbSweater = d.songs.find(s => s.id === 'song-the-neighbourhood-sweater-weather');
if (nbSweater) {
  nbSweater.title = 'Sweater Weather';
  nbSweater.artistName = 'The Neighbourhood';
  nbSweater.externalMediaId = 'GCdwKhTtNNw'; // The Neighbourhood - Sweater Weather Official Video
  nbSweater.audioUrl = 'https://www.youtube.com/watch?v=GCdwKhTtNNw';
  nbSweater.sourcePlatform = 'youtube';
  nbSweater.isUnavailable = false;
  fixedCount++;
  console.log('[FIXED] The Neighbourhood - "Sweater Weather" -> Official Video (GCdwKhTtNNw)');
}

// F. Moira Dela Torre - Why Him (Was playing BEFORE IT SINKS IN!)
const moiraWhyHim = d.songs.find(s => s.id === 'song-moira-dela-torre-why-him');
if (moiraWhyHim) {
  moiraWhyHim.title = 'Why Him? (feat. Moira Dela Torre)';
  moiraWhyHim.artistName = 'Nieman & Moira Dela Torre';
  moiraWhyHim.externalMediaId = 'UoSJx6Z0A9w'; // Nieman - Why Him? feat. Moira Dela Torre
  moiraWhyHim.audioUrl = 'https://www.youtube.com/watch?v=UoSJx6Z0A9w';
  moiraWhyHim.sourcePlatform = 'youtube';
  moiraWhyHim.isUnavailable = false;
  fixedCount++;
  console.log('[FIXED] Moira Dela Torre - "Why Him?" -> Nieman & Moira Dela Torre (UoSJx6Z0A9w)');
}

// G. Julia Michaels - ¿Y así van a agradecer? (Was playing I'm A Star Demo!)
const juliaSong = d.songs.find(s => s.id === 'song-julia-michaels-y-as-van-a-agradecer');
if (juliaSong) {
  juliaSong.externalMediaId = 'YGiov1kyRyY'; // Wish soundtrack official audio
  juliaSong.audioUrl = 'https://www.youtube.com/watch?v=YGiov1kyRyY';
  juliaSong.sourcePlatform = 'youtube';
  juliaSong.isUnavailable = false;
  fixedCount++;
  console.log('[FIXED] Julia Michaels - "¿Y así van a agradecer?" -> Official Wish Latin Soundtrack (YGiov1kyRyY)');
}

// 2. PURGE CONTAMINATED CREED TRACKS ON BRUNO MARS
const creedSongIds = new Set([
  'song-1440738580', // Bullets
  'song-1440718237', // One Last Breath
  'song-1440666233', // My Own Prison
  'song-1440718218', // Higher
  'song-1440718229', // With Arms Wide Open
  'song-1440718451', // My Sacrifice
  'song-1440666228', // Torn
  'song-1440631393', // What If
  'song-1440666375', // One
  'song-1440738798', // Weathered
  'song-1440718023', // What's This Life For
  'song-1440788242', // Rain
  'song-1440738801', // Don't Stop Dancing
  'song-1748843365', // Higher (Remastered)
  'song-1440631188', // Are You Ready?
]);

d.songs = d.songs.filter(s => {
  if (creedSongIds.has(s.id) && s.artistName === 'Bruno Mars') {
    removedCount++;
    console.log(`[REMOVED CREED CONTAMINATION FROM BRUNO MARS] "${s.title}" from album "${s.albumName || s.albumTitle}"`);
    return false;
  }
  return true;
});

// Remove contaminated Creed albums from Bruno Mars
const creedAlbumIds = new Set([
  'album-bruno-mars-weathered',
  'album-bruno-mars-my-own-prison',
  'album-bruno-mars-human-clay',
  'album-bruno-mars-full-circle'
]);
d.albums = d.albums.filter(a => {
  if (creedAlbumIds.has(a.id)) {
    console.log(`[REMOVED CREED ALBUM FROM BRUNO MARS] ${a.title} (${a.id})`);
    return false;
  }
  return true;
});

// Remove those album IDs from Bruno Mars artist profile
const brunoArtist = d.artists.find(a => a.id === 'artist-bruno-mars');
if (brunoArtist && brunoArtist.albumIds) {
  brunoArtist.albumIds = brunoArtist.albumIds.filter(id => !creedAlbumIds.has(id));
}

// 3. PURGE FAKE TRIBUTE / IMPOSTOR SONGS WHERE TITLE EQUALS ARTIST NAME FROM OTHER ARTISTS
const impostorSongIds = new Set([
  'song-1880846627', // Bruno Mars by TRESCENDER
  'song-1146028814', // Bruno Mars (feat. Marcy) by #SingersChallenge
  'song-1640953251', // Bruno Mars (Peter Gene Hernandez) by Tha Libra III
  'song-1622624619', // Dua Lipa by Jack Harlow
  'song-1698162327', // Eminem - Single
  'song-1628837538', // Billie Eilish - Single
  'song-1735197683', // Billie Eilish - Single
  'song-1563108364', // Giveon - Single (tribute)
  'song-1660785926', // Daniel Caesar - Single (tribute)
  'song-1637391680', // Jack Harlow - Single (tribute)
  'song-1448811701', // Fisher - Single
  'song-6805493317', // Blur - Single
  'song-1107403105', // #Blur
  'song-1644754591', // Tate McRae - Single
  'song-1462404354', // Flo Milli - Single
  'song-1488720719', // 21 Savage - Testify
  'song-1711412440', // Lil Wayne - !
  'song-1207349999', // Normani - Cloud Minders
]);

d.songs = d.songs.filter(s => {
  if (impostorSongIds.has(s.id)) {
    removedCount++;
    console.log(`[REMOVED IMPOSTOR/TRIBUTE TRACK] "${s.title}" under ${s.artistName} (${s.id})`);
    return false;
  }
  return true;
});

// 4. CLEAN UP ALBUM SONGIDS REFERENCES
const existingSongIdSet = new Set(d.songs.map(s => s.id));
for (const album of d.albums) {
  if (Array.isArray(album.songIds)) {
    album.songIds = album.songIds.filter(id => existingSongIdSet.has(id));
  }
}

// 5. UPDATE ARTIST COUNTS AND ALBUM ASSOCIATIONS
const existingAlbumIdSet = new Set(d.albums.map(a => a.id));
for (const artist of d.artists) {
  if (Array.isArray(artist.albumIds)) {
    artist.albumIds = artist.albumIds.filter(id => existingAlbumIdSet.has(id));
  }
}

console.log(`\nAudit & Synchronization Completed!`);
console.log(`  -> Fixed critical soundtracks: ${fixedCount}`);
console.log(`  -> Purged contaminated & impostor tracks: ${removedCount}`);
console.log(`  -> Remaining songs in DB: ${d.songs.length}`);
console.log(`  -> Remaining albums in DB: ${d.albums.length}`);

console.log('Writing back to database file...');
fs.writeFileSync(DB_PATH, JSON.stringify(d, null, 2), 'utf8');
console.log('Database successfully saved and synchronized!');

