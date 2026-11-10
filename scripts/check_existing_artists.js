const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'sonora.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const checkArtists = ['Olivia Rodrigo', 'Sabrina Carpenter', 'Adele', 'CORTIS'];
for (const name of checkArtists) {
  const a = (data.artists || []).find(x => x.name.toLowerCase() === name.toLowerCase());
  console.log(name, a ? { id: a.id, bio: a.bio, monthlyListeners: a.monthlyListeners } : 'NOT FOUND');
}
