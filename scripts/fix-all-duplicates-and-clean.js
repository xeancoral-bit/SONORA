const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

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

  // 1. Deduplicate Artists
  console.log('Deduplicating artists...');
  const uniqueArtists = [];
  const seenArtistIds = new Map();

  data.artists.forEach((artist) => {
    if (seenArtistIds.has(artist.id)) {
      const existing = seenArtistIds.get(artist.id);
      // Merge albumIds
      const combinedAlbums = Array.from(new Set([...(existing.albumIds || []), ...(artist.albumIds || [])]));
      existing.albumIds = combinedAlbums;
      if (artist.bio && artist.bio.length > (existing.bio || '').length) existing.bio = artist.bio;
      if (artist.avatar && !existing.avatar) existing.avatar = artist.avatar;
    } else {
      seenArtistIds.set(artist.id, artist);
      uniqueArtists.push(artist);
    }
  });
  data.artists = uniqueArtists;
  console.log(`Artists deduplicated: ${data.artists.length} unique artists.`);

  // 2. Deduplicate Albums
  console.log('Deduplicating albums...');
  const uniqueAlbums = [];
  const seenAlbumIds = new Map();

  data.albums.forEach((album) => {
    if (seenAlbumIds.has(album.id)) {
      const existing = seenAlbumIds.get(album.id);
      const combinedSongs = Array.from(new Set([...(existing.songIds || []), ...(album.songIds || [])]));
      existing.songIds = combinedSongs;
    } else {
      seenAlbumIds.set(album.id, album);
      uniqueAlbums.push(album);
    }
  });
  data.albums = uniqueAlbums;
  console.log(`Albums deduplicated: ${data.albums.length} unique albums.`);

  // 3. Deduplicate Songs
  console.log('Deduplicating songs...');
  const uniqueSongs = [];
  const seenSongIds = new Map();
  const seenSongKeys = new Set(); // artist:::title

  for (const song of data.songs) {
    const key = `${(song.artistName || '').toLowerCase()}:::${cleanTitle(song.title).toLowerCase()}`;

    // If exact same song key already exists, skip it
    if (seenSongKeys.has(key)) {
      continue;
    }

    // If ID collision with a DIFFERENT song, give this one a unique ID
    if (seenSongIds.has(song.id)) {
      const newId = `song-${slugify(song.artistName)}-${slugify(song.title)}-${Math.floor(Math.random() * 100000)}`;
      const oldId = song.id;
      song.id = newId;

      // Update album reference
      const album = data.albums.find((a) => a.id === song.albumId);
      if (album) {
        album.songIds = album.songIds.map((sid) => (sid === oldId ? newId : sid));
      }
    }

    seenSongIds.set(song.id, song);
    seenSongKeys.add(key);
    uniqueSongs.push(song);
  }
  data.songs = uniqueSongs;
  console.log(`Songs after removing duplicate instances: ${data.songs.length}`);

  // 4. Check counts per genre and top-up to exactly 999
  console.log('\nChecking song counts per genre...');
  const TOPUP_ARTISTS = {
    'genre-pop': ['Taylor Swift', 'Ariana Grande', 'Bruno Mars', 'Billie Eilish'],
    'genre-electronic': ['Avicii', 'Martin Garrix', 'Zedd', 'Kygo', 'Calvin Harris'],
    'genre-chill': ['Nujabes', 'Jinsang', 'Idealism', 'Kupla', 'Saib'],
    'genre-rnb': ['SZA', 'Frank Ocean', 'Daniel Caesar', 'Alicia Keys'],
    'genre-rock': ['The Beatles', 'Queen', 'Coldplay', 'Radiohead', 'The Strokes'],
    'genre-hiphop': ['Eminem', 'Kendrick Lamar', 'Drake', 'J. Cole'],
    'genre-acoustic': ['Jack Johnson', 'Jason Mraz', 'Ben&Ben', 'Moira Dela Torre', 'Vance Joy'],
    'genre-ambient': ['Brian Eno', 'C418', 'Marconi Union', 'Hammock'],
    'genre-jazz': ['Miles Davis', 'John Coltrane', 'Bill Evans', 'Norah Jones'],
    'genre-classical': ['Ludovico Einaudi', 'Max Richter', 'Yiruma', 'Hans Zimmer'],
    'genre-country': ['Johnny Cash', 'Chris Stapleton', 'Luke Combs', 'Kacey Musgraves']
  };

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

  for (const g of data.genres) {
    let currentGenreSongs = data.songs.filter((s) => s.genreId === g.id);
    let needed = 999 - currentGenreSongs.length;
    if (needed <= 0) continue;

    console.log(`Genre "${g.name}" has ${currentGenreSongs.length} songs. Adding ${needed} official studio tracks...`);
    const artists = TOPUP_ARTISTS[g.id] || ['Taylor Swift'];

    for (const artistName of artists) {
      if (needed <= 0) break;
      await delay(300);

      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=100`;
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
          if (seenSongKeys.has(key)) continue;

          seenSongKeys.add(key);

          let artist = artistMap.get(track.artistName.toLowerCase()) || artistMap.get(artistName.toLowerCase());
          const artworkHighRes = (track.artworkUrl100 || '').replace('100x100bb.jpg', '1000x1000bb.jpg');

          if (!artist) {
            const artistId = `artist-${slugify(track.artistName)}`;
            artist = {
              id: artistId,
              name: track.artistName,
              avatar: artworkHighRes,
              banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
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

          const newSongId = `song-${track.trackId || (Date.now() + Math.floor(Math.random() * 100000))}`;
          const newSong = {
            id: newSongId,
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
            explicit: Boolean(track.trackExplicitness === 'explicit'),
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
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  // 5. Final consolidation: exactly 999 per genre
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
  console.log('\nSUCCESS! Cleaned database written to disk.');
}

main().catch(console.error);

