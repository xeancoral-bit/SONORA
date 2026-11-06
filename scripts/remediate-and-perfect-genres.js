const fs = require('fs');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Starting Genre Accuracy Remediation...');
  const data = JSON.parse(fs.readFileSync('data/sonora.json', 'utf8'));

  // 1. Remove mock artists & mock songs
  const mockNames = ['Celeste Nova', 'Kai Sterling', 'Aurora Wave', 'Maya Lin', 'Luna & The Sol', 'Elias Vance', 'Kaelen Voss'];
  console.log('Removing mock artists and songs...');
  const initialSongCount = data.songs.length;
  data.songs = data.songs.filter(s => !mockNames.includes(s.artistName));
  data.artists = data.artists.filter(a => !mockNames.includes(a.name));
  data.albums = data.albums.filter(a => !mockNames.includes(a.artistName));
  console.log(`Removed ${initialSongCount - data.songs.length} mock songs.`);

  // 2. Fix 17 songs with undefined albumId
  console.log('Fixing songs with missing albumId...');
  const albumFixes = {
    'song-1788896867234': { albumTitle: 'Ashlyn', albumId: 'album-ashe-ashlyn', cover: 'https://e-cdns-images.dzcdn.net/images/cover/b4bb92b513da4ddc61a5b481c5d9a924/1000x1000-000000-80-0-0.jpg' },
    'song-1788892162979': { albumTitle: 'The Safe Haven', albumId: 'album-ruthb-safehaven', cover: 'https://e-cdns-images.dzcdn.net/images/cover/5f50efd0fa247e62ca619ff85cb084ea/1000x1000-000000-80-0-0.jpg' },
    'song-1788891985145': { albumTitle: 'I Am... Sasha Fierce', albumId: 'album-beyonce-sashafierce', cover: 'https://e-cdns-images.dzcdn.net/images/cover/1b73c2a1e672727144bb2adfc9db7d37/1000x1000-000000-80-0-0.jpg' },
    'song-1788891136665': { albumTitle: 'Lifetime', albumId: 'album-benben-lifetime', cover: 'https://e-cdns-images.dzcdn.net/images/cover/6c6e3dbdd4ba9435b0bcf9b6b772c676/1000x1000-000000-80-0-0.jpg' },
    'song-1788890965772': { albumTitle: 'Dizzy Up the Girl', albumId: 'album-googoodolls-dizzy', cover: 'https://e-cdns-images.dzcdn.net/images/cover/433f4a56a6552aefbc6c58be85ff75f6/1000x1000-000000-80-0-0.jpg' },
    'song-1788890683979': { albumTitle: 'Be Not Nobody', albumId: 'album-vanessa-benotnobody', cover: 'https://e-cdns-images.dzcdn.net/images/cover/c9324e931fa30a7d97d022fa59f310f8/1000x1000-000000-80-0-0.jpg' },
    'song-1788890431663': { albumTitle: 'Let Go', albumId: 'album-avril-letgo', cover: 'https://e-cdns-images.dzcdn.net/images/cover/22fa500b522ae2d326f5d8a98b4b248a/1000x1000-000000-80-0-0.jpg' },
    'song-1788889272275': { albumTitle: 'Plastic Hearts', albumId: 'album-miley-plastichearts', cover: 'https://e-cdns-images.dzcdn.net/images/cover/c751a0dc025a1b3296c6a461b5f63d04/1000x1000-000000-80-0-0.jpg' },
    'song-1788889000506': { albumTitle: 'Teenage Dream', albumId: 'album-katy-teenagedream', cover: 'https://e-cdns-images.dzcdn.net/images/cover/699042c16137fba305e55276e665baeb/1000x1000-000000-80-0-0.jpg' },
    'song-1788888793595': { albumTitle: 'Teenage Dream', albumId: 'album-katy-teenagedream', cover: 'https://e-cdns-images.dzcdn.net/images/cover/699042c16137fba305e55276e665baeb/1000x1000-000000-80-0-0.jpg' },
    'song-1788888585117': { albumTitle: 'Based On A True Story', albumId: 'album-newwest-basedontruestory', cover: 'https://e-cdns-images.dzcdn.net/images/cover/5f50efd0fa247e62ca619ff85cb084ea/1000x1000-000000-80-0-0.jpg' },
    'song-1788888397607': { albumTitle: 'She / Her / I', albumId: 'album-doechii-sheheri', cover: 'https://e-cdns-images.dzcdn.net/images/cover/5f50efd0fa247e62ca619ff85cb084ea/1000x1000-000000-80-0-0.jpg' },
    'song-1788888170738': { albumTitle: 'Overexposed', albumId: 'album-maroon5-overexposed', cover: 'https://e-cdns-images.dzcdn.net/images/cover/033e5c9b26b38c208479a973d09a5626/1000x1000-000000-80-0-0.jpg' },
    'song-1788887740014': { albumTitle: 'Making Mirrors', albumId: 'album-gotye-makingmirrors', cover: 'https://e-cdns-images.dzcdn.net/images/cover/f3e8281d2f7ca8066f2843efc432320a/1000x1000-000000-80-0-0.jpg' },
    'song-1788887469206': { albumTitle: 'GUTS (spilled)', albumId: 'album-olivia-guts', cover: 'https://e-cdns-images.dzcdn.net/images/cover/2c5d1e2311bda316db59ae5eb0c52bb7/1000x1000-000000-80-0-0.jpg' },
    'song-1788887228393': { albumTitle: 'Yours Truly', albumId: 'album-ariana-yourstruly', cover: 'https://e-cdns-images.dzcdn.net/images/cover/89ee1c6fc78f0b7dfc8793b58c704f02/1000x1000-000000-80-0-0.jpg' }
  };

  for (const [songId, fix] of Object.entries(albumFixes)) {
    const s = data.songs.find(x => x.id === songId);
    if (s) {
      s.albumId = fix.albumId;
      s.albumTitle = fix.albumTitle;
      if (!s.coverImage || s.coverImage.includes('unsplash')) {
        s.coverImage = fix.cover;
      }
      let album = data.albums.find(a => a.id === fix.albumId);
      if (!album) {
        album = {
          id: fix.albumId,
          title: fix.albumTitle,
          artistId: s.artistId,
          artistName: s.artistName,
          coverImage: fix.cover,
          releaseDate: s.releaseDate || '2020-01-01',
          genreId: s.genreId,
          tracksCount: 1,
          createdAt: new Date().toISOString()
        };
        data.albums.push(album);
      }
    }
  }

  // 3. Fix Latin collaboration metadata
  console.log('Fixing Latin collaboration song credits...');
  const latinFixes = {
    'song-dz-1696474867': { artistName: 'J Balvin & Ed Sheeran', title: 'Sigue' },
    'song-dz-1026676342': { artistName: 'J Balvin, Dua Lipa, Bad Bunny, Tainy', title: 'UN DIA (ONE DAY)' },
    'song-dz-2375967015': { artistName: 'Travis Scott, Bad Bunny & The Weeknd', title: 'K-POP' },
    'song-dz-3080632561': { artistName: 'Hugel, Topic, Arash ft. Daecolm & Ellie Goulding', title: 'I Adore You' },
    'song-dz-1484103102': { artistName: 'J Balvin & Skrillex', title: 'In Da Getto' }
  };
  for (const [id, fix] of Object.entries(latinFixes)) {
    const s = data.songs.find(x => x.id === id);
    if (s) {
      s.artistName = fix.artistName;
      s.title = fix.title;
    }
  }

  // 4. Move Reneé Rapp from Hip-Hop to Pop
  console.log('Reclassifying Reneé Rapp to Pop...');
  data.songs.filter(s => s.artistName === 'Reneé Rapp').forEach(s => {
    s.genreId = 'genre-pop';
    s.genreName = 'Pop';
  });

  // 5. Move A$AP Rocky to Hip-Hop
  console.log('Reclassifying A$AP Rocky to Hip-Hop...');
  data.songs.filter(s => s.artistName === 'A$AP Rocky').forEach(s => {
    s.genreId = 'genre-hiphop';
    s.genreName = 'Hip-Hop';
  });

  // 6. Move ODESZA from R&B to Electronic
  console.log('Reclassifying ODESZA to Electronic...');
  data.songs.filter(s => s.artistName === 'ODESZA').forEach(s => {
    s.genreId = 'genre-electronic';
    s.genreName = 'Electronic';
  });

  fs.writeFileSync('data/sonora.json', JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync('data/sonora.backup.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('Base remediation completed.');
}

main().catch(console.error);
