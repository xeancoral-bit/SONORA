const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');

const TARGET_ARTISTS = [
  'Taylor Swift',
  'Ariana Grande',
  'Shawn Mendes',
  'Ed Sheeran',
  'Tate McRae',
  'Martin Garrix',
  'Troye Sivan',
  'The Chainsmokers',
  'Bebe Rexha',
  'Selena Gomez',
  'Marshmello',
  '5 Seconds of Summer',
  'Kygo',
  'Coldplay',
  'The Script',
  'OneRepublic',
  'The Vamps',
  'Jonas Blue',
  'Lauv',
  "Why Don't We",
  'Charlie Puth',
  'Alessia Cara',
  'Zedd',
  'Hailee Steinfeld',
  'Alesso',
  'Maroon 5',
  'Katy Perry',
  'Khalid',
  'Justin Bieber',
  'One Direction',
  'Liam Payne',
  'Harry Styles',
  'Zayn',
  'Louis Tomlinson',
  'Niall Horan',
  'Rita Ora',
  'Nicki Minaj',
  'Dove Cameron',
  'Bella Poarch',
  'Rihanna',
  'Sabrina Carpenter',
  'David Kushner',
  'Dua Lipa',
  'Little Mix',
  'Demi Lovato',
  'Sam Smith',
  'Camila Cabello',
  'Clean Bandit',
  'Imagine Dragons',
  'Post Malone',
  'The Weeknd',
  'Miley Cyrus',
  'Bruno Mars',
  'Cheat Codes',
  'Julia Michaels',
  'Justin Timberlake',
  'Sia',
  'Avicii',
  'Sandro Cavazza',
  'Alan Walker',
  'Shakira',
];

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
    .replace(/\s*\(deluxe[^)]*\)/gi, '')
    .replace(/\s*\(bonus[^)]*\)/gi, '')
    .replace(/\s*\(taylor's version\)/gi, '')
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

function cleanAlbumTitle(t) {
  return t
    .replace(/\s*\(deluxe[^)]*\)/gi, '')
    .replace(/\s*\(platinum[^)]*\)/gi, '')
    .replace(/\s*\(bonus[^)]*\)/gi, '')
    .replace(/\s*\(special[^)]*\)/gi, '')
    .replace(/\s*\(expanded[^)]*\)/gi, '')
    .replace(/\s*\(the [^)]*edition\)/gi, '')
    .replace(/\s*\[deluxe[^\]]*\]/gi, '')
    .replace(/\s*\(standard\)/gi, '')
    .trim();
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

async function fetchLyrics(artist, title) {
  const cTitle = cleanTitle(title);
  const cArtist = cleanArtist(artist);

  try {
    const getUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cTitle)}&artist_name=${encodeURIComponent(cArtist)}`;
    const res = await fetch(getUrl, { signal: AbortSignal.timeout(1600) });
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

  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cArtist} ${cTitle}`)}`;
    const sRes = await fetch(searchUrl, { signal: AbortSignal.timeout(1600) });
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

  return { synced: [], plain: '' };
}

async function fetchJson(url, timeoutMs = 8000) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   SONORA FULL DISCOGRAPHY BULK IMPORTER (PAST TO LATEST)   ');
  console.log(`   Total Target Artists: ${TARGET_ARTISTS.length}`);
  console.log('═══════════════════════════════════════════════════════════');

  if (!fs.existsSync(DB_PATH)) {
    console.error('Database file not found at:', DB_PATH);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  console.log(`Initial DB state: ${db.songs.length} songs, ${db.albums.length} albums, ${db.artists.length} artists\n`);

  let grandTotalAlbumsAdded = 0;
  let grandTotalSongsAdded = 0;

  for (let aIdx = 0; aIdx < TARGET_ARTISTS.length; aIdx++) {
    const artistQuery = TARGET_ARTISTS[aIdx];
    console.log(`\n───────────────────────────────────────────────────────────`);
    console.log(`[${aIdx + 1}/${TARGET_ARTISTS.length}] 🎤 Processing Artist: "${artistQuery}"`);
    console.log(`───────────────────────────────────────────────────────────`);

    // 1. Search iTunes for albums by artist
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistQuery)}&entity=album&limit=80`;
    const searchData = await fetchJson(itunesUrl);
    if (!searchData || !searchData.results || searchData.results.length === 0) {
      console.warn(`⚠️ No iTunes results for "${artistQuery}". Skipping.`);
      continue;
    }

    const qLower = artistQuery.toLowerCase();
    const rawAlbums = searchData.results.filter((a) => {
      const aLower = (a.artistName || '').toLowerCase();
      const tLower = (a.collectionName || '').toLowerCase();
      return (
        (aLower.includes(qLower) || qLower.includes(aLower)) &&
        a.trackCount >= 4 &&
        !tLower.includes('karaoke') &&
        !tLower.includes('tribute') &&
        !tLower.includes('instrumental') &&
        !tLower.includes('commentary') &&
        !tLower.includes('ringtone')
      );
    });

    if (rawAlbums.length === 0) {
      console.warn(`⚠️ No valid studio albums found for "${artistQuery}".`);
      continue;
    }

    // Deduplicate studio albums by cleaned title
    const seenBaseTitles = new Set();
    const distinctAlbums = [];

    // Sort by trackCount descending first so we pick deluxe versions
    rawAlbums.sort((a, b) => (b.trackCount || 0) - (a.trackCount || 0));

    for (const alb of rawAlbums) {
      const baseTitle = cleanAlbumTitle(alb.collectionName).toLowerCase();
      if (!seenBaseTitles.has(baseTitle)) {
        seenBaseTitles.add(baseTitle);
        distinctAlbums.push(alb);
      }
    }

    // Sort chronologically from past to latest
    distinctAlbums.sort((a, b) => (a.releaseDate || '').localeCompare(b.releaseDate || ''));

    // Keep up to 8 core studio albums per artist (or 12 for mega artists like Taylor Swift / Coldplay)
    const maxAlbumsForArtist = ['taylor swift', 'coldplay', 'ed sheeran', 'eminem', 'rihanna', 'maroon 5', 'katy perry'].includes(qLower) ? 12 : 7;
    const albumsToImport = distinctAlbums.slice(0, maxAlbumsForArtist);

    const officialArtistName = albumsToImport[0]?.artistName || artistQuery;
    const artistSlug = slugify(officialArtistName);
    const artistId = `artist-${artistSlug}`;
    const artistGenre = mapGenre(albumsToImport[0]?.primaryGenreName || 'Pop');

    const heroArtwork = albumsToImport[albumsToImport.length - 1]?.artworkUrl100
      ? albumsToImport[albumsToImport.length - 1].artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
      : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80';

    // 2. Ensure Artist exists
    let artistObj = db.artists.find((a) => a.id === artistId);
    if (!artistObj) {
      artistObj = {
        id: artistId,
        name: officialArtistName,
        avatar: heroArtwork,
        banner: heroArtwork,
        bio: `${officialArtistName} is a chart-topping global recording artist featured in the SONORA music library.`,
        country: 'Global',
        genreId: artistGenre.id,
        genreName: artistGenre.name,
        monthlyListeners: Math.floor(Math.random() * 40000000) + 25000000,
        followersCount: Math.floor(Math.random() * 20000000) + 10000000,
        isVerified: true,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.artists.push(artistObj);
      console.log(`✨ Added Artist: ${officialArtistName} (${artistId})`);
    }

    let artistSongsAdded = 0;
    let artistAlbumsAdded = 0;

    // 3. For each album, fetch soundtracks
    for (const alb of albumsToImport) {
      const albumTitle = alb.collectionName;
      const albumSlug = slugify(albumTitle);
      const albumId = `album-${albumSlug}`;
      const coverHd = alb.artworkUrl100
        ? alb.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
        : heroArtwork;
      const albumGenre = mapGenre(alb.primaryGenreName);
      const releaseDate = alb.releaseDate ? alb.releaseDate.split('T')[0] : '2020-01-01';

      const lookupUrl = `https://itunes.apple.com/lookup?id=${alb.collectionId}&entity=song`;
      const lookupData = await fetchJson(lookupUrl);
      if (!lookupData || !lookupData.results) continue;

      const tracks = lookupData.results.filter((r) => r.wrapperType === 'track');
      if (tracks.length === 0) continue;

      console.log(`  💿 Album: "${albumTitle}" (${releaseDate.slice(0, 4)}) — ${tracks.length} tracks`);

      const songIdsForAlbum = [];

      // Concurrently fetch lyrics for tracks in small chunks
      const CHUNK_SIZE = 4;
      for (let i = 0; i < tracks.length; i += CHUNK_SIZE) {
        const chunk = tracks.slice(i, i + CHUNK_SIZE);
        const lyricsPromises = chunk.map((t) => fetchLyrics(officialArtistName, t.trackName));
        const lyricsResults = await Promise.all(lyricsPromises);

        for (let j = 0; j < chunk.length; j++) {
          const t = chunk[j];
          const lyricsData = lyricsResults[j] || { synced: [], plain: '' };
          const trackTitle = t.trackName;
          const songSlug = slugify(cleanTitle(trackTitle));
          const songId = `song-${artistSlug}-${songSlug}`;
          const durationSec = t.trackTimeMillis ? Math.round(t.trackTimeMillis / 1000) : 210;

          const songObj = {
            id: songId,
            title: trackTitle,
            originalFilename: `${songSlug}.mp3`,
            audioUrl: t.previewUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${officialArtistName} ${trackTitle}`)}`,
            audioPath: t.previewUrl || undefined,
            coverImage: coverHd,
            artistId: artistId,
            artistName: officialArtistName,
            albumId: albumId,
            albumTitle: albumTitle,
            genreId: albumGenre.id,
            genreName: albumGenre.name,
            duration: durationSec,
            releaseDate: releaseDate,
            description: `Track #${t.trackNumber || 1} from "${albumTitle}" by ${officialArtistName}.`,
            lyrics: lyricsData.plain || '',
            syncedLyrics: lyricsData.synced || [],
            multilingualLyrics: { en: lyricsData.synced || [] },
            explicit: t.trackExplicitness === 'explicit',
            status: 'published',
            playCount: Math.floor(Math.random() * 850000) + 120000,
            likesCount: Math.floor(Math.random() * 45000) + 6000,
            uploadedBy: 'user-admin',
            uploadType: 'url',
            sourceType: 'external_url',
            sourcePlatform: 'direct',
            isFeatured: true,
            synthPreset: albumGenre.id === 'genre-rock' ? 'rock' : 'pop',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const existingIdx = db.songs.findIndex((s) => s.id === songId);
          if (existingIdx >= 0) {
            db.songs[existingIdx] = { ...db.songs[existingIdx], ...songObj };
          } else {
            db.songs.push(songObj);
            artistSongsAdded++;
          }
          songIdsForAlbum.push(songId);
        }
      }

      // Ensure Album exists
      let albumObj = db.albums.find((a) => a.id === albumId);
      if (!albumObj) {
        albumObj = {
          id: albumId,
          title: albumTitle,
          artistId: artistId,
          artistName: officialArtistName,
          coverImage: coverHd,
          description: `Official studio album "${albumTitle}" by ${officialArtistName}.`,
          genreId: albumGenre.id,
          genreName: albumGenre.name,
          releaseDate: releaseDate,
          copyrightInfo: alb.copyright || `© ${releaseDate.slice(0, 4)} ${officialArtistName}`,
          status: 'published',
          isFeatured: true,
          songIds: songIdsForAlbum,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.albums.push(albumObj);
        artistAlbumsAdded++;
      } else {
        albumObj.songIds = Array.from(new Set([...albumObj.songIds, ...songIdsForAlbum]));
      }
    }

    grandTotalAlbumsAdded += artistAlbumsAdded;
    grandTotalSongsAdded += artistSongsAdded;

    // Save database after each artist so progress is permanently stored
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log(`✅ Saved "${officialArtistName}": +${artistAlbumsAdded} albums, +${artistSongsAdded} tracks. (DB Total: ${db.songs.length} songs, ${db.albums.length} albums)`);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🎉 BULK DISCOGRAPHY IMPORT COMPLETE!');
  console.log(`Total New Albums Added: ${grandTotalAlbumsAdded}`);
  console.log(`Total New Songs Added: ${grandTotalSongsAdded}`);
  console.log(`Final DB Total: ${db.songs.length} songs, ${db.albums.length} albums, ${db.artists.length} artists`);
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Bulk import encountered error:', err);
  process.exit(1);
});

