const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/sonora.json', 'utf8'));

console.log('=== RESTORED DATABASE STATS ===');
console.log('Total Artists:', d.artists.length);
console.log('Total Albums:', d.albums.length);
console.log('Total Songs:', d.songs.length);

console.log('\nChecking requested artists:');
const checkList = [
  'Rex Orange County', 'Goo Goo Dolls', 'Adie', 'Yung Kai', 'Zack Tabudlo',
  'Cup of Joe', 'Joji', 'Daniel Caesar', 'Elvis Presley', 'Troye Sivan',
  'Bruno Mars', 'Taylor Swift', 'Ariana Grande', 'Chappell Roan', 'Benson Boone',
  'Olivia Rodrigo', 'Billie Eilish', 'Ed Sheeran', 'The Neighbourhood'
];

for (const name of checkList) {
  const art = d.artists.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (art) {
    const s = d.songs.filter(x => x.artistId === art.id);
    const alb = d.albums.filter(x => x.artistId === art.id);
    console.log(` - ${art.name}: ${s.length} tracks, ${alb.length} albums`);
  } else {
    console.log(` - ${name}: NOT FOUND`);
  }
}

console.log('\nChecking key curated tracks:');
const sampleTracks = [
  'There For You', 'YOUTH', 'Sweater Weather', 'Just The Way You Are',
  'One Last Time', 'Cruel Summer', 'Paraluman', 'Binibini', 'Tingin',
  'Glimpse of Us', 'Blue'
];

for (const title of sampleTracks) {
  const song = d.songs.find(s => s.title.toLowerCase() === title.toLowerCase());
  if (song) {
    console.log(` - "${song.title}" by ${song.artistName} | Audio: ${Boolean(song.audioUrl)} | extMedia: ${song.externalMediaId || 'none'} | Album: "${song.albumTitle}"`);
  } else {
    console.log(` - "${title}": NOT FOUND`);
  }
}

