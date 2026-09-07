import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const album = db.getAlbumById(id);
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }

  const allSongs = db.getSongs();
  // Get songs in specific order of album.songIds
  const songs = album.songIds
    .map((songId) => allSongs.find((s) => s.id === songId))
    .filter(Boolean);

  const totalDuration = songs.reduce((acc, s) => acc + (s?.duration || 0), 0);

  return NextResponse.json({
    album,
    songs,
    totalDuration,
    songCount: songs.length
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const album = db.getAlbumById(id);
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = {
      ...album,
      ...body,
      id: album.id,
      updatedAt: new Date().toISOString()
    };

    db.saveAlbum(updated);

    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'Updated Album',
      details: `Modified album "${updated.title}"`,
      targetType: 'album',
      targetId: updated.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, album: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update album' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const album = db.getAlbumById(id);
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }

  db.deleteAlbum(id);

  db.addLog({
    id: `log-${Date.now()}`,
    adminId: user.id,
    adminName: user.name,
    action: 'Deleted Album',
    details: `Removed album "${album.title}"`,
    targetType: 'album',
    targetId: id,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ success: true, message: 'Album deleted' });
}
