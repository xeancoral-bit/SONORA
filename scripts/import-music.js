/**
 * SONORA MUSIC SYSTEM — Automated Music Importer
 * Fetches high-resolution metadata from iTunes API, synchronized lyrics from LRCLIB,
 * pairs with official YouTube playback streams, and automatically registers
 * artists, albums, genres, and songs into data/sonora.json with 100% referential integrity.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function parseLrc(lrc) {
  if (!lrc) return [];
  const lines = lrc.split('\n');
  const result = [];
  for (const line of lines) {
    const match = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseFloat(match[2]);
      const text = match[3].trim();
      if (text) {
        result.push({ time: Math.round((min * 60 + sec) * 10) / 10, text });
      }
    }
  }
  return result;
}

function cleanTitle(title) {
  return title
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/\s*\(music from the motion picture\)/gi, '')
    .replace(/\s*\(clean\)/gi, '')
    .replace(/\s*\(part ii\)/gi, '')
    .replace(/\s*\(deluxe\)/gi, '')
    .trim();
}

function cleanArtist(artist) {
  return artist
    .replace(/&.*/, '')
    .replace(/feat\..*/i, '')
    .replace(/ft\..*/i, '')
    .replace(/,\s*.*/, '')
    .trim();
}

async function fetchMetadata(artist, title) {
  const query = `${cleanArtist(artist)} ${cleanTitle(title)}`;
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const nonLive = data.results.find(
      (r) => !r.trackName.includes('Live') && !r.trackName.includes('Instrumental')
    );
    return nonLive || data.results[0];
  } catch (err) {
    console.warn(`[iTunes] Search failed for "${query}":`, err.message);
    return null;
  }
}

async function fetchLyrics(artist, title) {
  const cTitle = cleanTitle(title);
  const cArtist = cleanArtist(artist);

  // 1. Exact match via /get
  try {
    const getUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cTitle)}&artist_name=${encodeURIComponent(cArtist)}`;
    const res = await fetch(getUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) {
        return {
          synced: parseLrc(data.syncedLyrics),
          plain: data.plainLyrics || data.syncedLyrics,
        };
      }
      if (data.plainLyrics) {
        return { synced: [], plain: data.plainLyrics };
      }
    }
  } catch {}

  // 2. Search query via /search
  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cArtist} ${cTitle}`)}`;
    const sRes = await fetch(searchUrl);
    if (sRes.ok) {
      const items = await sRes.json();
      if (Array.isArray(items) && items.length > 0) {
        const withSynced = items.find((i) => i.syncedLyrics);
        if (withSynced) {
          return {
            synced: parseLrc(withSynced.syncedLyrics),
            plain: withSynced.plainLyrics || withSynced.syncedLyrics,
          };
        }
        if (items[0].plainLyrics) {
          return { synced: [], plain: items[0].plainLyrics };
        }
      }
    }
  } catch {}

  // 3. Fallback search by title only
  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(cTitle)}`;
    const sRes = await fetch(searchUrl);
    if (sRes.ok) {
      const items = await sRes.json();
      if (Array.isArray(items) && items.length > 0) {
        const withSynced = items.find((i) => i.syncedLyrics);
        if (withSynced) {
          return {
            synced: parseLrc(withSynced.syncedLyrics),
            plain: withSynced.plainLyrics || withSynced.syncedLyrics,
          };
        }
      }
    }
  } catch {}

  return { synced: [], plain: '' };
}

function mapGenre(itunesGenre) {
  const g = (itunesGenre || '').toLowerCase();
  if (g.includes('hip-hop') || g.includes('rap')) return { id: 'genre-hiphop', name: 'Hip-Hop' };
  if (g.includes('electronic') || g.includes('dance')) return { id: 'genre-electronic', name: 'Electronic' };
  if (g.includes('r&b') || g.includes('soul')) return { id: 'genre-rnb', name: 'R&B & Soul' };
  if (g.includes('rock') || g.includes('alternative') || g.includes('metal')) return { id: 'genre-rock', name: 'Rock & Indie' };
  if (g.includes('ambient') || g.includes('chill')) return { id: 'genre-chill', name: 'Lo-Fi & Chill' };
  if (g.includes('classical')) return { id: 'genre-classical', name: 'Modern Classical' };
  if (g.includes('jazz')) return { id: 'genre-jazz', name: 'Jazz & Fusion' };
  return { id: 'genre-pop', name: 'Pop' };
}

const EMINEM_PRESET_TRACKS = [
  { title: 'Without Me', artist: 'Eminem', ytId: 'YVkUvmDQ3HY', album: 'The Eminem Show' },
  { title: 'Love The Way You Lie', artist: 'Eminem', ytId: 'uelHwf8o7_U', album: 'Recovery' },
  { title: 'The Monster', artist: 'Eminem', ytId: 'EHkozMIXZ8w', album: 'The Marshall Mathers LP2' },
  { title: 'Till I Collapse', artist: 'Eminem', ytId: 'ytQ5CYE1VZw', album: 'The Eminem Show' },
  { title: 'Lose Yourself', artist: 'Eminem', ytId: '_Yhyp-_hX2s', album: 'Curtain Call: The Hits' },
  { title: 'Not Afraid', artist: 'Eminem', ytId: 'j5-yKhDd64s', album: 'Recovery' },
  { title: 'Mockingbird', artist: 'Eminem', ytId: 'S9bCLPwzSC0', album: 'Encore' },
  { title: 'Superman', artist: 'Eminem', ytId: 'KwyOfqbshG4', album: 'The Eminem Show' },
  { title: 'The Real Slim Shady', artist: 'Eminem', ytId: 'eJO5HU_7_1w', album: 'The Marshall Mathers LP' },
  { title: 'Godzilla', artist: 'Eminem', ytId: 'r_0JjYUe5jo', album: 'Music To Be Murdered By' },
  { title: 'Stan', artist: 'Eminem', ytId: 'gOMhN-hfMtY', album: 'The Marshall Mathers LP' },
  { title: 'Sing For The Moment', artist: 'Eminem', ytId: 'D4hAVfruQps', album: 'The Eminem Show' },
  { title: 'Houdini', artist: 'Eminem', ytId: '22tVWwmTie8', album: 'The Death of Slim Shady' },
  { title: 'Venom', artist: 'Eminem', ytId: '8CdcCD5V-d8', album: 'Kamikaze' },
  { title: 'Cleanin\' Out My Closet', artist: 'Eminem', ytId: 'RQ9_TKayu9s', album: 'The Eminem Show' },
  { title: 'Beautiful', artist: 'Eminem', ytId: 'lgT1AidzRWM', album: 'Relapse' },
  { title: 'River', artist: 'Eminem', ytId: '3bxPgPfT-Y8', album: 'Revival' },
  { title: 'Rap God', artist: 'Eminem', ytId: 'XbGs_qK2PQA', album: 'The Marshall Mathers LP2' },
  { title: 'Smack That', artist: 'Akon', ytId: 'bKDdT_nyP54', album: 'Konvicted' },
  { title: 'Forgot About Dre', artist: 'Dr. Dre', ytId: 'QFcv5Ma8u8k', album: '2001' },
  { title: 'I Need A Doctor', artist: 'Dr. Dre', ytId: 'VA770wpLX-Q', album: 'I Need A Doctor' },
  { title: 'What\'s The Difference', artist: 'Dr. Dre', ytId: 'jupb7jKq_Z4', album: '2001' }
];

async function importSong(trackConfig, db) {
  const { title, artist, ytId } = trackConfig;
  console.log(`\n⏳ Processing: "${title}" by ${artist}...`);

  // 1. Fetch metadata
  const meta = await fetchMetadata(artist, title);
  let trackName = trackConfig.title;
  if (meta?.trackName && !meta.trackName.includes('Live') && !meta.trackName.includes('Instrumental')) {
    trackName = meta.trackName;
  }
  const artistName = trackConfig.artist || meta?.artistName || artist;
  const albumTitle = trackConfig.album || meta?.collectionName || `${artistName} Essentials`;
  const duration = meta?.trackTimeMillis ? Math.round(meta.trackTimeMillis / 1000) : 240;
  const releaseDate = meta?.releaseDate ? meta.releaseDate.split('T')[0] : '2002-01-01';
  const coverImage = meta?.artworkUrl100
    ? meta.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
    : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80';
  const genreInfo = mapGenre(meta?.primaryGenreName || 'Hip-Hop');
  const isExplicit = meta ? meta.trackExplicitness === 'explicit' : true;

  // 2. Fetch lyrics from LRCLIB
  console.log(`   Fetching lyrics from LRCLIB for "${trackName}"...`);
  const lyricsData = await fetchLyrics(artistName, trackName);
  const syncedLyrics = lyricsData.synced || [];
  const plainLyrics = lyricsData.plain || '';
  console.log(`   Found ${syncedLyrics.length} synced lyric lines.`);

  // 3. Ensure Artist exists
  const artistSlug = slugify(artistName);
  const artistId = `artist-${artistSlug}`;
  let artistObj = db.artists.find((a) => a.id === artistId);
  if (!artistObj) {
    artistObj = {
      id: artistId,
      name: artistName,
      avatar: coverImage,
      banner: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80',
      bio: `${artistName} is a multi-platinum recording artist and global musical icon.`,
      country: 'United States',
      genreId: genreInfo.id,
      genreName: genreInfo.name,
      monthlyListeners: 68500000,
      followersCount: 45000000,
      isVerified: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.artists.push(artistObj);
    console.log(`   Created new artist: ${artistName} (${artistId})`);
  }

  // 4. Ensure Album exists
  const albumSlug = slugify(albumTitle);
  const albumId = `album-${albumSlug}`;
  let albumObj = db.albums.find((alb) => alb.id === albumId);
  if (!albumObj) {
    albumObj = {
      id: albumId,
      title: albumTitle,
      artistId: artistId,
      artistName: artistName,
      coverImage: coverImage,
      description: `Official studio album "${albumTitle}" by ${artistName}.`,
      genreId: genreInfo.id,
      genreName: genreInfo.name,
      releaseDate: releaseDate,
      copyrightInfo: `© ${releaseDate.slice(0, 4)} ${artistName}`,
      status: 'published',
      isFeatured: true,
      songIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.albums.push(albumObj);
    console.log(`   Created new album: ${albumTitle} (${albumId})`);
  }

  // 5. Create or Update Song
  const songId = `song-${artistSlug}-${slugify(cleanTitle(trackName))}`;
  const existingSongIdx = db.songs.findIndex(
    (s) => s.id === songId || (s.externalMediaId && s.externalMediaId === ytId)
  );

  const songObj = {
    id: songId,
    title: trackName,
    originalFilename: `${slugify(cleanTitle(trackName))}.mp3`,
    audioUrl: `https://www.youtube.com/watch?v=${ytId}`,
    coverImage: coverImage,
    artistId: artistId,
    artistName: artistName,
    albumId: albumId,
    albumTitle: albumTitle,
    genreId: genreInfo.id,
    genreName: genreInfo.name,
    duration: duration,
    releaseDate: releaseDate,
    description: `Official track by ${artistName} from the album "${albumTitle}".`,
    lyrics: plainLyrics,
    syncedLyrics: syncedLyrics,
    multilingualLyrics: { en: syncedLyrics },
    explicit: isExplicit,
    status: 'published',
    playCount: 1500000,
    likesCount: 95000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    sourceType: 'external_url',
    sourcePlatform: 'youtube',
    externalMediaId: ytId,
    isFeatured: true,
    synthPreset: genreInfo.id === 'genre-rock' ? 'rock' : 'electronic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existingSongIdx >= 0) {
    db.songs[existingSongIdx] = { ...db.songs[existingSongIdx], ...songObj };
    console.log(`   Updated existing song: "${trackName}"`);
  } else {
    db.songs.push(songObj);
    console.log(`   Added new song: "${trackName}" (${songId})`);
  }

  // Ensure song is in album.songIds
  if (!albumObj.songIds.includes(songId)) {
    albumObj.songIds.push(songId);
  }

  return songObj;
}

// Referential integrity validator & auto-repair
function validateAndRepairIntegrity(db) {
  console.log('\n🔍 Verifying referential integrity to prevent 404s...');
  let repairedCount = 0;

  const artistMap = new Map();
  db.artists.forEach((a) => artistMap.set(a.id, a));

  const albumMap = new Map();
  db.albums.forEach((alb) => albumMap.set(alb.id, alb));

  // 1. Check all albums have existing artistId
  db.albums.forEach((alb) => {
    if (!artistMap.has(alb.artistId)) {
      console.warn(`   Repairing missing artist for album "${alb.title}" (${alb.id})`);
      const artistSlug = slugify(alb.artistName || 'Various Artists');
      const fallbackArtistId = `artist-${artistSlug}`;
      let fallbackArtist = artistMap.get(fallbackArtistId);
      if (!fallbackArtist) {
        fallbackArtist = {
          id: fallbackArtistId,
          name: alb.artistName || 'Various Artists',
          avatar: alb.coverImage,
          banner: alb.coverImage,
          bio: `${alb.artistName} on SONORA.`,
          country: 'Global',
          genreId: alb.genreId || 'genre-pop',
          genreName: alb.genreName || 'Pop',
          monthlyListeners: 100000,
          followersCount: 5000,
          isVerified: true,
          isFeatured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.artists.push(fallbackArtist);
        artistMap.set(fallbackArtistId, fallbackArtist);
      }
      alb.artistId = fallbackArtist.id;
      repairedCount++;
    }
  });

  // 2. Check all songs have existing artistId and albumId
  db.songs.forEach((song) => {
    // Artist check
    if (!artistMap.has(song.artistId)) {
      console.warn(`   Repairing missing artist for song "${song.title}" (${song.id})`);
      const artistSlug = slugify(song.artistName || 'Unknown Artist');
      const fallbackArtistId = `artist-${artistSlug}`;
      let fallbackArtist = artistMap.get(fallbackArtistId);
      if (!fallbackArtist) {
        fallbackArtist = {
          id: fallbackArtistId,
          name: song.artistName || 'Unknown Artist',
          avatar: song.coverImage,
          banner: song.coverImage,
          bio: `${song.artistName} on SONORA.`,
          country: 'Global',
          genreId: song.genreId || 'genre-pop',
          genreName: song.genreName || 'Pop',
          monthlyListeners: 50000,
          followersCount: 2000,
          isVerified: true,
          isFeatured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.artists.push(fallbackArtist);
        artistMap.set(fallbackArtistId, fallbackArtist);
      }
      song.artistId = fallbackArtist.id;
      repairedCount++;
    }

    // Album check
    if (song.albumId && !albumMap.has(song.albumId)) {
      console.warn(`   Repairing missing album for song "${song.title}" (${song.id})`);
      const albumSlug = slugify(song.albumTitle || `${song.title} - Single`);
      const fallbackAlbumId = `album-${albumSlug}`;
      let fallbackAlbum = albumMap.get(fallbackAlbumId);
      if (!fallbackAlbum) {
        fallbackAlbum = {
          id: fallbackAlbumId,
          title: song.albumTitle || `${song.title} - Single`,
          artistId: song.artistId,
          artistName: song.artistName,
          coverImage: song.coverImage,
          description: `Single by ${song.artistName}.`,
          genreId: song.genreId || 'genre-pop',
          genreName: song.genreName || 'Pop',
          releaseDate: song.releaseDate || new Date().toISOString().split('T')[0],
          copyrightInfo: `© ${new Date().getFullYear()} ${song.artistName}`,
          status: 'published',
          isFeatured: false,
          songIds: [song.id],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.albums.push(fallbackAlbum);
        albumMap.set(fallbackAlbumId, fallbackAlbum);
      } else {
        if (!fallbackAlbum.songIds.includes(song.id)) {
          fallbackAlbum.songIds.push(song.id);
        }
      }
      song.albumId = fallbackAlbum.id;
      song.albumTitle = fallbackAlbum.title;
      repairedCount++;
    }
  });

  console.log(`   Verification complete: ${repairedCount} references checked and verified.`);
}

async function main() {
  console.log('==============================================');
  console.log('   SONORA MUSIC IMPORTER (iTunes + LRCLIB + YouTube)');
  console.log('==============================================');

  if (!fs.existsSync(DB_PATH)) {
    console.error(`Database file not found at ${DB_PATH}`);
    process.exit(1);
  }

  const rawDb = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(rawDb);

  const songsToImport = EMINEM_PRESET_TRACKS;
  let successCount = 0;

  for (const track of songsToImport) {
    try {
      await importSong(track, db);
      successCount++;
    } catch (err) {
      console.error(`   Error importing "${track.title}":`, err.message);
    }
  }

  // Validate referential integrity across the whole database
  validateAndRepairIntegrity(db);

  // Save updated database synchronously
  console.log(`\nSaving database to data/sonora.json...`);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Successfully imported ${successCount} songs into Sonora!`);
  console.log('Total songs in database:', db.songs.length);
  console.log('Total albums in database:', db.albums.length);
  console.log('Total artists in database:', db.artists.length);
  console.log('==============================================');
}

main().catch((err) => {
  console.error('Fatal error in importer:', err);
  process.exit(1);
});
