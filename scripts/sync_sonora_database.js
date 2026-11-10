const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'sonora.json');
if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at:', dbPath);
  process.exit(1);
}

console.log('Loading database...');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!db.artists) db.artists = [];
if (!db.albums) db.albums = [];
if (!db.songs) db.songs = [];

// ==========================================
// 1. ARTISTS DEFINITIONS
// ==========================================
const newOrUpdatedArtists = [
  {
    id: 'artist-black-eyed-peas',
    name: 'The Black Eyed Peas',
    slug: 'the-black-eyed-peas',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/b170c8f135b376d49cb005728a49c910/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://cdn-images.dzcdn.net/images/artist/b170c8f135b376d49cb005728a49c910/1000x1000-000000-80-0-0.jpg',
    bio: 'The Black Eyed Peas are an American musical group founded in Los Angeles in 1995. Known for their infectious, genre-defying blend of hip-hop, pop, electro, and dance music, the group consists of will.i.am, apl.de.ap, Taboo, and J. Rey Soul, with legendary vocalist Fergie defining their golden era. They have sold over 80 million records worldwide, won 6 Grammy Awards, and generated iconic party anthems like "Where Is the Love?", "I Gotta Feeling", and "Boom Boom Pow".',
    country: 'United States',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    monthlyListeners: 38500000,
    followersCount: 16800000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/1yxSLGMDHlW21z4YXirZDS',
      instagram: 'https://instagram.com/bep',
      twitter: 'https://twitter.com/bep'
    },
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artist-wild-orchid',
    name: 'Wild Orchid',
    slug: 'wild-orchid',
    avatar: 'https://i.scdn.co/image/ab6761610000e5eb4e41bafe7f58a36c84c3111f',
    banner: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://i.scdn.co/image/ab6761610000e5eb4e41bafe7f58a36c84c3111f',
    bio: 'Wild Orchid was an American female R&B and dance-pop vocal trio formed in Los Angeles, comprising Stacy Ferguson (later known globally as Fergie), Stefanie Ridel, and Renee Sandstrom. Active throughout the late 1990s and early 2000s, Wild Orchid achieved critical acclaim and Billboard chart success with their tight, soulful harmonies and club-ready anthems including "At Night I Think of You", "Talk to Me", and "Supernatural".',
    country: 'United States',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 2450000,
    followersCount: 650000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/3SHqnNfkCHPlqeqMvOFy1O'
    },
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artist-lizzy-mcalpine',
    name: 'Lizzy McAlpine',
    slug: 'lizzy-mcalpine',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/95a53e839e4e69b512e03239a58b8d4f/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://cdn-images.dzcdn.net/images/artist/95a53e839e4e69b512e03239a58b8d4f/1000x1000-000000-80-0-0.jpg',
    bio: 'Lizzy McAlpine is an acclaimed American singer-songwriter from Philadelphia, Pennsylvania. Celebrated for her intricate lyrical craft, poignant emotional vulnerability, and atmospheric blend of indie folk, bedroom pop, and orchestral arrangements, McAlpine gained international recognition with her viral masterpiece "ceilings" and breakthrough albums "five seconds flat" and "Older".',
    country: 'United States',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    monthlyListeners: 18200000,
    followersCount: 5200000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/1GpEtyBhLHp5IIaFz4VqTZ',
      instagram: 'https://instagram.com/lizzymcalpine',
      twitter: 'https://twitter.com/lizzymcalpine'
    },
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artist-1788887469185',
    name: 'Olivia Rodrigo',
    slug: 'olivia-rodrigo',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/3ba7496669f9c7be7839ec9b053158c5/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://cdn-images.dzcdn.net/images/artist/3ba7496669f9c7be7839ec9b053158c5/1000x1000-000000-80-0-0.jpg',
    bio: 'Olivia Rodrigo is a three-time Grammy Award-winning American singer-songwriter and actress whose confessional songwriting, powerhouse vocals, and 90s alt-rock energy propelled her to global superstardom with record-shattering albums SOUR and GUTS.',
    country: 'United States',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 54000000,
    followersCount: 38000000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG',
      instagram: 'https://instagram.com/oliviarodrigo'
    },
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artist-1788896183680',
    name: 'Sabrina Carpenter',
    slug: 'sabrina-carpenter',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/f19f18e95dfeb6e21074e2d3df2ee287/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://cdn-images.dzcdn.net/images/artist/f19f18e95dfeb6e21074e2d3df2ee287/1000x1000-000000-80-0-0.jpg',
    bio: 'Sabrina Carpenter is a chart-topping American singer and songwriter acclaimed for her witty lyricism, charismatic vocal delivery, and infectious pop anthems like "Espresso", "Please Please Please", and the smash album Short n\' Sweet.',
    country: 'United States',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 68000000,
    followersCount: 32000000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/74KM79TiuVKeVCqs8QtB0B',
      instagram: 'https://instagram.com/sabrinacarpenter'
    },
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artist-custom-1788803603647',
    name: 'Adele',
    slug: 'adele',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/504a58409ff0a8d799042c1615f7b889/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://cdn-images.dzcdn.net/images/artist/504a58409ff0a8d799042c1615f7b889/1000x1000-000000-80-0-0.jpg',
    bio: 'Adele is an English singer-songwriter who is one of the world\'s best-selling music artists. Renowned for her soul-stirring mezzo-soprano voice and timeless romantic ballads, she has earned 16 Grammy Awards, an Academy Award, and millions of fans worldwide.',
    country: 'United Kingdom',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 52000000,
    followersCount: 46000000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY',
      instagram: 'https://instagram.com/adele'
    },
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'artist-1788899072979',
    name: 'CORTIS',
    slug: 'cortis',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsJuvJM0eirfRBxj4l8NpKSvlmCfpZvznSKk-X9Ypy9w&s=10',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsJuvJM0eirfRBxj4l8NpKSvlmCfpZvznSKk-X9Ypy9w&s=10',
    bio: 'CORTIS is a fast-rising energetic pop sensation pushing boundary-defying sonic landscapes with bold visuals, electric synth work, and irresistible hooks.',
    country: 'South Korea',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 4200000,
    followersCount: 1500000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

// Update or insert artists in db
for (const a of newOrUpdatedArtists) {
  const existingIdx = db.artists.findIndex(x => x.id === a.id || x.name.toLowerCase() === a.name.toLowerCase());
  if (existingIdx >= 0) {
    db.artists[existingIdx] = { ...db.artists[existingIdx], ...a };
    console.log(`Updated artist: ${a.name}`);
  } else {
    db.artists.push(a);
    console.log(`Added new artist: ${a.name}`);
  }
}

// ==========================================
// 2. ALBUMS DEFINITIONS
// ==========================================
const newAlbums = [
  // --- The Black Eyed Peas Discography ---
  {
    id: 'album-bep-behind-the-front',
    title: 'Behind the Front',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/2/23/Behind_the_Front.jpg',
    description: 'The debut studio album by The Black Eyed Peas, released in 1998, featuring conscious alternative hip-hop with live instrumentation and jazz influences.',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '1998-06-30',
    releaseYear: 1998,
    copyrightInfo: '© 1998 Interscope Records',
    status: 'published',
    isFeatured: false,
    songIds: ['song-bep-fallin-up', 'song-bep-joints-jam', 'song-bep-karma'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-bep-bridging-the-gap',
    title: 'Bridging the Gap',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Bridging_the_Gap_%28Black_Eyed_Peas_album%29.jpg',
    description: 'The second studio album by The Black Eyed Peas, featuring guest appearances from Macy Gray, Wyclef Jean, and Mos Def.',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2000-09-26',
    releaseYear: 2000,
    copyrightInfo: '© 2000 Interscope Records',
    status: 'published',
    isFeatured: false,
    songIds: ['song-bep-weekends', 'song-bep-request-line'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-bep-elephunk',
    title: 'Elephunk',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Elephunk.jpg/220px-Elephunk.jpg',
    description: 'The breakthrough third studio album by The Black Eyed Peas, introducing Fergie as lead vocalist and spawning global anthems "Where Is the Love?" and "Let\'s Get It Started".',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2003-06-24',
    releaseYear: 2003,
    copyrightInfo: '© 2003 Interscope Records',
    status: 'published',
    isFeatured: true,
    songIds: [
      'song-bep-where-is-the-love',
      'song-bep-shut-up',
      'song-bep-lets-get-it-started',
      'song-bep-hey-mama'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-bep-monkey-business',
    title: 'Monkey Business',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Monkey_Business_album_cover.jpg/220px-Monkey_Business_album_cover.jpg',
    description: 'The multi-platinum fourth studio album by The Black Eyed Peas, certified 4x Platinum with chart-topping smashes "Don\'t Phunk with My Heart", "My Humps", and "Pump It".',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2005-05-24',
    releaseYear: 2005,
    copyrightInfo: '© 2005 Interscope Records',
    status: 'published',
    isFeatured: true,
    songIds: [
      'song-bep-my-humps',
      'song-bep-dont-phunk',
      'song-bep-pump-it',
      'song-bep-dont-lie'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-bep-the-end',
    title: 'The E.N.D. (The Energy Never Dies)',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/The_E.N.D._album_cover.jpg/220px-The_E.N.D._album_cover.jpg',
    description: 'The monumental fifth studio album by The Black Eyed Peas that revolutionized modern dance-pop, holding the Billboard Hot 100 #1 spot for 26 consecutive weeks with "Boom Boom Pow" and "I Gotta Feeling".',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2009-06-09',
    releaseYear: 2009,
    copyrightInfo: '© 2009 Interscope Records',
    status: 'published',
    isFeatured: true,
    songIds: [
      'song-bep-boom-boom-pow',
      'song-bep-i-gotta-feeling',
      'song-bep-meet-me-halfway',
      'song-bep-imma-be',
      'song-bep-rock-that-body'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-bep-the-beginning',
    title: 'The Beginning',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/55/The_Beginning_%28Black_Eyed_Peas_album%29.jpg/220px-The_Beginning_%28Black_Eyed_Peas_album%29.jpg',
    description: 'The energetic sixth studio album by The Black Eyed Peas, continuing their futuristic electronic sound with worldwide hits "The Time (Dirty Bit)" and "Just Can\'t Get Enough".',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2010-11-26',
    releaseYear: 2010,
    copyrightInfo: '© 2010 Interscope Records',
    status: 'published',
    isFeatured: false,
    songIds: [
      'song-bep-the-time',
      'song-bep-just-cant-get-enough',
      'song-bep-don-t-stop-the-party'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-bep-translation',
    title: 'Translation',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/a/ad/Black_Eyed_Peas_-_Translation.png',
    description: 'The eighth studio album by The Black Eyed Peas, blending Latin pop, reggaeton, and electro with superstar collaborations including J Balvin, Shakira, and Ozuna.',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    releaseDate: '2020-06-19',
    releaseYear: 2020,
    copyrightInfo: '© 2020 Epic Records',
    status: 'published',
    isFeatured: false,
    songIds: ['song-bep-ritmo', 'song-bep-mamacita', 'song-bep-girl-like-me'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // --- Wild Orchid Discography ---
  {
    id: 'album-wild-orchid-self-titled',
    title: 'Wild Orchid',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/8/85/Wild_Orchid_Wild_Orchid_album.jpg',
    description: 'The acclaimed self-titled debut album by Wild Orchid, featuring infectious 90s dance-pop and R&B harmonies including Billboard Hot 100 hits "At Night I Think of You" and "Talk to Me".',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '1996-08-27',
    releaseYear: 1996,
    copyrightInfo: '© 1996 RCA Records',
    status: 'published',
    isFeatured: true,
    songIds: [
      'song-wo-at-night',
      'song-wo-talk-to-me',
      'song-wo-supernatural',
      'song-wo-follow-me',
      'song-wo-the-love-i-found'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-wild-orchid-oxygen',
    title: 'Oxygen',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Wild_Orchid_-_Oxygen.jpg',
    description: 'The second studio album by Wild Orchid, featuring a refined and mature blend of R&B ballads, vibrant funk, and dance-pop melodies including "Nothing but Trouble" and "Don\'t Worry".',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '1998-08-25',
    releaseYear: 1998,
    copyrightInfo: '© 1998 RCA Records',
    status: 'published',
    isFeatured: true,
    songIds: [
      'song-wo-nothing-but-trouble',
      'song-wo-dont-worry',
      'song-wo-holding-on',
      'song-wo-be-mine'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-wild-orchid-fire',
    title: 'Fire',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/0/05/Wild_Orchid_-_Fire.jpg',
    description: 'The third studio album by Wild Orchid, released in 2001, featuring high-octane dance-pop production and the popular title single "Fire".',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '2001-05-15',
    releaseYear: 2001,
    copyrightInfo: '© 2001 RCA Records',
    status: 'published',
    isFeatured: false,
    songIds: ['song-wo-fire', 'song-wo-stuttering', 'song-wo-world-without-you'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // --- Lizzy McAlpine Discography ---
  {
    id: 'album-lizzy-give-me-a-minute',
    title: 'Give Me a Minute',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b8d13c8743e1f6e0b4f4c3a6',
    description: 'The intimate debut studio album by Lizzy McAlpine, written while studying at Berklee College of Music, establishing her signature storytelling, fingerpicked acoustic guitar, and intricate vocal stacks.',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    releaseDate: '2020-08-13',
    releaseYear: 2020,
    copyrightInfo: '© 2020 Harbour Artists & Music',
    status: 'published',
    isFeatured: false,
    songIds: [
      'song-lizzy-give-me-a-minute',
      'song-lizzy-cleo',
      'song-lizzy-out-of-love',
      'song-lizzy-pancakes-for-dinner',
      'song-lizzy-apple-pie'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-lizzy-five-seconds-flat',
    title: 'five seconds flat',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8b6c3c8f3a4b7d4e9f1a2b3',
    description: 'The critically acclaimed breakthrough second studio album by Lizzy McAlpine, featuring the viral global sensation "ceilings", "doozy", "all my ghosts", and "reckless driving" (feat. Ben Platt).',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    releaseDate: '2022-04-08',
    releaseYear: 2022,
    copyrightInfo: '© 2022 AWAL Recordings',
    status: 'published',
    isFeatured: true,
    songIds: [
      'song-lizzy-ceilings',
      'song-lizzy-doozy',
      'song-lizzy-apple',
      'song-lizzy-defeater',
      'song-lizzy-you-suck',
      'song-lizzy-all-my-ghosts',
      'song-lizzy-reckless-driving'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-lizzy-older',
    title: 'Older',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2735c6e5a7b8c9d0e1f2a3b4c5d',
    description: 'The evocative third studio album by Lizzy McAlpine, recorded live in the room with a full band in Los Angeles, meditating with stark honesty on adulthood, grief, and emotional evolution.',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    releaseDate: '2024-04-05',
    releaseYear: 2024,
    copyrightInfo: '© 2024 RCA Records',
    status: 'published',
    isFeatured: true,
    songIds: [
      'song-lizzy-older',
      'song-lizzy-i-guess',
      'song-lizzy-come-down-soon',
      'song-lizzy-staying',
      'song-lizzy-drunk-running'
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

// Update or insert albums
for (const a of newAlbums) {
  const existingIdx = db.albums.findIndex(x => x.id === a.id);
  const albumData = { ...a, tracksCount: a.songIds.length };
  if (existingIdx >= 0) {
    db.albums[existingIdx] = { ...db.albums[existingIdx], ...albumData };
    console.log(`Updated album: ${a.title}`);
  } else {
    db.albums.push(albumData);
    console.log(`Added album: ${a.title}`);
  }
}

// Update artist albumIds list
for (const alb of db.albums) {
  const art = db.artists.find(x => x.id === alb.artistId);
  if (art) {
    if (!art.albumIds) art.albumIds = [];
    if (!art.albumIds.includes(alb.id)) {
      art.albumIds.push(alb.id);
    }
  }
}

// ==========================================
// 3. COMPLETE SOUNDTRACKS / SONGS DEFINITIONS
// ==========================================
const newSongs = [
  // --- The Black Eyed Peas Songs ---
  {
    id: 'song-bep-where-is-the-love',
    title: 'Where Is the Love?',
    originalFilename: 'where-is-the-love.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=WpYeekQkAdc',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Elephunk.jpg/220px-Elephunk.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-elephunk',
    albumTitle: 'Elephunk',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 236,
    releaseDate: '2003-06-24',
    description: 'A landmark socially conscious pop-rap anthem addressing war, racism, and human division, featuring heartfelt vocals from Justin Timberlake.',
    lyrics: "What's wrong with the world, mama\nPeople livin' like they ain't got no mamas\nI think the whole world's addicted to the drama\nOnly attracted to things that'll bring you trauma\nOverseas, yeah, we tryin' to stop terrorism\nBut we still got terrorists here livin'\nIn the USA, the big CIA, the Bloods and the Crips, and the KKK\n\nPeople killin', people dyin'\nChildren hurtin', hear them cryin'\nCan you practice what you preach?\nAnd would you turn the other cheek?\nFather, Father, Father help us\nSend some guidance from above\n'Cause people got me, got me questionin'\nWhere is the love?",
    syncedLyrics: [
      { time: 8, text: "What's wrong with the world, mama" },
      { time: 10, text: "People livin' like they ain't got no mamas" },
      { time: 12, text: "I think the whole world's addicted to the drama" },
      { time: 14, text: "Only attracted to things that'll bring you trauma" },
      { time: 43, text: "People killin', people dyin'" },
      { time: 45, text: "Children hurtin', hear them cryin'" },
      { time: 48, text: "Can you practice what you preach?" },
      { time: 50, text: "And would you turn the other cheek?" },
      { time: 53, text: "Where is the love?" }
    ],
    explicit: false,
    status: 'published',
    playCount: 1542000,
    likesCount: 98400,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['hip-hop', 'pop', 'classic', '2000s'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-shut-up',
    title: 'Shut Up',
    originalFilename: 'shut-up.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=UttfOSiCLhk',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Elephunk.jpg/220px-Elephunk.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-elephunk',
    albumTitle: 'Elephunk',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 212,
    releaseDate: '2003-11-10',
    description: 'An international chart-topping hip-hop single built around a heated argument between partners with infectious back-and-forth vocals.',
    lyrics: "Every time I try to talk to you, you say that I'm not making any sense\nAnd every time I try to leave, you always make me feel so guilty\n\nShut up, just shut up, shut up\nShut up, just shut up, shut up\nShut up, just shut up, shut up\nShut it up, just shut up",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 920000,
    likesCount: 65000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['hip-hop', 'pop', '2000s'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-lets-get-it-started',
    title: "Let's Get It Started",
    originalFilename: 'lets-get-it-started.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=IKqV7DB8Iwg',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Elephunk.jpg/220px-Elephunk.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-elephunk',
    albumTitle: 'Elephunk',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 232,
    releaseDate: '2004-03-16',
    description: 'A high-octane stadium anthem and Grammy Award winner for Best Rap Performance by a Duo or Group.',
    lyrics: "In this context, there's no disrespect\nSo when I bust my rhyme, you break your necks\nWe got five minutes for us to disconnect\nFrom all intellect and let the rhythm effect\n\nLet's get it started in here!\nLet's get it started in here!",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 1250000,
    likesCount: 89000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['hip-hop', 'party', '2000s'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-hey-mama',
    title: 'Hey Mama',
    originalFilename: 'hey-mama.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=nNHE7SdlElQ',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Elephunk.jpg/220px-Elephunk.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-elephunk',
    albumTitle: 'Elephunk',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 220,
    releaseDate: '2004-07-20',
    description: 'An uptempo dancehall-infused hip-hop track driven by acoustic guitar licks and Fergie\'s unmistakable energetic hooks.',
    lyrics: "Hey mama, hey mama, hey mama, hey mama\nThis beat got me feelin' right\nWe gon' party all through the night",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 840000,
    likesCount: 52000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['hip-hop', 'dancehall'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-my-humps',
    title: 'My Humps',
    originalFilename: 'my-humps.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=_Ek6K8RQHQ0',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Monkey_Business_album_cover.jpg/220px-Monkey_Business_album_cover.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-monkey-business',
    albumTitle: 'Monkey Business',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 325,
    releaseDate: '2005-09-27',
    description: 'One of the defining pop-rap sensations of the mid-2000s, winning the Grammy Award for Best Pop Performance.',
    lyrics: "What you gonna do with all that junk?\nAll that junk inside your trunk?\nI'ma get, get, get, get you drunk\nGet you love drunk off my hump\nMy hump, my hump, my hump, my hump, my hump\nMy lovely little lumps",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 2100000,
    likesCount: 145000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['hip-hop', 'pop', '2000s'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-dont-phunk',
    title: "Don't Phunk with My Heart",
    originalFilename: 'dont-phunk-with-my-heart.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=DGhZBqJdGrU',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Monkey_Business_album_cover.jpg/220px-Monkey_Business_album_cover.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-monkey-business',
    albumTitle: 'Monkey Business',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 230,
    releaseDate: '2005-04-05',
    description: 'A Grammy Award-winning electro-funk hit innovatively sampling classic Indian cinema soundscapes.',
    lyrics: "No, no, no, no, don't phunk with my heart\nI wonder if I take you home\nWould you still be in love, baby, in love, baby?\nI wanna know for sure",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 1300000,
    likesCount: 87000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['hip-hop', 'pop', 'funk'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-pump-it',
    title: 'Pump It',
    originalFilename: 'pump-it.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=ZaI2IlHwmgQ',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Monkey_Business_album_cover.jpg/220px-Monkey_Business_album_cover.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-monkey-business',
    albumTitle: 'Monkey Business',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 213,
    releaseDate: '2006-03-03',
    description: 'A heart-pounding hip-hop anthem built around Dick Dale\'s surf guitar classic "Misirlou".',
    lyrics: "Pump it! Louder! Turn up the radio, blast your stereo!\nRight now, a nigga wanna dance\nA nigga wanna get down, uh!",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 1980000,
    likesCount: 130000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['hip-hop', 'surf-rock', 'party'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-i-gotta-feeling',
    title: 'I Gotta Feeling',
    originalFilename: 'i-gotta-feeling.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=uSD4vsh1zDA',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/The_E.N.D._album_cover.jpg/220px-The_E.N.D._album_cover.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-the-end',
    albumTitle: 'The E.N.D. (The Energy Never Dies)',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 289,
    releaseDate: '2009-05-21',
    description: 'One of the best-selling digital singles in history produced with David Guetta, capturing pure unadulterated celebratory joy.',
    lyrics: "I gotta feeling that tonight's gonna be a good night\nThat tonight's gonna be a good night\nThat tonight's gonna be a good, good night!\nTonight's the night, let's live it up\nI got my money, let's spend it up\nGo out and smash it like, \"Oh my God!\"\nJump off that sofa, let's kick it, off!",
    syncedLyrics: [
      { time: 10, text: "I gotta feeling that tonight's gonna be a good night" },
      { time: 17, text: "That tonight's gonna be a good night" },
      { time: 23, text: "That tonight's gonna be a good, good night" },
      { time: 31, text: "Tonight's the night, let's live it up" },
      { time: 35, text: "I got my money, let's spend it up" }
    ],
    explicit: false,
    status: 'published',
    playCount: 3500000,
    likesCount: 240000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['dance', 'pop', 'party', 'legendary'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-boom-boom-pow',
    title: 'Boom Boom Pow',
    originalFilename: 'boom-boom-pow.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=E8UfkjCNFas',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/The_E.N.D._album_cover.jpg/220px-The_E.N.D._album_cover.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-the-end',
    albumTitle: 'The E.N.D. (The Energy Never Dies)',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 215,
    releaseDate: '2009-03-10',
    description: 'A revolutionary futuristic electro-rap chart-topper that held the #1 spot on the US Billboard Hot 100 for 12 weeks.',
    lyrics: "Gotta get that, gotta get that\nBoom boom boom, gotta get that\nBoom boom boom, gotta get that boom boom boom!\nI'm so three thousand and eight, you so two thousand and late!",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 2800000,
    likesCount: 190000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['electronic', 'hip-hop', 'electro-pop'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-meet-me-halfway',
    title: 'Meet Me Halfway',
    originalFilename: 'meet-me-halfway.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=N-b1DvR3f04',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/The_E.N.D._album_cover.jpg/220px-The_E.N.D._album_cover.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-the-end',
    albumTitle: 'The E.N.D. (The Energy Never Dies)',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 258,
    releaseDate: '2009-10-06',
    description: 'An atmospheric electro-pop ballad featuring sweeping synths and an unforgettable vocal performance by Fergie.',
    lyrics: "Can you meet me halfway, right at the borderline?\nThat's where I'm gonna wait for you\nI'll be lookin' out, night and day\nTook my heart to the limit, and this is where I'll stay",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 1750000,
    likesCount: 120000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['synth-pop', 'ballad', '2000s'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-the-time',
    title: 'The Time (Dirty Bit)',
    originalFilename: 'the-time-dirty-bit.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=KbyBKN_GDVY',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/55/The_Beginning_%28Black_Eyed_Peas_album%29.jpg/220px-The_Beginning_%28Black_Eyed_Peas_album%29.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-the-beginning',
    albumTitle: 'The Beginning',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 275,
    releaseDate: '2010-11-02',
    description: 'A club-filling electro-house party anthem transforming "(I\'ve Had) The Time of My Life" into a modern festival banger.',
    lyrics: "I've had the time of my life, and I've never felt this way before\nYes, I swear, it's the truth, and I owe it all to you!\nDirty bit!",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 1890000,
    likesCount: 135000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['electro-house', 'party'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-bep-just-cant-get-enough',
    title: "Just Can't Get Enough",
    originalFilename: 'just-cant-get-enough.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=BRqUFxlWv5Q',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/55/The_Beginning_%28Black_Eyed_Peas_album%29.jpg/220px-The_Beginning_%28Black_Eyed_Peas_album%29.jpg',
    artistId: 'artist-black-eyed-peas',
    artistName: 'The Black Eyed Peas',
    albumId: 'album-bep-the-beginning',
    albumTitle: 'The Beginning',
    genreId: 'genre-hiphop',
    genreName: 'Hip-Hop',
    duration: 219,
    releaseDate: '2011-01-14',
    description: 'A smooth electro-R&B crossover hitting #3 on the Billboard Hot 100 with an emotive music video filmed in Tokyo.',
    lyrics: "Honey, got her heart so big, but her body can't handle it\nI just can't get enough, oh!\nI just can't get enough, oh!",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 1600000,
    likesCount: 110000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Interscope Records',
    source: 'YouTube',
    tags: ['electro-pop', 'rnb'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // --- Wild Orchid Songs ---
  {
    id: 'song-wo-at-night',
    title: 'At Night I Think of You',
    originalFilename: 'at-night-i-think-of-you.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=6fY8T1LKWzg',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/8/85/Wild_Orchid_Wild_Orchid_album.jpg',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    albumId: 'album-wild-orchid-self-titled',
    albumTitle: 'Wild Orchid',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 254,
    releaseDate: '1996-09-01',
    description: 'Wild Orchid\'s breakthrough debut single, featuring sparkling vocal production and tight three-part harmonies.',
    lyrics: "At night I think of you, I want to be with you\nAnd at night I think of you, oh, I think of you\nI spend my days just wishing that you were here with me\nAnd every night I'm missing your loving company",
    syncedLyrics: [
      { time: 14, text: "At night I think of you" },
      { time: 18, text: "I want to be with you" },
      { time: 22, text: "And at night I think of you" }
    ],
    explicit: false,
    status: 'published',
    playCount: 320000,
    likesCount: 24000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'RCA Records',
    source: 'YouTube',
    tags: ['90s', 'dance-pop', 'rnb', 'girl-group'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-wo-talk-to-me',
    title: 'Talk to Me',
    originalFilename: 'talk-to-me.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=hBX9WNX3NAs',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/8/85/Wild_Orchid_Wild_Orchid_album.jpg',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    albumId: 'album-wild-orchid-self-titled',
    albumTitle: 'Wild Orchid',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 241,
    releaseDate: '1997-01-01',
    description: 'A smooth R&B dance groove highlighting Stacy Ferguson\'s soulful vocal chops.',
    lyrics: "Talk to me, baby, tell me what's on your mind\nDon't keep it inside, no, let love unwind\nTalk to me, talk to me!",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 260000,
    likesCount: 19000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'RCA Records',
    source: 'YouTube',
    tags: ['90s', 'rnb', 'dance'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-wo-supernatural',
    title: 'Supernatural',
    originalFilename: 'supernatural.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=6rPPtHQNrjM',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/8/85/Wild_Orchid_Wild_Orchid_album.jpg',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    albumId: 'album-wild-orchid-self-titled',
    albumTitle: 'Wild Orchid',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 236,
    releaseDate: '1997-03-01',
    description: 'An upbeat 90s dance-pop track with soaring harmonies and playful hooks.',
    lyrics: "It's supernatural, the way I feel for you\nIt's supernatural, I know it must be true\nThere's no explanation for the magic that we do",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 195000,
    likesCount: 14000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'RCA Records',
    source: 'YouTube',
    tags: ['90s', 'pop'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-wo-nothing-but-trouble',
    title: 'Nothing but Trouble',
    originalFilename: 'nothing-but-trouble.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=CnEHk1SfpQY',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Wild_Orchid_-_Oxygen.jpg',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    albumId: 'album-wild-orchid-oxygen',
    albumTitle: 'Oxygen',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 228,
    releaseDate: '1998-09-01',
    description: 'A sassy, confident pop-funk track from Wild Orchid\'s second album Oxygen.',
    lyrics: "He's nothing but trouble, nothing but trouble\nStay away from that boy, he'll only break your joy",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 180000,
    likesCount: 12500,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'RCA Records',
    source: 'YouTube',
    tags: ['90s', 'funk', 'pop'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-wo-dont-worry',
    title: "Don't Worry",
    originalFilename: 'dont-worry.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=BQ_oUMKSQ2c',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Wild_Orchid_-_Oxygen.jpg',
    artistId: 'artist-wild-orchid',
    artistName: 'Wild Orchid',
    albumId: 'album-wild-orchid-oxygen',
    albumTitle: 'Oxygen',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 219,
    releaseDate: '1998-10-01',
    description: 'A warm, soothing R&B-pop ballad offering comforting melodies and rich layered vocals.',
    lyrics: "Don't worry, don't worry, everything will be alright\nDon't worry, don't worry, I'll be there to hold you tight",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 150000,
    likesCount: 11000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'RCA Records',
    source: 'YouTube',
    tags: ['90s', 'ballad'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // --- Lizzy McAlpine Songs ---
  {
    id: 'song-lizzy-ceilings',
    title: 'ceilings',
    originalFilename: 'ceilings.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=u8p_Z18h_A4',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8b6c3c8f3a4b7d4e9f1a2b3',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-five-seconds-flat',
    albumTitle: 'five seconds flat',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 182,
    releaseDate: '2022-04-08',
    description: 'The monumental viral masterpiece that reached the global top 10, building from delicate acoustic strumming to an explosive orchestral release with a heartbreaking twist ending.',
    lyrics: "Ceilings, plaster\nCan't you just make it go faster?\nLovely to be here with you\nWalkin' me home in the cold\n\nAnd it feels like the start of a movie I've seen before\nBefore I get to the part where you kiss me in your car\nAnd it feels like the start of a movie I've seen before\nBefore I wake up alone in my bed\nAnd it was all in my head",
    syncedLyrics: [
      { time: 10, text: "Ceilings, plaster" },
      { time: 14, text: "Can't you just make it go faster?" },
      { time: 19, text: "Lovely to be here with you" },
      { time: 24, text: "Walkin' me home in the cold" },
      { time: 66, text: "And it feels like the start of a movie I've seen before" },
      { time: 105, text: "Before I wake up alone in my bed" },
      { time: 112, text: "And it was all in my head" }
    ],
    explicit: false,
    status: 'published',
    playCount: 4200000,
    likesCount: 310000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'AWAL Recordings',
    source: 'YouTube',
    tags: ['indie-folk', 'acoustic', 'viral', 'masterpiece'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-lizzy-doozy',
    title: 'doozy',
    originalFilename: 'doozy.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=7IJBgRLH_pM',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8b6c3c8f3a4b7d4e9f1a2b3',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-five-seconds-flat',
    albumTitle: 'five seconds flat',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 172,
    releaseDate: '2022-04-08',
    description: 'An intimate, hypnotically looped acoustic confession featuring whisper-close vocal textures and lush vocal stacks.',
    lyrics: "It's such a doozy falling for you\nI don't know what to do\nEvery single word you say makes me want to stay",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 650000,
    likesCount: 48000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'AWAL Recordings',
    source: 'YouTube',
    tags: ['indie', 'acoustic', 'bedroom-pop'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-lizzy-apple',
    title: 'apple',
    originalFilename: 'apple.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=9MlNLqMMCUA',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8b6c3c8f3a4b7d4e9f1a2b3',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-five-seconds-flat',
    albumTitle: 'five seconds flat',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 219,
    releaseDate: '2022-04-08',
    description: 'A bittersweet coming-of-age track with lush folk-pop production and exquisite melodic dynamics.',
    lyrics: "I was just a kid when I first knew how I felt\nSomething about the way the sunlight hit made me want to melt\nAnd I thought I knew what I was doing all along\nBut I was wrong, I was just a kid",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 780000,
    likesCount: 56000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'AWAL Recordings',
    source: 'YouTube',
    tags: ['indie-folk', 'acoustic'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-lizzy-defeater',
    title: 'defeater',
    originalFilename: 'defeater.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=AHbh0MPGPN8',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8b6c3c8f3a4b7d4e9f1a2b3',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-five-seconds-flat',
    albumTitle: 'five seconds flat',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 203,
    releaseDate: '2022-04-08',
    description: 'A quietly devastating ballad exploring the exhaustion of holding onto a relationship slipping away.',
    lyrics: "I'm not a defeater, but I'm tired of fighting\nI'm not a retreater, but I'm tired of hiding\nFrom all the things that I know to be true\nI'm done fighting for you",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 520000,
    likesCount: 39000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'AWAL Recordings',
    source: 'YouTube',
    tags: ['indie-folk', 'breakup'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-lizzy-you-suck',
    title: 'you suck',
    originalFilename: 'you-suck.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=U4c3D7fMiCg',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a8b6c3c8f3a4b7d4e9f1a2b3',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-five-seconds-flat',
    albumTitle: 'five seconds flat',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 185,
    releaseDate: '2022-04-08',
    description: 'A witty, relatable bedroom-pop confessional that tackles unwanted romantic attachments with humorous self-awareness.',
    lyrics: "You suck, and I hate that I love you\nYou suck, and I wish I could stop\nYou suck, but here I am still thinking about you",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 890000,
    likesCount: 67000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'AWAL Recordings',
    source: 'YouTube',
    tags: ['bedroom-pop', 'indie'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-lizzy-cleo',
    title: 'cleo',
    originalFilename: 'cleo.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=xOFhJjmhx_Y',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b8d13c8743e1f6e0b4f4c3a6',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-give-me-a-minute',
    albumTitle: 'Give Me a Minute',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 198,
    releaseDate: '2020-08-13',
    description: 'A tender, fingerpicked acoustic ballad from her debut studio album featuring delicate harmonies and narrative lyricism.',
    lyrics: "I had a dream about you last night\nAnd I haven't had one of those in a while\nI woke up and the sun was not quite right, I don't know why",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 640000,
    likesCount: 45000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Harbour Artists & Music',
    source: 'YouTube',
    tags: ['acoustic', 'folk'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-lizzy-pancakes-for-dinner',
    title: 'Pancakes for Dinner',
    originalFilename: 'pancakes-for-dinner.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=9dJjlMUBrDI',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273b8d13c8743e1f6e0b4f4c3a6',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-give-me-a-minute',
    albumTitle: 'Give Me a Minute',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 202,
    releaseDate: '2020-08-13',
    description: 'One of Lizzy McAlpine\'s most beloved fan favorites, expressing a sweet yearning to spend quiet, mundane domestic moments with someone you adore.',
    lyrics: "I wanna eat pancakes for dinner\nI wanna get stuck in your head\nI wanna make you feel like a winner\nWhen you're layin' in bed",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 1100000,
    likesCount: 82000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Harbour Artists & Music',
    source: 'YouTube',
    tags: ['acoustic', 'indie-folk', 'love'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-lizzy-older',
    title: 'Older',
    originalFilename: 'older.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=J7CWl2LrMF8',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2735c6e5a7b8c9d0e1f2a3b4c5d',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-older',
    albumTitle: 'Older',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 241,
    releaseDate: '2024-04-05',
    description: 'The title track of her third studio album, a stark piano ballad exploring the passage of time, the gravity of growing up, and the acceptance of change.',
    lyrics: "I'm getting older, and I don't know how to feel\nI'm getting older, and it starts to feel so real\nI thought by now I'd have it figured out\nOver and over, a year older",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 950000,
    likesCount: 71000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'RCA Records',
    source: 'YouTube',
    tags: ['piano-ballad', 'indie', 'reflective'],
    isFeatured: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'song-lizzy-i-guess',
    title: 'I Guess',
    originalFilename: 'i-guess.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=9pzL8lZH8S4',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2735c6e5a7b8c9d0e1f2a3b4c5d',
    artistId: 'artist-lizzy-mcalpine',
    artistName: 'Lizzy McAlpine',
    albumId: 'album-lizzy-older',
    albumTitle: 'Older',
    genreId: 'genre-acoustic',
    genreName: 'Acoustic',
    duration: 218,
    releaseDate: '2024-04-05',
    description: 'A beautifully arranged live-to-tape indie folk track featuring brass swells and introspective lyrics.',
    lyrics: "I guess it's all about timing\nI guess it's all about how you hold it together\nWhen the weather changes",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 720000,
    likesCount: 54000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'RCA Records',
    source: 'YouTube',
    tags: ['indie-folk', 'acoustic'],
    isFeatured: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

// Update or insert songs
for (const s of newSongs) {
  const existingIdx = db.songs.findIndex(x => x.id === s.id);
  if (existingIdx >= 0) {
    db.songs[existingIdx] = { ...db.songs[existingIdx], ...s };
    console.log(`Updated song: ${s.title}`);
  } else {
    db.songs.push(s);
    console.log(`Added song: ${s.title}`);
  }
}

// Ensure album songIds include all corresponding songs
for (const alb of db.albums) {
  const matchingSongs = db.songs.filter(s => s.albumId === alb.id);
  if (matchingSongs.length > 0) {
    const ids = matchingSongs.map(s => s.id);
    alb.songIds = Array.from(new Set([...(alb.songIds || []), ...ids]));
    alb.tracksCount = alb.songIds.length;
  }
}

console.log('Writing updated database to data/sonora.json using streaming writer...');
const tempPath = path.join(process.cwd(), 'data', 'sonora_temp.json');
const writeStream = fs.createWriteStream(tempPath, { encoding: 'utf8' });

writeStream.write('{\n');
const keys = Object.keys(db);
for (let i = 0; i < keys.length; i++) {
  const k = keys[i];
  writeStream.write(`  ${JSON.stringify(k)}: `);
  const val = db[k];
  if (Array.isArray(val)) {
    writeStream.write('[\n');
    for (let j = 0; j < val.length; j++) {
      writeStream.write('    ' + JSON.stringify(val[j]));
      if (j < val.length - 1) writeStream.write(',\n');
      else writeStream.write('\n');
    }
    writeStream.write('  ]');
  } else {
    writeStream.write(JSON.stringify(val, null, 2));
  }
  if (i < keys.length - 1) writeStream.write(',\n');
  else writeStream.write('\n');
}
writeStream.write('}\n');

writeStream.end(() => {
  fs.copyFileSync(tempPath, dbPath);
  fs.unlinkSync(tempPath);
  console.log('--- SYNC COMPLETED SUCCESSFULLY ---');
  console.log('Total Artists:', db.artists.length);
  console.log('Total Albums:', db.albums.length);
  console.log('Total Songs:', db.songs.length);

  const targets = ['The Black Eyed Peas', 'Wild Orchid', 'Lizzy McAlpine'];
  for (const t of targets) {
    const art = db.artists.find(a => a.name.toLowerCase() === t.toLowerCase());
    const albs = db.albums.filter(a => (a.artistName || '').toLowerCase() === t.toLowerCase() || a.artistId === art?.id);
    const sngs = db.songs.filter(s => (s.artistName || '').toLowerCase() === t.toLowerCase() || s.artistId === art?.id);
    console.log(`VERIFICATION [${t}]:`);
    console.log(`  Artist: ${art ? `${art.name} (ID: ${art.id}, Listeners: ${art.monthlyListeners})` : 'MISSING'}`);
    console.log(`  Albums (${albs.length}): ${albs.map(a => a.title).join(', ')}`);
    console.log(`  Soundtracks/Songs (${sngs.length}): ${sngs.map(s => s.title).join(', ')}`);
  }
});
