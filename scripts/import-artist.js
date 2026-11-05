/**
 * SONORA MUSIC SYSTEM — Artist Discography Auto-Importer CLI
 * 
 * Usage:
 *   node scripts/import-artist.js "Bruno Mars" [maxAlbums=5]
 *   node scripts/import-artist.js "Taylor Swift" 10
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
    .replace(/\s*\(deluxe[^)]*\)/gi, '')
    .replace(/\s*\(bonus[^)]*\)/gi, '')
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

  return { synced: [], plain: '' };
}

async function main() {
  const artistQuery = process.argv[2] || 'Bruno Mars';
  const maxAlbums = parseInt(process.argv[3] || '4', 10);

  console.log('==============================================');
  console.log(`   SONORA 1-CLICK DISCOGRAPHY IMPORTER`);
  console.log(`   Target Artist: "${artistQuery}"`);
  console.log(`   Max Albums: ${maxAlbums}`);
  console.log('==============================================');

  if (!fs.existsSync(DB_PATH)) {
    console.error(`Database file not found at ${DB_PATH}`);
    process.exit(1);
  }

  const rawDb = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(rawDb);

  // 1. Search albums on iTunes
  console.log(`\n🔍 Searching iTunes for albums by "${artistQuery}"...`);
  const albumSearchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistQuery)}&entity=album&limit=30`;
  const res = await fetch(albumSearchUrl);
  if (!res.ok) {
    console.error('Failed to fetch from iTunes API.');
    process.exit(1);
  }

  const data = await res.json();
  const rawAlbums = data.results || [];
  if (rawAlbums.length === 0) {
    console.error(`No albums found for "${artistQuery}".`);
    process.exit(1);
  }

  // Filter relevant albums
  const seenTitles = new Set();
  const filteredAlbums = [];
  const qLower = artistQuery.toLowerCase();

  for (const alb of rawAlbums) {
    const titleLower = alb.collectionName.toLowerCase();
    const artistLower = alb.artistName.toLowerCase();
    if (
      !titleLower.includes('tribute') &&
      !titleLower.includes('karaoke') &&
      (artistLower.includes(qLower) || qLower.includes(artistLower)) &&
      !seenTitles.has(titleLower)
    ) {
      seenTitles.add(titleLower);
      filteredAlbums.push(alb);
      if (filteredAlbums.length >= maxAlbums) break;
    }
  }

  const albumsToProcess = filteredAlbums.length > 0 ? filteredAlbums : rawAlbums.slice(0, maxAlbums);
  const officialArtistName = albumsToProcess[0]?.artistName || artistQuery;
  const artistSlug = slugify(officialArtistName);
  const artistId = `artist-${artistSlug}`;
  const genreInfo = mapGenre(albumsToProcess[0]?.primaryGenreName || 'Pop');

  const heroArtwork = albumsToProcess[0]?.artworkUrl100
    ? albumsToProcess[0].artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
    : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80';

  // 2. Ensure Artist exists
  let artistObj = db.artists.find((a) => a.id === artistId);
  if (!artistObj) {
    artistObj = {
      id: artistId,
      name: officialArtistName,
      avatar: heroArtwork,
      banner: heroArtwork,
      bio: `${officialArtistName} is a world-renowned recording artist featured on SONORA.`,
      country: 'Global',
      genreId: genreInfo.id,
      genreName: genreInfo.name,
      monthlyListeners: 52000000,
      followersCount: 26000000,
      isVerified: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.artists.push(artistObj);
    console.log(`✨ Created Artist: ${officialArtistName} (${artistId})`);
  }

  let totalSongsAdded = 0;

  // 3. For each album, fetch soundtracks/tracks
  for (const alb of albumsToProcess) {
    const albumTitle = alb.collectionName;
    const albumSlug = slugify(albumTitle);
    const albumId = `album-${albumSlug}`;
    const coverHd = alb.artworkUrl100
      ? alb.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
      : heroArtwork;
    const albumGenre = mapGenre(alb.primaryGenreName);
    const releaseDate = alb.releaseDate ? alb.releaseDate.split('T')[0] : '2020-01-01';

    console.log(`\n💿 Processing Album: "${albumTitle}" (${releaseDate})...`);
    const lookupUrl = `https://itunes.apple.com/lookup?id=${alb.collectionId}&entity=song`;
    const lookupRes = await fetch(lookupUrl);
    if (!lookupRes.ok) continue;

    const lookupData = await lookupRes.json();
    const tracks = (lookupData.results || []).filter((r) => r.wrapperType === 'track');
    console.log(`   Found ${tracks.length} tracks.`);

    const songIdsForAlbum = [];

    for (const t of tracks) {
      const trackTitle = t.trackName;
      const songSlug = slugify(cleanTitle(trackTitle));
      const songId = `song-${artistSlug}-${songSlug}`;
      const durationSec = t.trackTimeMillis ? Math.round(t.trackTimeMillis / 1000) : 210;

      // Fetch lyrics
      process.stdout.write(`   🎵 Track: "${trackTitle}" ... `);
      const lyricsData = await fetchLyrics(officialArtistName, trackTitle);
      const syncedCount = lyricsData.synced ? lyricsData.synced.length : 0;
      process.stdout.write(`${syncedCount} synced lyrics lines\n`);

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
        description: `Track #${t.trackNumber || 1} from the album "${albumTitle}".`,
        lyrics: lyricsData.plain || '',
        syncedLyrics: lyricsData.synced || [],
        multilingualLyrics: { en: lyricsData.synced || [] },
        explicit: t.trackExplicitness === 'explicit',
        status: 'published',
        playCount: Math.floor(Math.random() * 800000) + 150000,
        likesCount: Math.floor(Math.random() * 40000) + 8000,
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
        totalSongsAdded++;
      }
      songIdsForAlbum.push(songId);
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
        description: `Official album "${albumTitle}" by ${officialArtistName}.`,
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
    } else {
      albumObj.songIds = Array.from(new Set([...albumObj.songIds, ...songIdsForAlbum]));
    }
  }

  // Save database
  console.log(`\n💾 Saving database to data/sonora.json...`);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

  console.log('\n==============================================');
  console.log(`✅ SUCCESS: Imported ${albumsToProcess.length} albums and ${totalSongsAdded} songs for ${officialArtistName}!`);
  console.log(`Total songs now in Sonora: ${db.songs.length}`);
  console.log(`Total albums now in Sonora: ${db.albums.length}`);
  console.log('==============================================');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

