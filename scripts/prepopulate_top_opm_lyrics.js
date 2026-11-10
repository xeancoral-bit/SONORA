const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const targets = [
  { artist: 'juan karlos', title: 'Buwan' },
  { artist: 'Up Dharma Down', title: 'Tadhana' },
  { artist: 'Nobita', title: 'Ikaw Lang' },
  { artist: 'Up Dharma Down', title: 'Oo' },
  { artist: 'juan karlos', title: 'ERE' },
  { artist: 'I Belong to the Zoo', title: 'Sana' },
  { artist: 'Gloc-9', title: 'Sirena' },
  { artist: 'mrld', title: 'An Art Gallery Could Never Be as Unique as You' },
  { artist: 'BINI', title: 'Pantropiko' },
  { artist: 'Orange & Lemons', title: 'Hanggang Kailan' },
  { artist: 'Nobita', title: 'Unang Sayaw' },
  { artist: 'BINI', title: 'Salamin, Salamin' },
  { artist: 'Gloc-9', title: 'Magda' },
  { artist: 'I Belong to the Zoo', title: 'Balang Araw' },
  { artist: 'Orange & Lemons', title: 'Pinoy Ako' },
  { artist: 'Eraserheads', title: 'Ligaya' },
  { artist: 'BINI', title: 'Karera' },
  { artist: 'Franco', title: 'Better Days' },
];

function parseLrc(lrc) {
  if (!lrc) return [];
  const lines = lrc.split('\n');
  const result = [];
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let match;
    const timestamps = [];
    while ((match = timeRegex.exec(trimmed)) !== null) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const msStr = match[3] || '0';
      const ms = parseInt(msStr.padEnd(3, '0').slice(0, 3), 10);
      timestamps.push(min * 60 + sec + ms / 1000);
    }
    const text = trimmed.replace(timeRegex, '').trim();
    if (timestamps.length > 0 && text) {
      for (const t of timestamps) {
        result.push({ time: t, text });
      }
    }
  }
  result.sort((a, b) => a.time - b.time);
  return result;
}

function autoGenerateSyncedLyrics(plainLyrics, duration = 180) {
  if (!plainLyrics || typeof plainLyrics !== 'string') return [];
  const rawLines = plainLyrics.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !/^\[(verse|chorus|bridge|intro|outro)/i.test(l));
  if (rawLines.length === 0) return [];
  const count = rawLines.length;
  const startSec = 8;
  const endSec = Math.max(startSec + count * 3.5, duration - 8);
  const timeSpan = endSec - startSec;
  return rawLines.map((line, idx) => {
    const progress = idx / Math.max(1, count - 1);
    const time = Math.round((startSec + progress * timeSpan) * 100) / 100;
    return { time, text: line };
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('--- Pre-populating Full Lyrics for Popular OPM Tracks ---');
  let successCount = 0;

  for (const t of targets) {
    try {
      const cleanArtist = t.artist.replace('&', '').replace(/\s+/g, ' ').trim();
      const cleanTitle = t.title.replace(/\s*\(.*?\)/g, '').trim();
      const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'SonoraMusic/2.0' } });
      
      let item = null;
      if (res.ok) {
        item = await res.json();
      } else {
        // Fallback search
        const sUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cleanArtist} ${cleanTitle}`)}`;
        const sRes = await fetch(sUrl, { headers: { 'User-Agent': 'SonoraMusic/2.0' } });
        if (sRes.ok) {
          const list = await sRes.json();
          if (Array.isArray(list) && list[0]) item = list[0];
        }
      }

      if (item && (item.syncedLyrics || item.plainLyrics)) {
        const matches = db.songs.filter(
          s =>
            (s.title.toLowerCase().startsWith(cleanTitle.toLowerCase()) || cleanTitle.toLowerCase().startsWith(s.title.toLowerCase())) &&
            (s.artistName.toLowerCase().includes(cleanArtist.toLowerCase()) || cleanArtist.toLowerCase().includes(s.artistName.toLowerCase()))
        );

        for (const s of matches) {
          const duration = s.duration || item.duration || 200;
          let synced = [];
          if (item.syncedLyrics) {
            synced = parseLrc(item.syncedLyrics);
          } else if (item.plainLyrics) {
            synced = autoGenerateSyncedLyrics(item.plainLyrics, duration);
          }

          s.lyrics = item.plainLyrics || item.syncedLyrics;
          if (synced.length > 0) {
            s.syncedLyrics = synced;
          }
          console.log(`[SAVED LYRICS] ${s.title} (${s.artistName}) -> ${synced.length} lines`);
          successCount++;
        }
      } else {
        console.log(`[NO LYRICS FOUND] ${t.artist} - ${t.title}`);
      }
    } catch (e) {
      console.error(`[ERROR] ${t.title}:`, e.message);
    }
    await sleep(100);
  }

  console.log(`Successfully populated lyrics for ${successCount} song records.`);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('Database updated.');
}

main().catch(console.error);

