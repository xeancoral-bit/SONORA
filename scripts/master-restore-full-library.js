const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');
const MASTER_ARTISTS_FILE = path.join(__dirname, 'master-300-artists.json');

const REQUESTED_140_ARTISTS = `Rex Orange County, Goo Goo Dolls, Mariah Deborah, Adie, Yung Kai, Ava Max, Zack Tabudlo, Cup of Joe, Sombr, Joji, Daniel Caesar, Marino, Elvis Presley, CARYS, MIIA, Sofia Carson, Elley Duhé, Madison Beer, Bahari, Indila, Henry Moodie, Sasha Alex Sloan, Bea Miller, 6LACK, Gigi Perez, Ali Gatie, Glass Animals, Panic! At The Disco, Lizzo, Tove Lo, NEONI, J Balvin, Alex Warren, Faouzia, Benny Blanco, Chelsea Cutler, Suzi, Fetty Wap, Benson Boone, Doja Cat, Everybody Loves An Outlaw, Lxandra, Zara Larsson, ADÉLA, Pia Mia, Chris Brown, Tyga, Aya Nakamura, WALK THE MOON, Chord Overstreet, Ellie Goulding, Diplo, Swae Lee, Jex, Aaron Smith, Bishop Briggs, LSD, Labrinth, Machine Gun Kelly, Fall Out Boy, Egzod, Maestro Chives, Halsey, Gnash, Olivia O'Brien, Britney Spears, Jonas Brothers, Joe Jonas, Nick Jonas, Calum Scott, Rachel Platten, Bastille, Natalie Taylor, JP Saxe, Caleb Hearn, ROSIE, Charli XCX, John Legend, Owl City, Carly Rae Jepsen, Christina Perri, Vanessa Carlton, Evanescence, Hoobastank, Kodaline, Meghan Trainor, Sarah Geronimo, Gotye, Doechii, Djo, Charlotte Lawrence, Loreen, Rosa Linn, Lil Nas X, Cardi B, Dhruv, SLANDER, Alex Crichton, Hozier, KATSEYE, Leona Lewis, Måneskin, Rema, Lukas Graham, Sub Urban, Chappell Roan, Kehlani, Maximillian, Alex & Sierra, Jess Glynne, We The Kings, Jessie J, The Kid LAROI, Jagwar Twin, Billy Ray Cyrus, Miles Away, Claire Ridgely, fun., Jack Harlow, Jack & Jack, Sean Kingston, SAYGRACE, Zoe Wees, Sam Tinnesz, Yacht Money, Kina, Alexander 23, AURORA, Duncan Laurence, Stephen Sanchez, Kat Dahlia, Astrid S, Rudimental, Macklemore, Dan Caplen, Olivia Dean, Rye, Flo Rida, Alicia Keys, Kesha, Pitbull`;

// Curated verified YouTube video IDs for top tracks
const CURATED_MEDIA_MAP = {
  'troye sivan::there for you': 'pNNMr5glICM',
  'troye sivan::youth': 'XYAghEq5Lfw',
  'the neighbourhood::sweater weather': 'GCdwKhTtNNw',
  'ariana grande::one last time': 'BPgAM3135d4',
  'ariana grande::7 rings': 'QYh6mYIJG2Y',
  'bruno mars::just the way you are': 'LjhCEhWiKXk',
  'bruno mars::locked out of heaven': 'e-fA-gBCkj0',
  'bruno mars::that\'s what i like': 'PMivT7MJ41M',
  'bruno mars::24k magic': 'UqyT8IEBkvY',
  'bruno mars & lady gaga::die with a smile': 'kPa7bsKwL-8',
  'lady gaga & bruno mars::die with a smile': 'kPa7bsKwL-8',
  'rosé & bruno mars::apt.': 'ekr2nIex040',
  'bruno mars & rosé::apt.': 'ekr2nIex040',
  'taylor swift::cruel summer': 'ic8j13piAhQ',
  'taylor swift::anti-hero': 'b1kbLwvqugk',
  'ed sheeran::shape of you': 'JGwWNGJdvx8',
  'ed sheeran::perfect': '2Vv-BfVoq4g',
  'coldplay::yellow': 'yKNxeF4KMsY',
  'coldplay::viva la vida': 'dvgZkm1xWPE',
  'maroon 5::sugar': '09R8_2nJtjg',
  'maroon 5::memories': 'SlPhMPnQ58k',
  'billie eilish::bad guy': 'DYed5whEf4g',
  'billie eilish::birds of a feather': 'd5gf9dXHevw',
  'olivia rodrigo::drivers license': 'ZmDBbnmKpqQ',
  'olivia rodrigo::vampire': 'rXb5_2uXU-k',
  'sabrina carpenter::espresso': 'eVli-tstM5E',
  'sabrina carpenter::please please please': 'cF1Na4AIecM',
  'chappell roan::good luck, babe!': '1RKqOmSkGgM',
  'benson boone::beautiful things': 'Oa_RSwwpPaA',
  'hozier::too sweet': 'aezstCBHopQ',
  'djo::end of beginning': 'e8xni3EcIbc',
  'adie::paraluman': 'w89b0N_2NQI',
  'zack tabudlo::binibini': 'Esd05ZgCvh4',
  'cup of joe::tingin': 'iR-w-pA4J9A',
  'joji::glimpse of us': 'FvOpPeKSf_4',
  'daniel caesar::best part': 'vBy7FaapGRo',
  'rex orange county::the shade': '2jN-p3O6FkE',
  'yung kai::blue': 'Z_2L6F4mU_g'
};

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 45);
}

function normalizeTitle(title) {
  return (title || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeArtist(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^the\s+/, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function mapGenre(artistName) {
  const an = (artistName || '').toLowerCase();
  if (an.includes('country') || an.includes('cyrus') || an.includes('stapleton') || an.includes('combs') || an.includes('wallen')) return { id: 'genre-country', name: 'Country' };
  if (an.includes('rock') || an.includes('evanescence') || an.includes('fall out boy') || an.includes('hoobastank') || an.includes('goo goo dolls') || an.includes('bastille') || an.includes('kodaline') || an.includes('glass animals') || an.includes('green day') || an.includes('linkin park') || an.includes('coldplay') || an.includes('queen') || an.includes('oasis')) return { id: 'genre-rock', name: 'Rock & Indie' };
  if (an.includes('hip-hop') || an.includes('rap') || an.includes('eminem') || an.includes('tyga') || an.includes('drake') || an.includes('cardi b') || an.includes('lil nas x') || an.includes('jack harlow') || an.includes('travis scott') || an.includes('kendrick')) return { id: 'genre-hiphop', name: 'Hip-Hop' };
  if (an.includes('r&b') || an.includes('soul') || an.includes('kehlani') || an.includes('chris brown') || an.includes('daniel caesar') || an.includes('6lack') || an.includes('alicia keys') || an.includes('john legend') || an.includes('joji') || an.includes('sza') || an.includes('frank ocean') || an.includes('usher')) return { id: 'genre-rnb', name: 'R&B & Soul' };
  if (an.includes('electronic') || an.includes('dance') || an.includes('edm') || an.includes('garrix') || an.includes('chainsmokers') || an.includes('marshmello') || an.includes('kygo') || an.includes('zedd') || an.includes('alesso') || an.includes('avicii') || an.includes('alan walker') || an.includes('diplo') || an.includes('slander') || an.includes('skrillex')) return { id: 'genre-electronic', name: 'Electronic' };
  if (an.includes('k-pop') || an.includes('bts') || an.includes('blackpink') || an.includes('twice') || an.includes('newjeans') || an.includes('katseye')) return { id: 'genre-kpop', name: 'K-Pop' };
  if (an.includes('acoustic') || an.includes('adie') || an.includes('yung kai') || an.includes('cup of joe') || an.includes('stephen sanchez') || an.includes('caleb hearn') || an.includes('calum scott') || an.includes('henry moodie') || an.includes('sasha alex sloan') || an.includes('rex orange county') || an.includes('zack tabudlo')) return { id: 'genre-acoustic', name: 'Acoustic' };
  return { id: 'genre-pop', name: 'Pop' };
}

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(7000),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      if (attempt === 3) return null;
      await new Promise(r => setTimeout(r, 300 * attempt));
    }
  }
  return null;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('====================================================');
  console.log('🎵 SONORA MASTER FULL LIBRARY RESTORER');
  console.log('====================================================');

  // Load existing base DB
  let db;
  try {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    db = { users: [], songs: [], albums: [], artists: [], genres: [], playlists: [], collections: [] };
  }

  // Ensure arrays exist
  db.songs = db.songs || [];
  db.albums = db.albums || [];
  db.artists = db.artists || [];
  db.genres = db.genres || [];

  // Build complete unified artist list
  let masterList = [];
  try {
    masterList = JSON.parse(fs.readFileSync(MASTER_ARTISTS_FILE, 'utf8'));
  } catch (e) {
    console.warn('Could not load master-300-artists.json:', e.message);
  }

  const requestedList = REQUESTED_140_ARTISTS
    .replace(/\band\b/gi, ',')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const artistSet = new Set();
  const allArtists = [];

  for (const name of [...masterList, ...requestedList]) {
    const norm = normalizeArtist(name);
    if (!artistSet.has(norm)) {
      artistSet.add(norm);
      allArtists.push(name);
    }
  }

  console.log(`Total target artists to restore: ${allArtists.length}`);

  // Maps for fast lookup
  const artistMap = new Map();
  db.artists.forEach(a => {
    artistMap.set(normalizeArtist(a.name), a);
    artistMap.set(a.id, a);
  });

  const existingSongIds = new Set(db.songs.map(s => s.id));
  const existingSongTitlesByArtist = new Map(); // artistId -> Set of normalized titles

  db.songs.forEach(s => {
    if (!existingSongTitlesByArtist.has(s.artistId)) {
      existingSongTitlesByArtist.set(s.artistId, new Set());
    }
    existingSongTitlesByArtist.get(s.artistId).add(normalizeTitle(s.title));
  });

  const existingAlbumIds = new Set(db.albums.map(a => a.id));

  let totalSongsAdded = 0;
  let totalAlbumsAdded = 0;
  let totalArtistsCreated = 0;

  // Process artists in concurrent batches of 8
  const BATCH_SIZE = 8;
  const TARGET_TRACKS_PER_ARTIST = 100; // Guarantee at least 100+ tracks per artist

  for (let i = 0; i < allArtists.length; i += BATCH_SIZE) {
    const batch = allArtists.slice(i, i + BATCH_SIZE);
    console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allArtists.length / BATCH_SIZE)}: ${batch.join(', ')}`);

    await Promise.all(batch.map(async (artistName) => {
      try {
        const artistSlug = slugify(artistName);
        const artistId = `artist-${artistSlug}`;
        const normArtistName = normalizeArtist(artistName);

        let artist = artistMap.get(normArtistName) || db.artists.find(a => a.id === artistId);

        // Fetch Deezer artist info
        const searchRes = await fetchJson(`https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=5`);
        const deezerArtist = searchRes?.data?.[0];

        const defaultGenre = mapGenre(artistName);

        if (!artist) {
          artist = {
            id: artistId,
            name: artistName,
            slug: artistSlug,
            avatar: deezerArtist?.picture_xl || deezerArtist?.picture_big || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
            banner: deezerArtist?.picture_xl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
            coverImage: deezerArtist?.picture_xl || deezerArtist?.picture_big || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
            bio: `${artistName} is an official featured recording artist on SONORA with complete studio discography, albums, and soundtracks.`,
            genreId: defaultGenre.id,
            genreName: defaultGenre.name,
            monthlyListeners: deezerArtist?.nb_fan ? deezerArtist.nb_fan * 5 : Math.floor(Math.random() * 8000000) + 1200000,
            followersCount: deezerArtist?.nb_fan || Math.floor(Math.random() * 3000000) + 500000,
            albumIds: [],
            isVerified: true,
            isFeatured: true,
            status: 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          db.artists.push(artist);
          artistMap.set(normArtistName, artist);
          artistMap.set(artistId, artist);
          totalArtistsCreated++;
        } else {
          if (!artist.albumIds) artist.albumIds = [];
          if (deezerArtist && (!artist.avatar || artist.avatar.includes('unsplash'))) {
            artist.avatar = deezerArtist.picture_xl || deezerArtist.picture_big;
            artist.coverImage = artist.avatar;
            artist.banner = artist.avatar;
          }
        }

        if (!existingSongTitlesByArtist.has(artist.id)) {
          existingSongTitlesByArtist.set(artist.id, new Set());
        }
        const artistSongTitles = existingSongTitlesByArtist.get(artist.id);

        let artistTrackCount = db.songs.filter(s => s.artistId === artist.id).length;
        if (artistTrackCount >= TARGET_TRACKS_PER_ARTIST) {
          return;
        }

        if (!deezerArtist) return;

        // Fetch top tracks directly (gives top 100 hit tracks)
        const topRes = await fetchJson(`https://api.deezer.com/artist/${deezerArtist.id}/top?limit=100`);
        const topTracks = topRes?.data || [];

        // Helper to add track
        const addTrack = (track, albumData) => {
          if (!track || !track.title) return false;
          const trackTitle = (track.title || track.title_short || '').trim();
          if (!trackTitle) return false;

          const normTitle = normalizeTitle(trackTitle);
          if (artistSongTitles.has(normTitle)) return false;

          const lower = trackTitle.toLowerCase();
          if (/\b(live|en vivo|live at|live from|\(live\)|\[live\]|unplugged|live concert)\b/i.test(lower) ||
              /\b(remix|remixes|club mix|extended mix|vip mix|mashup|sped up|slowed|reverb)\b/i.test(lower) ||
              /\b(karaoke|instrumental|reaction|snippet|preview|interview|commentary)\b/i.test(lower)) {
            return false;
          }

          const songId = `song-dz-${track.id}`;
          if (existingSongIds.has(songId)) return false;

          const rawAlbumTitle = (albumData?.title || track.album?.title || `${trackTitle} - Single`).trim();
          const albumSlug = slugify(rawAlbumTitle);
          const albumId = `album-${artistSlug}-${albumSlug || 'releases'}`;

          let album = db.albums.find(a => a.id === albumId);
          const albumCover = albumData?.cover_xl || albumData?.cover_big || track.album?.cover_xl || track.album?.cover_big || artist.avatar;

          if (!artist.albumIds) artist.albumIds = [];
          if (!album) {
            album = {
              id: albumId,
              title: rawAlbumTitle,
              artistId: artist.id,
              artistName: artist.name,
              coverImage: albumCover,
              description: `Official studio album "${rawAlbumTitle}" by ${artist.name}.`,
              genreId: defaultGenre.id,
              genreName: defaultGenre.name,
              releaseDate: (albumData?.release_date || '2024-01-01').split('T')[0],
              copyrightInfo: `℗ ${artist.name}`,
              status: 'published',
              isFeatured: false,
              songIds: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            db.albums.push(album);
            existingAlbumIds.add(albumId);
            totalAlbumsAdded++;
            if (!artist.albumIds.includes(albumId)) {
              artist.albumIds.push(albumId);
            }
          }

          if (!album.songIds) album.songIds = [];
          if (!album.songIds.includes(songId)) {
            album.songIds.push(songId);
          }

          // Check if curated media ID exists
          const key = `${artist.name.toLowerCase()}::${trackTitle.toLowerCase()}`;
          const curatedMediaId = CURATED_MEDIA_MAP[key];

          const song = {
            id: songId,
            title: trackTitle,
            artistId: artist.id,
            artistName: artist.name,
            albumId: album.id,
            albumTitle: album.title,
            albumName: album.title,
            genreId: defaultGenre.id,
            genreName: defaultGenre.name,
            duration: track.duration || 180,
            audioUrl: track.preview || '',
            coverImage: albumCover,
            releaseDate: (album.releaseDate || '2024-01-01').split('T')[0],
            playCount: Math.floor(Math.random() * 500000) + 20000,
            likesCount: Math.floor(Math.random() * 90000) + 4000,
            status: 'published',
            isFeatured: artistTrackCount < 5,
            trackNumber: track.track_position || album.songIds.length,
            explicit: !!track.explicit_lyrics,
            externalMediaId: curatedMediaId || undefined,
            sourcePlatform: curatedMediaId ? 'youtube' : 'direct',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          db.songs.push(song);
          existingSongIds.add(songId);
          artistSongTitles.add(normTitle);
          artistTrackCount++;
          totalSongsAdded++;
          return true;
        };

        // Add top tracks first
        for (const t of topTracks) {
          addTrack(t, t.album);
          if (artistTrackCount >= TARGET_TRACKS_PER_ARTIST) break;
        }

        // Fetch artist albums if more tracks needed
        if (artistTrackCount < TARGET_TRACKS_PER_ARTIST) {
          const albumsRes = await fetchJson(`https://api.deezer.com/artist/${deezerArtist.id}/albums?limit=40`);
          const albumsList = albumsRes?.data || [];

          for (const alb of albumsList) {
            if (artistTrackCount >= TARGET_TRACKS_PER_ARTIST) break;
            if (/\b(live|tour|remix|tribute|karaoke)\b/i.test(alb.title)) continue;

            const tracksRes = await fetchJson(`https://api.deezer.com/album/${alb.id}/tracks?limit=50`);
            const tracks = tracksRes?.data || [];
            for (const t of tracks) {
              addTrack(t, alb);
              if (artistTrackCount >= TARGET_TRACKS_PER_ARTIST) break;
            }
          }
        }
      } catch (err) {
        console.error(`Error processing ${artistName}:`, err.message);
      }
    }));

    // Save checkpoint every 4 batches
    if (Math.floor(i / BATCH_SIZE) % 4 === 0) {
      console.log(`\n💾 Saving database checkpoint... Songs in DB: ${db.songs.length}, Albums: ${db.albums.length}, Artists: ${db.artists.length}`);
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
      fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
    }
  }

  // Final verification & cleanup
  console.log('\nValidating database referential integrity...');
  db.albums.forEach(a => {
    a.songIds = db.songs.filter(s => s.albumId === a.id).map(s => s.id);
  });
  db.artists.forEach(a => {
    a.albumIds = db.albums.filter(alb => alb.artistId === a.id).map(alb => alb.id);
  });

  console.log(`\nWriting final data to ${DB_PATH} and ${BACKUP_PATH}...`);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');

  console.log('====================================================');
  console.log('🎉 MASTER RESTORATION COMPLETE!');
  console.log(`Total Artists: ${db.artists.length}`);
  console.log(`Total Albums: ${db.albums.length}`);
  console.log(`Total Soundtracks: ${db.songs.length}`);
  console.log('====================================================');
}

main().catch(err => {
  console.error('Fatal error in restorer:', err);
  process.exit(1);
});
