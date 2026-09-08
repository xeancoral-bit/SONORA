import { User, Artist, Album, Song, Genre, Playlist, UserCollection, LikedSong, ListeningHistory, NotificationItem, AdminActivityLog, SystemSettings } from './types';

// Pre-computed bcrypt hashes to avoid synchronous hashing at module load time
// Admin123! hashed with bcrypt saltRounds=10
export const ADMIN_PASSWORD_HASH = '$2b$10$GVUSSV5jrDwAl4162tZ3o.hTBo/tzsA6sPabfama72ynOnf4HVYFi';
// User123! hashed with bcrypt saltRounds=10
export const USER_PASSWORD_HASH = '$2b$10$hzkKpQhVStd0/OQPFG2dgOs2T2p4GwPKTOnXTHJphc55flz4Z/Mpi';

export const initialGenres: Genre[] = [
  {
    id: 'genre-pop',
    name: 'Pop',
    slug: 'pop',
    color: 'from-pink-500 to-rose-700',
    accentColor: '#EC4899',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    description: 'Catchy hooks, upbeat rhythms, and mainstream chart-toppers.'
  },
  {
    id: 'genre-electronic',
    name: 'Electronic',
    slug: 'electronic',
    color: 'from-cyan-500 to-blue-700',
    accentColor: '#06B6D4',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    description: 'Synthesizers, driving 4/4 beats, synthwave, and club anthems.'
  },
  {
    id: 'genre-chill',
    name: 'Lo-Fi & Chill',
    slug: 'chill',
    color: 'from-emerald-500 to-teal-800',
    accentColor: '#10B981',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    description: 'Relaxing study beats, ambient textures, and peaceful vibes.'
  },
  {
    id: 'genre-rnb',
    name: 'R&B & Soul',
    slug: 'rnb',
    color: 'from-purple-500 to-indigo-800',
    accentColor: '#8B5CF6',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    description: 'Smooth vocals, deep basslines, and emotive melodies.'
  },
  {
    id: 'genre-rock',
    name: 'Rock & Indie',
    slug: 'rock',
    color: 'from-amber-600 to-red-800',
    accentColor: '#F59E0B',
    coverImage: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    description: 'Distorted guitars, energetic drums, and raw indie passion.'
  },
  {
    id: 'genre-hiphop',
    name: 'Hip-Hop',
    slug: 'hip-hop',
    color: 'from-orange-500 to-amber-700',
    accentColor: '#F97316',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    description: 'Crisp 808s, rhythmic verses, and urban flows.'
  },
  {
    id: 'genre-acoustic',
    name: 'Acoustic',
    slug: 'acoustic',
    color: 'from-lime-600 to-emerald-800',
    accentColor: '#84CC16',
    coverImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
    description: 'Intimate acoustic guitars, soft pianos, and warm organic recordings.'
  },
  {
    id: 'genre-ambient',
    name: 'Ambient & Sleep',
    slug: 'ambient',
    color: 'from-slate-600 to-zinc-900',
    accentColor: '#64748B',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    description: 'Calm soundscapes, meditative drones, and gentle night chords.'
  },
  {
    id: 'genre-jazz',
    name: 'Jazz & Fusion',
    slug: 'jazz',
    color: 'from-yellow-600 to-amber-900',
    accentColor: '#EAB308',
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
    description: 'Improvisational brass, smooth chords, and sophisticated grooves.'
  },
  {
    id: 'genre-classical',
    name: 'Modern Classical',
    slug: 'classical',
    color: 'from-stone-500 to-stone-800',
    accentColor: '#A8A29E',
    coverImage: 'https://images.unsplash.com/photo-1520523839898-507127025816?w=600&auto=format&fit=crop&q=80',
    description: 'Cinematic strings, grand pianos, and orchestral elegance.'
  }
];

export const initialArtists: Artist[] = [
  {
    id: 'artist-aurora-wave',
    name: 'Aurora Wave',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    bio: 'Electronic & Synthwave producer crafting neon soundscapes and futuristic synth melodies for late-night dreamers.',
    country: 'Sweden',
    genreId: 'genre-electronic',
    genreName: 'Electronic',
    monthlyListeners: 1420500,
    followersCount: 382400,
    isVerified: true,
    isFeatured: true,
    socialLinks: {
      spotify: 'https://spotify.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z'
  },
  {
    id: 'artist-kai-sterling',
    name: 'Kai Sterling',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    bio: 'Contemporary R&B singer and songwriter known for buttery vocals, velvety harmonies, and midnight love letters.',
    country: 'United States',
    genreId: 'genre-rnb',
    genreName: 'R&B & Soul',
    monthlyListeners: 2150300,
    followersCount: 520100,
    isVerified: true,
    isFeatured: true,
    socialLinks: {
      spotify: 'https://spotify.com',
      instagram: 'https://instagram.com'
    },
    createdAt: '2025-01-12T09:00:00.000Z',
    updatedAt: '2025-01-12T09:00:00.000Z'
  },
  {
    id: 'artist-luna-sol',
    name: 'Luna & The Sol',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=1600&auto=format&fit=crop&q=80',
    bio: 'Indie rock trio from Melbourne blending nostalgic tape reverb, fuzzy guitar chords, and heartfelt lyrics.',
    country: 'Australia',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    monthlyListeners: 890400,
    followersCount: 195000,
    isVerified: true,
    isFeatured: true,
    socialLinks: {
      instagram: 'https://instagram.com'
    },
    createdAt: '2025-01-15T11:00:00.000Z',
    updatedAt: '2025-01-15T11:00:00.000Z'
  },
  {
    id: 'artist-maya-lin',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1600&auto=format&fit=crop&q=80',
    bio: 'Lo-Fi beatmaker, pianist, and cozy vibes curator creating gentle melodies for studying, coding, and unwinding.',
    country: 'Japan',
    genreId: 'genre-chill',
    genreName: 'Lo-Fi & Chill',
    monthlyListeners: 3450000,
    followersCount: 780000,
    isVerified: true,
    isFeatured: true,
    socialLinks: {
      spotify: 'https://spotify.com'
    },
    createdAt: '2025-01-18T14:00:00.000Z',
    updatedAt: '2025-01-18T14:00:00.000Z'
  },
  {
    id: 'artist-elias-vance',
    name: 'Elias Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1600&auto=format&fit=crop&q=80',
    bio: 'Folk-acoustic balladeer with a resonant baritone voice and fingerstyle guitar arrangements.',
    country: 'United Kingdom',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    monthlyListeners: 620000,
    followersCount: 142000,
    isVerified: false,
    isFeatured: false,
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z'
  },
  {
    id: 'artist-celeste-nova',
    name: 'Celeste Nova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    bio: 'Global pop sensation blending infectious dance-pop basslines with glittering vocal performances.',
    country: 'Canada',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 4120000,
    followersCount: 1250000,
    isVerified: true,
    isFeatured: true,
    createdAt: '2025-01-22T12:00:00.000Z',
    updatedAt: '2025-01-22T12:00:00.000Z'
  },
  {
    id: 'artist-marcus-kane',
    name: 'Marcus Kane',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80',
    bio: 'Hip-hop artist and producer from Atlanta crafting hard-hitting 808 anthems and sharp street narratives.',
    country: 'United States',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    monthlyListeners: 1870000,
    followersCount: 430000,
    isVerified: true,
    isFeatured: true,
    socialLinks: {
      spotify: 'https://spotify.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z'
  }
];

export const initialAlbums: Album[] = [
  {
    id: 'album-midnight-odyssey',
    title: 'Midnight Odyssey',
    artistId: 'artist-aurora-wave',
    artistName: 'Aurora Wave',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'An atmospheric voyage through synthesizer textures, analog drum machines, and futuristic retro-pop.',
    genreId: 'genre-electronic',
    genreName: 'Electronic',
    releaseDate: '2025-02-14',
    copyrightInfo: '© 2025 Sonora Records / Aurora Wave',
    status: 'published',
    isFeatured: true,
    songIds: ['song-night-drive', 'song-cyber-sunset', 'song-neon-echoes'],
    createdAt: '2025-02-14T00:00:00.000Z',
    updatedAt: '2025-02-14T00:00:00.000Z'
  },
  {
    id: 'album-velvet-skies',
    title: 'Velvet Skies',
    artistId: 'artist-kai-sterling',
    artistName: 'Kai Sterling',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    description: 'Sensual R&B tracks exploring late-night confessions, romance, and urban introspection.',
    genreId: 'genre-rnb',
    genreName: 'R&B & Soul',
    releaseDate: '2025-01-28',
    copyrightInfo: '© 2025 Kai Sterling Music Group',
    status: 'published',
    isFeatured: true,
    songIds: ['song-velvet-touch', 'song-after-hours', 'song-silk-sheets'],
    createdAt: '2025-01-28T00:00:00.000Z',
    updatedAt: '2025-01-28T00:00:00.000Z'
  },
  {
    id: 'album-coffee-and-rain',
    title: 'Coffee & Rain',
    artistId: 'artist-maya-lin',
    artistName: 'Maya Lin',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    description: 'Warm vinyl crackle, gentle Rhodes piano, and chill tape loops designed to calm your mind.',
    genreId: 'genre-chill',
    genreName: 'Lo-Fi & Chill',
    releaseDate: '2025-02-01',
    copyrightInfo: '© 2025 Lin Sounds / Sonora Chill',
    status: 'published',
    isFeatured: true,
    songIds: ['song-tokyo-drizzle', 'song-study-session', 'song-warm-mug'],
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z'
  },
  {
    id: 'album-electric-starlight',
    title: 'Electric Starlight',
    artistId: 'artist-celeste-nova',
    artistName: 'Celeste Nova',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    description: 'An unstoppable collection of shimmering pop anthems and radiant chorus melodies.',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '2025-02-20',
    copyrightInfo: '© 2025 Nova Star Entertainment',
    status: 'published',
    isFeatured: true,
    songIds: ['song-starlight-glow', 'song-dancing-alone', 'song-higher-vibrations'],
    createdAt: '2025-02-20T00:00:00.000Z',
    updatedAt: '2025-02-20T00:00:00.000Z'
  },
  {
    id: 'album-summer-drift',
    title: 'Summer Drift',
    artistId: 'artist-luna-sol',
    artistName: 'Luna & The Sol',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    description: 'Sun-drenched indie rock riffs and breezy nostalgic melodies captured under golden hour.',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    releaseDate: '2025-01-10',
    copyrightInfo: '© 2025 Luna Sol Collective',
    status: 'published',
    isFeatured: false,
    songIds: ['song-ocean-breeze', 'song-golden-coast'],
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z'
  }
];

export const initialSongs: Song[] = [
  {
    id: 'song-night-drive',
    title: 'Night Drive',
    originalFilename: 'aurora_wave_night_drive_master.mp3',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-aurora-wave',
    artistName: 'Aurora Wave',
    albumId: 'album-midnight-odyssey',
    albumTitle: 'Midnight Odyssey',
    genreId: 'genre-electronic',
    genreName: 'Electronic',
    duration: 218,
    releaseDate: '2025-02-14',
    description: 'The definitive synthwave journey through city lights and open highways.',
    explicit: false,
    status: 'published',
    playCount: 142380,
    likesCount: 18420,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Aurora Wave / Sonora Media',
    source: 'Sonora Studio Master',
    tags: ['synthwave', 'night', 'cyberpunk', 'driving', 'electronic'],
    isFeatured: true,
    synthPreset: 'electronic',
    lyrics: `[00:00.00] (Instrumental synth intro)
[00:15.50] Cruising past the neon glow
[00:22.80] Watching shadows in the rear-view grow
[00:30.10] City skyline burning bright
[00:37.40] Guided only by the midnight light
[00:45.00] We're alive in the slipstream
[00:52.20] Living out this electric dream
[01:00.00] Feel the bass underneath the wheels
[01:07.50] This is how the night time feels
[01:15.00] Night drive, across the endless line
[01:22.50] Lost inside this space and time
[01:30.00] Night drive, forever on the run
[01:37.50] Racing toward the morning sun`,
    syncedLyrics: [
      { time: 0, text: '♪ (Atmospheric synth intro) ♪' },
      { time: 15, text: 'Cruising past the neon glow' },
      { time: 22, text: 'Watching shadows in the rear-view grow' },
      { time: 30, text: 'City skyline burning bright' },
      { time: 37, text: 'Guided only by the midnight light' },
      { time: 45, text: "We're alive in the slipstream" },
      { time: 52, text: 'Living out this electric dream' },
      { time: 60, text: 'Feel the bass underneath the wheels' },
      { time: 67, text: 'This is how the night time feels' },
      { time: 75, text: 'Night drive, across the endless line' },
      { time: 82, text: 'Lost inside this space and time' },
      { time: 90, text: 'Night drive, forever on the run' },
      { time: 97, text: 'Racing toward the morning sun' }
    ],
    createdAt: '2025-02-14T00:00:00.000Z',
    updatedAt: '2025-02-14T00:00:00.000Z'
  },
  {
    id: 'song-velvet-touch',
    title: 'Velvet Touch',
    originalFilename: 'kai_sterling_velvet_touch.mp3',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-kai-sterling',
    artistName: 'Kai Sterling',
    albumId: 'album-velvet-skies',
    albumTitle: 'Velvet Skies',
    genreId: 'genre-rnb',
    genreName: 'R&B & Soul',
    duration: 195,
    releaseDate: '2025-01-28',
    description: 'Silky smooth chords, 808 percussion, and hypnotic vocal harmonies.',
    explicit: false,
    status: 'published',
    playCount: 198420,
    likesCount: 29400,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Kai Sterling',
    source: 'Official Release',
    tags: ['rnb', 'smooth', 'sensual', 'midnight', 'vocal'],
    isFeatured: true,
    synthPreset: 'rnb',
    lyrics: `[00:00.00] (Soft Fender Rhodes intro)
[00:12.00] Whisper slow, don't rush the night
[00:18.50] Everything feels just right
[00:25.00] Your silhouette against the wall
[00:31.50] Every time you softly call
[00:38.00] Velvet touch on my skin
[00:44.50] That's where all the magic begins
[00:51.00] Velvet touch, take my hand
[00:57.50] No one else could understand`,
    syncedLyrics: [
      { time: 0, text: '♪ (Smooth Fender Rhodes intro) ♪' },
      { time: 12, text: "Whisper slow, don't rush the night" },
      { time: 18, text: 'Everything feels just right' },
      { time: 25, text: 'Your silhouette against the wall' },
      { time: 31, text: 'Every time you softly call' },
      { time: 38, text: 'Velvet touch on my skin' },
      { time: 44, text: "That's where all the magic begins" },
      { time: 51, text: 'Velvet touch, take my hand' },
      { time: 57, text: 'No one else could understand' }
    ],
    createdAt: '2025-01-28T00:00:00.000Z',
    updatedAt: '2025-01-28T00:00:00.000Z'
  },
  {
    id: 'song-tokyo-drizzle',
    title: 'Tokyo Drizzle',
    originalFilename: 'maya_lin_tokyo_drizzle_lofi.mp3',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-maya-lin',
    artistName: 'Maya Lin',
    albumId: 'album-coffee-and-rain',
    albumTitle: 'Coffee & Rain',
    genreId: 'genre-chill',
    genreName: 'Lo-Fi & Chill',
    duration: 174,
    releaseDate: '2025-02-01',
    description: 'Gentle raindrops on glass, tape saturation, and mellow jazz piano chords.',
    explicit: false,
    status: 'published',
    playCount: 312500,
    likesCount: 45200,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Maya Lin',
    source: 'Sonora Lo-Fi Beats',
    tags: ['lofi', 'study', 'rain', 'piano', 'chill'],
    isFeatured: true,
    synthPreset: 'lofi',
    lyrics: `[00:00.00] (Vinyl crackle and gentle rain ambiance)
[00:15.00] (Mellow jazz piano riff begins)
[00:45.00] (Soft drum groove enters with brush snare)
[01:15.00] (Warm tape echo and peaceful harmonies)
[01:45.00] (Gentle melodic resolution)
[02:15.00] (Rain sounds fade out into peace)`,
    syncedLyrics: [
      { time: 0, text: '♪ (Vinyl crackle and gentle rain ambiance) ♪' },
      { time: 15, text: '♪ (Mellow jazz piano chords) ♪' },
      { time: 45, text: '♪ (Soft lo-fi drum groove) ♪' },
      { time: 75, text: '♪ (Warm tape echo and peaceful tones) ♪' },
      { time: 105, text: '♪ (Relaxing melodic flow) ♪' },
      { time: 135, text: '♪ (Rain gently falling on the window) ♪' }
    ],
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z'
  },
  {
    id: 'song-starlight-glow',
    title: 'Starlight Glow',
    originalFilename: 'celeste_nova_starlight_glow.mp3',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-celeste-nova',
    artistName: 'Celeste Nova',
    albumId: 'album-electric-starlight',
    albumTitle: 'Electric Starlight',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 204,
    releaseDate: '2025-02-20',
    description: 'An infectious dance-pop anthem filled with euphoria and sparkling production.',
    explicit: false,
    status: 'published',
    playCount: 284100,
    likesCount: 39800,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Nova Star',
    source: 'Commercial Master',
    tags: ['pop', 'dance', 'energy', 'anthem', 'charts'],
    isFeatured: true,
    synthPreset: 'pop',
    lyrics: `[00:00.00] (Sparkling synth arpeggio)
[00:10.00] Look up at the ceiling of stars
[00:16.00] Forget about who we are
[00:22.00] Tonight the universe is ours
[00:28.00] Dancing in the starlight glow
[00:34.00] Feel the rhythm take control
[00:40.00] Everywhere we want to go
[00:46.00] Starlight glow, shining down
[00:52.00] Brightest light in all this town!`,
    syncedLyrics: [
      { time: 0, text: '♪ (Sparkling synth arpeggio) ♪' },
      { time: 10, text: 'Look up at the ceiling of stars' },
      { time: 16, text: 'Forget about who we are' },
      { time: 22, text: 'Tonight the universe is ours' },
      { time: 28, text: 'Dancing in the starlight glow' },
      { time: 34, text: 'Feel the rhythm take control' },
      { time: 40, text: 'Everywhere we want to go' },
      { time: 46, text: 'Starlight glow, shining down' },
      { time: 52, text: 'Brightest light in all this town!' }
    ],
    createdAt: '2025-02-20T00:00:00.000Z',
    updatedAt: '2025-02-20T00:00:00.000Z'
  },
  {
    id: 'song-cyber-sunset',
    title: 'Cyber Sunset',
    originalFilename: 'cyber_sunset_aurora.mp3',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-aurora-wave',
    artistName: 'Aurora Wave',
    albumId: 'album-midnight-odyssey',
    albumTitle: 'Midnight Odyssey',
    genreId: 'genre-electronic',
    genreName: 'Electronic',
    duration: 232,
    releaseDate: '2025-02-14',
    description: 'Golden hour synth leads backed by retro gated reverb snares.',
    explicit: false,
    status: 'published',
    playCount: 162100,
    likesCount: 22100,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Aurora Wave',
    source: 'Sonora Studio',
    tags: ['synthwave', 'sunset', 'electronic', 'melodic'],
    isFeatured: false,
    synthPreset: 'electronic',
    syncedLyrics: [
      { time: 0, text: '♪ (Synth pads opening) ♪' },
      { time: 18, text: 'When the violet sun goes down' },
      { time: 26, text: 'Silicon across the town' },
      { time: 35, text: 'We drive into the sunset glow' },
      { time: 44, text: 'Where no one else can go' }
    ],
    createdAt: '2025-02-14T00:00:00.000Z',
    updatedAt: '2025-02-14T00:00:00.000Z'
  },
  {
    id: 'song-after-hours',
    title: 'After Hours',
    originalFilename: 'kai_sterling_after_hours.mp3',
    coverImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-kai-sterling',
    artistName: 'Kai Sterling',
    albumId: 'album-velvet-skies',
    albumTitle: 'Velvet Skies',
    genreId: 'genre-rnb',
    genreName: 'R&B & Soul',
    duration: 186,
    releaseDate: '2025-01-28',
    description: 'Low-tempo late night groove for intimate moments and chilled evenings.',
    explicit: true,
    status: 'published',
    playCount: 119800,
    likesCount: 14700,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Kai Sterling',
    source: 'Official Release',
    tags: ['rnb', 'slowjam', 'chill', 'explicit'],
    isFeatured: false,
    synthPreset: 'rnb',
    syncedLyrics: [
      { time: 0, text: '♪ (Sub-bass intro) ♪' },
      { time: 14, text: 'Clock hits 3 AM once more' },
      { time: 22, text: 'Hear you knock upon my door' },
      { time: 30, text: 'After hours in the dark' },
      { time: 38, text: 'Lighting up a sudden spark' }
    ],
    createdAt: '2025-01-28T00:00:00.000Z',
    updatedAt: '2025-01-28T00:00:00.000Z'
  },
  {
    id: 'song-study-session',
    title: 'Study Session',
    originalFilename: 'maya_lin_study_session.mp3',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-maya-lin',
    artistName: 'Maya Lin',
    albumId: 'album-coffee-and-rain',
    albumTitle: 'Coffee & Rain',
    genreId: 'genre-chill',
    genreName: 'Lo-Fi & Chill',
    duration: 168,
    releaseDate: '2025-02-01',
    description: 'Minimalist study beat with repetitive, soothing melodies designed for deep focus.',
    explicit: false,
    status: 'published',
    playCount: 245000,
    likesCount: 31000,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Maya Lin',
    source: 'Sonora Chill',
    tags: ['lofi', 'focus', 'study', 'coding'],
    isFeatured: false,
    synthPreset: 'lofi',
    syncedLyrics: [
      { time: 0, text: '♪ (Gentle lo-fi piano intro) ♪' },
      { time: 20, text: '♪ (Soft acoustic shaker beat) ♪' },
      { time: 40, text: '♪ (Warm melodic chords flow) ♪' },
      { time: 70, text: '♪ (Deep focus state unlocked) ♪' }
    ],
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z'
  },
  {
    id: 'song-ocean-breeze',
    title: 'Ocean Breeze',
    originalFilename: 'luna_sol_ocean_breeze.mp3',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-luna-sol',
    artistName: 'Luna & The Sol',
    albumId: 'album-summer-drift',
    albumTitle: 'Summer Drift',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    duration: 210,
    releaseDate: '2025-01-10',
    description: 'Jangle-pop guitar hooks with ocean vibes and upbeat indie nostalgia.',
    explicit: false,
    status: 'published',
    playCount: 175300,
    likesCount: 21400,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Luna & The Sol',
    source: 'Sonora Indie',
    tags: ['indie', 'guitar', 'summer', 'vibes'],
    isFeatured: false,
    synthPreset: 'acoustic',
    syncedLyrics: [
      { time: 0, text: '♪ (Jangle guitar riff) ♪' },
      { time: 14, text: 'Salty air upon our hair' },
      { time: 22, text: 'Nothing else could quite compare' },
      { time: 30, text: 'Ocean breeze blow my blues away' },
      { time: 38, text: 'Here is where I want to stay' }
    ],
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'song-whispering-pines',
    title: 'Whispering Pines',
    originalFilename: 'elias_vance_whispering_pines.mp3',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-elias-vance',
    artistName: 'Elias Vance',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 225,
    releaseDate: '2025-01-20',
    description: 'Intimate fingerpicked acoustic guitar and natural reverb recorded in a cabin.',
    explicit: false,
    status: 'published',
    playCount: 94100,
    likesCount: 11200,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Elias Vance',
    source: 'Acoustic Sessions',
    tags: ['acoustic', 'folk', 'guitar', 'peaceful'],
    isFeatured: false,
    synthPreset: 'acoustic',
    syncedLyrics: [
      { time: 0, text: '♪ (Intimate fingerpicked guitar) ♪' },
      { time: 16, text: 'Deep inside the forest green' },
      { time: 24, text: 'Prettiest place I ever seen' },
      { time: 32, text: 'Whispering pines tell a gentle song' },
      { time: 40, text: "Here's the place where we belong" }
    ],
    createdAt: '2025-01-20T00:00:00.000Z',
    updatedAt: '2025-01-20T00:00:00.000Z'
  },
  {
    id: 'song-dancing-alone',
    title: 'Dancing Alone',
    originalFilename: 'celeste_nova_dancing_alone.mp3',
    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-celeste-nova',
    artistName: 'Celeste Nova',
    albumId: 'album-electric-starlight',
    albumTitle: 'Electric Starlight',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 190,
    releaseDate: '2025-02-20',
    description: 'Energetic club beat about finding independence and joy on the dance floor.',
    explicit: false,
    status: 'published',
    playCount: 210000,
    likesCount: 27800,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Nova Star',
    source: 'Official Single',
    tags: ['pop', 'dance', 'anthem'],
    isFeatured: false,
    synthPreset: 'pop',
    syncedLyrics: [
      { time: 0, text: '♪ (Four-on-the-floor beat intro) ♪' },
      { time: 12, text: 'I don’t need nobody on my side' },
      { time: 18, text: 'I just let the music be my guide' },
      { time: 24, text: 'Dancing alone in the purple light' },
      { time: 30, text: 'Everything is gonna be alright' }
    ],
    createdAt: '2025-02-20T00:00:00.000Z',
    updatedAt: '2025-02-20T00:00:00.000Z'
  },

  // ── Album stub: Midnight Odyssey track 3 ──────────────────────────────────
  {
    id: 'song-neon-echoes',
    title: 'Neon Echoes',
    originalFilename: 'aurora_wave_neon_echoes.mp3',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-aurora-wave',
    artistName: 'Aurora Wave',
    albumId: 'album-midnight-odyssey',
    albumTitle: 'Midnight Odyssey',
    genreId: 'genre-electronic',
    genreName: 'Electronic',
    duration: 241,
    releaseDate: '2025-02-14',
    description: 'Pulsating arpeggiators and echo-drenched leads build a wall of neon sound.',
    explicit: false,
    status: 'published',
    playCount: 98400,
    likesCount: 13100,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Aurora Wave',
    source: 'Sonora Studio',
    tags: ['synthwave', 'electronic', 'arpeggio', 'neon'],
    isFeatured: false,
    synthPreset: 'electronic',
    syncedLyrics: [
      { time: 0, text: '♪ (Arpeggiator cascade) ♪' },
      { time: 20, text: 'Every neon sign speaks my name' },
      { time: 30, text: 'This city never looks the same' },
      { time: 40, text: 'Echoes bouncing wall to wall' },
      { time: 50, text: 'Electric answers to the call' }
    ],
    createdAt: '2025-02-14T00:00:00.000Z',
    updatedAt: '2025-02-14T00:00:00.000Z'
  },

  // ── Album stub: Velvet Skies track 3 ─────────────────────────────────────
  {
    id: 'song-silk-sheets',
    title: 'Silk Sheets',
    originalFilename: 'kai_sterling_silk_sheets.mp3',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-kai-sterling',
    artistName: 'Kai Sterling',
    albumId: 'album-velvet-skies',
    albumTitle: 'Velvet Skies',
    genreId: 'genre-rnb',
    genreName: 'R&B & Soul',
    duration: 201,
    releaseDate: '2025-01-28',
    description: 'Warm soul chords and hushed falsetto for the quietest hours of the night.',
    explicit: false,
    status: 'published',
    playCount: 134200,
    likesCount: 17300,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Kai Sterling',
    source: 'Official Release',
    tags: ['rnb', 'soul', 'smooth', 'love'],
    isFeatured: false,
    synthPreset: 'rnb',
    syncedLyrics: [
      { time: 0, text: '♪ (Gentle Rhodes chords) ♪' },
      { time: 14, text: 'Silk sheets and city glow' },
      { time: 22, text: 'Staying right here, nowhere to go' },
      { time: 30, text: 'You and me in this soft light' },
      { time: 38, text: 'Every moment feels just right' }
    ],
    createdAt: '2025-01-28T00:00:00.000Z',
    updatedAt: '2025-01-28T00:00:00.000Z'
  },

  // ── Album stub: Coffee & Rain track 3 ────────────────────────────────────
  {
    id: 'song-warm-mug',
    title: 'Warm Mug',
    originalFilename: 'maya_lin_warm_mug.mp3',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-maya-lin',
    artistName: 'Maya Lin',
    albumId: 'album-coffee-and-rain',
    albumTitle: 'Coffee & Rain',
    genreId: 'genre-chill',
    genreName: 'Lo-Fi & Chill',
    duration: 158,
    releaseDate: '2025-02-01',
    description: 'Cozy looped guitar samples and soft bass for a lazy Sunday morning.',
    explicit: false,
    status: 'published',
    playCount: 187600,
    likesCount: 24100,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Maya Lin',
    source: 'Sonora Chill',
    tags: ['lofi', 'cozy', 'morning', 'coffee'],
    isFeatured: false,
    synthPreset: 'lofi',
    syncedLyrics: [
      { time: 0, text: '♪ (Warm vinyl loop opens) ♪' },
      { time: 18, text: '♪ (Lazy guitar strums) ♪' },
      { time: 40, text: '♪ (Soft pad texture rolls in) ♪' },
      { time: 80, text: '♪ (Mellow resolution) ♪' }
    ],
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z'
  },

  // ── Album stub: Summer Drift track 2 ─────────────────────────────────────
  {
    id: 'song-golden-coast',
    title: 'Golden Coast',
    originalFilename: 'luna_sol_golden_coast.mp3',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-luna-sol',
    artistName: 'Luna & The Sol',
    albumId: 'album-summer-drift',
    albumTitle: 'Summer Drift',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    duration: 198,
    releaseDate: '2025-01-10',
    description: 'Shimmering indie guitar layers chasing the golden hour down the coast.',
    explicit: false,
    status: 'published',
    playCount: 142800,
    likesCount: 18900,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Luna & The Sol',
    source: 'Sonora Indie',
    tags: ['indie', 'rock', 'summer', 'guitar', 'golden'],
    isFeatured: false,
    synthPreset: 'acoustic',
    syncedLyrics: [
      { time: 0, text: '♪ (Shimmer guitar intro) ♪' },
      { time: 12, text: 'Gold on the horizon line' },
      { time: 20, text: 'Everything is yours and mine' },
      { time: 28, text: 'Golden coast we drive along' },
      { time: 36, text: 'With this everlasting song' }
    ],
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z'
  },

  // ── Album stub: Electric Starlight track 3 ───────────────────────────────
  {
    id: 'song-higher-vibrations',
    title: 'Higher Vibrations',
    originalFilename: 'celeste_nova_higher_vibrations.mp3',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-celeste-nova',
    artistName: 'Celeste Nova',
    albumId: 'album-electric-starlight',
    albumTitle: 'Electric Starlight',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 212,
    releaseDate: '2025-02-20',
    description: 'High-energy pop banger built on pulsating synth leads and euphoric drops.',
    explicit: false,
    status: 'published',
    playCount: 178500,
    likesCount: 23400,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Nova Star',
    source: 'Commercial Master',
    tags: ['pop', 'energy', 'dance', 'synth'],
    isFeatured: false,
    synthPreset: 'pop',
    syncedLyrics: [
      { time: 0, text: '♪ (Energetic synth build) ♪' },
      { time: 14, text: 'Rise up to a higher place' },
      { time: 22, text: 'Floating through this endless space' },
      { time: 30, text: 'Higher vibrations carry me' },
      { time: 38, text: 'To where I was always meant to be' }
    ],
    createdAt: '2025-02-20T00:00:00.000Z',
    updatedAt: '2025-02-20T00:00:00.000Z'
  },

  // ── NEW: Hip-Hop ──────────────────────────────────────────────────────────
  {
    id: 'song-concrete-jungle',
    title: 'Concrete Jungle',
    originalFilename: 'marcus_kane_concrete_jungle.mp3',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-marcus-kane',
    artistName: 'Marcus Kane',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 213,
    releaseDate: '2025-03-01',
    description: 'Hard-hitting 808 bass, crisp snares, and sharp lyricism straight from the city grid.',
    explicit: true,
    status: 'published',
    playCount: 221400,
    likesCount: 31200,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Marcus Kane / Urban Pulse',
    source: 'Official Single',
    tags: ['hiphop', 'rap', '808', 'urban', 'bars'],
    isFeatured: true,
    synthPreset: 'electronic',
    syncedLyrics: [
      { time: 0, text: '♪ (Deep 808 intro) ♪' },
      { time: 12, text: 'Concrete jungle, glass and steel' },
      { time: 20, text: 'Only the grind is what I feel' },
      { time: 28, text: 'Every block a different game' },
      { time: 36, text: 'Coming up, never the same' },
      { time: 44, text: 'Concrete jungle — this is home' },
      { time: 52, text: 'Every street I walk alone' }
    ],
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z'
  },

  // ── NEW: Hip-Hop track 2 ──────────────────────────────────────────────────
  {
    id: 'song-midnight-bars',
    title: 'Midnight Bars',
    originalFilename: 'marcus_kane_midnight_bars.mp3',
    coverImage: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-marcus-kane',
    artistName: 'Marcus Kane',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 189,
    releaseDate: '2025-03-05',
    description: 'Late-night freestyle energy with a trap-soul beat and introspective bars.',
    explicit: true,
    status: 'published',
    playCount: 154700,
    likesCount: 19800,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Marcus Kane',
    source: 'Official Single',
    tags: ['hiphop', 'trap', 'freestyle', 'bars'],
    isFeatured: false,
    synthPreset: 'electronic',
    syncedLyrics: [
      { time: 0, text: '♪ (Trap hi-hat pattern) ♪' },
      { time: 14, text: 'Past midnight, still I write' },
      { time: 22, text: 'Every bar a battle fight' },
      { time: 30, text: 'Midnight bars, city lights' },
      { time: 38, text: 'Turning every wrong to right' }
    ],
    createdAt: '2025-03-05T00:00:00.000Z',
    updatedAt: '2025-03-05T00:00:00.000Z'
  },

  // ── NEW: Ambient & Sleep ──────────────────────────────────────────────────
  {
    id: 'song-drift-to-sleep',
    title: 'Drift to Sleep',
    originalFilename: 'ambient_drift_to_sleep.mp3',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-aurora-wave',
    artistName: 'Aurora Wave',
    genreId: 'genre-ambient',
    genreName: 'Ambient & Sleep',
    duration: 360,
    releaseDate: '2025-03-10',
    description: 'Long evolving pads, ultra-slow breathing drones, and rain textures for effortless sleep.',
    explicit: false,
    status: 'published',
    playCount: 87300,
    likesCount: 14100,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Aurora Wave',
    source: 'Sonora Sleep Series',
    tags: ['ambient', 'sleep', 'drone', 'rain', 'meditation'],
    isFeatured: false,
    synthPreset: 'ambient',
    syncedLyrics: [
      { time: 0, text: '♪ (Slow evolving pad) ♪' },
      { time: 60, text: '♪ (Rain texture layers in) ♪' },
      { time: 120, text: '♪ (Deep breathing drone) ♪' },
      { time: 200, text: '♪ (Fading into silence) ♪' },
      { time: 300, text: '♪ (Gentle fade out) ♪' }
    ],
    createdAt: '2025-03-10T00:00:00.000Z',
    updatedAt: '2025-03-10T00:00:00.000Z'
  },

  // ── NEW: Ambient & Sleep track 2 ─────────────────────────────────────────
  {
    id: 'song-still-waters',
    title: 'Still Waters',
    originalFilename: 'ambient_still_waters.mp3',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-maya-lin',
    artistName: 'Maya Lin',
    genreId: 'genre-ambient',
    genreName: 'Ambient & Sleep',
    duration: 298,
    releaseDate: '2025-03-12',
    description: 'Gentle water sounds, soft bell tones, and meditative silence for deep relaxation.',
    explicit: false,
    status: 'published',
    playCount: 64200,
    likesCount: 10300,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Maya Lin',
    source: 'Sonora Ambient',
    tags: ['ambient', 'water', 'bells', 'meditation', 'sleep'],
    isFeatured: false,
    synthPreset: 'ambient',
    syncedLyrics: [
      { time: 0, text: '♪ (Water flowing softly) ♪' },
      { time: 60, text: '♪ (Bell tone resonates) ♪' },
      { time: 130, text: '♪ (Stillness settles in) ♪' },
      { time: 220, text: '♪ (Gentle fade into peace) ♪' }
    ],
    createdAt: '2025-03-12T00:00:00.000Z',
    updatedAt: '2025-03-12T00:00:00.000Z'
  },

  // ── NEW: Jazz & Fusion ────────────────────────────────────────────────────
  {
    id: 'song-blue-quarter',
    title: 'Blue Quarter',
    originalFilename: 'blue_quarter_jazz.mp3',
    coverImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-kai-sterling',
    artistName: 'Kai Sterling',
    genreId: 'genre-jazz',
    genreName: 'Jazz & Fusion',
    duration: 267,
    releaseDate: '2025-03-15',
    description: 'Modal jazz chords, walking bass, and a wandering trumpet melody over slow-swing percussion.',
    explicit: false,
    status: 'published',
    playCount: 72100,
    likesCount: 11800,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Kai Sterling / Sonora Jazz',
    source: 'Studio Session',
    tags: ['jazz', 'modal', 'trumpet', 'swing', 'groove'],
    isFeatured: true,
    synthPreset: 'chill',
    syncedLyrics: [
      { time: 0, text: '♪ (Bass intro, walking line) ♪' },
      { time: 20, text: '♪ (Trumpet enters — blue note) ♪' },
      { time: 48, text: '♪ (Piano comping behind melody) ♪' },
      { time: 90, text: '♪ (Trumpet improvises freely) ♪' },
      { time: 140, text: '♪ (Drum brush solo) ♪' },
      { time: 200, text: '♪ (Full band resolution) ♪' }
    ],
    createdAt: '2025-03-15T00:00:00.000Z',
    updatedAt: '2025-03-15T00:00:00.000Z'
  },

  // ── NEW: Jazz & Fusion track 2 ────────────────────────────────────────────
  {
    id: 'song-late-night-groove',
    title: 'Late Night Groove',
    originalFilename: 'late_night_groove_jazz.mp3',
    coverImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-elias-vance',
    artistName: 'Elias Vance',
    genreId: 'genre-jazz',
    genreName: 'Jazz & Fusion',
    duration: 243,
    releaseDate: '2025-03-18',
    description: 'Electric guitar fusion meets jazz-funk percussion in a tight late-night session.',
    explicit: false,
    status: 'published',
    playCount: 58400,
    likesCount: 9200,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Elias Vance',
    source: 'Studio Live Session',
    tags: ['jazz', 'fusion', 'guitar', 'funk', 'groove'],
    isFeatured: false,
    synthPreset: 'chill',
    syncedLyrics: [
      { time: 0, text: '♪ (Funky guitar riff) ♪' },
      { time: 22, text: '♪ (Syncopated bass groove) ♪' },
      { time: 50, text: '♪ (Electric piano fills) ♪' },
      { time: 100, text: '♪ (Guitar solo — fusion breaks) ♪' },
      { time: 180, text: '♪ (Groove locks back in) ♪' }
    ],
    createdAt: '2025-03-18T00:00:00.000Z',
    updatedAt: '2025-03-18T00:00:00.000Z'
  },

  // ── NEW: Modern Classical ─────────────────────────────────────────────────
  {
    id: 'song-glass-cathedral',
    title: 'Glass Cathedral',
    originalFilename: 'glass_cathedral_classical.mp3',
    coverImage: 'https://images.unsplash.com/photo-1520523839898-507127025816?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-elias-vance',
    artistName: 'Elias Vance',
    genreId: 'genre-classical',
    genreName: 'Modern Classical',
    duration: 312,
    releaseDate: '2025-03-20',
    description: 'Sweeping orchestral strings, solo piano, and cinematic dynamic swells in the modern classical tradition.',
    explicit: false,
    status: 'published',
    playCount: 49800,
    likesCount: 9700,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Elias Vance / Sonora Classics',
    source: 'Chamber Recording',
    tags: ['classical', 'orchestral', 'piano', 'cinematic', 'strings'],
    isFeatured: true,
    synthPreset: 'acoustic',
    syncedLyrics: [
      { time: 0, text: '♪ (Solo piano — delicate opening) ♪' },
      { time: 40, text: '♪ (Strings swell gently) ♪' },
      { time: 90, text: '♪ (Full orchestral crescendo) ♪' },
      { time: 160, text: '♪ (Piano returns, introspective) ♪' },
      { time: 240, text: '♪ (Strings and piano resolve together) ♪' }
    ],
    createdAt: '2025-03-20T00:00:00.000Z',
    updatedAt: '2025-03-20T00:00:00.000Z'
  },

  // ── NEW: Modern Classical track 2 ────────────────────────────────────────
  {
    id: 'song-winter-requiem',
    title: 'Winter Requiem',
    originalFilename: 'winter_requiem_classical.mp3',
    coverImage: 'https://images.unsplash.com/photo-1485160493852-8649adabd09a?w=600&auto=format&fit=crop&q=80',
    artistId: 'artist-maya-lin',
    artistName: 'Maya Lin',
    genreId: 'genre-classical',
    genreName: 'Modern Classical',
    duration: 284,
    releaseDate: '2025-03-22',
    description: 'Minimalist piano composition with sparse string harmonics evoking stillness and solitude.',
    explicit: false,
    status: 'published',
    playCount: 41200,
    likesCount: 8100,
    uploadedBy: 'user-admin',
    uploadType: 'file',
    copyrightOwner: 'Maya Lin',
    source: 'Sonora Classics',
    tags: ['classical', 'minimalist', 'piano', 'strings', 'winter'],
    isFeatured: false,
    synthPreset: 'acoustic',
    syncedLyrics: [
      { time: 0, text: '♪ (Single piano note — silence) ♪' },
      { time: 30, text: '♪ (Sparse string harmonics) ♪' },
      { time: 80, text: '♪ (Melody unfolds slowly) ♪' },
      { time: 160, text: '♪ (Quiet emotional peak) ♪' },
      { time: 240, text: '♪ (Fades into winter stillness) ♪' }
    ],
    createdAt: '2025-03-22T00:00:00.000Z',
    updatedAt: '2025-03-22T00:00:00.000Z'
  }
];


export const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Administrator',
    username: 'admin',
    email: 'admin@sonora.io',
    passwordHash: ADMIN_PASSWORD_HASH,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'SONORA Head of Music Catalog & Platform Administration.',
    favoriteGenres: ['genre-electronic', 'genre-pop', 'genre-rnb'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    isActive: true,
    preferences: {
      autoplay: true,
      audioQuality: 'ultra',
      crossfade: 2,
      normalizeVolume: true,
      explicitFilter: false,
      privateListening: false,
      notifyNewReleases: true,
      notifyArtistUpdates: true,
      notifyRecommendations: true,
      notifySystem: true,
      theme: 'dark'
    }
  },
  {
    id: 'user-xean',
    name: 'Xean Santos',
    username: 'xean',
    email: 'xean@sonora.io',
    passwordHash: USER_PASSWORD_HASH,
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    bio: 'Music enthusiast, synthesizer collector, and night drive explorer.',
    favoriteGenres: ['genre-electronic', 'genre-chill', 'genre-rnb'],
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: '2025-01-10T12:00:00.000Z',
    isActive: true,
    preferences: {
      autoplay: true,
      audioQuality: 'high',
      crossfade: 3,
      normalizeVolume: true,
      explicitFilter: false,
      privateListening: false,
      notifyNewReleases: true,
      notifyArtistUpdates: true,
      notifyRecommendations: true,
      notifySystem: true,
      theme: 'dark'
    }
  }
];

export const initialPlaylists: Playlist[] = [
  {
    id: 'playlist-midnight-vibes',
    title: 'Midnight Highway Drives',
    description: 'Synthesizers, smooth vocals, and neon vibes for late-night cruising.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    userId: 'user-xean',
    userName: 'Xean Santos',
    isPublic: true,
    songIds: ['song-night-drive', 'song-cyber-sunset', 'song-velvet-touch', 'song-after-hours'],
    createdAt: '2025-02-15T18:00:00.000Z',
    updatedAt: '2025-02-15T18:00:00.000Z'
  },
  {
    id: 'playlist-deep-focus-code',
    title: 'Deep Focus & Code',
    description: 'Lo-Fi beats, soft rain textures, and chill piano melodies to get in the zone.',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    userId: 'user-xean',
    userName: 'Xean Santos',
    isPublic: true,
    songIds: ['song-tokyo-drizzle', 'song-study-session', 'song-whispering-pines'],
    createdAt: '2025-02-16T10:00:00.000Z',
    updatedAt: '2025-02-16T10:00:00.000Z'
  }
];

export const initialCollections: UserCollection[] = [
  {
    id: 'collection-study-music',
    title: 'Study Music',
    description: 'My favorite songs while studying and reading.',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    userId: 'user-xean',
    userName: 'Xean Santos',
    songIds: ['song-tokyo-drizzle', 'song-study-session', 'song-whispering-pines'],
    createdAt: '2025-02-18T14:00:00.000Z',
    updatedAt: '2025-02-18T14:00:00.000Z'
  },
  {
    id: 'collection-workout-fuel',
    title: 'High Energy Energy',
    description: 'Uptempo pop and electronic tracks for workouts and running.',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    userId: 'user-xean',
    userName: 'Xean Santos',
    songIds: ['song-starlight-glow', 'song-dancing-alone', 'song-night-drive'],
    createdAt: '2025-02-19T09:00:00.000Z',
    updatedAt: '2025-02-19T09:00:00.000Z'
  }
];

export const initialLikedSongs: LikedSong[] = [
  { userId: 'user-xean', songId: 'song-night-drive', likedAt: '2025-02-15T19:00:00.000Z' },
  { userId: 'user-xean', songId: 'song-velvet-touch', likedAt: '2025-02-16T14:00:00.000Z' },
  { userId: 'user-xean', songId: 'song-tokyo-drizzle', likedAt: '2025-02-17T11:00:00.000Z' },
  { userId: 'user-xean', songId: 'song-starlight-glow', likedAt: '2025-02-18T20:00:00.000Z' }
];

export const initialHistory: ListeningHistory[] = [
  { id: 'hist-1', userId: 'user-xean', songId: 'song-night-drive', playedAt: '2025-02-24T22:30:00.000Z' },
  { id: 'hist-2', userId: 'user-xean', songId: 'song-starlight-glow', playedAt: '2025-02-24T22:35:00.000Z' },
  { id: 'hist-3', userId: 'user-xean', songId: 'song-velvet-touch', playedAt: '2025-02-24T22:40:00.000Z' },
  { id: 'hist-4', userId: 'user-xean', songId: 'song-tokyo-drizzle', playedAt: '2025-02-24T22:45:00.000Z' }
];

export const initialFollowedArtists: { userId: string; artistId: string }[] = [
  { userId: 'user-xean', artistId: 'artist-aurora-wave' },
  { userId: 'user-xean', artistId: 'artist-kai-sterling' },
  { userId: 'user-xean', artistId: 'artist-maya-lin' }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'all',
    title: 'Welcome to SONORA',
    message: 'Experience pristine audio streaming, personalized music discovery, and effortless playlists.',
    type: 'system',
    link: '/browse',
    isRead: false,
    createdAt: '2025-02-20T08:00:00.000Z'
  },
  {
    id: 'notif-2',
    userId: 'user-xean',
    title: 'New Album by Aurora Wave',
    message: 'Aurora Wave just dropped their new synthwave album "Midnight Odyssey"!',
    type: 'album',
    link: '/albums/album-midnight-odyssey',
    isRead: false,
    createdAt: '2025-02-22T12:00:00.000Z'
  },
  {
    id: 'notif-3',
    userId: 'admin',
    title: 'Catalog Health Check',
    message: 'All 10 initial master tracks and 5 albums are verified and online.',
    type: 'admin_alert',
    link: '/admin/music',
    isRead: false,
    createdAt: '2025-02-24T00:00:00.000Z'
  }
];

export const initialLogs: AdminActivityLog[] = [
  {
    id: 'log-1',
    adminId: 'user-admin',
    adminName: 'Administrator',
    action: 'Uploaded Master Audio',
    details: 'Uploaded audio file for song "Night Drive" (Aurora Wave)',
    targetType: 'song',
    targetId: 'song-night-drive',
    ipAddress: '127.0.0.1',
    createdAt: '2025-02-14T00:00:00.000Z'
  },
  {
    id: 'log-2',
    adminId: 'user-admin',
    adminName: 'Administrator',
    action: 'Created Album',
    details: 'Published new album "Midnight Odyssey" with 3 tracks',
    targetType: 'album',
    targetId: 'album-midnight-odyssey',
    ipAddress: '127.0.0.1',
    createdAt: '2025-02-14T00:05:00.000Z'
  },
  {
    id: 'log-3',
    adminId: 'user-admin',
    adminName: 'Administrator',
    action: 'Updated Featured List',
    details: 'Featured artist "Kai Sterling" and album "Velvet Skies"',
    targetType: 'artist',
    targetId: 'artist-kai-sterling',
    ipAddress: '127.0.0.1',
    createdAt: '2025-01-28T00:00:00.000Z'
  }
];

export const initialSettings: SystemSettings = {
  siteName: 'SONORA',
  tagline: 'Your Music. Your Moment.',
  allowUserRegistrations: true,
  maxUploadSizeBytes: 50 * 1024 * 1024,
  supportedAudioFormats: ['mp3', 'wav', 'm4a', 'aac'],
  defaultTheme: 'dark',
  requireEmailVerification: false,
  maintenanceMode: false,
  storageUsedBytes: 124500000
};
