import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Genre } from '@/lib/types';

export async function GET() {
  const genres = db.getGenres();
  const allSongs = db.getSongs().filter((s) => s.status === 'published');

  const genresWithCount = genres.map((g) => ({
    ...g,
    songCount: allSongs.filter((s) => s.genreId === g.id).length
  }));

  return NextResponse.json({ genres: genresWithCount });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, slug, color, accentColor, coverImage, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Genre name is required' }, { status: 400 });
    }

    const newGenre: Genre = {
      id: `genre-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      color: color || 'from-emerald-600 to-teal-900',
      accentColor: accentColor || '#10B981',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      description: description || ''
    };

    db.saveGenre(newGenre);

    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'Created Genre',
      details: `Added new category/genre "${newGenre.name}"`,
      targetType: 'genre',
      targetId: newGenre.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, genre: newGenre });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create genre' }, { status: 500 });
  }
}
