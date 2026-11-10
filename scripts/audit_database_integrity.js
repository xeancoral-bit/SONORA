const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/sonora.json', 'utf8'));

console.log('=== AUDIT REPORT ===');
console.log('Total Artists:', db.artists.length);
console.log('Total Albums:', db.albums.length);
console.log('Total Songs:', db.songs.length);

// 1. Check for duplicate or near-duplicate artist names
const normArtistMap = new Map();
const duplicateArtists = [];
for (const a of db.artists) {
  const norm = a.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normArtistMap.has(norm)) {
    duplicateArtists.push({ original: normArtistMap.get(norm), duplicate: a });
  } else {
    normArtistMap.set(norm, a);
  }
}
console.log('\n--- DUPLICATE ARTISTS (' + duplicateArtists.length + ') ---');
duplicateArtists.forEach(d => {
  console.log(`Original: "${d.original.name}" (${d.original.id}) vs Duplicate: "${d.duplicate.name}" (${d.duplicate.id})`);
});

// 2. Check for artists with generic unsplash banners or avatars
const unsplashArtists = db.artists.filter(a => (a.avatar || '').includes('unsplash.com') || (a.coverImage || '').includes('unsplash.com'));
console.log('\n--- ARTISTS WITH UNSPLASH AVATARS/COVERS (' + unsplashArtists.length + ') ---');
unsplashArtists.slice(0, 15).forEach(a => console.log('  -', a.name, a.avatar));

// 3. Check for songs with YouTube links to different artists or mismatched titles
console.log('\n--- CHECKING SAMPLE POPULAR SONGS FOR AUDIO/AUTHOR INTEGRITY ---');
const famousChecks = [
  { artist: 'AURORA', title: 'Runaway' },
  { artist: 'Jungkook', title: 'Seven' },
  { artist: 'BTS', title: 'Dynamite' },
  { artist: 'Bruno Mars', title: 'Locked Out of Heaven' },
  { artist: 'Queen', title: 'Bohemian Rhapsody' }
];
famousChecks.forEach(fc => {
  const s = db.songs.find(x => (x.artistName || '').toLowerCase().includes(fc.artist.toLowerCase()) && (x.title || '').toLowerCase().includes(fc.title.toLowerCase()));
  if (s) {
    console.log(`Found: [${s.artistName}] "${s.title}" -> Audio: ${s.audioUrl} | Cover: ${s.coverImage?.slice(0, 50)}...`);
  } else {
    console.log(`Missing: [${fc.artist}] "${fc.title}"`);
  }
});

// 4. Check all soundtrack albums and their tracks
console.log('\n--- SOUNDTRACK ALBUMS AUDIT ---');
const ostAlbums = db.albums.filter(a =>
  (a.title || '').toLowerCase().includes('soundtrack') ||
  (a.title || '').toLowerCase().includes('ost') ||
  a.type === 'soundtrack' ||
  (a.genreName || '').toLowerCase().includes('soundtrack')
);
console.log('Total OST Albums:', ostAlbums.length);
ostAlbums.slice(0, 20).forEach(a => {
  console.log(`  - [${a.artistName}] "${a.title}" (Tracks: ${a.songIds?.length || 0}) Cover: ${a.coverImage?.slice(0, 60)}`);
});
