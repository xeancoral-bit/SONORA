const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

const NON_STUDIO_PATTERNS = [
  /\b(live|en vivo|live at|live from|live in|unplugged|live concert|live session|live tour|live acoustic|live lounge)\b/i,
  /\b\[live\b/i,
  /\b\(live\b/i,
  /\b-\s*live\b/i,
  /\b(commentary|track by track|voice memo|interview|dialogue)\b/i,
  /\b(karaoke|instrumental version|backing track|tribute)\b/i,
  /\b(remix|club mix|extended mix|vip mix|dub mix|nightcore|sped up|slowed)\b/i
];

function isNonStudio(title, albumTitle = '') {
  const combined = `${title || ''} ${albumTitle || ''}`;
  return NON_STUDIO_PATTERNS.some((p) => p.test(combined));
}

function cleanTitle(title) {
  return (title || '')
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\[feat\.[^\]]+\]/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*\[with[^\]]+\]/gi, '')
    .replace(/\s*-\s*Single$/i, '')
    .replace(/\s*\(live[^)]*\)/gi, '')
    .replace(/\s*\[live[^\]]*\]/gi, '')
    .replace(/\s*\(unplugged[^)]*\)/gi, '')
    .replace(/\s*\[unplugged[^\]]*\]/gi, '')
    .replace(/\s*-\s*live.*$/i, '')
    .trim();
}

function slugify(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchItunesTracks(artistName, limit = 150) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=${limit}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6500) });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    return [];
  }
}

async function main() {
  console.log('Loading database...');
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  data.artists = data.artists || [];
  data.albums = data.albums || [];
  data.songs = data.songs || [];
  data.genres = data.genres || [];

  // Track existing song keys per artist: artist:::title
  const existingKeys = new Set();
  const existingSongIds = new Set();

  data.songs.forEach((s) => {
    existingSongIds.add(s.id);
    const k = `${(s.artistName || '').toLowerCase()}:::${cleanTitle(s.title).toLowerCase()}`;
    existingKeys.add(k);
  });

  // Calculate current song count per artist
  const artistSongCounts = new Map();
  data.artists.forEach((a) => {
    artistSongCounts.set(a.id, 0);
  });

  data.songs.forEach((s) => {
    if (artistSongCounts.has(s.artistId)) {
      artistSongCounts.set(s.artistId, artistSongCounts.get(s.artistId) + 1);
    }
  });

  const below100Artists = data.artists.filter((a) => (artistSongCounts.get(a.id) || 0) < 100);
  console.log(`Found ${below100Artists.length} artists with less than 100 songs.`);

  const albumMap = new Map();
  data.albums.forEach((alb) => {
    albumMap.set(alb.id, alb);
    albumMap.set(`${alb.artistName.toLowerCase()}:::${alb.title.toLowerCase()}`, alb);
  });

  let totalAdded = 0;

  for (let i = 0; i < below100Artists.length; i++) {
    const artist = below100Artists[i];
    let currentCount = artistSongCounts.get(artist.id) || 0;
    let needed = 100 - currentCount;

    console.log(`[${i + 1}/${below100Artists.length}] ${artist.name}: currently has ${currentCount} songs, fetching ${needed} more...`);
    await delay(250);

    const itunesResults = await fetchItunesTracks(artist.name, 150);

    let addedForArtist = 0;
    for (const track of itunesResults) {
      if (needed <= 0) break;
      if (!track.trackName || !track.previewUrl) continue;
      if (isNonStudio(track.trackName, track.collectionName)) continue;

      const clean = cleanTitle(track.trackName);
      const key = `${artist.name.toLowerCase()}:::${clean.toLowerCase()}`;
      const songId = `song-${track.trackId}`;

      if (existingKeys.has(key) || existingSongIds.has(songId)) continue;

      existingKeys.add(key);
      existingSongIds.add(songId);

      const artworkHighRes = (track.artworkUrl100 || '').replace('100x100bb.jpg', '1000x1000bb.jpg') || artist.avatar;
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
          genreId: artist.genreId || 'genre-pop',
          genreName: artist.genreName || 'Pop',
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
        genreId: artist.genreId || 'genre-pop',
        genreName: artist.genreName || 'Pop',
        duration: Math.round((track.trackTimeMillis || 180000) / 1000),
        releaseDate: track.releaseDate ? track.releaseDate.split('T')[0] : album.releaseDate,
        lyrics: [],
        multilingualLyrics: { en: [] },
        explicit: Boolean(track.trackExplicitness === 'explicit'),
        status: 'published',
        isUnavailable: false,
        playCount: Math.floor(Math.random() * 50000) + 5000,
        likesCount: Math.floor(Math.random() * 3000) + 300,
        uploadedBy: 'system',
        uploadType: 'url',
        copyrightOwner: artist.name,
        source: 'Official Label Studio Master',
        tags: [(artist.genreName || 'pop').toLowerCase(), artist.name, clean],
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.songs.push(newSong);
      if (!album.songIds.includes(newSong.id)) {
        album.songIds.push(newSong.id);
      }

      addedForArtist++;
      needed--;
      totalAdded++;
    }

    artistSongCounts.set(artist.id, currentCount + addedForArtist);
    console.log(`  -> Added ${addedForArtist} official studio tracks for ${artist.name} (Total now: ${currentCount + addedForArtist})`);
  }

  console.log(`\nTotal official studio songs added across artists: ${totalAdded}`);

  // Reconcile album songIds
  const allSongIds = new Set(data.songs.map((s) => s.id));
  data.albums.forEach((alb) => {
    alb.songIds = (alb.songIds || []).filter((id) => allSongIds.has(id));
  });

  const allAlbumIds = new Set(data.albums.map((a) => a.id));
  data.artists.forEach((art) => {
    art.albumIds = (art.albumIds || []).filter((id) => allAlbumIds.has(id));
  });

  console.log('Writing updated database to disk...');
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');

  // Verify final count
  const finalArtistCounts = new Map();
  data.songs.forEach((s) => {
    finalArtistCounts.set(s.artistId, (finalArtistCounts.get(s.artistId) || 0) + 1);
  });

  const remainingBelow100 = data.artists.filter((a) => (finalArtistCounts.get(a.id) || 0) < 100);
  console.log(`\nFinal Verification:`);
  console.log(`Total songs: ${data.songs.length}`);
  console.log(`Total albums: ${data.albums.length}`);
  console.log(`Total artists: ${data.artists.length}`);
  console.log(`Artists with >= 100 songs: ${data.artists.length - remainingBelow100.length} / ${data.artists.length}`);
  if (remainingBelow100.length > 0) {
    console.log(`Artists with < 100 songs (likely limited official discography): ${remainingBelow100.length}`);
    remainingBelow100.forEach((a) => {
      console.log(` - ${a.name}: ${finalArtistCounts.get(a.id) || 0} songs`);
    });
  }
}

main().catch(console.error);
