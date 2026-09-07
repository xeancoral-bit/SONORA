import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string; // 'audio' or 'cover'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Role check: Only admin can upload audio files
    if (type === 'audio' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Only administrators can upload audio to the official library' }, { status: 403 });
    }

    // Validate mime types
    const validAudioMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/aac', 'audio/m4a', 'audio/x-m4a', 'audio/mp4'];
    const validImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (type === 'audio' && !validAudioMimes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|aac)$/i)) {
      return NextResponse.json({ error: 'Music file could not be uploaded. Please check the format (MP3, WAV, M4A, AAC) and try again.' }, { status: 400 });
    }

    if (type === 'cover' && !validImageMimes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      return NextResponse.json({ error: 'Invalid image format. Supported formats: JPG, PNG, WEBP, GIF.' }, { status: 400 });
    }

    // Size limit: 50MB for audio, 10MB for images
    const maxSizeBytes = type === 'audio' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: `File size exceeds the allowed limit (${type === 'audio' ? '50MB' : '10MB'})` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || (type === 'audio' ? '.mp3' : '.jpg');
    const safeFilename = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type === 'audio' ? 'audio' : 'covers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${type === 'audio' ? 'audio' : 'covers'}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      originalName: file.name,
      size: file.size
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
