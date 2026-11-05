import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDb();
  const rawId = (await params).id;
  const id = decodeURIComponent(rawId).trim();
  let album = db.getAlbumById(id);
  if (!album) {
    const allAlbums = db.getAlbums();
    const idLower = id.toLowerCase();
    album = allAlbums.find(
      (a) => a.id.toLowerCase() === idLower || a.title.toLowerCase() === idLower
    );
    if (!album) {
      // Smart fallback for migrated live albums (e.g. album-speak-now-world-tour-live -> Speak Now)
      const cleanId = id.replace(/-(live|tour|world-tour|unplugged|in-concert).*/i, '');
      album = allAlbums.find((a) => a.id.includes(cleanId) || cleanId.includes(a.id));
    }
  }
  if (!album) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 });
  }

  const allSongs = db.getSongs();
  const seenSongIds = new Set<string>();
  const songs: any[] = [];

  (album.songIds || []).forEach((songId) => {
    const s = allSongs.find((item) => item.id === songId);
    if (s && !seenSongIds.has(s.id)) {
      seenSongIds.add(s.id);
      songs.push(s);
    }
  });

  allSongs.forEach((s) => {
    if (s.albumId === album.id && !seenSongIds.has(s.id)) {
      seenSongIds.add(s.id);
      songs.push(s);
    }
  });

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
  await initDb();
  const rawId = (await params).id;
  const id = decodeURIComponent(rawId).trim();
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  let album = db.getAlbumById(id);
  if (!album) {
    const allAlbums = db.getAlbums();
    const idLower = id.toLowerCase();
    album = allAlbums.find(
      (a) => a.id.toLowerCase() === idLower || a.title.toLowerCase() === idLower
    );
    if (!album) {
      // Smart fallback for migrated live albums (e.g. album-speak-now-world-tour-live -> Speak Now)
      const cleanId = id.replace(/-(live|tour|world-tour|unplugged|in-concert).*/i, '');
      album = allAlbums.find((a) => a.id.includes(cleanId) || cleanId.includes(a.id));
    }
  }
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
  await initDb();
  const rawId = (await params).id;
  const id = decodeURIComponent(rawId).trim();
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  let album = db.getAlbumById(id);
  if (!album) {
    const allAlbums = db.getAlbums();
    const idLower = id.toLowerCase();
    album = allAlbums.find(
      (a) => a.id.toLowerCase() === idLower || a.title.toLowerCase() === idLower
    );
    if (!album) {
      // Smart fallback for migrated live albums (e.g. album-speak-now-world-tour-live -> Speak Now)
      const cleanId = id.replace(/-(live|tour|world-tour|unplugged|in-concert).*/i, '');
      album = allAlbums.find((a) => a.id.includes(cleanId) || cleanId.includes(a.id));
    }
  }
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
