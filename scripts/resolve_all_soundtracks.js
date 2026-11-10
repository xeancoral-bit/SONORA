const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

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
  const rawLines = plainLyrics
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !/^\[(verse|chorus|bridge|intro|outro|pre-chorus|hook)/i.test(l));
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

function cleanTitle(t) {
  return t
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*\(from [^)]+\)/gi, '')
    .replace(/\s*-\s*from [^)]+/gi, '')
    .replace(/\s*\(music from [^)]+\)/gi, '')
    .replace(/\s*\(original motion picture soundtrack\)/gi, '')
    .replace(/\s*\(soundtrack\)/gi, '')
    .replace(/\s*-\s*single/gi, '')
    .trim();
}

async function fetchLyrics(artist, title) {
  const cleanT = cleanTitle(title);
  const primaryA = artist.split(/[&,]|feat\./i)[0].trim();
  try {
    const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(primaryA)}&track_name=${encodeURIComponent(cleanT)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'SonoraMusic/2.0' }, signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.syncedLyrics || data.plainLyrics)) return data;
    }
  } catch {}

  try {
    const sUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${primaryA} ${cleanT}`)}`;
    const sRes = await fetch(sUrl, { headers: { 'User-Agent': 'SonoraMusic/2.0' }, signal: AbortSignal.timeout(3500) });
    if (sRes.ok) {
      const list = await sRes.json();
      if (Array.isArray(list) && list[0]) return list[0];
    }
  } catch {}

  return null;
}

async function fetchYouTubeVideo(artist, title, album = '') {
  const cleanT = cleanTitle(title);
  const query = `${cleanT} ${artist} ${album} official soundtrack audio`.trim();
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch {}
  return null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const ostSongs = db.songs.filter(
    (s) =>
      (s.genreName && s.genreName.toLowerCase().includes('soundtrack')) ||
      s.albumTitle?.toLowerCase().includes('soundtrack') ||
      s.albumTitle?.toLowerCase().includes('ost')
  );

  console.log(`Starting soundtrack resolution for ${ostSongs.length} songs...`);

  let lyricsFixed = 0;
  let audioFixed = 0;

  // Process in small batches
  const BATCH_SIZE = 10;
  for (let i = 0; i < ostSongs.length; i += BATCH_SIZE) {
    const batch = ostSongs.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (song) => {
        const needsAudio = !song.externalMediaId || song.audioUrl?.includes('dzcdn.net');
        const needsLyrics = !song.lyrics || song.lyrics.trim().length === 0;

        // 1. Resolve Audio if needed
        if (needsAudio) {
          const videoId = await fetchYouTubeVideo(song.artistName, song.title, song.albumTitle);
          if (videoId) {
            song.externalMediaId = videoId;
            song.audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
            song.sourcePlatform = 'youtube';
            song.isUnavailable = false;
            audioFixed++;
          }
        }

        // 2. Resolve Lyrics if needed
        if (needsLyrics) {
          const lyr = await fetchLyrics(song.artistName, song.title);
          if (lyr) {
            const dur = song.duration || lyr.duration || 210;
            let parsed = [];
            if (lyr.syncedLyrics) {
              parsed = parseLrc(lyr.syncedLyrics);
            } else if (lyr.plainLyrics) {
              parsed = autoGenerateSyncedLyrics(lyr.plainLyrics, dur);
            }

            song.lyrics = lyr.plainLyrics || lyr.syncedLyrics;
            if (parsed.length > 0) {
              song.syncedLyrics = parsed;
            }
            lyricsFixed++;
          }
        }
      })
    );

    console.log(`Progress: ${Math.min(i + BATCH_SIZE, ostSongs.length)} / ${ostSongs.length} processed. Audio fixed: ${audioFixed}, Lyrics fixed: ${lyricsFixed}`);
    await sleep(150);
  }

  console.log(`\n--- SOUNDTRACK RESOLUTION COMPLETE ---`);
  console.log(`Total Audio Fixed: ${audioFixed}`);
  console.log(`Total Lyrics Fixed: ${lyricsFixed}`);

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('Database saved.');
}

main().catch(console.error);

