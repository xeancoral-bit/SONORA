const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'sonora.json');
if (!fs.existsSync(dbPath)) {
  console.log('sonora.json does not exist');
  process.exit(0);
}

try {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  console.log('Total artists in sonora.json:', data.artists ? data.artists.length : 0);
  console.log('Total albums in sonora.json:', data.albums ? data.albums.length : 0);
  console.log('Total songs in sonora.json:', data.songs ? data.songs.length : 0);

  const targets = ['The Black Eyed Peas', 'Wild Orchid', 'Lizzy McAlpine'];
  for (const t of targets) {
    const foundArtist = (data.artists || []).find(a => a.name.toLowerCase() === t.toLowerCase());
    const foundSongs = (data.songs || []).filter(s => (s.artistName || '').toLowerCase() === t.toLowerCase());
    const foundAlbums = (data.albums || []).filter(a => (a.artistName || '').toLowerCase() === t.toLowerCase());
    console.log(`[${t}] Artist: ${foundArtist ? foundArtist.id : 'NOT FOUND'}, Albums: ${foundAlbums.length}, Songs: ${foundSongs.length}`);
  }
} catch (err) {
  console.error('Error reading sonora.json:', err.message);
}
