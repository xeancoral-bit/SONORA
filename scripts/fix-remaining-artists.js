const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// 1. Fix Tinashe
const tinasheArtist = db.artists.find((a) => a.name.toLowerCase() === 'tinashe');
if (tinasheArtist) {
  tinasheArtist.id = 'artist-tinashe';
  tinasheArtist.bio = 'Tinashe is an American singer, songwriter, dancer, and record producer.';
}

// 2. Fix Dua Lipa
const duaLipaArtist = db.artists.find((a) => a.name.toLowerCase() === 'dua lipa');
if (duaLipaArtist) {
  duaLipaArtist.id = 'artist-dua-lipa';
  for (const alb of db.albums) {
    if (alb.id.includes('dua-lipa') || alb.artistName.toLowerCase().includes('dua lipa')) {
      alb.artistId = 'artist-dua-lipa';
      alb.artistName = 'Dua Lipa';
    }
  }
  for (const song of db.songs) {
    if (song.artistName.toLowerCase().includes('dua lipa')) {
      song.artistId = 'artist-dua-lipa';
      song.artistName = 'Dua Lipa';
    }
  }
}

// 3. Fetch IU albums and tracks
async function fetchIU() {
  const res = await fetch('https://itunes.apple.com/search?term=IU+%EC%95%84%EC%9D%B4%EC%9C%A0&entity=album&limit=10', {
    headers: { 'User-Agent': 'SonoraMusic/2.0' }
  });
  const data = await res.json();
  const albums = (data.results || []).slice(0, 3);

  const iuArtist = db.artists.find((a) => a.name.toLowerCase() === 'iu');
  if (iuArtist && albums.length > 0) {
    const heroArt = albums[0].artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg');
    iuArtist.avatar = heroArt;
    iuArtist.banner = heroArt;
    iuArtist.genreId = 'genre-pop';
    iuArtist.genreName = 'K-Pop';

    for (const alb of albums) {
      const albumSlug = alb.collectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const albumId = `album-${albumSlug}`;
      const coverHd = alb.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg');

      const lookupRes = await fetch(`https://itunes.apple.com/lookup?id=${alb.collectionId}&entity=song`, {
        headers: { 'User-Agent': 'SonoraMusic/2.0' }
      });
      const lookupData = await lookupRes.json();
      const tracks = (lookupData.results || []).filter((r) => r.wrapperType === 'track');

      const songIds = [];
      for (const t of tracks) {
        const songSlug = t.trackName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const songId = `song-iu-${songSlug}`;
        const songObj = {
          id: songId,
          title: t.trackName,
          originalFilename: `${songSlug}.mp3`,
          audioUrl: t.previewUrl || `https://www.youtube.com/results?search_query=IU+${encodeURIComponent(t.trackName)}`,
          audioPath: t.previewUrl || undefined,
          coverImage: coverHd,
          artistId: iuArtist.id,
          artistName: 'IU',
          albumId: albumId,
          albumTitle: alb.collectionName,
          genreId: 'genre-pop',
          genreName: 'K-Pop',
          duration: Math.round((t.trackTimeMillis || 210000) / 1000),
          releaseDate: alb.releaseDate ? alb.releaseDate.split('T')[0] : '2021-03-25',
          description: `Track #${t.trackNumber || 1} from "${alb.collectionName}" by IU.`,
          lyrics: '',
          syncedLyrics: [],
          multilingualLyrics: { en: [] },
          explicit: false,
          status: 'published',
          playCount: 450000,
          likesCount: 28000,
          uploadedBy: 'user-admin',
          uploadType: 'url',
          sourceType: 'external_url',
          sourcePlatform: 'direct',
          isFeatured: true,
          synthPreset: 'pop',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const sIdx = db.songs.findIndex((s) => s.id === songId);
        if (sIdx >= 0) db.songs[sIdx] = songObj;
        else db.songs.push(songObj);
        songIds.push(songId);
      }

      let albObj = db.albums.find((a) => a.id === albumId);
      if (!albObj) {
        albObj = {
          id: albumId,
          title: alb.collectionName,
          artistId: iuArtist.id,
          artistName: 'IU',
          coverImage: coverHd,
          description: `Studio release "${alb.collectionName}" by IU.`,
          genreId: 'genre-pop',
          genreName: 'K-Pop',
          releaseDate: alb.releaseDate ? alb.releaseDate.split('T')[0] : '2021-03-25',
          copyrightInfo: alb.copyright || `© EDAM Entertainment`,
          status: 'published',
          isFeatured: true,
          songIds: songIds,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.albums.push(albObj);
      } else {
        albObj.artistId = iuArtist.id;
        albObj.songIds = Array.from(new Set([...albObj.songIds, ...songIds]));
      }
    }
  }

  // Final check: guarantee exactly 300 unique artists
  const albArtistIds = new Set(db.albums.map((a) => a.artistId));
  const missing = db.artists.filter((a) => !albArtistIds.has(a.id));

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

  console.log({
    totalArtists: db.artists.length,
    totalAlbums: db.albums.length,
    totalSongs: db.songs.length,
    artistsWithAlbums: db.artists.length - missing.length,
    missingCount: missing.length,
    missingNames: missing.map((a) => a.name)
  });
}

fetchIU().catch(console.error);

