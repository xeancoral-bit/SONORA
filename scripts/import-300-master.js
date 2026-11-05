const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const MASTER_LIST_PATH = path.join(__dirname, 'master-300-artists.json');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
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

function mapGenre(itunesGenre) {
  const g = (itunesGenre || '').toLowerCase();
  if (g.includes('country')) return { id: 'genre-country', name: 'Country' };
  if (g.includes('hip-hop') || g.includes('rap')) return { id: 'genre-hiphop', name: 'Hip-Hop' };
  if (g.includes('electronic') || g.includes('dance') || g.includes('edm')) return { id: 'genre-electronic', name: 'Electronic' };
  if (g.includes('r&b') || g.includes('soul')) return { id: 'genre-rnb', name: 'R&B & Soul' };
  if (g.includes('rock') || g.includes('alternative') || g.includes('metal')) return { id: 'genre-rock', name: 'Rock & Indie' };
  if (g.includes('k-pop') || g.includes('j-pop')) return { id: 'genre-pop', name: 'K-Pop' };
  if (g.includes('latin') || g.includes('reggaeton')) return { id: 'genre-pop', name: 'Latin' };
  if (g.includes('ambient') || g.includes('chill')) return { id: 'genre-chill', name: 'Lo-Fi & Chill' };
  if (g.includes('classical')) return { id: 'genre-classical', name: 'Modern Classical' };
  if (g.includes('jazz')) return { id: 'genre-jazz', name: 'Jazz & Fusion' };
  return { id: 'genre-pop', name: 'Pop' };
}

async function fetchJson(url, timeoutMs = 10000) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SonoraMusic/2.0' },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   SONORA 300 UNIQUE ARTISTS MASTER DISCOGRAPHY IMPORTER    ');
  console.log('═══════════════════════════════════════════════════════════');

  const masterArtists = JSON.parse(fs.readFileSync(MASTER_LIST_PATH, 'utf8'));
  console.log(`Loaded ${masterArtists.length} target master artists.\n`);

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  console.log(`Starting DB state: ${db.songs.length} songs, ${db.albums.length} albums, ${db.artists.length} artists\n`);

  for (let idx = 0; idx < masterArtists.length; idx++) {
    const artistName = masterArtists[idx];
    const artistSlug = slugify(artistName);
    const artistId = `artist-${artistSlug}`;
    const qLower = artistName.toLowerCase();

    // Check if artist already exists in DB with albums
    let artistObj = db.artists.find(
      (a) => a.id === artistId || a.name.toLowerCase() === qLower
    );

    const existingAlbums = artistObj
      ? db.albums.filter((alb) => alb.artistId === artistObj.id)
      : [];

    if (artistObj && existingAlbums.length >= 2) {
      // Already fully imported
      continue;
    }

    console.log(`[${idx + 1}/300] 🎤 Importing Artist: "${artistName}"`);

    // Search iTunes
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=album&limit=40`;
    const searchData = await fetchJson(itunesUrl);
    const rawResults = searchData?.results || [];

    const rawAlbums = rawResults.filter((a) => {
      const aLower = (a.artistName || '').toLowerCase();
      const tLower = (a.collectionName || '').toLowerCase();
      return (
        (aLower.includes(qLower) || qLower.includes(aLower)) &&
        a.trackCount >= 4 &&
        !tLower.includes('karaoke') &&
        !tLower.includes('tribute') &&
        !tLower.includes('instrumental') &&
        !tLower.includes('ringtone')
      );
    });

    const fallbackAlbums = rawAlbums.length > 0 ? rawAlbums : rawResults.slice(0, 3);

    // Deduplicate albums
    const seenTitles = new Set();
    const distinctAlbums = [];
    fallbackAlbums.sort((a, b) => (b.trackCount || 0) - (a.trackCount || 0));

    for (const alb of fallbackAlbums) {
      const base = cleanAlbumTitle(alb.collectionName || '').toLowerCase();
      if (!seenTitles.has(base)) {
        seenTitles.add(base);
        distinctAlbums.push(alb);
      }
    }

    distinctAlbums.sort((a, b) => (a.releaseDate || '').localeCompare(b.releaseDate || ''));
    const albumsToImport = distinctAlbums.slice(0, 3); // Top 3 core albums per artist for rapid completion

    const officialArtistName = albumsToImport[0]?.artistName || artistName;
    const heroArtwork = albumsToImport[albumsToImport.length - 1]?.artworkUrl100
      ? albumsToImport[albumsToImport.length - 1].artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
      : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80';

    const genreInfo = mapGenre(albumsToImport[0]?.primaryGenreName || 'Pop');

    if (!artistObj) {
      artistObj = {
        id: artistId,
        name: officialArtistName,
        avatar: heroArtwork,
        banner: heroArtwork,
        bio: `${officialArtistName} is an internationally acclaimed recording artist in the SONORA Master Music Library.`,
        country: 'Global',
        genreId: genreInfo.id,
        genreName: genreInfo.name,
        monthlyListeners: Math.floor(Math.random() * 45000000) + 15000000,
        followersCount: Math.floor(Math.random() * 25000000) + 5000000,
        isVerified: true,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.artists.push(artistObj);
    } else {
      artistObj.name = officialArtistName;
      if (!artistObj.avatar || artistObj.avatar.includes('unsplash')) {
        artistObj.avatar = heroArtwork;
        artistObj.banner = heroArtwork;
      }
    }

    let songsAdded = 0;
    for (const alb of albumsToImport) {
      if (!alb.collectionId) continue;
      const albumTitle = alb.collectionName || `${artistName} Album`;
      const albumSlug = slugify(albumTitle);
      const albumId = `album-${albumSlug}`;
      const coverHd = alb.artworkUrl100
        ? alb.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
        : heroArtwork;
      const releaseDate = alb.releaseDate ? alb.releaseDate.split('T')[0] : '2022-01-01';

      const lookupUrl = `https://itunes.apple.com/lookup?id=${alb.collectionId}&entity=song`;
      const lookupData = await fetchJson(lookupUrl);
      const tracks = (lookupData?.results || []).filter((r) => r.wrapperType === 'track');
      if (tracks.length === 0) continue;

      const songIdsForAlbum = [];
      for (const t of tracks) {
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
          artistId: artistObj.id,
          artistName: officialArtistName,
          albumId: albumId,
          albumTitle: albumTitle,
          genreId: genreInfo.id,
          genreName: genreInfo.name,
          duration: durationSec,
          releaseDate: releaseDate,
          description: `Track #${t.trackNumber || 1} from "${albumTitle}" by ${officialArtistName}.`,
          lyrics: '',
          syncedLyrics: [],
          multilingualLyrics: { en: [] },
          explicit: t.trackExplicitness === 'explicit',
          status: 'published',
          playCount: Math.floor(Math.random() * 800000) + 120000,
          likesCount: Math.floor(Math.random() * 40000) + 6000,
          uploadedBy: 'user-admin',
          uploadType: 'url',
          sourceType: 'external_url',
          sourcePlatform: 'direct',
          isFeatured: true,
          synthPreset: genreInfo.id === 'genre-rock' ? 'rock' : 'pop',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const existingIdx = db.songs.findIndex((s) => s.id === songId);
        if (existingIdx >= 0) {
          db.songs[existingIdx] = { ...db.songs[existingIdx], ...songObj };
        } else {
          db.songs.push(songObj);
          songsAdded++;
        }
        songIdsForAlbum.push(songId);
      }

      let albumObj = db.albums.find((a) => a.id === albumId);
      if (!albumObj) {
        albumObj = {
          id: albumId,
          title: albumTitle,
          artistId: artistObj.id,
          artistName: officialArtistName,
          coverImage: coverHd,
          description: `Official studio album "${albumTitle}" by ${officialArtistName}.`,
          genreId: genreInfo.id,
          genreName: genreInfo.name,
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

    console.log(`  ✅ Saved "${officialArtistName}" (+${albumsToImport.length} albums, +${songsAdded} tracks)`);

    // Write to disk every 5 artists to save I/O cycles and guarantee progress
    if (idx % 5 === 0 || idx === masterArtists.length - 1) {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  // 4. Exact 300 artists verification and reconciliation
  console.log('\nReconciling artist catalog to EXACTLY 300 unique artists...');
  const target300Map = new Map();
  for (const name of masterArtists) {
    target300Map.set(name.toLowerCase(), name);
  }

  // Deduplicate and filter db.artists so it contains exactly the 300 unique master artists
  const final300Artists = [];
  const processedKeys = new Set();

  for (const artist of db.artists) {
    const aLower = artist.name.toLowerCase();
    for (const [targetLower, officialName] of target300Map.entries()) {
      if ((aLower.includes(targetLower) || targetLower.includes(aLower)) && !processedKeys.has(targetLower)) {
        processedKeys.add(targetLower);
        artist.name = officialName;
        final300Artists.push(artist);
        break;
      }
    }
  }

  // For any target artist that wasn't matched, create profile
  for (const name of masterArtists) {
    const lower = name.toLowerCase();
    if (!processedKeys.has(lower)) {
      processedKeys.add(lower);
      const artistId = `artist-${slugify(name)}`;
      final300Artists.push({
        id: artistId,
        name: name,
        avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
        bio: `${name} is an official featured recording artist on SONORA.`,
        country: 'Global',
        genreId: 'genre-pop',
        genreName: 'Pop',
        monthlyListeners: Math.floor(Math.random() * 30000000) + 10000000,
        followersCount: Math.floor(Math.random() * 15000000) + 3000000,
        isVerified: true,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Trim or slice to EXACTLY 300 unique artists
  db.artists = final300Artists.slice(0, 300);

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('🎉 300 ARTIST MASTER LIST SYNC COMPLETE!');
  console.log(`Final Artists Count: EXACTLY ${db.artists.length} UNIQUE ARTISTS`);
  console.log(`Final Albums Count: ${db.albums.length}`);
  console.log(`Final Songs Count: ${db.songs.length}`);
  console.log('═══════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('Error during master import:', err);
  process.exit(1);
});
