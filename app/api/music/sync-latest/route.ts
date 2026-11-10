import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { Song, Album, Artist } from '@/lib/types';

function cleanStr(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*-\s*single/gi, '')
    .replace(/\s*\(deluxe[^)]*\)/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function mapGenre(rawGenre?: string): { id: string; name: string } {
  const lower = (rawGenre || '').toLowerCase();
  if (lower.includes('pop') || lower.includes('k-pop') || lower.includes('dance')) {
    return { id: 'genre-pop', name: 'Pop' };
  }
  if (lower.includes('rock') || lower.includes('alternative') || lower.includes('indie')) {
    return { id: 'genre-rock', name: 'Rock & Indie' };
  }
  if (lower.includes('hip-hop') || lower.includes('rap') || lower.includes('trap')) {
    return { id: 'genre-hiphop', name: 'Hip-Hop' };
  }
  if (lower.includes('r&b') || lower.includes('soul')) {
    return { id: 'genre-rnb', name: 'R&B & Soul' };
  }
  if (lower.includes('country')) {
    return { id: 'genre-country', name: 'Country' };
  }
  return { id: 'genre-pop', name: 'Pop' };
}

// Global & OPM watchlist for automated artist release scanning
const POPULAR_WATCHLIST = [
  'Bruno Mars',
  'Sabrina Carpenter',
  'BINI',
  'Billie Eilish',
  'Olivia Rodrigo',
  'The Weeknd',
  'Taylor Swift',
  'Lola Amour',
  'Arthur Nery',
  'SB19',
  'Dionela',
  'Maki',
  'Hev Abi',
  'SZA',
  'Lady Gaga',
  'Coldplay',
  'Chappell Roan',
  'Post Malone',
  'Ariana Grande',
  'Dua Lipa',
];

// Module-level cooldown and rotation memory
let lastAutoSyncTimestamp = 0;
let watchlistRotationIndex = 0;
const AUTO_SYNC_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes cooldown for auto background sync

async function syncArtistReleases(artistName: string, maxItems: number = 4): Promise<Song[]> {
  const existingSongs = db.getSongs();
  const existingArtists = db.getArtists();
  const existingAlbums = db.getAlbums();

  const queryUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&sort=recent&limit=15`;
  const res = await fetch(queryUrl, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) return [];

  const json = await res.json();
  const results: any[] = json.results || [];
  if (results.length === 0) return [];

  const added: Song[] = [];

  for (const item of results) {
    if (!item.trackName || !item.previewUrl) continue;

    const targetClean = cleanStr(item.trackName);
    const artistClean = cleanStr(item.artistName);

    // Deduplication check: title + artist
    const alreadyExists = existingSongs.some((s) => {
      const sTitleClean = cleanStr(s.title);
      const sArtistClean = cleanStr(s.artistName);
      return sTitleClean === targetClean && (sArtistClean.includes(artistClean) || artistClean.includes(sArtistClean));
    });

    if (alreadyExists) continue;

    const highResArtwork = item.artworkUrl100?.replace('100x100bb.jpg', '1000x1000bb.jpg') || '';
    const genreInfo = mapGenre(item.primaryGenreName);
    const releaseDateStr = item.releaseDate ? item.releaseDate.slice(0, 10) : new Date().toISOString().slice(0, 10);
    const releaseYearNum = item.releaseDate ? new Date(item.releaseDate).getFullYear() : new Date().getFullYear();

    // 1. Find or create Artist
    let matchedArtist = existingArtists.find((a) => cleanStr(a.name) === artistClean);
    const artistId = matchedArtist ? matchedArtist.id : `artist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    if (!matchedArtist) {
      const newArtist: Artist = {
        id: artistId,
        name: item.artistName,
        avatar: item.artworkUrl100?.replace('100x100bb.jpg', '600x600bb.jpg') || '',
        banner: highResArtwork,
        coverImage: highResArtwork,
        bio: `${item.artistName} is a featured artist on Sonora.`,
        genreId: genreInfo.id,
        genreName: genreInfo.name,
        monthlyListeners: 2500000,
        followersCount: 450000,
        isVerified: true,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.saveArtist(newArtist);
      matchedArtist = newArtist;
    }

    // 2. Find or create Album (Accurate Collection & Soundtrack mapping)
    const albumClean = cleanStr(item.collectionName || `${item.trackName} - Single`);
    const providerAlbumId = item.collectionId ? String(item.collectionId) : undefined;

    let matchedAlbum = existingAlbums.find((a) =>
      (providerAlbumId && a.providerAlbumId === providerAlbumId) ||
      (cleanStr(a.title) === albumClean && a.artistId === artistId)
    );
    const albumId = matchedAlbum ? matchedAlbum.id : `album-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    if (!matchedAlbum) {
      const newAlbum: Album = {
        id: albumId,
        title: item.collectionName || `${item.trackName} - Single`,
        artistId,
        artistName: item.artistName,
        coverImage: highResArtwork,
        genreId: genreInfo.id,
        genreName: genreInfo.name,
        releaseDate: releaseDateStr,
        releaseYear: releaseYearNum,
        recordLabel: item.copyright || `${item.artistName} Records`,
        providerAlbumId: providerAlbumId,
        totalTracks: item.trackCount || 1,
        tracksCount: item.trackCount || 1,
        status: 'published',
        isFeatured: true,
        songIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.saveAlbum(newAlbum);
      matchedAlbum = newAlbum;
    }

    // 3. Create the New Song (Accurate Soundtrack & Audio stream)
    const songId = `song-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    const synthMap: Record<string, 'pop' | 'rnb' | 'rock' | 'chill' | 'electronic'> = {
      'genre-pop': 'pop',
      'genre-rnb': 'rnb',
      'genre-rock': 'rock',
      'genre-hiphop': 'chill',
      'genre-country': 'chill',
    };
    const synthPreset = synthMap[genreInfo.id] || 'pop';

    const newSong: Song = {
      id: songId,
      title: item.trackName,
      artistId,
      artistName: item.artistName,
      albumId: matchedAlbum.id,
      albumTitle: matchedAlbum.title,
      coverImage: highResArtwork,
      genreId: genreInfo.id,
      genreName: genreInfo.name,
      duration: Math.round((item.trackTimeMillis || 180000) / 1000),
      releaseDate: releaseDateStr,
      audioUrl: item.previewUrl,
      sourcePlatform: 'direct',
      uploadType: 'url',
      sourceType: 'external_url',
      providerTrackId: String(item.trackId || ''),
      trackNumber: item.trackNumber || 1,
      discNumber: item.discNumber || 1,
      explicit: item.trackExplicitness === 'explicit',
      uploadedBy: 'system-sync',
      status: 'published',
      isFeatured: true,
      playCount: 1,
      likesCount: 0,
      copyrightOwner: item.artistName,
      tags: [genreInfo.name, item.artistName, 'latest-release', 'auto-uploaded'],
      synthPreset,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.saveSong(newSong);

    // Link song to album
    if (matchedAlbum && !matchedAlbum.songIds.includes(songId)) {
      matchedAlbum.songIds.push(songId);
      db.saveAlbum(matchedAlbum);
    }

    // Broadcast system notification
    db.addNotification({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: 'all',
      title: 'New Music Drop! 🎵',
      message: `"${newSong.title}" by ${newSong.artistName} is now live on Sonora!`,
      type: 'release',
      link: `/songs/${newSong.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    added.push(newSong);
    if (added.length >= maxItems) break;
  }

  return added;
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json().catch(() => ({}));
    const requestedArtist = (body.artistName || '').trim();
    const isAutoSync = Boolean(body.auto);
    const isForce = Boolean(body.force);

    // Check cooldown for automated background syncs
    if (isAutoSync && !isForce) {
      const now = Date.now();
      if (now - lastAutoSyncTimestamp < AUTO_SYNC_COOLDOWN_MS) {
        return NextResponse.json({
          success: true,
          cooldown: true,
          addedCount: 0,
          songs: [],
          message: 'System is up to date (cooldown active).',
        });
      }
    }

    let artistsToScan: string[] = [];

    if (requestedArtist) {
      artistsToScan = [requestedArtist];
    } else if (isAutoSync) {
      // Rotate through watchlist so all artists are constantly kept fresh
      const batchSize = 5;
      const start = watchlistRotationIndex % POPULAR_WATCHLIST.length;
      artistsToScan = POPULAR_WATCHLIST.slice(start, start + batchSize);
      if (artistsToScan.length < batchSize) {
        artistsToScan.push(...POPULAR_WATCHLIST.slice(0, batchSize - artistsToScan.length));
      }
      watchlistRotationIndex = (start + batchSize) % POPULAR_WATCHLIST.length;
      lastAutoSyncTimestamp = Date.now();
    } else {
      // Manual sync: scan top 6 watchlist artists
      artistsToScan = POPULAR_WATCHLIST.slice(0, 6);
      lastAutoSyncTimestamp = Date.now();
    }

    const newlyAddedSongs: Song[] = [];

    for (const artist of artistsToScan) {
      try {
        const added = await syncArtistReleases(artist, requestedArtist ? 8 : 2);
        newlyAddedSongs.push(...added);
      } catch (err) {
        console.warn(`Error syncing artist ${artist}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      scannedArtists: artistsToScan.length,
      addedCount: newlyAddedSongs.length,
      songs: newlyAddedSongs,
      message:
        newlyAddedSongs.length > 0
          ? `Successfully uploaded ${newlyAddedSongs.length} new releases to Sonora!`
          : 'All tracked artists are up-to-date with their latest releases.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync latest releases' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const artist = (searchParams.get('artist') || '').trim();

    const artistsToScan = artist ? [artist] : POPULAR_WATCHLIST.slice(0, 4);
    const newlyAddedSongs: Song[] = [];

    for (const a of artistsToScan) {
      try {
        const added = await syncArtistReleases(a, 2);
        newlyAddedSongs.push(...added);
      } catch {}
    }

    return NextResponse.json({
      success: true,
      scannedArtists: artistsToScan.length,
      addedCount: newlyAddedSongs.length,
      songs: newlyAddedSongs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
