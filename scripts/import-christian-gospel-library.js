const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const GENRE_ID = 'genre-christian';
const GENRE_NAME = 'Christian & Gospel';
const GENRE_SLUG = 'christian';

const GENRE_RECORD = {
  id: GENRE_ID,
  name: GENRE_NAME,
  slug: GENRE_SLUG,
  color: 'from-sky-500 to-indigo-800',
  accentColor: '#38BDF8',
  coverImage: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&auto=format&fit=crop&q=80',
  description: 'Uplifting praise, worship anthems, contemporary Christian music, and inspiring gospel melodies.'
};

const CHRISTIAN_ARTISTS = [
  'Hillsong Worship',
  'Hillsong UNITED',
  'Hillsong Young & Free',
  'Bethel Music',
  'Elevation Worship',
  'Maverick City Music',
  'Chris Tomlin',
  'Lauren Daigle',
  'Phil Wickham',
  'Brandon Lake',
  'Cory Asbury',
  'Don Moen',
  'Kari Jobe',
  'Cody Carnes',
  'Brooke Ligertwood',
  'Matt Redman',
  'MercyMe',
  'Casting Crowns',
  'for KING & COUNTRY',
  'TobyMac',
  'Zach Williams',
  'Tauren Wells',
  'Michael W. Smith',
  'CeCe Winans',
  'Kirk Franklin',
  'Sinach',
  'Planetshakers',
  'Jeremy Camp',
  'Newsboys',
  'Darlene Zschech',
  'Victory Worship',
  'Tasha Cobbs Leonard',
  'We The Kingdom',
  'Rend Collective',
  'Crowder',
  'Matthew West',
  'Danny Gokey',
  'Colton Dixon',
  'Natalie Grant',
  'Francesca Battistelli',
  'Big Daddy Weave',
  'Third Day',
  'Skillet'
];

const CURATED_CHRISTIAN_HITS = {
  'hillsong united::oceans (where feet may fail)': 'dy9nwe9_xzw',
  'hillsong worship::what a beautiful name': 'nQWFzMvCfLE',
  'hillsong worship::who you say i am': 'lKw6uqtGFfo',
  'hillsong worship::king of kings': 'dFQmiq77nqw',
  'elevation worship::o come to the altar': 'rYQ5yXCc_CA',
  'elevation worship::graves into gardens': 'YBl84oZSRUg',
  'elevation worship::the blessing': 'Zp6aygmvzM4',
  'elevation worship & maverick city music::jireh': 'mC-zw0zCCtg',
  'maverick city music::jireh': 'mC-zw0zCCtg',
  'maverick city music::promises': 'q5m09GzJRgk',
  'bethel music::goodness of god': '-f4MUUMHaaI',
  'bethel music::raise a hallelujah': 'G2XtCePrmmA',
  'bethel music::reckless love': 'Sc6SSHuZvQE',
  'cory asbury::reckless love': 'Sc6SSHuZvQE',
  'chris tomlin::how great is our god': 'vg5qDljEw7Q',
  'chris tomlin::good good father': 'CqybaIesBuA',
  'chris tomlin::our god': 'ZL5Gg240gR8',
  'lauren daigle::you say': 'sIaT8Jl2zpI',
  'lauren daigle::trust in you': 'qv-SXz_exKE',
  'lauren daigle::rescue': 'gYR0xP1j4PY',
  'phil wickham::battle belongs': 'qtvQNzPHn-w',
  'phil wickham::living hope': 'u-1fwZtKJSM',
  'phil wickham::house of the lord': 'O0U00aGzIqU',
  'brandon lake::gratitude': 'dQdfs5S6jyA',
  'brandon lake::praise': 'qF32r_F3aL8',
  'don moen::god will make a way': '1zo3fJYtS-o',
  'don moen::give thanks': '78U9Z8K3P_w',
  'don moen::god is good all the time': 'g81k-X84T1M',
  'matt redman::10,000 reasons (bless the lord)': 'XtwIT8JtddM',
  'sinach::way maker': 'n4XWfwLHeLM',
  'mercyme::i can only imagine': 'BRPbM1zN_8w',
  'casting crowns::scars in heaven': 'qQ71RWJhS_M',
  'for king & country::god only knows': 'Q5cPQg3oq-o',
  'cece winans::goodness of god': '9sE5kEnitqE',
  'kari jobe::the blessing': 'Zp6aygmvzM4',
  'kari jobe::forever': 'huFra1mnIVE',
  'cody carnes::firm foundation (he won\'t)': 'x8qQ1VpWwXU',
  'cody carnes::run to the father': 'HcpeLDp0Foo',
  'victory worship::lilim': 'Ue80Fw9N_8A',
  'victory worship::radikal': 'Dk-Xj3iZ7lA'
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SonoraMusic/2.5' }
      });
      if (res.status === 429) {
        await delay(3000 * attempt);
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch {
      if (attempt === 3) return null;
      await delay(1000 * attempt);
    }
  }
  return null;
}

async function main() {
  console.log('========================================================');
  console.log('✝️ IMPORTING COMPLETE CHRISTIAN & GOSPEL MUSIC LIBRARY');
  console.log('========================================================');

  let db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  db.songs = db.songs || [];
  db.albums = db.albums || [];
  db.artists = db.artists || [];
  db.genres = db.genres || [];

  // 1. Ensure Christian & Gospel genre is registered in db.genres
  let christianGenre = db.genres.find(g => g.id === GENRE_ID);
  if (!christianGenre) {
    db.genres.push(GENRE_RECORD);
    console.log(`Added "${GENRE_NAME}" to db.genres.`);
  } else {
    christianGenre.coverImage = GENRE_RECORD.coverImage;
    christianGenre.description = GENRE_RECORD.description;
    christianGenre.color = GENRE_RECORD.color;
    christianGenre.accentColor = GENRE_RECORD.accentColor;
  }

  const existingSongIds = new Set(db.songs.map(s => s.id));
  const existingAlbumIds = new Set(db.albums.map(a => a.id));
  const artistMap = new Map();
  db.artists.forEach(a => {
    artistMap.set(a.id, a);
    artistMap.set(a.name.toLowerCase().trim(), a);
  });

  const existingSongTitlesByArtist = new Map();
  db.songs.forEach(s => {
    if (!existingSongTitlesByArtist.has(s.artistId)) {
      existingSongTitlesByArtist.set(s.artistId, new Set());
    }
    existingSongTitlesByArtist.get(s.artistId).add(normalizeTitle(s.title));
  });

  let totalSongsAdded = 0;
  let totalAlbumsAdded = 0;
  let totalArtistsAdded = 0;
  let artistIndex = 0;

  for (const artistName of CHRISTIAN_ARTISTS) {
    artistIndex++;
    console.log(`\n[${artistIndex}/${CHRISTIAN_ARTISTS.length}] Processing Christian Artist: "${artistName}"...`);

    await delay(120);
    const searchRes = await fetchJson(`https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}`);
    const dzArtists = searchRes?.data || [];

    if (dzArtists.length === 0) {
      console.log(`  -> No Deezer profile found for "${artistName}". Skipping.`);
      continue;
    }

    const exact = dzArtists.filter(d => d.name.toLowerCase() === artistName.toLowerCase());
    const bestDz = exact.length > 0
      ? exact.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0]
      : dzArtists.sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0];

    if (!bestDz) continue;

    const artistSlug = slugify(bestDz.name || artistName);
    let artist = artistMap.get(bestDz.name.toLowerCase().trim()) || artistMap.get(artistName.toLowerCase().trim());
    const artistId = artist ? artist.id : `artist-${artistSlug}`;

    if (!artist) {
      artist = {
        id: artistId,
        name: bestDz.name || artistName,
        slug: artistSlug,
        avatar: bestDz.picture_xl || bestDz.picture_big,
        coverImage: bestDz.picture_xl || bestDz.picture_big,
        headerImage: bestDz.picture_xl || bestDz.picture_big,
        banner: bestDz.picture_xl || bestDz.picture_big,
        bio: `${bestDz.name} is an internationally acclaimed Christian & Gospel worship artist with over ${(bestDz.nb_fan || 150000).toLocaleString()} global listeners, known for inspiring praise anthems and devotion.`,
        genreId: GENRE_ID,
        genreName: GENRE_NAME,
        isVerified: true,
        monthlyListeners: bestDz.nb_fan ? bestDz.nb_fan * 5 : 650000,
        albumIds: [],
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.artists.push(artist);
      artistMap.set(artist.id, artist);
      artistMap.set(artist.name.toLowerCase().trim(), artist);
      totalArtistsAdded++;
      console.log(`  -> Created artist profile for "${artist.name}"`);
    } else {
      artist.genreId = GENRE_ID;
      artist.genreName = GENRE_NAME;
      if (!artist.avatar || artist.avatar.includes('unsplash')) {
        artist.avatar = bestDz.picture_xl || bestDz.picture_big || artist.avatar;
        artist.coverImage = artist.avatar;
      }
    }

    if (!artist.albumIds) artist.albumIds = [];
    if (!existingSongTitlesByArtist.has(artist.id)) {
      existingSongTitlesByArtist.set(artist.id, new Set());
    }
    const artistSongTitles = existingSongTitlesByArtist.get(artist.id);

    // Fetch albums for this Christian artist
    await delay(120);
    const albumsRes = await fetchJson(`https://api.deezer.com/artist/${bestDz.id}/albums?limit=100`);
    const dzAlbums = albumsRes?.data || [];
    console.log(`  Found ${dzAlbums.length} official albums on Deezer.`);

    let artistSongsAdded = 0;
    let artistAlbumsAdded = 0;

    for (const dzAlbum of dzAlbums) {
      const rawAlbumTitle = (dzAlbum.title || '').trim();
      if (!rawAlbumTitle) continue;

      const lowerAlbum = rawAlbumTitle.toLowerCase();
      // Filter karaoke, tribute, sound-a-like
      if (/\b(karaoke|tribute|sound-a-like)\b/i.test(lowerAlbum)) continue;

      const albumSlug = slugify(rawAlbumTitle);
      const albumId = `album-${artistSlug}-${albumSlug || 'release'}`;

      let album = db.albums.find(a => a.id === albumId);
      const albumCover = dzAlbum.cover_xl || dzAlbum.cover_big || artist.avatar;
      const releaseDate = dzAlbum.release_date || '2023-01-01';
      const releaseYear = parseInt(releaseDate.split('-')[0], 10) || 2023;

      if (!album) {
        album = {
          id: albumId,
          title: rawAlbumTitle,
          artistId: artist.id,
          artistName: artist.name,
          coverImage: albumCover,
          description: `Official Christian studio album "${rawAlbumTitle}" by ${artist.name} (${releaseYear}).`,
          genreId: GENRE_ID,
          genreName: GENRE_NAME,
          releaseDate: releaseDate,
          releaseYear: releaseYear,
          copyrightInfo: `℗ ${artist.name}`,
          status: 'published',
          isFeatured: false,
          songIds: [],
          tracksCount: 0,
          createdAt: `${releaseDate}T00:00:00.000Z`,
          updatedAt: new Date().toISOString(),
        };
        db.albums.push(album);
        existingAlbumIds.add(albumId);
        artistAlbumsAdded++;
        totalAlbumsAdded++;
      } else {
        album.genreId = GENRE_ID;
        album.genreName = GENRE_NAME;
      }

      if (!artist.albumIds.includes(album.id)) {
        artist.albumIds.push(album.id);
      }

      // Fetch tracks for this album
      await delay(120);
      const tracksRes = await fetchJson(`https://api.deezer.com/album/${dzAlbum.id}/tracks?limit=100`);
      const dzTracks = tracksRes?.data || [];

      for (const tr of dzTracks) {
        if (!tr || !tr.title) continue;

        const trackTitle = (tr.title || tr.title_short || '').trim();
        if (!trackTitle) continue;

        const normTitle = normalizeTitle(trackTitle);
        if (artistSongTitles.has(normTitle)) continue;

        const lowerTrack = trackTitle.toLowerCase();
        if (/\b(karaoke|reaction|snippet|interview|commentary)\b/i.test(lowerTrack)) continue;

        const songId = `song-dz-${tr.id}`;
        if (existingSongIds.has(songId)) continue;

        // Check if curated media video exists
        const hitKey = `${artist.name.toLowerCase()}::${trackTitle.toLowerCase()}`;
        const curatedMediaId = CURATED_CHRISTIAN_HITS[hitKey];

        const song = {
          id: songId,
          title: trackTitle,
          artistId: artist.id,
          artistName: artist.name,
          albumId: album.id,
          albumTitle: album.title,
          albumName: album.title,
          genreId: GENRE_ID,
          genreName: GENRE_NAME,
          duration: tr.duration || 240,
          releaseDate: releaseDate,
          coverImage: albumCover,
          audioUrl: tr.preview || '',
          sourcePlatform: curatedMediaId ? 'youtube' : 'direct',
          externalMediaId: curatedMediaId || undefined,
          uploadType: curatedMediaId ? 'youtube' : 'url',
          sourceType: curatedMediaId ? 'youtube' : 'external_url',
          lyrics: '',
          syncedLyrics: [],
          multilingualLyrics: { en: [] },
          status: 'published',
          playCount: tr.rank || Math.floor(Math.random() * 500000 + 100000),
          likesCount: Math.floor((tr.rank || 250000) * 0.09),
          explicit: false,
          isFeatured: tr.rank > 500000 || !!curatedMediaId,
          createdAt: `${releaseDate}T00:00:00.000Z`,
          updatedAt: new Date().toISOString()
        };

        db.songs.push(song);
        existingSongIds.add(songId);
        artistSongTitles.add(normTitle);

        if (!album.songIds) album.songIds = [];
        if (!album.songIds.includes(songId)) {
          album.songIds.push(songId);
        }
        album.tracksCount = album.songIds.length;

        artistSongsAdded++;
        totalSongsAdded++;
      }
    }

    console.log(`  -> Added ${artistSongsAdded} tracks, ${artistAlbumsAdded} albums for ${artist.name}`);

    // Checkpoint save every 5 artists
    if (artistIndex % 5 === 0) {
      console.log(`\n💾 Checkpoint: ${db.songs.length} total songs, ${db.albums.length} albums saved...`);
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
      fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
    }
  }

  // Final persist
  console.log('\n========================================================');
  console.log('✅ CHRISTIAN & GOSPEL IMPORT COMPLETE!');
  console.log(`Total New Christian Songs Added: ${totalSongsAdded}`);
  console.log(`Total New Albums Added: ${totalAlbumsAdded}`);
  console.log(`Total New Artists Added: ${totalArtistsAdded}`);
  console.log(`Total Library Songs: ${db.songs.length}`);
  console.log(`Total Library Albums: ${db.albums.length}`);
  console.log(`Total Library Artists: ${db.artists.length}`);
  const christianTotal = db.songs.filter(s => s.genreId === GENRE_ID).length;
  console.log(`Total Christian & Gospel Songs: ${christianTotal}`);
  console.log('========================================================');

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
}

main().catch(console.error);

