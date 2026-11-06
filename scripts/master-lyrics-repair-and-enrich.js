const fs = require('fs');

function parseLrc(lrc) {
  if (!lrc || typeof lrc !== 'string') return [];
  const lines = lrc.split(/\r?\n/);
  const result = [];
  let offsetMs = 0;

  for (const rawLine of lines) {
    const offsetMatch = rawLine.match(/^\[offset:\s*([+-]?\d+)\]/i);
    if (offsetMatch) {
      offsetMs = parseInt(offsetMatch[1], 10) || 0;
      break;
    }
  }
  const offsetSec = offsetMs / 1000;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^\[(ti|ar|al|by|offset|length|re|ve|encoding|id):/i.test(line)) continue;

    const timestampRegex = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
    const timestamps = [];
    let match;

    while ((match = timestampRegex.exec(line)) !== null) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      let ms = 0;
      if (match[3]) {
        const msStr = match[3].padEnd(3, '0').slice(0, 3);
        ms = parseInt(msStr, 10) / 1000;
      }
      const rawTime = min * 60 + sec + ms + offsetSec;
      const finalTime = Math.max(0, Math.round(rawTime * 100) / 100);
      timestamps.push(finalTime);
    }

    const cleanText = line.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim();

    if (timestamps.length > 0 && cleanText) {
      if (/^\[(verse|chorus|bridge|intro|outro|pre-chorus|hook|solo)\]$/i.test(cleanText)) continue;
      for (const t of timestamps) {
        result.push({ time: t, text: cleanText });
      }
    }
  }

  result.sort((a, b) => a.time - b.time);

  const deduplicated = [];
  for (const item of result) {
    const last = deduplicated[deduplicated.length - 1];
    if (last && Math.abs(last.time - item.time) < 0.08 && last.text === item.text) continue;
    deduplicated.push(item);
  }

  return deduplicated;
}

function cleanTitle(title) {
  return (title || '')
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/\s*\(from [^)]+\)/gi, '')
    .replace(/\s*-\s*from [^)]+/gi, '')
    .replace(/\s*\(music from [^)]+\)/gi, '')
    .replace(/\s*\(soundtrack\)/gi, '')
    .replace(/\s*\(original motion picture soundtrack\)/gi, '')
    .replace(/\s*\(taylor's version\)/gi, '')
    .replace(/\s*\(taylor’s version\)/gi, '')
    .replace(/\s*\(deluxe[^)]*\)/gi, '')
    .replace(/\s*\[deluxe[^\]]*\]/gi, '')
    .replace(/\s*\(expanded[^)]*\)/gi, '')
    .replace(/\s*\(bonus[^)]*\)/gi, '')
    .replace(/\s*\(special[^)]*\)/gi, '')
    .replace(/\s*\(platinum[^)]*\)/gi, '')
    .replace(/\s*-\s*single/gi, '')
    .replace(/\s*-\s*ep/gi, '')
    .replace(/\s*\(live[^)]*\)/gi, '')
    .replace(/\s*\[remastered[^\]]*\]/gi, '')
    .replace(/\s*\(remastered[^)]*\)/gi, '')
    .replace(/\s*\(clean\)/gi, '')
    .replace(/\s*\(explicit\)/gi, '')
    .replace(/\s*-\s*radio edit/gi, '')
    .replace(/\s*\(radio edit\)/gi, '')
    .trim();
}

function isArtistMatch(itemArtist, targetArtist) {
  if (!itemArtist || !targetArtist) return false;
  const iNorm = itemArtist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const tNorm = targetArtist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (iNorm === tNorm) return true;
  if (iNorm.includes(tNorm) || tNorm.includes(iNorm)) {
    const wordsT = tNorm.split(/[\s,&]+/).filter((w) => w.length > 2);
    const wordsI = iNorm.split(/[\s,&]+/).filter((w) => w.length > 2);
    return wordsT.some((w) => wordsI.includes(w)) || wordsI.some((w) => wordsT.includes(w));
  }
  return false;
}

async function fetchLyricsForTrack(title, artist, duration = 210) {
  const cTitle = cleanTitle(title);
  const primaryArtist = cleanTitle((artist || '').split(/[&,]|feat\./i)[0].trim());
  const fullArtist = cleanTitle(artist || '');

  // 1. Direct exact match
  try {
    const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(primaryArtist)}&track_name=${encodeURIComponent(cTitle)}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'SonoraMusic/2.0' }, signal: AbortSignal.timeout(3500) });
    if (r.ok) {
      const data = await r.json();
      if (data.syncedLyrics || data.plainLyrics) {
        return {
          synced: parseLrc(data.syncedLyrics),
          plain: data.plainLyrics || (data.syncedLyrics ? data.syncedLyrics.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim() : '')
        };
      }
    }
  } catch {}

  // 1b. Direct exact match with full artist
  if (fullArtist !== primaryArtist) {
    try {
      const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(fullArtist)}&track_name=${encodeURIComponent(cTitle)}`;
      const r = await fetch(url, { headers: { 'User-Agent': 'SonoraMusic/2.0' }, signal: AbortSignal.timeout(3500) });
      if (r.ok) {
        const data = await r.json();
        if (data.syncedLyrics || data.plainLyrics) {
          return {
            synced: parseLrc(data.syncedLyrics),
            plain: data.plainLyrics || (data.syncedLyrics ? data.syncedLyrics.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim() : '')
          };
        }
      }
    } catch {}
  }

  // 2. Search API
  try {
    const sUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${primaryArtist} ${cTitle}`)}`;
    const r = await fetch(sUrl, { headers: { 'User-Agent': 'SonoraMusic/2.0' }, signal: AbortSignal.timeout(3500) });
    if (r.ok) {
      const items = await r.json();
      if (Array.isArray(items) && items.length > 0) {
        const matched = items.find(it => isArtistMatch(it.artistName, primaryArtist) && (it.syncedLyrics || it.plainLyrics));
        if (matched) {
          return {
            synced: parseLrc(matched.syncedLyrics),
            plain: matched.plainLyrics || (matched.syncedLyrics ? matched.syncedLyrics.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim() : '')
          };
        }
      }
    }
  } catch {}

  return null;
}

async function main() {
  console.log('Loading database...');
  const raw = fs.readFileSync('data/sonora.json', 'utf8');
  const data = JSON.parse(raw);
  console.log(`Loaded ${data.songs.length} songs.`);

  // 1. Identify songs needing lyrics repair:
  // - Existing songs with short/truncated lyrics (< 20 lines)
  // - Top featured songs, popular songs, and hits from prominent artists
  const repairList = [];

  // Add existing songs with truncated lyrics
  for (const s of data.songs) {
    const lineCount = (s.syncedLyrics || []).length;
    if (s.lyrics && lineCount > 0 && lineCount < 20) {
      repairList.push(s);
    }
  }
  console.log(`Found ${repairList.length} songs with short/truncated lyrics to fix.`);

  // Target key top artists for extensive lyrics enrichment:
  const keyArtists = [
    'Taylor Swift', 'Bruno Mars', 'Lady Gaga', 'Sabrina Carpenter', 'Billie Eilish',
    'The Weeknd', 'Post Malone', 'Adele', 'Ed Sheeran', 'Olivia Rodrigo', 'Dua Lipa',
    'Ariana Grande', 'Coldplay', 'Maroon 5', 'Imagine Dragons', 'David Guetta',
    'Hillsong Worship', 'Hillsong UNITED', 'Bethel Music', 'Elevation Worship',
    'Maverick City Music', 'Victory Worship', 'Chris Tomlin', 'Lauren Daigle',
    'Don Moen', 'Phil Wickham', 'Brandon Lake', 'Kari Jobe', 'Cody Carnes',
    'Gary Valenciano', 'Sinach', 'Leeland'
  ];

  const artistMap = new Map();
  for (const s of data.songs) {
    const aName = (s.artistName || '').toLowerCase();
    for (const target of keyArtists) {
      if (aName.includes(target.toLowerCase())) {
        if (!artistMap.has(target)) artistMap.set(target, []);
        if (artistMap.get(target).length < 25) { // enrich up to 25 top tracks per key artist
          // only if not already having rich synced lyrics
          if (!s.syncedLyrics || s.syncedLyrics.length < 25) {
            artistMap.get(target).push(s);
          }
        }
      }
    }
  }

  for (const [artist, songs] of artistMap.entries()) {
    for (const s of songs) {
      if (!repairList.find(x => x.id === s.id)) {
        repairList.push(s);
      }
    }
  }

  console.log(`Total songs queued for lyrics validation and enrichment: ${repairList.length}`);

  let updatedCount = 0;
  let batchIndex = 0;

  for (const song of repairList) {
    batchIndex++;
    process.stdout.write(`[${batchIndex}/${repairList.length}] Enriching lyrics for "${song.title}" by ${song.artistName}... `);

    try {
      const res = await fetchLyricsForTrack(song.title, song.artistName, song.duration);
      if (res && (res.synced.length > 0 || res.plain.length > 0)) {
        song.syncedLyrics = res.synced;
        song.lyrics = res.plain || (res.synced.map(l => l.text).join('\n'));
        song.updatedAt = new Date().toISOString();
        updatedCount++;
        console.log(`✓ (${res.synced.length} synced lines, ${song.lyrics.length} chars)`);
      } else {
        console.log('- not found in registry');
      }
    } catch (e) {
      console.log(`! error: ${e.message}`);
    }

    // Rate-limit friendly delay
    await new Promise(r => setTimeout(r, 150));

    // Save checkpoint every 50 songs
    if (batchIndex % 50 === 0) {
      console.log(`Saving checkpoint at ${batchIndex}...`);
      fs.writeFileSync('data/sonora.json', JSON.stringify(data, null, 2), 'utf8');
    }
  }

  console.log(`Finished enrichment! Total songs updated with official full synced lyrics: ${updatedCount}`);
  fs.writeFileSync('data/sonora.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved data/sonora.json successfully.');
}

module.exports = { parseLrc, cleanTitle, isArtistMatch, fetchLyricsForTrack };

if (require.main === module) {
  main().catch(console.error);
}
