-- ====================================================================
-- SONORA MUSIC STREAMING & MANAGEMENT SYSTEM
-- SUPABASE POSTGRESQL COMPLETE DATABASE SCHEMA
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ARTISTS TABLE
CREATE TABLE IF NOT EXISTS public.artists (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    header_image_url TEXT,
    monthly_listeners INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    genres TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ALBUMS TABLE
CREATE TABLE IF NOT EXISTS public.albums (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    artist_id TEXT REFERENCES public.artists(id) ON DELETE SET NULL,
    artist_name TEXT NOT NULL,
    cover_url TEXT,
    release_year INTEGER,
    genres TEXT[] DEFAULT '{}',
    description TEXT,
    track_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GENRES TABLE
CREATE TABLE IF NOT EXISTS public.genres (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_url TEXT,
    color TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SONGS TABLE
CREATE TABLE IF NOT EXISTS public.songs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    artist_id TEXT REFERENCES public.artists(id) ON DELETE SET NULL,
    artist_name TEXT NOT NULL,
    album_id TEXT REFERENCES public.albums(id) ON DELETE SET NULL,
    album_title TEXT,
    duration INTEGER NOT NULL DEFAULT 0,
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    genre TEXT,
    plays_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    release_date DATE DEFAULT CURRENT_DATE,
    is_explicit BOOLEAN DEFAULT FALSE,
    lyrics TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    source_type TEXT DEFAULT 'audio_file' CHECK (source_type IN ('audio_file', 'media_url')),
    source_platform TEXT DEFAULT 'custom',
    external_media_id TEXT,
    external_url TEXT,
    embed_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PLAYLISTS TABLE
CREATE TABLE IF NOT EXISTS public.playlists (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    user_id TEXT NOT NULL,
    user_name TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    song_ids TEXT[] DEFAULT '{}',
    tracks_count INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PLAYLIST SONGS TABLE (Join table for ordered playlist tracks)
CREATE TABLE IF NOT EXISTS public.playlist_songs (
    id BIGSERIAL PRIMARY KEY,
    playlist_id TEXT NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    song_id TEXT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(playlist_id, song_id)
);

-- 8. USER COLLECTIONS / PERSONAL ALBUMS
CREATE TABLE IF NOT EXISTS public.user_collections (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    type TEXT DEFAULT 'album' CHECK (type IN ('album', 'collection', 'favorites')),
    song_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. LIKED SONGS
CREATE TABLE IF NOT EXISTS public.liked_songs (
    user_id TEXT NOT NULL,
    song_id TEXT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    liked_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, song_id)
);

-- 10. LISTENING HISTORY
CREATE TABLE IF NOT EXISTS public.listening_history (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    song_id TEXT NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    played_at TIMESTAMPTZ DEFAULT NOW(),
    completion_rate NUMERIC DEFAULT 1.0
);

-- 11. FOLLOWED ARTISTS
CREATE TABLE IF NOT EXISTS public.followed_artists (
    user_id TEXT NOT NULL,
    artist_id TEXT NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    followed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, artist_id)
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    admin_id TEXT NOT NULL,
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_songs_artist ON public.songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_album ON public.songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON public.songs(genre);
CREATE INDEX IF NOT EXISTS idx_songs_status ON public.songs(status);
CREATE INDEX IF NOT EXISTS idx_songs_plays ON public.songs(plays_count DESC);
CREATE INDEX IF NOT EXISTS idx_albums_artist ON public.albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_user ON public.liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_history_user_played ON public.listening_history(user_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS across all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followed_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 1. SONGS: Public can read published songs, authenticated users can read all
DROP POLICY IF EXISTS "Public can view published songs" ON public.songs;
CREATE POLICY "Public can view published songs"
ON public.songs FOR SELECT
USING (status = 'published' OR (auth.jwt() ->> 'role') = 'admin');

-- 2. ARTISTS: Public read
DROP POLICY IF EXISTS "Public can view artists" ON public.artists;
CREATE POLICY "Public can view artists"
ON public.artists FOR SELECT
USING (true);

-- 3. ALBUMS: Public read
DROP POLICY IF EXISTS "Public can view albums" ON public.albums;
CREATE POLICY "Public can view albums"
ON public.albums FOR SELECT
USING (true);

-- 4. GENRES: Public read
DROP POLICY IF EXISTS "Public can view genres" ON public.genres;
CREATE POLICY "Public can view genres"
ON public.genres FOR SELECT
USING (true);

-- 5. PLAYLISTS: Public playlists can be viewed by anyone, private by owner
DROP POLICY IF EXISTS "View playlists" ON public.playlists;
CREATE POLICY "View playlists"
ON public.playlists FOR SELECT
USING (is_public = true OR user_id = (auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Manage own playlists" ON public.playlists;
CREATE POLICY "Manage own playlists"
ON public.playlists FOR ALL
USING (user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- 6. LIKED SONGS: Users can only see and manage their own liked songs
DROP POLICY IF EXISTS "User liked songs access" ON public.liked_songs;
CREATE POLICY "User liked songs access"
ON public.liked_songs FOR ALL
USING (user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- 7. LISTENING HISTORY: Users can only see their own history
DROP POLICY IF EXISTS "User history access" ON public.listening_history;
CREATE POLICY "User history access"
ON public.listening_history FOR ALL
USING (user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (user_id = (auth.jwt() ->> 'sub'));

-- 8. NOTIFICATIONS: Users can only view their own notifications
DROP POLICY IF EXISTS "User notifications access" ON public.notifications;
CREATE POLICY "User notifications access"
ON public.notifications FOR ALL
USING (user_id = (auth.jwt() ->> 'sub'))
WITH CHECK (user_id = (auth.jwt() ->> 'sub'));
