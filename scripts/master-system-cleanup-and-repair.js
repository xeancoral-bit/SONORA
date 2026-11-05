const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const d = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log('=== STARTING MASTER SYSTEM-WIDE CLEANUP & REPAIR ===');
console.log(`Initial DB state: ${d.songs.length} songs, ${d.albums.length} albums, ${d.artists.length} artists`);

let fixedAlbums = 0;
let removedDuplicates = 0;
let cleanedLyrics = 0;

// 1. REPAIR CROSS-ARTIST ALBUM MISMATCHES

// A. Maroon 5 tracks in Ed Sheeran's "=" album
const maroon5SongsJaneId = 'album-maroon-5-songs-about-jane';
let maroon5Album = d.albums.find(a => a.id === maroon5SongsJaneId);
if (!maroon5Album) {
  maroon5Album = {
    id: maroon5SongsJaneId,
    title: 'Songs About Jane',
    artistId: 'artist-maroon-5',
    artistName: 'Maroon 5',
    coverImage: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bf/25/7f/bf257f86-cfdf-e2a2-cbcf-f6f8730b65bf/00602547146581.rgb.jpg/1000x1000bb.jpg',
    description: 'Debut studio album "Songs About Jane" by Maroon 5 featuring hit singles This Love, Sunday Morning, and She Will Be Loved.',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '2002-06-25',
    copyrightInfo: '℗ 2002 Octone Records',
    status: 'published',
    isFeatured: true,
    songIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  d.albums.push(maroon5Album);
  fixedAlbums++;
  console.log('[CREATED ALBUM] Maroon 5 - Songs About Jane');
}

const edSheeranEquals = d.albums.find(a => a.id === 'album-ed-sheeran-equals');
for (const s of d.songs) {
  if (s.artistName === 'Maroon 5' && s.albumId === 'album-ed-sheeran-equals') {
    s.albumId = maroon5Album.id;
    s.albumTitle = maroon5Album.title;
    s.albumName = maroon5Album.title;
    if (!maroon5Album.songIds.includes(s.id)) {
      maroon5Album.songIds.push(s.id);
    }
    console.log(`[REASSIGNED TO SONGS ABOUT JANE] "${s.title}" by Maroon 5`);
  }
}

if (edSheeranEquals && Array.isArray(edSheeranEquals.songIds)) {
  const maroon5SongIdSet = new Set(maroon5Album.songIds);
  edSheeranEquals.songIds = edSheeranEquals.songIds.filter(id => !maroon5SongIdSet.has(id));
  console.log('[CLEANED] Ed Sheeran "=" album now contains only Ed Sheeran tracks');
}

// Ensure Maroon 5 artist profile includes Songs About Jane
const maroon5Artist = d.artists.find(a => a.id === 'artist-maroon-5');
if (maroon5Artist && !maroon5Artist.albumIds.includes(maroon5Album.id)) {
  maroon5Artist.albumIds.push(maroon5Album.id);
}

// B. Rihanna & Coldplay "Princess of China"
for (const s of d.songs) {
  if (s.albumId === 'album-princess-of-china-ep' && s.artistName === 'Rihanna') {
    s.artistName = 'Coldplay & Rihanna';
    s.artistId = 'artist-coldplay';
    console.log(`[NORMALIZED COLLABORATION] "${s.title}" -> Coldplay & Rihanna`);
  }
}

// 2. DEDUPLICATE REPEATED TRACKS UNDER THE SAME ARTIST
function normTitle(t) {
  return (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Priority scoring for deciding which track version to retain
function scoreTrackQuality(s) {
  let score = 0;
  // Official studio album preferred over generic singles
  if (s.albumTitle && !s.albumTitle.toLowerCase().includes('single') && !s.albumTitle.toLowerCase().includes('ep')) {
    score += 50;
  }
  // Avoid reused slug IDs like 'song-camila-cabello-havana-live' for Shakira
  if (!s.id.includes('live') && !s.id.includes('remix')) {
    score += 30;
  }
  // High quality verified artwork
  if (s.coverImage && !s.coverImage.includes('unsplash')) {
    score += 20;
  }
  // Higher play count
  score += Math.min(20, Math.log10(s.playCount || 10) * 4);
  return score;
}

const trackGroups = new Map();
for (const s of d.songs) {
  const normArtist = (s.artistName || '').toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]/g, '');
  const key = `${normArtist}:::${normTitle(s.title)}`;
  if (!trackGroups.has(key)) {
    trackGroups.set(key, []);
  }
  trackGroups.get(key).push(s);
}

const songsToKeep = new Set();
const songsToRemove = new Set();

for (const [key, group] of trackGroups.entries()) {
  if (group.length === 1) {
    songsToKeep.add(group[0].id);
  } else {
    // Sort descending by quality score
    group.sort((a, b) => scoreTrackQuality(b) - scoreTrackQuality(a));
    songsToKeep.add(group[0].id);
    for (let i = 1; i < group.length; i++) {
      songsToRemove.add(group[i].id);
      removedDuplicates++;
    }
  }
}

console.log(`Deduplication: Retained ${songsToKeep.size} canonical tracks, removing ${songsToRemove.size} duplicate entries.`);
d.songs = d.songs.filter(s => !songsToRemove.has(s.id));

// 3. PURGE SYNTHETIC & DUMMY LYRICS
for (const s of d.songs) {
  if (typeof s.lyrics === 'string' && s.lyrics.includes('♪ Verse 1 ♪')) {
    s.lyrics = '';
    s.syncedLyrics = [];
    cleanedLyrics++;
  }
  if (Array.isArray(s.syncedLyrics) && s.syncedLyrics.some(l => l.text && l.text.includes('♪ Verse 1 ♪'))) {
    s.syncedLyrics = [];
    s.lyrics = '';
    cleanedLyrics++;
  }
}
console.log(`Cleaned fabricated dummy lyrics from ${cleanedLyrics} songs.`);

// 4. CLEAN UP ALBUM TRACKLISTS AND REMOVE EMPTY ALBUMS
const validSongIds = new Set(d.songs.map(s => s.id));
for (const alb of d.albums) {
  if (Array.isArray(alb.songIds)) {
    alb.songIds = alb.songIds.filter(id => validSongIds.has(id));
  }
}

// Remove empty albums that have 0 songs
const beforeAlbumCount = d.albums.length;
d.albums = d.albums.filter(a => Array.isArray(a.songIds) && a.songIds.length > 0);
console.log(`Removed ${beforeAlbumCount - d.albums.length} empty albums without songs.`);

// 5. CLEAN UP ARTIST ALBUM LISTS
const validAlbumIds = new Set(d.albums.map(a => a.id));
for (const art of d.artists) {
  if (Array.isArray(art.albumIds)) {
    art.albumIds = art.albumIds.filter(id => validAlbumIds.has(id));
  }
}

// 6. SYNC ALL SONG <-> ALBUM <-> ARTIST METADATA
const albumLookup = new Map(d.albums.map(a => [a.id, a]));
for (const s of d.songs) {
  const alb = albumLookup.get(s.albumId);
  if (alb) {
    s.albumTitle = alb.title;
    s.albumName = alb.title;
    if (!s.coverImage || s.coverImage.includes('unsplash')) {
      s.coverImage = alb.coverImage;
    }
  }
}

console.log('\n=== FINAL REPAIR SUMMARY ===');
console.log(`  -> Valid songs remaining: ${d.songs.length}`);
console.log(`  -> Valid albums remaining: ${d.albums.length}`);
console.log(`  -> Total artists: ${d.artists.length}`);
console.log(`  -> Duplicate tracks purged: ${removedDuplicates}`);
console.log(`  -> Fabricated lyrics purged: ${cleanedLyrics}`);

console.log('Writing back to database file...');
fs.writeFileSync(DB_PATH, JSON.stringify(d, null, 2), 'utf8');
console.log('Database successfully saved and fully synchronized!');

