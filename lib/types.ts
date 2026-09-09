export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar: string;
  bio?: string;
  favoriteGenres?: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  preferences?: {
    autoplay?: boolean;
    audioQuality?: 'normal' | 'high' | 'ultra';
    crossfade?: number;
    normalizeVolume?: boolean;
    explicitFilter?: boolean;
    privateListening?: boolean;
    notifyNewReleases?: boolean;
    notifyArtistUpdates?: boolean;
    notifyRecommendations?: boolean;
    notifySystem?: boolean;
    theme?: 'dark' | 'light' | 'system';
  };
}

export type SongStatus = 'published' | 'draft' | 'private' | 'archived';
export type UploadType = 'file' | 'url';
export type SourceType = 'upload' | 'external_url';
export type SourcePlatform = 'youtube' | 'soundcloud' | 'direct' | null;

export interface SyncedLyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  originalFilename?: string;
  audioPath?: string;
  audioUrl?: string;
  coverImage: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  genreId: string;
  genreName: string;
  duration: number; // in seconds
  releaseDate: string;
  description?: string;
  lyrics?: string;
  syncedLyrics?: SyncedLyricLine[];
  multilingualLyrics?: Record<string, SyncedLyricLine[]>;
  explicit: boolean;
  status: SongStatus;
  playCount: number;
  likesCount: number;
  uploadedBy: string; // user ID
  uploadType: UploadType;
  // Source tracking fields
  sourceType?: SourceType;        // 'upload' | 'external_url'
  sourceUrl?: string;             // Original pasted URL (YouTube, SoundCloud, etc.)
  sourcePlatform?: SourcePlatform; // Detected platform
  externalMediaId?: string;       // e.g. YouTube video ID
  copyrightOwner?: string;
  source?: string;
  tags?: string[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  synthPreset?: 'chill' | 'lofi' | 'pop' | 'electronic' | 'acoustic' | 'rnb' | 'ambient' | 'rock';
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverImage: string;
  description?: string;
  genreId: string;
  genreName: string;
  releaseDate: string;
  copyrightInfo?: string;
  status: 'published' | 'draft' | 'archived';
  isFeatured?: boolean;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  country?: string;
  genreId?: string;
  genreName?: string;
  monthlyListeners: number;
  followersCount: number;
  isVerified: boolean;
  isFeatured?: boolean;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  color: string; // e.g., 'from-emerald-600 to-teal-900'
  accentColor: string; // e.g., '#10B981'
  coverImage?: string;
  description?: string;
  songCount?: number;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  userId: string;
  userName: string;
  isPublic: boolean;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserCollection {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  userId: string;
  userName: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LikedSong {
  userId: string;
  songId: string;
  likedAt: string;
}

export interface ListeningHistory {
  id: string;
  userId: string;
  songId: string;
  playedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // 'all' or specific user ID or 'admin'
  title: string;
  message: string;
  type: 'release' | 'album' | 'playlist' | 'system' | 'admin_alert';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  targetType: 'song' | 'album' | 'artist' | 'genre' | 'user' | 'system';
  targetId?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface SystemSettings {
  siteName: string;
  tagline: string;
  allowUserRegistrations: boolean;
  maxUploadSizeBytes: number; // e.g. 50MB
  supportedAudioFormats: string[];
  defaultTheme: 'dark' | 'light';
  requireEmailVerification: boolean;
  maintenanceMode: boolean;
  storageUsedBytes: number;
}

export interface SearchResults {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  genres: Genre[];
}

export interface AnalyticsSummary {
  totalSongs: number;
  totalAlbums: number;
  totalArtists: number;
  totalUsers: number;
  totalPlays: number;
  totalLikes: number;
  totalPlaylists: number;
  activeUsers: number;
  mostPlayedSongs: { title: string; artist: string; plays: number; coverImage: string }[];
  userGrowth: { period: string; count: number }[];
  listeningActivity: { date: string; plays: number }[];
  popularGenres: { name: string; value: number; color: string }[];
  topArtists: { name: string; plays: number; followers: number; avatar: string }[];
}

// Support Messaging & AI Assistance Types
export type SupportCategory = 
  | 'music_request' 
  | 'issue_report' 
  | 'account_support' 
  | 'feedback' 
  | 'general';

export type ConversationStatus = 
  | 'new' 
  | 'unread' 
  | 'ai_assisted' 
  | 'waiting_admin' 
  | 'replied' 
  | 'resolved';

export type MessageSenderRole = 'user' | 'admin';
export type MessageSenderType = 'user' | 'admin' | 'ai';

export interface SupportMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: MessageSenderRole;
  senderType: MessageSenderType;
  message: string;
  category?: SupportCategory;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SupportConversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  adminId?: string;
  category: SupportCategory;
  subject?: string;
  status: ConversationStatus;
  unreadByUserCount: number;
  unreadByAdminCount: number;
  latestMessage?: string;
  latestMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportRequest {
  id: string;
  userId: string;
  userName: string;
  conversationId: string;
  requestType: 'music_request' | 'issue_report';
  title: string;
  description: string;
  metadata?: {
    artist?: string;
    album?: string;
    issueType?: 'player' | 'lyrics' | 'search' | 'playlist' | 'account' | 'other';
    screenshotUrl?: string;
  };
  status: 'pending' | 'in_review' | 'completed' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface AdminOnlineStatus {
  isOnline: boolean;
  lastSeen: string;
  statusMessage?: string;
}

