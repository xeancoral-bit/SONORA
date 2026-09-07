import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { UserCollection } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ collections: [] });
  }

  const collections = db.getUserCollections(user.id);
  const allSongs = db.getSongs();

  const enhanced = collections.map((c) => ({
    ...c,
    songCount: c.songIds.length,
    totalDuration: c.songIds.reduce((acc, sId) => {
      const s = allSongs.find((item) => item.id === sId);
      return acc + (s?.duration || 0);
    }, 0)
  }));

  return NextResponse.json({ collections: enhanced });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please log in to create personal collections' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, coverImage, songIds } = body;

    if (!title) {
      return NextResponse.json({ error: 'Collection title is required' }, { status: 400 });
    }

    const newCollection: UserCollection = {
      id: `collection-${Date.now()}`,
      title: title.trim(),
      description: description || '',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
      userId: user.id,
      userName: user.name,
      songIds: Array.isArray(songIds) ? songIds : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.saveCollection(newCollection);
    return NextResponse.json({ success: true, collection: newCollection });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create collection' }, { status: 500 });
  }
}
