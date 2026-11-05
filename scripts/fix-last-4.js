const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

async function main() {
  const songsToFix = data.songs.filter(
    (s) => !s.audioUrl || !s.audioUrl.includes('audio-ssl.itunes.apple.com')
  );

  for (const song of songsToFix) {
    const q = `${song.artistName} ${song.title.replace(/\([^)]*\)/g, '').trim()}`;
    const url = 'https://itunes.apple.com/search?term=' + encodeURIComponent(q) + '&entity=song&limit=5';
    try {
      const res = await fetch(url);
      const json = await res.json();
      const track = json.results?.find((r) => r.previewUrl);
      if (track) {
        song.audioUrl = track.previewUrl;
        song.duration = Math.round((track.trackTimeMillis || 180000) / 1000);
        song.sourcePlatform = 'custom';
        song.uploadType = 'url';
        song.isUnavailable = false;
        console.log('Fixed:', song.artistName, '-', song.title, '->', track.previewUrl);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

main();
