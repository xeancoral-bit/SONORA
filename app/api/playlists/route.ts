import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Playlist } from '@/lib/types';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  let playlists = db.getPlaylists();

  if (userId) {
    playlists = playlists.filter((p) => p.userId === userId || (p.isPublic && user?.id !== userId));
  } else if (!user) {
    playlists = playlists.filter((p) => p.isPublic);
  } else {
    playlists = playlists.filter((p) => p.userId === user.id || p.isPublic);
  }

  const allSongs = db.getSongs();
  const enhanced = playlists.map((p) => ({
    ...p,
    songCount: p.songIds.length,
    totalDuration: p.songIds.reduce((acc, sId) => {
      const s = allSongs.find((item) => item.id === sId);
      return acc + (s?.duration || 0);
    }, 0)
  }));

  return NextResponse.json({ playlists: enhanced });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please log in to create playlists' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, coverImage, isPublic, songIds } = body;

    if (!title) {
      return NextResponse.json({ error: 'Playlist name is required' }, { status: 400 });
    }

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title: title.trim(),
      description: description || '',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      userId: user.id,
      userName: user.name,
      isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      songIds: Array.isArray(songIds) ? songIds : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.savePlaylist(newPlaylist);

    return NextResponse.json({ success: true, playlist: newPlaylist });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create playlist' }, { status: 500 });
  }
}
