const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const d = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

function slug(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

const mismatched = [];
for (const s of d.songs) {
  if (s.id.startsWith('song-') && !s.id.match(/^song-\d+$/) && !s.id.startsWith('song-dz-')) {
    for (const a of d.artists) {
      if (slug(a.name).length > 4 && s.id.startsWith('song-' + a.slug) && slug(s.artistName) !== slug(a.name) && !slug(s.artistName).includes(slug(a.name))) {
        mismatched.push({ id: s.id, artistName: s.artistName, targetArtist: a.name, title: s.title });
        break;
      }
    }
  }
}

console.log(`Found ${mismatched.length} songs with mismatched ID slugs:`);
for (const m of mismatched.slice(0, 20)) {
  console.log(`[${m.id}] title="${m.title}", artist="${m.artistName}" (ID slug belongs to: ${m.targetArtist})`);
}

// Remove these corrupt entries and clean album songIds
if (mismatched.length > 0) {
  const badIdSet = new Set(mismatched.map(m => m.id));
  d.songs = d.songs.filter(s => !badIdSet.has(s.id));
  for (const alb of d.albums) {
    if (Array.isArray(alb.songIds)) {
      alb.songIds = alb.songIds.filter(id => !badIdSet.has(id));
    }
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(d, null, 2), 'utf8');
  console.log(`Successfully purged ${mismatched.length} corrupt mismatched songs and resynced DB.`);
}

