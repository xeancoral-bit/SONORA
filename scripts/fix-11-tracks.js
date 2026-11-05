const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const targets = [
  { matchSong: (s) => s.title.includes('Ride') && s.artistName.toLowerCase().includes('twenty one pilots'), query: 'twenty one pilots Ride' },
  { matchSong: (s) => s.title.includes('Secrets') && s.artistName.toLowerCase().includes('onerepublic'), query: 'OneRepublic Secrets' },
  { matchSong: (s) => s.title.includes("Hard Day's Night") && s.artistName.toLowerCase().includes('beatles'), query: "The Beatles A Hard Day's Night" },
  { matchSong: (s) => s.title.includes('Oblivion') && s.artistName.toLowerCase().includes('bastille'), query: 'Bastille Oblivion' },
  { matchSong: (s) => s.title.includes('Runaway') && s.artistName.toLowerCase().includes('bon jovi'), query: 'Bon Jovi Runaway' },
  { matchSong: (s) => s.title.includes('Venom') && s.artistName.toLowerCase().includes('eminem'), query: 'Eminem Venom' },
  { matchSong: (s) => s.title.includes('Till I Collapse') && s.artistName.toLowerCase().includes('eminem'), query: 'Eminem Till I Collapse' },
  { matchSong: (s) => s.title.includes('Sing For the Moment') && s.artistName.toLowerCase().includes('eminem'), query: 'Eminem Sing For the Moment' },
  { matchSong: (s) => s.title.includes('Mad As Rabbits') && s.artistName.toLowerCase().includes('panic'), query: 'Panic At the Disco Nine in the Afternoon' },
  { matchSong: (s) => s.title.includes('Everybody Documentary') && s.artistName.toLowerCase().includes('logic'), query: 'Logic 1-800-273-8255' },
  { matchSong: (s) => s.title.includes('Dead Flowers') && s.artistName.toLowerCase().includes('miranda lambert'), query: 'Miranda Lambert Bluebird' }
];

async function main() {
  for (const t of targets) {
    const url = 'https://itunes.apple.com/search?term=' + encodeURIComponent(t.query) + '&entity=song&limit=5';
    try {
      const res = await fetch(url);
      const json = await res.json();
      const track = json.results?.find((r) => r.previewUrl);
      if (track) {
        const song = data.songs.find(t.matchSong);
        if (song) {
          song.audioUrl = track.previewUrl;
          song.duration = Math.round((track.trackTimeMillis || 180000) / 1000);
          song.sourcePlatform = 'custom';
          song.uploadType = 'url';
          song.isUnavailable = false;
          console.log('Fixed:', song.artistName, '-', song.title, '->', track.previewUrl);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('Database updated successfully.');
}

main();
