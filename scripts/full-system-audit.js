const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const d = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

console.log('=== FULL SYSTEM AUDIT ===');
console.log(`Songs: ${d.songs.length}, Albums: ${d.albums.length}, Artists: ${d.artists.length}`);

// 1. Check Songs without valid audioUrl
const noAudio = d.songs.filter(s => !s.audioUrl || s.audioUrl.trim() === '');
console.log(`Songs without audioUrl: ${noAudio.length}`);

// Indexing for instant O(1) lookups
const albumMap = new Map(d.albums.map(a => [a.id, a]));
const artistMap = new Map(d.artists.map(a => [a.id, a]));
const songsByAlbum = new Map();
for (const s of d.songs) {
  if (!songsByAlbum.has(s.albumId)) songsByAlbum.set(s.albumId, []);
  songsByAlbum.get(s.albumId).push(s);
}

// 2. Check Songs where album.artistId != song.artistId
let albumArtistMismatch = 0;
const mismatchSamples = [];
for (const s of d.songs) {
  const alb = albumMap.get(s.albumId);
  if (alb && alb.artistId && s.artistId && alb.artistId !== s.artistId) {
    albumArtistMismatch++;
    if (mismatchSamples.length < 8) {
      mismatchSamples.push({
        songTitle: s.title,
        songArtist: s.artistName,
        albumTitle: alb.title,
        albumArtist: alb.artistName
      });
    }
  }
}
console.log(`Songs assigned to an album belonging to a DIFFERENT artist: ${albumArtistMismatch}`);
if (mismatchSamples.length > 0) {
  console.log('Sample album-artist mismatches:', mismatchSamples);
}

// 3. Check Albums containing songs from multiple distinct artists
let multiArtistAlbums = 0;
const multiArtistAlbumSamples = [];
for (const alb of d.albums) {
  const albSongs = songsByAlbum.get(alb.id) || [];
  const distinctArtists = new Set(albSongs.map(s => s.artistId || s.artistName));
  if (distinctArtists.size > 1) {
    multiArtistAlbums++;
    if (multiArtistAlbumSamples.length < 6) {
      multiArtistAlbumSamples.push({
        albumId: alb.id,
        albumTitle: alb.title,
        albumArtist: alb.artistName,
        distinctArtists: Array.from(distinctArtists),
        songCount: albSongs.length
      });
    }
  }
}
console.log(`Albums containing songs from MULTIPLE distinct artists: ${multiArtistAlbums}`);
if (multiArtistAlbumSamples.length > 0) {
  console.log('Sample multi-artist albums:', multiArtistAlbumSamples);
}

// 4. Check Duplicate songs per artist
function normTitle(t) {
  return (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

const duplicates = [];
const artistTrackMap = new Map();
for (const s of d.songs) {
  const key = `${s.artistId || s.artistName}:::${normTitle(s.title)}`;
  if (artistTrackMap.has(key)) {
    duplicates.push({ duplicate: s.id, original: artistTrackMap.get(key).id, title: s.title, artist: s.artistName });
  } else {
    artistTrackMap.set(key, s);
  }
}
console.log(`Duplicate songs detected under the same artist: ${duplicates.length}`);
if (duplicates.length > 0) {
  console.log('Sample duplicates:', duplicates.slice(0, 5));
}

// 5. Dangling songIds in albums
let danglingInAlbums = 0;
const songIdSet = new Set(d.songs.map(s => s.id));
for (const alb of d.albums) {
  if (Array.isArray(alb.songIds)) {
    for (const sid of alb.songIds) {
      if (!songIdSet.has(sid)) danglingInAlbums++;
    }
  }
}
console.log(`Dangling song references in albums: ${danglingInAlbums}`);

// 6. Dangling albumIds in artists
let danglingInArtists = 0;
const albumIdSet = new Set(d.albums.map(a => a.id));
for (const art of d.artists) {
  if (Array.isArray(art.albumIds)) {
    for (const aid of art.albumIds) {
      if (!albumIdSet.has(aid)) danglingInArtists++;
    }
  }
}
console.log(`Dangling album references in artists: ${danglingInArtists}`);
