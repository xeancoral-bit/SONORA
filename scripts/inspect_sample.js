const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'sonora.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('Keys in sonora.json:', Object.keys(data));
console.log('Sample artist:', data.artists ? data.artists[0] : null);
console.log('Sample album:', data.albums ? data.albums[0] : null);
console.log('Sample song:', data.songs ? data.songs[0] : null);
