const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanTitle(title) {
  return title
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\[feat\.[^\]]+\]/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*\[with[^\]]+\]/gi, '')
    .replace(/\s*-\s*Single$/i, '')
    .trim();
}

async function searchTrack(artist, title) {
  const q = `${artist} ${cleanTitle(title)}`;
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=5`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.results || json.results.length === 0) return null;
    
    // Find best match
    const titleLower = cleanTitle(title).toLowerCase();
    for (const item of json.results) {
      if (!item.previewUrl) continue;
      const itemTitleLower = cleanTitle(item.trackName || '').toLowerCase();
      if (itemTitleLower === titleLower || itemTitleLower.includes(titleLower) || titleLower.includes(itemTitleLower)) {
        return item;
      }
    }
    return json.results[0].previewUrl ? json.results[0] : null;
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log('Loading database...');
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  const needsAudio = data.songs.filter(
    (s) => !s.audioUrl || !s.audioUrl.includes('audio-ssl.itunes.apple.com')
  );

  console.log(`Found ${needsAudio.length} songs needing pure official audio streams.`);

  let updated = 0;
  for (let i = 0; i < needsAudio.length; i++) {
    const song = needsAudio[i];
    console.log(`[${i + 1}/${needsAudio.length}] Searching pure audio for: "${song.title}" by ${song.artistName}...`);
    await delay(300);

    const match = await searchTrack(song.artistName, song.title);
    if (match && match.previewUrl) {
      song.audioUrl = match.previewUrl;
      song.duration = Math.round((match.trackTimeMillis || song.duration * 1000) / 1000);
      song.sourcePlatform = 'custom';
      song.uploadType = 'url';
      song.isUnavailable = false;
      if (match.artworkUrl100 && (!song.coverImage || song.coverImage.startsWith('data:'))) {
        song.coverImage = match.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg');
      }
      updated++;
      console.log(`  -> SUCCESS: ${match.trackName} (${match.previewUrl.slice(0, 50)}...)`);
    } else {
      console.log(`  -> No direct match, searching artist catalog: "${song.artistName}"...`);
      const artistUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(song.artistName)}&entity=song&limit=10`;
      try {
        const aRes = await fetch(artistUrl);
        const aJson = await aRes.json();
        const fallback = aJson.results?.find((r) => r.previewUrl);
        if (fallback) {
          song.audioUrl = fallback.previewUrl;
          song.duration = Math.round((fallback.trackTimeMillis || 180000) / 1000);
          song.sourcePlatform = 'custom';
          song.uploadType = 'url';
          song.isUnavailable = false;
          updated++;
          console.log(`  -> Fallback audio connected: ${fallback.trackName}`);
        }
      } catch {}
    }
  }

  console.log(`Updated ${updated} of ${needsAudio.length} tracks.`);
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved updated database.');
}

main().catch(console.error);
