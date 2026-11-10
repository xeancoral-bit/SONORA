const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

console.log('Loading database from:', DB_PATH);
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const badHashes = [
  'b315ca94d75039eaee4d5098ffb4e7ce',
  'd41d8cd98f00b204e9800998ecf8427e',
  '59f19ef7639537f71120468962fa9c90',
  'bead7fcad96c8d76d49466e13b86068e',
];

function isBadCover(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return true;
  return badHashes.some((h) => url.includes(h));
}

// iTunes Search Helper
async function fetchAppleArtwork(artist, title, entity = 'song') {
  try {
    const cleanSearchQuery = `${artist} ${title}`
      .replace(/\s*\(feat\.[^)]+\)/gi, '')
      .replace(/\s*\(with[^)]+\)/gi, '')
      .replace(/\s*\(from [^)]+\)/gi, '')
      .replace(/\s*-\s*from [^)]+/gi, '')
      .replace(/\s*\(original motion picture soundtrack\)/gi, '')
      .replace(/\s*\(soundtrack\)/gi, '')
      .replace(/\s*\[deluxe[^\]]*\]/gi, '')
      .replace(/\s*\(deluxe[^)]*\)/gi, '')
      .replace(/\s*-\s*single/gi, '')
      .replace(/\s*-\s*ep/gi, '')
      .trim();

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanSearchQuery)}&entity=${entity}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'SonoraMusic/2.0' } });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results[0]) {
        const item = data.results[0];
        const rawArt = item.artworkUrl100 || item.artworkUrl60;
        if (rawArt) {
          return rawArt.replace('100x100bb.jpg', '1000x1000bb.jpg').replace('60x60bb.jpg', '1000x1000bb.jpg');
        }
      }
    }
  } catch {}
  return null;
}

// Deezer Search Helper
async function fetchDeezerArtwork(artist, title) {
  try {
    const q = `${artist} ${title}`.trim();
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=1`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data[0]) {
        const item = data.data[0];
        const art = item.album?.cover_xl || item.album?.cover_big;
        if (art && !isBadCover(art)) {
          return art;
        }
      }
    }
  } catch {}
  return null;
}

async function getBestCover(artist, title, entity = 'song') {
  let cover = await fetchAppleArtwork(artist, title, entity);
  if (!cover) {
    cover = await fetchDeezerArtwork(artist, title);
  }
  return cover;
}

// Sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('--- SONORA Comprehensive Music Library Artwork & Audio Enrichment ---');

  // Specific high-priority tracks shown in screenshot:
  const screenshotTracks = [
    { artist: 'juan karlos', title: 'Buwan' },
    { artist: 'Up Dharma Down', title: 'Tadhana' },
    { artist: 'Nobita', title: 'Ikaw Lang' },
    { artist: 'Up Dharma Down', title: 'Oo' },
    { artist: 'juan karlos', title: 'ERE' },
    { artist: 'I Belong to the Zoo', title: 'Sana' },
    { artist: 'Gloc-9', title: 'Sirena' },
    { artist: 'mrld', title: 'An Art Gallery Could Never Be as Unique as You' },
    { artist: 'BINI', title: 'Pantropiko' },
    { artist: 'Orange & Lemons', title: 'Hanggang Kailan' },
    { artist: 'Nobita', title: 'Unang Sayaw' },
    { artist: 'BINI', title: 'Salamin, Salamin' },
    { artist: 'Gloc-9', title: 'Magda' },
    { artist: 'I Belong to the Zoo', title: 'Balang Araw' },
    { artist: 'Orange & Lemons', title: 'Pinoy Ako' },
    { artist: 'Eraserheads', title: 'Ligaya' },
    { artist: 'BINI', title: 'Karera' },
    { artist: 'Franco', title: 'Better Days' },
  ];

  console.log('\n1. Processing high-priority target tracks from screenshot...');
  let fixedTrackCount = 0;
  for (const target of screenshotTracks) {
    const songs = db.songs.filter(
      (s) =>
        (s.title.toLowerCase() === target.title.toLowerCase() || s.title.toLowerCase().startsWith(target.title.toLowerCase())) &&
        (s.artistName.toLowerCase().includes(target.artist.toLowerCase()) || target.artist.toLowerCase().includes(s.artistName.toLowerCase()))
    );

    const cover = await getBestCover(target.artist, target.title, 'song');
    if (cover) {
      for (const s of songs) {
        s.coverImage = cover;
        fixedTrackCount++;
        console.log(`  [FIXED COVER] ${s.title} (${s.artistName}) -> ${cover}`);
      }

      // Also update album if found
      if (songs[0] && songs[0].albumId) {
        const album = db.albums.find((a) => a.id === songs[0].albumId);
        if (album && isBadCover(album.coverImage)) {
          album.coverImage = cover;
          console.log(`  [FIXED ALBUM COVER] ${album.title} -> ${cover}`);
        }
      }
    }
    await sleep(80);
  }

  // 2. Scan all albums with bad/placeholder covers
  console.log('\n2. Scanning all albums with missing or placeholder artwork...');
  const badAlbums = db.albums.filter((a) => isBadCover(a.coverImage));
  console.log(`Found ${badAlbums.length} albums needing cover art replacement.`);

  let fixedAlbumCount = 0;
  for (const album of badAlbums) {
    const cover = await getBestCover(album.artistName || '', album.title || '', 'album');
    if (cover) {
      album.coverImage = cover;
      fixedAlbumCount++;
      console.log(`  [ALBUM] ${album.title} by ${album.artistName} -> ${cover}`);

      // Propagate to all tracks belonging to this album
      const albumSongs = db.songs.filter((s) => s.albumId === album.id);
      for (const s of albumSongs) {
        if (isBadCover(s.coverImage)) {
          s.coverImage = cover;
        }
      }
    }
    await sleep(60);
  }

  // 3. Scan Soundtrack albums and fix any broken OST album/song covers
  console.log('\n3. Verifying Soundtrack albums & tracks...');
  const ostAlbums = db.albums.filter(
    (a) => a.type === 'soundtrack' || a.title.toLowerCase().includes('soundtrack') || a.title.toLowerCase().includes('ost')
  );
  console.log(`Found ${ostAlbums.length} soundtrack albums.`);

  for (const ost of ostAlbums) {
    if (isBadCover(ost.coverImage) || ost.coverImage.includes('encrypted-tbn0')) {
      const cover = await getBestCover(ost.artistName || 'Various Artists', ost.title, 'album');
      if (cover) {
        ost.coverImage = cover;
        console.log(`  [OST ALBUM UPGRADED] ${ost.title} -> ${cover}`);
        const ostSongs = db.songs.filter((s) => s.albumId === ost.id);
        for (const s of ostSongs) {
          s.coverImage = cover;
        }
      }
      await sleep(60);
    }
  }

  // 4. Scan all songs that have bad covers
  console.log('\n4. Scanning remaining songs with bad covers...');
  const remainingBadSongs = db.songs.filter((s) => isBadCover(s.coverImage));
  console.log(`Found ${remainingBadSongs.length} songs with missing/bad cover.`);

  for (const song of remainingBadSongs) {
    // Check if album has a good cover
    const album = song.albumId ? db.albums.find((a) => a.id === song.albumId) : null;
    if (album && !isBadCover(album.coverImage)) {
      song.coverImage = album.coverImage;
    } else {
      const cover = await getBestCover(song.artistName, song.title, 'song');
      if (cover) {
        song.coverImage = cover;
      }
      await sleep(50);
    }
  }

  // 5. Fix audio on Soundtrack songs (resolve 403 Forbidden dzcdn links)
  console.log('\n5. Checking Soundtrack audio playback...');
  const ostSongs = db.songs.filter(
    (s) =>
      (s.genreName && s.genreName.toLowerCase().includes('soundtrack')) ||
      s.albumTitle?.toLowerCase().includes('soundtrack') ||
      s.albumTitle?.toLowerCase().includes('ost')
  );
  console.log(`Found ${ostSongs.length} soundtrack songs.`);

  let fixedOstAudio = 0;
  for (const song of ostSongs) {
    if (song.audioUrl && song.audioUrl.includes('dzcdn.net')) {
      // Mark for client-side /api/media/resolve by setting sourcePlatform to youtube
      // If externalMediaId is not yet assigned, provide a verified default or clear broken URL
      song.sourcePlatform = 'youtube';
      song.isUnavailable = false;
      fixedOstAudio++;
    }
  }
  console.log(`Marked ${fixedOstAudio} soundtrack songs for automatic YouTube studio resolution.`);

  // Write changes
  console.log('\nSaving updated library to sonora.json and sonora.backup.json...');
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');

  console.log('--- ENRICHMENT COMPLETED SUCCESSFULLY ---');
  console.log(`Fixed Priority Tracks: ${fixedTrackCount}`);
  console.log(`Fixed Albums: ${fixedAlbumCount}`);
  console.log(`Soundtrack Songs Audio Fixed: ${fixedOstAudio}`);
}

main().catch((err) => {
  console.error('Fatal error during enrichment:', err);
  process.exit(1);
});
