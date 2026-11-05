const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

async function resolveTrack(artist, title, album) {
  const cleanT = title.replace(/\s*\(feat\.[^)]+\)/gi, '').replace(/\s*\(with[^)]+\)/gi, '').trim();
  const cleanA = artist.replace(/&.*/, '').trim();
  let query = `${cleanA} - ${cleanT} official audio`;
  if (album && (album.toLowerCase().includes('soundtrack') || album.toLowerCase().includes('ost'))) {
    query = `${cleanA} - ${cleanT} ${album} official soundtrack`;
  }

  try {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const jsonMatch = html.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
    if (jsonMatch && jsonMatch[1]) return jsonMatch[1];
    const linkMatch = html.match(/\/watch\?v=([A-Za-z0-9_-]{11})/);
    if (linkMatch && linkMatch[1]) return linkMatch[1];
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log(`Checking ${db.albums.length} albums for lead track pre-resolution...`);
  let resolvedCount = 0;
  let alreadySet = 0;

  for (let i = 0; i < db.albums.length; i++) {
    const alb = db.albums[i];
    if (!alb.songIds || alb.songIds.length === 0) continue;
    const leadSongId = alb.songIds[0];
    const song = db.songs.find((s) => s.id === leadSongId);
    if (!song) continue;

    if (song.externalMediaId) {
      alreadySet++;
      continue;
    }

    const videoId = await resolveTrack(song.artistName, song.title, alb.title);
    if (videoId) {
      song.externalMediaId = videoId;
      song.sourcePlatform = 'youtube';
      song.audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
      song.isUnavailable = false;
      resolvedCount++;
      console.log(`[${i + 1}/${db.albums.length}] ✅ Resolved: "${song.artistName} - ${song.title}" -> ${videoId}`);
    } else {
      console.log(`[${i + 1}/${db.albums.length}] ⚠️ Unavailable: "${song.artistName} - ${song.title}"`);
    }

    // Save every 20 albums
    if (resolvedCount > 0 && resolvedCount % 20 === 0) {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    }

    await new Promise((r) => setTimeout(r, 120));
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`\n🎉 Pre-resolution finished! Already set: ${alreadySet}, Newly resolved: ${resolvedCount}`);
}

main().catch(console.error);

