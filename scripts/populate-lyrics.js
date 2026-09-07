const fs = require('fs');
const path = require('path');

// Read compiled/raw lyricsData
const lyricsDataRaw = fs.readFileSync(path.join(__dirname, '..', 'lib', 'lyricsData.ts'), 'utf8');

// Extract CATALOG_LYRICS_DB object from ts file
// Since it's valid JS object structure inside, we can eval or compile it
const match = lyricsDataRaw.match(/export const CATALOG_LYRICS_DB: Record<string, Record<string, SyncedLyricLine\[\]>> = (\{[\s\S]*?\n\};)/);
if (!match) {
  console.error('Could not extract CATALOG_LYRICS_DB');
  process.exit(1);
}

let catalogLyricsDb;
try {
  catalogLyricsDb = eval('(' + match[1].replace(/;\s*$/, '') + ')');
} catch (e) {
  console.error('Failed to parse CATALOG_LYRICS_DB:', e);
  process.exit(1);
}

const dbPath = path.join(__dirname, '..', 'data', 'sonora.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let updatedCount = 0;
for (const song of db.songs) {
  const lyricsEntry = catalogLyricsDb[song.id];
  if (lyricsEntry) {
    song.syncedLyrics = lyricsEntry.en;
    song.multilingualLyrics = lyricsEntry;
    if (!song.lyrics) {
      song.lyrics = lyricsEntry.en.map(l => `[${formatLrcTime(l.time)}] ${l.text}`).join('\n');
    }
    updatedCount++;
    console.log(`Updated lyrics for "${song.title}" (${song.id})`);
  }
}

function formatLrcTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.00`;
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully populated lyrics for ${updatedCount} songs in data/sonora.json!`);
