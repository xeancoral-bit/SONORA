const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

const TOPUP_SOURCES = {
  'genre-chill': ['Idealism', 'Kupla', 'Saib', 'Potsu'],
  'genre-rnb': ['Frank Ocean', 'Giveon', 'Daniel Caesar', 'H.E.R.'],
  'genre-acoustic': ['Sufjan Stevens', 'Ray LaMontagne', 'Jose Gonzalez', 'Iron and Wine', 'City and Colour'],
  'genre-ambient': ['Brian Eno', 'C418', 'Hammock', 'Tycho'],
  'genre-jazz': ['Miles Davis', 'John Coltrane', 'Bill Evans', 'Norah Jones'],
  'genre-classical': ['Ludovico Einaudi', 'Max Richter', 'Yiruma', 'Hans Zimmer'],
  'genre-country': ['Johnny Cash', 'Chris Stapleton', 'Luke Combs', 'Kacey Musgraves']
};

function cleanTitle(title) {
  return (title || '')
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\[feat\.[^\]]+\]/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*\[with[^\]]+\]/gi, '')
    .replace(/\s*-\s*Single$/i, '')
    .trim();
}

function slugify(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('Loading database...');
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  // First, deduplicate songs by ID and by key
  const seenIds = new Set();
  const seenKeys = new Set();
  const dedupedSongs = [];

  for (const s of data.songs) {
    const key = `${(s.artistName || '').toLowerCase()}:::${cleanTitle(s.title).toLowerCase()}`;
    if (!seenIds.has(s.id) && !seenKeys.has(key)) {
      seenIds.add(s.id);
      seenKeys.add(key);
      dedupedSongs.push(s);
    }
  }

  data.songs = dedupedSongs;
  console.log(`Initial deduped songs: ${data.songs.length}`);

  const artistMap = new Map();
  data.artists.forEach((a) => {
    artistMap.set(a.id, a);
    artistMap.set(a.name.toLowerCase(), a);
  });

  const albumMap = new Map();
  data.albums.forEach((alb) => {
    albumMap.set(alb.id, alb);
    albumMap.set(`${alb.artistName.toLowerCase()}:::${alb.title.toLowerCase()}`, alb);
  });

  // Top up any genres below 999
  for (const g of data.genres) {
    let currentList = data.songs.filter((s) => s.genreId === g.id);
    let needed = 999 - currentList.length;
    if (needed <= 0) continue;

    console.log(`Top-up for ${g.name} (${g.id}): needed ${needed}...`);
    const artists = TOPUP_SOURCES[g.id] || ['Taylor Swift'];

    for (const artistName of artists) {
      if (needed <= 0) break;
      await delay(300);

      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=60`;
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) continue;
        const resJson = await res.json();
        const results = resJson.results || [];

        for (const track of results) {
          if (needed <= 0) break;
          if (!track.trackName || !track.previewUrl) continue;
          if (/\b(live|remix|commentary|karaoke|instrumental|unplugged|sped up|slowed)\b/i.test(track.trackName + ' ' + (track.collectionName || ''))) continue;

          const clean = cleanTitle(track.trackName);
          const key = `${track.artistName.toLowerCase()}:::${clean.toLowerCase()}`;
          const songId = `song-${track.trackId}`;

          if (seenIds.has(songId) || seenKeys.has(key)) continue;

          seenIds.add(songId);
          seenKeys.add(key);

          let artist = artistMap.get(track.artistName.toLowerCase()) || artistMap.get(artistName.toLowerCase());
          const artworkHighRes = (track.artworkUrl100 || '').replace('100x100bb.jpg', '1000x1000bb.jpg');

          if (!artist) {
            const artistId = `artist-${slugify(track.artistName)}`;
            artist = {
              id: artistId,
              name: track.artistName,
              avatar: artworkHighRes,
              banner: artworkHighRes,
              bio: `${track.artistName} is an official recording artist on SONORA.`,
              country: 'International',
              genreId: g.id,
              genreName: g.name,
              monthlyListeners: 5000000,
              followersCount: 2000000,
              isVerified: true,
              isFeatured: true,
              albumIds: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            data.artists.push(artist);
            artistMap.set(artist.id, artist);
            artistMap.set(artist.name.toLowerCase(), artist);
          }

          const albumTitle = track.collectionName || `${clean} - Single`;
          const albumKey = `${artist.name.toLowerCase()}:::${albumTitle.toLowerCase()}`;
          let album = albumMap.get(albumKey);

          if (!album) {
            const albumId = `album-${slugify(artist.name)}-${slugify(albumTitle)}`.slice(0, 60);
            album = {
              id: albumId,
              title: albumTitle,
              artistId: artist.id,
              artistName: artist.name,
              coverImage: artworkHighRes,
              description: `Official studio album "${albumTitle}" by ${artist.name}.`,
              genreId: g.id,
              genreName: g.name,
              releaseDate: track.releaseDate ? track.releaseDate.split('T')[0] : '2024-01-01',
              copyrightInfo: `℗ ${artist.name}`,
              status: 'published',
              isFeatured: true,
              songIds: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            data.albums.push(album);
            albumMap.set(album.id, album);
            albumMap.set(albumKey, album);

            if (!artist.albumIds.includes(album.id)) {
              artist.albumIds.push(album.id);
            }
          }

          const newSong = {
            id: songId,
            title: clean,
            originalFilename: `${slugify(clean)}.mp3`,
            audioUrl: track.previewUrl,
            coverImage: artworkHighRes,
            artistId: artist.id,
            artistName: artist.name,
            albumId: album.id,
            albumTitle: album.title,
            genreId: g.id,
            genreName: g.name,
            duration: Math.round((track.trackTimeMillis || 180000) / 1000),
            releaseDate: track.releaseDate ? track.releaseDate.split('T')[0] : album.releaseDate,
            lyrics: [],
            multilingualLyrics: { en: [] },
            explicit: false,
            status: 'published',
            isUnavailable: false,
            playCount: 35000,
            likesCount: 1800,
            uploadedBy: 'system',
            uploadType: 'url',
            copyrightOwner: artist.name,
            source: 'Official Label Studio Master',
            tags: [g.name.toLowerCase(), artist.name, clean],
            isFeatured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          data.songs.push(newSong);
          if (!album.songIds.includes(newSong.id)) {
            album.songIds.push(newSong.id);
          }

          needed--;
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  }

  // Exactly 999 per genre
  const finalSongs = [];
  for (const g of data.genres) {
    const list = data.songs.filter((s) => s.genreId === g.id);
    const capped = list.slice(0, 999);
    console.log(`Final count for ${g.name}: ${capped.length}`);
    finalSongs.push(...capped);
  }
  data.songs = finalSongs;

  // Reconcile album songIds
  const validSongIds = new Set(data.songs.map((s) => s.id));
  data.albums.forEach((alb) => {
    alb.songIds = (alb.songIds || []).filter((id) => validSongIds.has(id));
  });
  data.albums = data.albums.filter((alb) => alb.songIds.length > 0);

  const validAlbumIds = new Set(data.albums.map((a) => a.id));
  data.artists.forEach((art) => {
    art.albumIds = (art.albumIds || []).filter((id) => validAlbumIds.has(id));
  });

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('SUCCESS! Pure unique library saved to disk.');
}

main().catch(console.error);

