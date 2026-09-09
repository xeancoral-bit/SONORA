import fs from 'fs';
import path from 'path';
import {
  User,
  Song,
  Album,
  Artist,
  Genre,
  Playlist,
  UserCollection,
  LikedSong,
  ListeningHistory,
  NotificationItem,
  AdminActivityLog,
  SystemSettings,
  SupportConversation,
  SupportMessage,
  SupportRequest,
  AdminOnlineStatus,
  SupportCategory,
  ConversationStatus
} from './types';
import {
  initialUsers,
  initialSongs,
  initialAlbums,
  initialArtists,
  initialGenres,
  initialPlaylists,
  initialCollections,
  initialLikedSongs,
  initialHistory,
  initialFollowedArtists,
  initialNotifications,
  initialLogs,
  initialSettings
} from './seedData';

interface DatabaseSchema {
  users: User[];
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  genres: Genre[];
  playlists: Playlist[];
  collections: UserCollection[];
  likedSongs: LikedSong[];
  history: ListeningHistory[];
  followedArtists: { userId: string; artistId: string }[];
  notifications: NotificationItem[];
  logs: AdminActivityLog[];
  settings: SystemSettings;
  conversations?: SupportConversation[];
  supportMessages?: SupportMessage[];
  supportRequests?: SupportRequest[];
  adminStatus?: AdminOnlineStatus;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'sonora.json');
const USE_SUPABASE = process.env.USE_SUPABASE_DB === 'true' || process.env.NODE_ENV === 'production';

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function getInitialData(): DatabaseSchema {
  return {
    users: initialUsers,
    songs: initialSongs,
    albums: initialAlbums,
    artists: initialArtists,
    genres: initialGenres,
    playlists: initialPlaylists,
    collections: initialCollections,
    likedSongs: initialLikedSongs,
    history: initialHistory,
    followedArtists: initialFollowedArtists,
    notifications: initialNotifications,
    logs: initialLogs,
    settings: initialSettings,
    conversations: [],
    supportMessages: [],
    supportRequests: [],
    adminStatus: {
      isOnline: true,
      lastSeen: new Date().toISOString()
    }
  };
}

let dbMemoryCache: DatabaseSchema | null = null;

function syncMissingArtists(data: DatabaseSchema): boolean {
  let changed = false;
  if (!data.artists) data.artists = [];
  const artistMap = new Map<string, Artist>();
  data.artists.forEach((a) => {
    artistMap.set(a.id, a);
    artistMap.set(a.name.toLowerCase(), a);
  });

  for (const song of data.songs || []) {
    if (!song.artistName) continue;
    const nameKey = song.artistName.trim().toLowerCase();
    let matchedArtist = song.artistId ? artistMap.get(song.artistId) : null;
    if (!matchedArtist) {
      matchedArtist = artistMap.get(nameKey) || null;
    }

    if (!matchedArtist) {
      // Auto-create artist for this song
      const newArtist: Artist = {
        id: song.artistId || `artist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: song.artistName.trim(),
        avatar: song.coverImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        banner: song.coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
        bio: `${song.artistName.trim()} is an official artist on SONORA.`,
        country: 'Global',
        genreId: song.genreId || undefined,
        genreName: song.genreName || undefined,
        monthlyListeners: 42000,
        followersCount: 1500,
        isVerified: true,
        isFeatured: song.isFeatured || false,
        socialLinks: {},
        createdAt: song.createdAt || new Date().toISOString(),
        updatedAt: song.updatedAt || new Date().toISOString()
      };
      data.artists.push(newArtist);
      artistMap.set(newArtist.id, newArtist);
      artistMap.set(nameKey, newArtist);
      song.artistId = newArtist.id;
      changed = true;
    } else if (song.artistId !== matchedArtist.id) {
      song.artistId = matchedArtist.id;
      changed = true;
    }
  }
  return changed;
}

const INVALID_ALBUM_TITLES = new Set([
  'unnamed album',
  'unknown album',
  'unknown',
  'null',
  'undefined',
  'placeholder',
  'none',
  'single'
]);

export function isInvalidAlbumTitle(title: string | null | undefined): boolean {
  if (!title || typeof title !== 'string') return true;
  const trimmed = title.trim();
  if (!trimmed) return true;
  return INVALID_ALBUM_TITLES.has(trimmed.toLowerCase());
}

function syncMissingAlbums(data: DatabaseSchema): boolean {
  let changed = false;
  if (!data.albums) data.albums = [];

  // Filter out any invalid / empty / placeholder albums
  const beforeCount = data.albums.length;
  data.albums = data.albums.filter((a) => a && !isInvalidAlbumTitle(a.title));
  if (data.albums.length !== beforeCount) {
    changed = true;
  }

  const albumIdMap = new Map<string, Album>();
  const albumTitleMap = new Map<string, Album>();
  const artistTitleMap = new Map<string, Album>();

  data.albums.forEach((a) => {
    a.title = a.title.trim();
    albumIdMap.set(a.id, a);
    const tLower = a.title.toLowerCase();
    albumTitleMap.set(tLower, a);
    const aLower = (a.artistName || '').trim().toLowerCase();
    if (aLower) {
      artistTitleMap.set(`${aLower}::${tLower}`, a);
    }
  });

  for (const song of data.songs || []) {
    const rawTitle = song.albumTitle;
    const cleanAlbumTitle = typeof rawTitle === 'string' ? rawTitle.trim() : '';
    const cleanAlbumId = typeof song.albumId === 'string' ? song.albumId.trim() : '';

    if (isInvalidAlbumTitle(cleanAlbumTitle)) {
      // If the song has an albumId that does not map to a valid album, clear it so it's a standalone single
      if (cleanAlbumId && !albumIdMap.has(cleanAlbumId)) {
        song.albumId = undefined;
        song.albumTitle = undefined;
        changed = true;
      }
      continue;
    }

    const tLower = cleanAlbumTitle.toLowerCase();
    const aLower = (song.artistName || '').trim().toLowerCase();
    const artistTitleKey = `${aLower}::${tLower}`;

    let matched =
      (aLower ? artistTitleMap.get(artistTitleKey) : null) ||
      (cleanAlbumId ? albumIdMap.get(cleanAlbumId) : null) ||
      albumTitleMap.get(tLower) ||
      null;

    if (matched) {
      if (song.albumId !== matched.id || song.albumTitle !== matched.title) {
        song.albumId = matched.id;
        song.albumTitle = matched.title;
        changed = true;
      }
      if (!matched.songIds.includes(song.id)) {
        matched.songIds.push(song.id);
        changed = true;
      }
    } else {
      // Auto-create album for this song and any others sharing this title
      const newAlbum: Album = {
        id: cleanAlbumId && !cleanAlbumId.startsWith('album-custom-')
          ? cleanAlbumId
          : `album-${cleanAlbumTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Date.now()}`,
        title: cleanAlbumTitle,
        artistId: song.artistId || 'artist-unknown',
        artistName: song.artistName || 'Unknown Artist',
        coverImage: song.coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        description: `${cleanAlbumTitle} by ${song.artistName || 'Unknown Artist'}.`,
        genreId: song.genreId || 'genre-pop',
        genreName: song.genreName || 'Pop',
        releaseDate: song.releaseDate || new Date().toISOString().split('T')[0],
        copyrightInfo: song.copyrightOwner || `© ${new Date().getFullYear()} ${song.artistName || 'Artist'}`,
        status: 'published',
        isFeatured: Boolean(song.isFeatured),
        songIds: [song.id],
        createdAt: song.createdAt || new Date().toISOString(),
        updatedAt: song.updatedAt || new Date().toISOString()
      };
      data.albums.push(newAlbum);
      albumIdMap.set(newAlbum.id, newAlbum);
      albumTitleMap.set(tLower, newAlbum);
      if (aLower) artistTitleMap.set(artistTitleKey, newAlbum);
      song.albumId = newAlbum.id;
      song.albumTitle = newAlbum.title;
      changed = true;
    }
  }

  return changed;
}

export function readDb(): DatabaseSchema {
  if (dbMemoryCache) return dbMemoryCache;
  // Synchronous fallback for local dev / first access before initDb()
  try {
    ensureDirectoryExistence(DB_FILE);
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      syncMissingArtists(initial);
      syncMissingAlbums(initial);
      if (!USE_SUPABASE) {
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      }
      dbMemoryCache = initial;
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data) as DatabaseSchema;
    if (!parsed.conversations) parsed.conversations = [];
    if (!parsed.supportMessages) parsed.supportMessages = [];
    if (!parsed.supportRequests) parsed.supportRequests = [];
    if (!parsed.adminStatus) {
      parsed.adminStatus = { isOnline: true, lastSeen: new Date().toISOString() };
    }
    syncMissingArtists(parsed);
    syncMissingAlbums(parsed);
    dbMemoryCache = parsed;
    return parsed;
  } catch (error) {
    console.error('Error reading database file, using fallback in-memory store:', error);
    if (!dbMemoryCache) {
      dbMemoryCache = getInitialData();
    }
    return dbMemoryCache;
  }
}

// --- Supabase-backed persistence ---

let _dbInitPromise: Promise<void> | null = null;

/**
 * initDb() MUST be called at the top of every API route handler.
 * On a serverless cold start it fetches data from Supabase; subsequent
 * calls within the same container lifetime are instant (memory cache hit).
 */
export async function initDb(): Promise<void> {
  if (dbMemoryCache) return; // already loaded
  if (_dbInitPromise) return _dbInitPromise; // another request is initializing

  _dbInitPromise = (async () => {
    if (!USE_SUPABASE) {
      // Local development: read from JSON file
      readDb();
      return;
    }

    try {
      const { createAdminClient } = await import('./supabase/admin');
      const supabase = createAdminClient();

      // Ensure the table exists (idempotent DDL)
      try {
        await supabase.rpc('exec_sql_void', {
          sql: `CREATE TABLE IF NOT EXISTS app_state (
            id SMALLINT PRIMARY KEY DEFAULT 1,
            payload JSONB NOT NULL,
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT single_row CHECK (id = 1)
          );`
        });
      } catch {
        // ignore if rpc doesn't exist yet
      }

      const { data, error } = await supabase
        .from('app_state')
        .select('payload')
        .eq('id', 1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('[initDb] Supabase read error:', error.message);
      }

      if (data?.payload) {
        const parsed = data.payload as DatabaseSchema;
        if (!parsed.conversations) parsed.conversations = [];
        if (!parsed.supportMessages) parsed.supportMessages = [];
        if (!parsed.supportRequests) parsed.supportRequests = [];
        if (!parsed.adminStatus) {
          parsed.adminStatus = { isOnline: true, lastSeen: new Date().toISOString() };
        }
        syncMissingArtists(parsed);
        syncMissingAlbums(parsed);
        dbMemoryCache = parsed;
        console.log('[initDb] Loaded database from Supabase app_state.');
      } else {
        // First boot: seed Supabase with initial data
        console.log('[initDb] No app_state row found. Seeding Supabase with initial data...');
        const initial = getInitialData();
        syncMissingArtists(initial);
        syncMissingAlbums(initial);
        await supabase
          .from('app_state')
          .upsert({ id: 1, payload: initial, updated_at: new Date().toISOString() });
        dbMemoryCache = initial;
        console.log('[initDb] Supabase seeded successfully.');
      }
    } catch (err) {
      console.error('[initDb] Failed to load from Supabase, using in-memory fallback:', err);
      if (!dbMemoryCache) dbMemoryCache = getInitialData();
    } finally {
      _dbInitPromise = null;
    }
  })();

  return _dbInitPromise;
}

export function writeDb(data: DatabaseSchema): void {
  // Always update the in-memory cache immediately (synchronous reads still work)
  dbMemoryCache = data;

  if (USE_SUPABASE) {
    // Fire-and-forget async persistence to Supabase
    import('./supabase/admin')
      .then(({ createAdminClient }) => {
        const supabase = createAdminClient();
        return supabase
          .from('app_state')
          .upsert({ id: 1, payload: data, updated_at: new Date().toISOString() });
      })
      .then(({ error }) => {
        if (error) console.error('[writeDb] Supabase write error:', error.message);
      })
      .catch((err) => console.error('[writeDb] Failed to persist to Supabase:', err));
  } else {
    // Local development: write to JSON file
    try {
      ensureDirectoryExistence(DB_FILE);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing database file:', error);
    }
  }
}

// Database helper functions
export const db = {
  // Songs
  getSongs: () => readDb().songs,
  getSongById: (id: string) => readDb().songs.find((s) => s.id === id),
  saveSong: (song: Song) => {
    const data = readDb();
    const index = data.songs.findIndex((s) => s.id === song.id);
    if (index >= 0) {
      data.songs[index] = { ...song, updatedAt: new Date().toISOString() };
    } else {
      data.songs.unshift(song);
    }
    writeDb(data);
    return song;
  },
  deleteSong: (id: string) => {
    const data = readDb();
    data.songs = data.songs.filter((s) => s.id !== id);
    // Also remove from albums, playlists, collections, liked songs
    data.albums = data.albums.map((a) => ({
      ...a,
      songIds: a.songIds.filter((sId) => sId !== id)
    }));
    data.playlists = data.playlists.map((p) => ({
      ...p,
      songIds: p.songIds.filter((sId) => sId !== id)
    }));
    data.collections = data.collections.map((c) => ({
      ...c,
      songIds: c.songIds.filter((sId) => sId !== id)
    }));
    data.likedSongs = data.likedSongs.filter((ls) => ls.songId !== id);
    writeDb(data);
  },
  incrementPlayCount: (songId: string, userId?: string) => {
    const data = readDb();
    const song = data.songs.find((s) => s.id === songId);
    if (song) {
      song.playCount = (song.playCount || 0) + 1;
      if (userId) {
        // Record listening history (avoid immediate duplicate within 30s)
        const recent = data.history.find(
          (h) =>
            h.userId === userId &&
            h.songId === songId &&
            Date.now() - new Date(h.playedAt).getTime() < 30000
        );
        if (!recent) {
          data.history.unshift({
            id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            userId,
            songId,
            playedAt: new Date().toISOString()
          });
          // keep last 500 history entries
          if (data.history.length > 500) {
            data.history = data.history.slice(0, 500);
          }
        }
      }
      writeDb(data);
    }
  },

  // Albums
  getAlbums: () => {
    const albums = readDb().albums || [];
    return albums.filter((a) => a && !isInvalidAlbumTitle(a.title));
  },
  getAlbumById: (id: string) => readDb().albums.find((a) => a.id === id),
  saveAlbum: (album: Album) => {
    if (!album || isInvalidAlbumTitle(album.title)) {
      return album;
    }
    const cleanTitle = album.title.trim();
    const data = readDb();
    const index = data.albums.findIndex((a) => a.id === album.id);
    const updatedAlbum: Album = { ...album, title: cleanTitle };
    if (index >= 0) {
      data.albums[index] = { ...updatedAlbum, updatedAt: new Date().toISOString() };
    } else {
      data.albums.unshift(updatedAlbum);
    }
    // Update songs associated with this album
    data.songs = data.songs.map((s) => {
      if (album.songIds.includes(s.id)) {
        return { ...s, albumId: album.id, albumTitle: cleanTitle };
      }
      if (s.albumId === album.id && !album.songIds.includes(s.id)) {
        return { ...s, albumId: undefined, albumTitle: undefined };
      }
      return s;
    });
    writeDb(data);
    return updatedAlbum;
  },
  deleteAlbum: (id: string) => {
    const data = readDb();
    data.albums = data.albums.filter((a) => a.id !== id);
    // Unlink songs from this album
    data.songs = data.songs.map((s) => (s.albumId === id ? { ...s, albumId: undefined, albumTitle: undefined } : s));
    writeDb(data);
  },

  // Artists
  getArtists: () => readDb().artists,
  getArtistById: (id: string) => {
    if (!id) return undefined;
    const artists = readDb().artists;
    const direct = artists.find((a) => a.id === id);
    if (direct) return direct;
    const decoded = decodeURIComponent(id).trim().toLowerCase();
    return artists.find(
      (a) => a.id.toLowerCase() === decoded || a.name.toLowerCase() === decoded
    );
  },
  saveArtist: (artist: Artist) => {
    const data = readDb();
    const index = data.artists.findIndex((a) => a.id === artist.id || a.name.toLowerCase() === artist.name.toLowerCase());
    if (index >= 0) {
      data.artists[index] = { ...data.artists[index], ...artist, updatedAt: new Date().toISOString() };
      writeDb(data);
      return data.artists[index];
    } else {
      data.artists.unshift(artist);
      writeDb(data);
      return artist;
    }
  },
  deleteArtist: (id: string) => {
    const data = readDb();
    data.artists = data.artists.filter((a) => a.id !== id);
    writeDb(data);
  },

  // Genres
  getGenres: () => readDb().genres,
  getGenreById: (id: string) => {
    if (!id) return undefined;
    const genres = readDb().genres;
    const direct = genres.find((g) => g.id === id);
    if (direct) return direct;
    const decoded = decodeURIComponent(id).trim().toLowerCase();
    return genres.find((g) => g.slug?.toLowerCase() === decoded || g.name.toLowerCase() === decoded);
  },
  saveGenre: (genre: Genre) => {
    const data = readDb();
    const index = data.genres.findIndex((g) => g.id === genre.id);
    if (index >= 0) {
      data.genres[index] = genre;
    } else {
      data.genres.push(genre);
    }
    writeDb(data);
    return genre;
  },
  deleteGenre: (id: string) => {
    const data = readDb();
    data.genres = data.genres.filter((g) => g.id !== id);
    writeDb(data);
  },

  // Playlists
  getPlaylists: () => readDb().playlists,
  getPlaylistById: (id: string) => readDb().playlists.find((p) => p.id === id),
  getUserPlaylists: (userId: string) => readDb().playlists.filter((p) => p.userId === userId || p.isPublic),
  savePlaylist: (playlist: Playlist) => {
    const data = readDb();
    const index = data.playlists.findIndex((p) => p.id === playlist.id);
    if (index >= 0) {
      data.playlists[index] = { ...playlist, updatedAt: new Date().toISOString() };
    } else {
      data.playlists.unshift(playlist);
    }
    writeDb(data);
    return playlist;
  },
  deletePlaylist: (id: string) => {
    const data = readDb();
    data.playlists = data.playlists.filter((p) => p.id !== id);
    writeDb(data);
  },

  // Collections (Personal Albums)
  getCollections: () => readDb().collections,
  getCollectionById: (id: string) => readDb().collections.find((c) => c.id === id),
  getUserCollections: (userId: string) => readDb().collections.filter((c) => c.userId === userId),
  saveCollection: (col: UserCollection) => {
    const data = readDb();
    const index = data.collections.findIndex((c) => c.id === col.id);
    if (index >= 0) {
      data.collections[index] = { ...col, updatedAt: new Date().toISOString() };
    } else {
      data.collections.unshift(col);
    }
    writeDb(data);
    return col;
  },
  deleteCollection: (id: string) => {
    const data = readDb();
    data.collections = data.collections.filter((c) => c.id !== id);
    writeDb(data);
  },

  // Likes
  getLikedSongs: (userId: string) => readDb().likedSongs.filter((ls) => ls.userId === userId),
  isSongLiked: (userId: string, songId: string) => {
    return readDb().likedSongs.some((ls) => ls.userId === userId && ls.songId === songId);
  },
  toggleLikeSong: (userId: string, songId: string) => {
    const data = readDb();
    const index = data.likedSongs.findIndex((ls) => ls.userId === userId && ls.songId === songId);
    let isLiked = false;
    const song = data.songs.find((s) => s.id === songId);

    if (index >= 0) {
      data.likedSongs.splice(index, 1);
      if (song) song.likesCount = Math.max(0, (song.likesCount || 0) - 1);
      isLiked = false;
    } else {
      data.likedSongs.unshift({
        userId,
        songId,
        likedAt: new Date().toISOString()
      });
      if (song) song.likesCount = (song.likesCount || 0) + 1;
      isLiked = true;
    }
    writeDb(data);
    return { isLiked, likesCount: song?.likesCount || 0 };
  },

  // Following Artists
  isArtistFollowed: (userId: string, artistId: string) => {
    return readDb().followedArtists.some((fa) => fa.userId === userId && fa.artistId === artistId);
  },
  toggleFollowArtist: (userId: string, artistId: string) => {
    const data = readDb();
    const index = data.followedArtists.findIndex((fa) => fa.userId === userId && fa.artistId === artistId);
    let isFollowed = false;
    const artist = data.artists.find((a) => a.id === artistId);

    if (index >= 0) {
      data.followedArtists.splice(index, 1);
      if (artist) artist.followersCount = Math.max(0, (artist.followersCount || 0) - 1);
      isFollowed = false;
    } else {
      data.followedArtists.unshift({ userId, artistId });
      if (artist) artist.followersCount = (artist.followersCount || 0) + 1;
      isFollowed = true;
    }
    writeDb(data);
    return { isFollowed, followersCount: artist?.followersCount || 0 };
  },
  getFollowedArtists: (userId: string) => {
    const data = readDb();
    const artistIds = data.followedArtists.filter((fa) => fa.userId === userId).map((fa) => fa.artistId);
    return data.artists.filter((a) => artistIds.includes(a.id));
  },

  // History
  getUserHistory: (userId: string) => {
    const data = readDb();
    return data.history.filter((h) => h.userId === userId);
  },
  clearUserHistory: (userId: string) => {
    const data = readDb();
    data.history = data.history.filter((h) => h.userId !== userId);
    writeDb(data);
  },

  // Users
  getUsers: () => readDb().users,
  getUserById: (id: string) => readDb().users.find((u) => u.id === id),
  getUserByEmail: (email: string) => readDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  getUserByUsername: (username: string) =>
    readDb().users.find((u) => u.username.toLowerCase() === username.toLowerCase()),
  saveUser: (user: User) => {
    const data = readDb();
    const index = data.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      data.users[index] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      data.users.push(user);
    }
    writeDb(data);
    return user;
  },
  deleteUser: (id: string) => {
    const data = readDb();
    data.users = data.users.filter((u) => u.id !== id);
    writeDb(data);
  },

  // Notifications
  getNotificationsForUser: (userId: string) => {
    const data = readDb();
    return data.notifications.filter((n) => n.userId === 'all' || n.userId === userId);
  },
  addNotification: (notif: NotificationItem) => {
    const data = readDb();
    data.notifications.unshift(notif);
    writeDb(data);
    return notif;
  },
  markNotificationAsRead: (id: string) => {
    const data = readDb();
    const n = data.notifications.find((item) => item.id === id);
    if (n) {
      n.isRead = true;
      writeDb(data);
    }
  },

  // Activity Logs
  getLogs: () => readDb().logs,
  addLog: (log: AdminActivityLog) => {
    const data = readDb();
    data.logs.unshift(log);
    if (data.logs.length > 300) {
      data.logs = data.logs.slice(0, 300);
    }
    writeDb(data);
    return log;
  },

  // Settings
  getSettings: () => readDb().settings,
  updateSettings: (settings: Partial<SystemSettings>) => {
    const data = readDb();
    data.settings = { ...data.settings, ...settings };
    writeDb(data);
    return data.settings;
  },

  // Support & Messaging
  getConversationsForUser: (userId: string) => {
    const data = readDb();
    return (data.conversations || [])
      .filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.latestMessageAt || b.createdAt).getTime() - new Date(a.latestMessageAt || a.createdAt).getTime());
  },

  getAllConversations: () => {
    const data = readDb();
    return (data.conversations || [])
      .sort((a, b) => new Date(b.latestMessageAt || b.createdAt).getTime() - new Date(a.latestMessageAt || a.createdAt).getTime());
  },

  getConversationById: (id: string) => {
    const data = readDb();
    return (data.conversations || []).find((c) => c.id === id);
  },

  getOrCreateConversationForUser: (user: { id: string; name: string; avatar: string; email: string }, category: SupportCategory = 'general') => {
    const data = readDb();
    if (!data.conversations) data.conversations = [];
    let conv = data.conversations.find((c) => c.userId === user.id);
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        userEmail: user.email,
        category: category,
        status: 'new',
        unreadByUserCount: 0,
        unreadByAdminCount: 0,
        latestMessage: '',
        latestMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.conversations.unshift(conv);
      writeDb(data);
    }
    return conv;
  },

  getMessagesForConversation: (conversationId: string) => {
    const data = readDb();
    return (data.supportMessages || [])
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  addSupportMessage: (message: SupportMessage) => {
    const data = readDb();
    if (!data.supportMessages) data.supportMessages = [];
    if (!data.conversations) data.conversations = [];
    data.supportMessages.push(message);

    const convIndex = data.conversations.findIndex((c) => c.id === message.conversationId);
    if (convIndex >= 0) {
      const conv = data.conversations[convIndex];
      conv.latestMessage = message.message;
      conv.latestMessageAt = message.createdAt;
      conv.updatedAt = message.createdAt;
      if (message.category) conv.category = message.category;

      if (message.senderRole === 'user') {
        conv.unreadByAdminCount = (conv.unreadByAdminCount || 0) + 1;
        if (conv.status === 'replied' || conv.status === 'resolved') {
          conv.status = 'unread';
        }
      } else if (message.senderRole === 'admin') {
        conv.unreadByUserCount = (conv.unreadByUserCount || 0) + 1;
        conv.status = 'replied';
      }
      data.conversations[convIndex] = conv;
    }
    writeDb(data);
    return message;
  },

  updateConversationStatus: (id: string, status: ConversationStatus) => {
    const data = readDb();
    if (!data.conversations) data.conversations = [];
    const conv = data.conversations.find((c) => c.id === id);
    if (conv) {
      conv.status = status;
      conv.updatedAt = new Date().toISOString();
      if (status === 'resolved') {
        conv.unreadByAdminCount = 0;
      }
      writeDb(data);
      return conv;
    }
    return null;
  },

  markConversationReadBy: (conversationId: string, readerRole: 'user' | 'admin') => {
    const data = readDb();
    if (!data.conversations) data.conversations = [];
    if (!data.supportMessages) data.supportMessages = [];

    const conv = data.conversations.find((c) => c.id === conversationId);
    if (conv) {
      if (readerRole === 'user') {
        conv.unreadByUserCount = 0;
      } else {
        conv.unreadByAdminCount = 0;
      }
    }

    // Mark messages as read
    data.supportMessages.forEach((m) => {
      if (m.conversationId === conversationId) {
        if (readerRole === 'user' && (m.senderRole === 'admin' || m.senderType === 'ai')) {
          m.isRead = true;
        } else if (readerRole === 'admin' && m.senderRole === 'user') {
          m.isRead = true;
        }
      }
    });

    writeDb(data);
  },

  createSupportRequest: (req: SupportRequest) => {
    const data = readDb();
    if (!data.supportRequests) data.supportRequests = [];
    data.supportRequests.unshift(req);
    writeDb(data);
    return req;
  },

  getSupportRequests: () => {
    const data = readDb();
    return data.supportRequests || [];
  },

  getAdminOnlineStatus: (): AdminOnlineStatus => {
    const data = readDb();
    if (!data.adminStatus) {
      data.adminStatus = { isOnline: true, lastSeen: new Date().toISOString() };
    }
    return data.adminStatus;
  },

  setAdminOnlineStatus: (isOnline: boolean, statusMessage?: string) => {
    const data = readDb();
    data.adminStatus = {
      isOnline,
      lastSeen: new Date().toISOString(),
      statusMessage
    };
    writeDb(data);
    return data.adminStatus;
  },

  getUnreadSupportCount: (userId?: string, isAdmin?: boolean) => {
    const data = readDb();
    const convs = data.conversations || [];
    if (isAdmin) {
      return convs.reduce((acc, c) => acc + (c.unreadByAdminCount || 0), 0);
    }
    if (userId) {
      const userConv = convs.find((c) => c.userId === userId);
      return userConv ? (userConv.unreadByUserCount || 0) : 0;
    }
    return 0;
  }
};
