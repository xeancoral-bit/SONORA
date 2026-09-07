import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Song, Artist, SyncedLyricLine } from '@/lib/types';
import { autoGenerateSyncedLyrics, getSyncedLyricsForSong, SUPPORTED_LYRIC_LANGUAGES } from '@/lib/lyricsService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get('artistId');
  const albumId = searchParams.get('albumId');
  const genreId = searchParams.get('genreId');
  const status = searchParams.get('status');
  const isFeatured = searchParams.get('featured');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const sort = searchParams.get('sort') || 'latest'; // 'latest', 'plays', 'title'

  let songs = db.getSongs();

  if (artistId) {
    songs = songs.filter((s) => s.artistId === artistId);
  }
  if (albumId) {
    songs = songs.filter((s) => s.albumId === albumId);
  }
  if (genreId) {
    songs = songs.filter((s) => s.genreId === genreId);
  }
  if (status) {
    songs = songs.filter((s) => s.status === status);
  } else {
    // Regular browse defaults to published
    const user = await getCurrentUser();
    if (user?.role !== 'admin') {
      songs = songs.filter((s) => s.status === 'published');
    }
  }
  if (isFeatured === 'true') {
    songs = songs.filter((s) => s.isFeatured);
  }

  if (sort === 'plays') {
    songs.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
  } else if (sort === 'title') {
    songs.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // latest
    songs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return NextResponse.json({ songs: songs.slice(0, limit) });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin permission required to upload official music' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      title,
      artistId,
      artistName,
      albumId,
      albumTitle,
      genreId,
      genreName,
      duration,
      releaseDate,
      description,
      lyrics,
      syncedLyrics,
      explicit,
      status,
      uploadType,
      audioPath,
      audioUrl,
      originalFilename,
      coverImage,
      copyrightOwner,
      source,
      tags,
      isFeatured,
      synthPreset
    } = body;

    if (!title || (!artistId && !artistName) || !genreId) {
      return NextResponse.json({ error: 'Song title, artist, and genre are required' }, { status: 400 });
    }

    const genre = db.getGenreById(genreId);
    const resolvedGenreId = genre?.id || genreId;
    const resolvedGenreName = genre?.name || genreName || 'Pop';

    let artist = artistId ? db.getArtistById(artistId) : null;
    if (!artist && artistName) {
      const allArtists = db.getArtists();
      artist = allArtists.find((a) => a.name.toLowerCase() === artistName.trim().toLowerCase());
    }

    if (!artist && artistName) {
      const newArtist: Artist = {
        id: artistId && !artistId.startsWith('artist-custom-') ? artistId : `artist-${Date.now()}`,
        name: artistName.trim(),
        avatar: coverImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        banner: coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
        bio: `${artistName.trim()} is an official artist on SONORA.`,
        country: 'Global',
        genreId: resolvedGenreId,
        genreName: resolvedGenreName,
        monthlyListeners: 35000,
        followersCount: 1200,
        isVerified: true,
        isFeatured: Boolean(isFeatured),
        socialLinks: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.saveArtist(newArtist);
      artist = newArtist;
    } else if (artist && !artist.genreId) {
      artist.genreId = resolvedGenreId;
      artist.genreName = resolvedGenreName;
      db.saveArtist(artist);
    }

    const resolvedArtistId = artist ? artist.id : (artistId || `artist-${Date.now()}`);
    const resolvedArtistName = artist ? artist.name : (artistName || 'Unknown Artist');

    const newSong: Song = {
      id: `song-${Date.now()}`,
      title: title.trim(),
      originalFilename: originalFilename || `${title.toLowerCase().replace(/\s+/g, '_')}.mp3`,
      audioPath: audioPath || undefined,
      audioUrl: audioUrl || undefined,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      artistId: resolvedArtistId,
      artistName: resolvedArtistName,
      albumId: albumId || undefined,
      albumTitle: albumTitle || undefined,
      genreId: resolvedGenreId,
      genreName: resolvedGenreName,
      duration: duration || 180,
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      description: description || '',
      lyrics: lyrics || '',
      syncedLyrics: (syncedLyrics && syncedLyrics.length > 0)
        ? syncedLyrics
        : autoGenerateSyncedLyrics(lyrics, duration || 180),
      multilingualLyrics: (() => {
        const base = (syncedLyrics && syncedLyrics.length > 0)
          ? syncedLyrics
          : autoGenerateSyncedLyrics(lyrics, duration || 180);
        const map: Record<string, SyncedLyricLine[]> = { en: base };
        SUPPORTED_LYRIC_LANGUAGES.forEach((l) => {
          if (l.code !== 'en') {
            map[l.code] = getSyncedLyricsForSong({ id: 'temp', duration: duration || 180, syncedLyrics: base } as any, l.code);
          }
        });
        return map;
      })(),
      explicit: Boolean(explicit),
      status: status || 'published',
      playCount: 0,
      likesCount: 0,
      uploadedBy: user.id,
      uploadType: uploadType || 'file',
      copyrightOwner: copyrightOwner || `${artist?.name || 'Artist'} / Sonora Records`,
      source: source || 'Direct Upload',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [],
      isFeatured: Boolean(isFeatured),
      synthPreset: synthPreset || 'chill',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.saveSong(newSong);

    // If album was specified, add song to album
    if (albumId) {
      const album = db.getAlbumById(albumId);
      if (album && !album.songIds.includes(newSong.id)) {
        album.songIds.push(newSong.id);
        db.saveAlbum(album);
      }
    }

    // Log admin activity
    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'Uploaded Song',
      details: `Added new song "${newSong.title}" by ${newSong.artistName} (${newSong.uploadType})`,
      targetType: 'song',
      targetId: newSong.id,
      createdAt: new Date().toISOString()
    });

    // Send notification to users
    db.addNotification({
      id: `notif-${Date.now()}`,
      userId: 'all',
      title: 'New Track Released',
      message: `"${newSong.title}" by ${newSong.artistName} is now available on SONORA!`,
      type: 'release',
      link: `/songs/${newSong.id}`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, song: newSong });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create song' }, { status: 500 });
  }
}
