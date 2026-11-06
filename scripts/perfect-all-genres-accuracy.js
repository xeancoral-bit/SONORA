const fs = require('fs');
const https = require('https');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/sonora.json');
const BACKUP_PATH = path.join(__dirname, '../data/sonora.backup.json');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve(JSON.parse(b)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function sanitizeId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function fetchArtistTracks(artistName, targetCount, genreId, genreName) {
  console.log(`  Searching Deezer for artist: "${artistName}"...`);
  const searchRes = await get(`https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}`);
  const artist = searchRes.data?.[0];
  if (!artist) {
    console.log(`  ❌ Artist "${artistName}" not found on Deezer.`);
    return { artistObj: null, songs: [], albums: [] };
  }

  const artistObj = {
    id: `artist-${sanitizeId(artist.name)}`,
    name: artist.name,
    bio: `Official artist profile for ${artist.name}.`,
    genres: [genreName],
    image: artist.picture_xl || artist.picture_big || artist.picture_medium,
    followersCount: artist.nb_fan || 500000,
    monthlyListeners: (artist.nb_fan || 500000) * 4,
    verified: true,
    socialLinks: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const songs = [];
  const albumsMap = new Map();

  // 1. Fetch top tracks
  const topRes = await get(`https://api.deezer.com/artist/${artist.id}/top?limit=100`);
  if (topRes.data && Array.isArray(topRes.data)) {
    for (const trk of topRes.data) {
      if (!trk.preview || songs.length >= targetCount) continue;
      if (songs.some(s => s.id === `song-dz-${trk.id}`)) continue;

      const albumId = trk.album?.id ? `album-dz-${trk.album.id}` : `album-${sanitizeId(artist.name)}-${sanitizeId(trk.title)}`;
      const albumTitle = trk.album?.title || trk.title;
      const cover = trk.album?.cover_xl || trk.album?.cover_big || artistObj.image;

      if (trk.album?.id && !albumsMap.has(albumId)) {
        albumsMap.set(albumId, {
          id: albumId,
          title: albumTitle,
          artistId: artistObj.id,
          artistName: artistObj.name,
          coverImage: cover,
          description: `Official release "${albumTitle}" by ${artistObj.name}.`,
          genreId: genreId,
          genreName: genreName,
          releaseDate: '2020-01-01',
          copyrightInfo: `℗ ${artistObj.name}`,
          status: 'published',
          isFeatured: false,
          songIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tracksCount: 0
        });
      }

      songs.push({
        id: `song-dz-${trk.id}`,
        title: trk.title,
        artistId: artistObj.id,
        artistName: trk.artist?.name || artistObj.name,
        albumId: albumId,
        albumTitle: albumTitle,
        albumName: albumTitle,
        duration: trk.duration || 180,
        audioUrl: trk.preview,
        coverImage: cover,
        genreId: genreId,
        genreName: genreName,
        releaseDate: '2020-01-01',
        playCount: Math.floor(Math.random() * 250000) + 50000,
        liked: false,
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (albumsMap.has(albumId)) {
        const alb = albumsMap.get(albumId);
        alb.songIds.push(`song-dz-${trk.id}`);
        alb.tracksCount = alb.songIds.length;
      }
    }
  }

  // 2. If more tracks needed, query artist albums
  if (songs.length < targetCount) {
    await delay(150);
    const albumsRes = await get(`https://api.deezer.com/artist/${artist.id}/albums?limit=25`);
    if (albumsRes.data && Array.isArray(albumsRes.data)) {
      for (const albInfo of albumsRes.data) {
        if (songs.length >= targetCount) break;
        await delay(120);
        try {
          const albTracksRes = await get(`https://api.deezer.com/album/${albInfo.id}/tracks?limit=50`);
          if (albTracksRes.data && Array.isArray(albTracksRes.data)) {
            const albumId = `album-dz-${albInfo.id}`;
            const cover = albInfo.cover_xl || albInfo.cover_big || artistObj.image;

            if (!albumsMap.has(albumId)) {
              albumsMap.set(albumId, {
                id: albumId,
                title: albInfo.title,
                artistId: artistObj.id,
                artistName: artistObj.name,
                coverImage: cover,
                description: `Official studio album "${albInfo.title}" by ${artistObj.name}.`,
                genreId: genreId,
                genreName: genreName,
                releaseDate: albInfo.release_date || '2020-01-01',
                copyrightInfo: `℗ ${artistObj.name}`,
                status: 'published',
                isFeatured: false,
                songIds: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tracksCount: 0
              });
            }

            for (const trk of albTracksRes.data) {
              if (songs.length >= targetCount) break;
              if (!trk.preview || songs.some(s => s.id === `song-dz-${trk.id}`)) continue;

              songs.push({
                id: `song-dz-${trk.id}`,
                title: trk.title,
                artistId: artistObj.id,
                artistName: trk.artist?.name || artistObj.name,
                albumId: albumId,
                albumTitle: albInfo.title,
                albumName: albInfo.title,
                duration: trk.duration || 180,
                audioUrl: trk.preview,
                coverImage: cover,
                genreId: genreId,
                genreName: genreName,
                releaseDate: albInfo.release_date || '2020-01-01',
                playCount: Math.floor(Math.random() * 200000) + 30000,
                liked: false,
                status: 'published',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });

              const alb = albumsMap.get(albumId);
              alb.songIds.push(`song-dz-${trk.id}`);
              alb.tracksCount = alb.songIds.length;
            }
          }
        } catch {}
      }
    }
  }

  console.log(`  -> Fetched ${songs.length} tracks across ${albumsMap.size} albums for "${artist.name}".`);
  return { artistObj, songs, albums: Array.from(albumsMap.values()) };
}

async function main() {
  console.log('========================================================');
  console.log('🎵 PERFECTING ALL GENRE ACCURACY ACROSS LIBRARY');
  console.log('========================================================');

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  // -------------------------------------------------------------
  // 1. FIX MARCUS KANE -> MARCUS & MARTINUS & MOVE TO POP
  // -------------------------------------------------------------
  console.log('\n--- 1. Correcting Marcus & Martinus (formerly Marcus Kane) ---');
  let mmArtist = db.artists.find(a => a.id === 'artist-marcus-martinus' || a.name === 'Marcus & Martinus');
  if (!mmArtist) {
    mmArtist = {
      id: 'artist-marcus-martinus',
      name: 'Marcus & Martinus',
      bio: 'Norwegian pop duo and Melodifestivalen winners Marcus & Martinus.',
      genres: ['Pop'],
      image: 'https://e-cdns-images.dzcdn.net/images/artist/9c55b6ef3fc4b600d81f18501e74f178/1000x1000-000000-80-0-0.jpg',
      followersCount: 750000,
      monthlyListeners: 2800000,
      verified: true,
      socialLinks: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.artists.push(mmArtist);
  }

  // Remove old 'Marcus Kane' artist if present
  db.artists = db.artists.filter(a => a.name !== 'Marcus Kane');

  let mmCount = 0;
  db.songs.forEach(s => {
    if (s.artistName === 'Marcus Kane' || s.artistName === 'Marcus & Martinus') {
      s.artistName = 'Marcus & Martinus';
      s.artistId = mmArtist.id;
      s.genreId = 'genre-pop';
      s.genreName = 'Pop';
      mmCount++;
    }
  });
  db.albums.forEach(a => {
    if (a.artistName === 'Marcus Kane' || a.artistName === 'Marcus & Martinus') {
      a.artistName = 'Marcus & Martinus';
      a.artistId = mmArtist.id;
      a.genreId = 'genre-pop';
      a.genreName = 'Pop';
    }
  });
  console.log(`✅ Corrected ${mmCount} Marcus & Martinus tracks and moved them from Hip-Hop to Pop.`);

  // -------------------------------------------------------------
  // 2. FIX LO-FI POWFU ARTIST ATTRIBUTION
  // -------------------------------------------------------------
  console.log('\n--- 2. Fixing Lo-Fi & Chill Powfu Solo Artist Attribution ---');
  let powfuArtist = db.artists.find(a => a.name === 'Powfu');
  if (!powfuArtist) {
    powfuArtist = {
      id: 'artist-powfu',
      name: 'Powfu',
      bio: 'Canadian lo-fi hip hop singer and rapper Powfu.',
      genres: ['Lo-Fi & Chill'],
      image: 'https://e-cdns-images.dzcdn.net/images/artist/986d4b29bb185799a7e6b7d2f9547d79/1000x1000-000000-80-0-0.jpg',
      followersCount: 890000,
      monthlyListeners: 7500000,
      verified: true,
      socialLinks: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.artists.push(powfuArtist);
  }

  let soloPowfuFixed = 0;
  db.songs.forEach(s => {
    if (s.genreId === 'genre-chill' && s.artistName === 'Powfu & beabadoobee') {
      if (!s.title.toLowerCase().includes('death bed')) {
        s.artistName = 'Powfu';
        s.artistId = powfuArtist.id;
        soloPowfuFixed++;
      }
    }
  });
  console.log(`✅ Fixed ${soloPowfuFixed} solo Powfu tracks in Lo-Fi & Chill.`);

  // -------------------------------------------------------------
  // 3. RECLASSIFY NON-COUNTRY TRACKS FROM COUNTRY TO APPROPRIATE GENRES
  // -------------------------------------------------------------
  console.log('\n--- 3. Reclassifying Non-Country Songs Out of Country ---');
  const countryMileyPopTitles = new Set([
    'Flowers', 'Flowers (Demo)', 'We Can\'t Stop', 'Can\'t Be Tamed', 'Mother\'s Daughter',
    'Slide Away', 'River', 'Jaded', 'Used To Be Young', 'Who Owns My Heart', 'Doctor (Work It Out)',
    'Easy Lover', 'See You Again', 'Adore You', 'Dream As One (from Avatar: Fire and Ash)',
    'Nothing Else Matters', 'When I Look At You', 'The Climb', 'End of the World', 'Bass Persuades',
    'Let’s Get Married', 'REDLIGHTS', 'Orbit', 'Different Religion (feat. Model/Actriz)',
    'Younger You (From the "Hannah Montana 20th Anniversary Special")', 'You (Demo) (from Netflix Series "Nobody Wants This" Season 3)'
  ]);

  let mileyPopMoved = 0;
  db.songs.forEach(s => {
    if (s.genreId === 'genre-country') {
      if (s.artistName === 'Miley Cyrus') {
        const titleClean = s.title.split('(')[0].trim();
        if (countryMileyPopTitles.has(s.title) || countryMileyPopTitles.has(titleClean) || (s.albumTitle && (s.albumTitle.includes('Bangerz') || s.albumTitle.includes('Endless Summer') || s.albumTitle.includes('Can\'t Be Tamed') || s.albumTitle.includes('SHE IS COMING')))) {
          s.genreId = 'genre-pop';
          s.genreName = 'Pop';
          mileyPopMoved++;
        }
      } else if (s.artistName === 'Mark Ronson') {
        s.genreId = 'genre-pop';
        s.genreName = 'Pop';
      } else if (s.artistName === 'Lil Durk') {
        s.genreId = 'genre-hiphop';
        s.genreName = 'Hip-Hop';
      } else if (s.artistName === 'Diplo') {
        s.genreId = 'genre-electronic';
        s.genreName = 'Electronic';
      }
    }
  });
  console.log(`✅ Reclassified ${mileyPopMoved} pop tracks by Miley Cyrus out of Country into Pop.`);

  // -------------------------------------------------------------
  // 4. TOP UP COUNTRY TO EXACTLY 700 WITH DOLLY PARTON & CARRIE UNDERWOOD
  // -------------------------------------------------------------
  console.log('\n--- 4. Topping up Country with Legendary Country Artists to Exactly 700 ---');
  const currentCountryCount = db.songs.filter(s => s.genreId === 'genre-country').length;
  console.log(`Current Country songs: ${currentCountryCount}/700`);
  const countryDeficit = 700 - currentCountryCount;

  if (countryDeficit > 0) {
    console.log(`Need to fetch ${countryDeficit} authentic Country tracks...`);
    const dollyData = await fetchArtistTracks('Dolly Parton', countryDeficit, 'genre-country', 'Country');
    if (dollyData.artistObj && !db.artists.some(a => a.id === dollyData.artistObj.id)) {
      db.artists.push(dollyData.artistObj);
    }
    for (const alb of dollyData.albums) {
      if (!db.albums.some(a => a.id === alb.id)) db.albums.push(alb);
    }
    for (const trk of dollyData.songs) {
      if (db.songs.filter(s => s.genreId === 'genre-country').length >= 700) break;
      if (!db.songs.some(s => s.id === trk.id)) db.songs.push(trk);
    }

    const stillNeeded = 700 - db.songs.filter(s => s.genreId === 'genre-country').length;
    if (stillNeeded > 0) {
      console.log(`Still need ${stillNeeded} Country tracks; fetching Carrie Underwood...`);
      const carrieData = await fetchArtistTracks('Carrie Underwood', stillNeeded, 'genre-country', 'Country');
      if (carrieData.artistObj && !db.artists.some(a => a.id === carrieData.artistObj.id)) {
        db.artists.push(carrieData.artistObj);
      }
      for (const alb of carrieData.albums) {
        if (!db.albums.some(a => a.id === alb.id)) db.albums.push(alb);
      }
      for (const trk of carrieData.songs) {
        if (db.songs.filter(s => s.genreId === 'genre-country').length >= 700) break;
        if (!db.songs.some(s => s.id === trk.id)) db.songs.push(trk);
      }
    }
  }
  console.log(`✅ Country songs count now: ${db.songs.filter(s => s.genreId === 'genre-country').length}/700`);

  // -------------------------------------------------------------
  // 5. TOP UP JAZZ & FUSION TO EXACTLY 690 WITH JOHN COLTRANE
  // -------------------------------------------------------------
  console.log('\n--- 5. Topping up Jazz & Fusion to Exactly 690 with John Coltrane ---');
  const currentJazzCount = db.songs.filter(s => s.genreId === 'genre-jazz').length;
  console.log(`Current Jazz songs: ${currentJazzCount}/690`);
  const jazzDeficit = 690 - currentJazzCount;

  if (jazzDeficit > 0) {
    const coltraneData = await fetchArtistTracks('John Coltrane', jazzDeficit + 10, 'genre-jazz', 'Jazz & Fusion');
    if (coltraneData.artistObj && !db.artists.some(a => a.id === coltraneData.artistObj.id)) {
      db.artists.push(coltraneData.artistObj);
    }
    for (const alb of coltraneData.albums) {
      if (!db.albums.some(a => a.id === alb.id)) db.albums.push(alb);
    }
    for (const trk of coltraneData.songs) {
      if (db.songs.filter(s => s.genreId === 'genre-jazz').length >= 690) break;
      if (!db.songs.some(s => s.id === trk.id)) db.songs.push(trk);
    }
  }
  console.log(`✅ Jazz & Fusion songs count now: ${db.songs.filter(s => s.genreId === 'genre-jazz').length}/690`);

  // -------------------------------------------------------------
  // 6. ENRICH HIP-HOP WITH J. COLE (REPLACING MARCUS & MARTINUS)
  // -------------------------------------------------------------
  console.log('\n--- 6. Adding Authentic Hip-Hop Legend J. Cole ---');
  const jColeData = await fetchArtistTracks('J. Cole', 60, 'genre-hiphop', 'Hip-Hop');
  if (jColeData.artistObj && !db.artists.some(a => a.id === jColeData.artistObj.id)) {
    db.artists.push(jColeData.artistObj);
  }
  for (const alb of jColeData.albums) {
    if (!db.albums.some(a => a.id === alb.id)) db.albums.push(alb);
  }
  for (const trk of jColeData.songs) {
    if (!db.songs.some(s => s.id === trk.id)) db.songs.push(trk);
  }
  console.log(`✅ Added ${jColeData.songs.length} J. Cole tracks to Hip-Hop.`);

  // Move Sleepy Hallow to Hip-Hop
  const sh = db.songs.find(s => s.artistName === 'Sleepy Hallow');
  if (sh) {
    sh.genreId = 'genre-hiphop';
    sh.genreName = 'Hip-Hop';
  }

  // -------------------------------------------------------------
  // 7. WRITE UPDATED VERIFIED DATABASE
  // -------------------------------------------------------------
  console.log('\n--- 7. Writing Verified Accurate Database to Disk ---');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('✅ Successfully saved to data/sonora.json and backup!');

  // Summary Report
  console.log('\n================ FINAL GENRE AUDIT REPORT ================');
  db.genres.forEach(g => {
    const songs = db.songs.filter(s => s.genreId === g.id);
    const artists = new Set(songs.map(s => s.artistName));
    console.log(`${g.name.padEnd(20)} | ${songs.length.toString().padStart(5)} songs | ${artists.size.toString().padStart(3)} artists`);
  });
  console.log('==========================================================\n');
}

main().catch(console.error);
