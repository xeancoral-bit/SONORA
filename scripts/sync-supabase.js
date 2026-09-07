/**
 * SONORA Supabase Data Synchronization Script
 * 
 * Usage:
 *   node scripts/sync-supabase.js
 * 
 * Reads the local Sonora database and pushes records to your connected Supabase project.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...values] = trimmed.split('=');
    if (key && values.length) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSync() {
  console.log('🎵 Connecting to Supabase project at:', supabaseUrl);

  const dbFile = path.join(__dirname, '..', 'data', 'sonora.json');
  if (!fs.existsSync(dbFile)) {
    console.log('ℹ️  No data/sonora.json file found yet. Creating defaults or nothing to sync.');
    return;
  }

  let dbData;
  try {
    dbData = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch (err) {
    console.error('❌ Failed to parse data/sonora.json:', err);
    return;
  }

  console.log(`📦 Found ${dbData.songs?.length || 0} songs, ${dbData.artists?.length || 0} artists, ${dbData.albums?.length || 0} albums in local database.`);

  // 1. Sync Artists
  if (dbData.artists?.length) {
    console.log('⏳ Syncing artists...');
    const artistRows = dbData.artists.map(a => ({
      id: a.id,
      name: a.name,
      bio: a.bio || '',
      image_url: a.imageUrl || a.image_url || '',
      header_image_url: a.headerImageUrl || a.header_image_url || '',
      monthly_listeners: a.monthlyListeners || a.monthly_listeners || 0,
      verified: a.verified || false,
      genres: a.genres || []
    }));
    const { error } = await supabase.from('artists').upsert(artistRows, { onConflict: 'id' });
    if (error) {
      console.warn('⚠️ Artists sync note:', error.message);
    } else {
      console.log('✅ Artists synced successfully!');
    }
  }

  // 2. Sync Albums
  if (dbData.albums?.length) {
    console.log('⏳ Syncing albums...');
    const albumRows = dbData.albums.map(a => ({
      id: a.id,
      title: a.title,
      artist_id: a.artistId || a.artist_id,
      artist_name: a.artistName || a.artist_name || '',
      cover_url: a.coverUrl || a.cover_url || '',
      release_year: a.releaseYear || a.release_year || new Date().getFullYear(),
      genres: a.genres || [],
      description: a.description || '',
      track_count: a.trackCount || a.track_count || 0
    }));
    const { error } = await supabase.from('albums').upsert(albumRows, { onConflict: 'id' });
    if (error) {
      console.warn('⚠️ Albums sync note:', error.message);
    } else {
      console.log('✅ Albums synced successfully!');
    }
  }

  // 3. Sync Songs
  if (dbData.songs?.length) {
    console.log('⏳ Syncing songs...');
    const songRows = dbData.songs.map(s => ({
      id: s.id,
      title: s.title,
      artist_id: s.artistId || s.artist_id || null,
      artist_name: s.artistName || s.artist_name || 'Unknown Artist',
      album_id: s.albumId || s.album_id || null,
      album_title: s.albumTitle || s.album_title || null,
      duration: s.duration || 0,
      audio_url: s.audioUrl || s.audio_url || '',
      cover_url: s.coverUrl || s.cover_url || '',
      genre: s.genre || 'Various',
      plays_count: s.playsCount || s.plays_count || 0,
      likes_count: s.likesCount || s.likes_count || 0,
      status: s.status || 'published',
      source_type: s.sourceType || s.source_type || 'audio_file',
      source_platform: s.sourcePlatform || s.source_platform || 'custom',
      external_media_id: s.externalMediaId || s.external_media_id || null,
      external_url: s.externalUrl || s.external_url || null,
      embed_url: s.embedUrl || s.embed_url || null
    }));
    const { error } = await supabase.from('songs').upsert(songRows, { onConflict: 'id' });
    if (error) {
      console.warn('⚠️ Songs sync note:', error.message);
    } else {
      console.log('✅ Songs synced successfully!');
    }
  }

  console.log('🎉 Sync execution completed.');
}

runSync().catch(err => console.error('Unexpected sync error:', err));
