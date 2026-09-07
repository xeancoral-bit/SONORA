import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const playlist = db.getPlaylistById(id);
  if (!playlist) {
    return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!playlist.isPublic && (!user || (user.id !== playlist.userId && user.role !== 'admin'))) {
    return NextResponse.json({ error: 'This playlist is private' }, { status: 403 });
  }

  const allSongs = db.getSongs();
  const songs = playlist.songIds
    .map((sId) => allSongs.find((s) => s.id === sId))
    .filter(Boolean);

  const totalDuration = songs.reduce((acc, s) => acc + (s?.duration || 0), 0);

  return NextResponse.json({
    playlist,
    songs,
    totalDuration,
    songCount: songs.length,
    isOwner: user?.id === playlist.userId
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const playlist = db.getPlaylistById(id);
  if (!playlist) {
    return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  }

  if (playlist.userId !== user.id && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = {
      ...playlist,
      ...body,
      id: playlist.id,
      userId: playlist.userId,
      updatedAt: new Date().toISOString()
    };

    db.savePlaylist(updated);
    return NextResponse.json({ success: true, playlist: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update playlist' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const playlist = db.getPlaylistById(id);
  if (!playlist) {
    return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  }

  if (playlist.userId !== user.id && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  db.deletePlaylist(id);
  return NextResponse.json({ success: true, message: 'Playlist deleted' });
}
