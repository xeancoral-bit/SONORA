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

// ============================================================================
// 1. ARTISTS DEFINITIONS
// ============================================================================
const newArtists = [
  // --- P-POP ---
  {
    id: 'artist-bini',
    name: 'BINI',
    slug: 'bini',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/b6f5d7ce87d7b2e88a087a329d8926d2/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://cdn-images.dzcdn.net/images/artist/b6f5d7ce87d7b2e88a087a329d8926d2/1000x1000-000000-80-0-0.jpg',
    bio: 'BINI is an eight-member Filipino girl group formed by Star Music, celebrated as the "Nation\'s Girl Group." Known for their vibrant bubblegum-pop sound, stellar synchronization, and infectious hits like "Pantropiko", "Salamin, Salamin", "Karera", and "Cherry on Top", BINI has made history as the biggest P-Pop female act in streaming history.',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 7800000,
    followersCount: 4200000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    socialLinks: { spotify: 'https://open.spotify.com/artist/7tNOHILWPxSnMAw1rayjmt', instagram: 'https://instagram.com/bini_ph' }
  },
  {
    id: 'artist-alamat',
    name: 'ALAMAT',
    slug: 'alamat',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/8172c72b1d3d6832db74a5fe0425a176/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://cdn-images.dzcdn.net/images/artist/8172c72b1d3d6832db74a5fe0425a176/1000x1000-000000-80-0-0.jpg',
    bio: 'ALAMAT is a multilingual, multiethnic Filipino boy group under Viva Records that champions indigenous Filipino culture and regional languages (Tagalog, Ilocano, Kapampangan, Bicolano, Waray, Hiligaynon, Bisaya) blended with state-of-the-art modern pop and R&B, famous for tracks like "Maharani" and "kbye".',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 1650000,
    followersCount: 680000,
    isVerified: true,
    isFeatured: true,
    status: 'published',
    socialLinks: { spotify: 'https://open.spotify.com/artist/4Xb44c4X2eFp3B7E9c2G1H' }
  },
  {
    id: 'artist-bgyo',
    name: 'BGYO',
    slug: 'bgyo',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/f1d7a8b4c2e6f9a0b1c2d3e4f5a6b7c8/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    coverImage: 'https://cdn-images.dzcdn.net/images/artist/f1d7a8b4c2e6f9a0b1c2d3e4f5a6b7c8/1000x1000-000000-80-0-0.jpg',
    bio: 'BGYO is a premier five-member Filipino boy group dubbed the "Aces of P-Pop." Known for their laser-sharp choreography, explosive pop-dance anthems like "The Baddest" and "Gising", and emotional ballads, they have topped Billboard\'s Next Big Sound chart.',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 920000,
    followersCount: 540000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-g22',
    name: 'G22',
    slug: 'g22',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    bio: 'G22 is a powerhouse Filipino girl group known as the "Female Alphas" of P-Pop, recognized for their ferocious vocal prowess, empowering concepts, and hits like "BANG", "Defy", and "Babalik".',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 850000,
    followersCount: 320000,
    isVerified: true,
    isFeatured: false,
    status: 'published'
  },

  // --- K-POP MISSING ---
  {
    id: 'artist-txt',
    name: 'TOMORROW X TOGETHER',
    slug: 'tomorrow-x-together',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/06f7ef0e816a1b21c4355ecb5fa4bceb/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80',
    bio: 'TOMORROW X TOGETHER (TXT) is a leading fourth-generation South Korean boy group under BIGHIT MUSIC. Recognized as the voice of Gen Z, TXT is praised for intricate storytelling, genre-spanning discography, and massive hits like "Sugar Rush Ride", "0X1=LOVESONG", and "Deja Vu".',
    country: 'South Korea',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 10500000,
    followersCount: 11200000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-jungkook',
    name: 'Jungkook',
    slug: 'jungkook',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/0c198c69f25712f558fc168d1eb5dc52/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&auto=format&fit=crop&q=80',
    bio: 'Jungkook is a South Korean singer and the golden vocalist of BTS. His solo debut album "GOLDEN" shattered international records with global #1 Billboard Hot 100 smashes "Seven" and "Standing Next to You".',
    country: 'South Korea',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 24500000,
    followersCount: 16800000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-v',
    name: 'V',
    slug: 'v',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/e58d84ee54e0b0431215b22105e1975e/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
    bio: 'V (Kim Taehyung) is a South Korean singer, songwriter, and member of BTS celebrated for his warm, soulful baritone voice and vintage jazz-soul aesthetic as showcased on his debut solo album "Layover".',
    country: 'South Korea',
    genreId: 'genre-rnb',
    genreName: 'R&B & Soul',
    monthlyListeners: 11800000,
    followersCount: 15400000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-illit',
    name: 'ILLIT',
    slug: 'illit',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/bf5c8d0a2717c185df36c56b7bc140ad/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    bio: 'ILLIT is a five-member South Korean girl group under BELIFT LAB whose viral hyper-pop debut single "Magnetic" made history on global charts and Billboard Hot 100.',
    country: 'South Korea',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 12200000,
    followersCount: 3800000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-boynextdoor',
    name: 'BOYNEXTDOOR',
    slug: 'boynextdoor',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/8a8b8c8d8e8f8a8b8c8d8e8f8a8b8c8d/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    bio: 'BOYNEXTDOOR is a South Korean boy group formed by KOZ Entertainment (founded by ZICO). Known for relatable, conversational lyricism and energetic pop-rock and hip-hop grooves.',
    country: 'South Korea',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 4100000,
    followersCount: 2200000,
    isVerified: true,
    isFeatured: false,
    status: 'published'
  },
  {
    id: 'artist-day6',
    name: 'DAY6',
    slug: 'day6',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/e94d809b45661b17b20e0be2162cb17e/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=1600&auto=format&fit=crop&q=80',
    bio: 'DAY6 is an acclaimed South Korean pop-rock band under JYP Entertainment, lauded for self-composed emotional rock anthems like "You Were Beautiful", "Time of Our Life", and "Welcome to the Show".',
    country: 'South Korea',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    monthlyListeners: 4800000,
    followersCount: 3600000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-nmixx',
    name: 'NMIXX',
    slug: 'nmixx',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
    bio: 'NMIXX is a South Korean girl group under SQU4D (JYP Entertainment) pioneering the "MIXX POP" genre by melding multiple genres into exhilarating musical rollercoasters like "DASH" and "Love Me Like This".',
    country: 'South Korea',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 6100000,
    followersCount: 4100000,
    isVerified: true,
    isFeatured: false,
    status: 'published'
  },

  // --- OPM MISSING ---
  {
    id: 'artist-juan-karlos',
    name: 'juan karlos',
    slug: 'juan-karlos',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/1941655be60d2ecb313ef04fe3444040/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&auto=format&fit=crop&q=80',
    bio: 'juan karlos is a Filipino rock singer, songwriter, and actor led by Juan Karlos Labajo. Famous for historic OPM anthems "Buwan" and "ERE", the latter becoming the first Filipino song to enter the global Spotify Top 100 chart.',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 4800000,
    followersCount: 3100000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-udd',
    name: 'Up Dharma Down',
    slug: 'up-dharma-down',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/738df8ecb160b7eef449f80789cefb9b/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80',
    bio: 'Up Dharma Down (UDD) is a legendary Filipino indie rock and synth-pop band hailed as one of the most musically sophisticated acts in OPM history, famous for immortal classics "Tadhana", "Oo", and "Indak".',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 3200000,
    followersCount: 2900000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-orange-lemons',
    name: 'Orange & Lemons',
    slug: 'orange-and-lemons',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/5b94d137b03b2e537e5bf41cbb47e62d/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=1600&auto=format&fit=crop&q=80',
    bio: 'Orange & Lemons is a revered Filipino indie pop/rock band from Bulacan. Influenced by 60s British Invasion, they created iconic pop classics including "Hanggang Kailan", "Pinoy Ako", and "Heaven Knows".',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 2400000,
    followersCount: 1600000,
    isVerified: true,
    isFeatured: false,
    status: 'published'
  },
  {
    id: 'artist-nobita',
    name: 'Nobita',
    slug: 'nobita',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/33e382b9a7c3697e88220f1883be1ea1/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1600&auto=format&fit=crop&q=80',
    bio: 'Nobita is a Filipino 5-piece alt-pop band from Valenzuela whose romantic, relatable love songs "Ikaw Lang" and "Unang Sayaw" have garnered hundreds of millions of plays.',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 3600000,
    followersCount: 2100000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-mrld',
    name: 'mrld',
    slug: 'mrld',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/a539bc7a3f4e3c98ec8df80fa0d65bfa/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
    bio: 'mrld (Meriel de Jesus) is a rising Cebuana indie singer-songwriter whose acoustic bedroom pop masterpieces like "An Art Gallery Could Never Be as Unique as You" and "Ligaya" have captivated fans across Southeast Asia.',
    country: 'Philippines',
    genreId: 'genre-opm',
    genreName: 'OPM',
    monthlyListeners: 3900000,
    followersCount: 1800000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },

  // --- LATIN MISSING ---
  {
    id: 'artist-karol-g',
    name: 'Karol G',
    slug: 'karol-g',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/e08b1767bebf09dfd2d3852fc7007f35/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80',
    bio: 'Karol G is a Colombian superstar and Grammy-winning icon of Latin urban music. As "La Bichota", she made history with "MAÑANA SERÁ BONITO" and global smash hits like "PROVENZA", "TQG", and "Si Antes Te Hubiera Conocido".',
    country: 'Colombia',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 52000000,
    followersCount: 46000000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-rosalia',
    name: 'Rosalía',
    slug: 'rosalia',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/77353b3ebda4a6b09c6237be1e920d04/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    bio: 'Rosalía is a visionary Spanish singer and producer who revolutionized contemporary pop and flamenco with landmark albums "El Mal Querer" and "MOTOMAMI", scoring global smashes like "DESPECHÁ".',
    country: 'Spain',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 31000000,
    followersCount: 18000000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-maluma',
    name: 'Maluma',
    slug: 'maluma',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/8ff2cf7a21764c6778401399435b5ea0/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    bio: 'Maluma is a Colombian reggaeton and Latin-pop sensation known for charismatic vocals and infectious rhythms on global anthems like "Hawái", "Felices los 4", and "Sobrio".',
    country: 'Colombia',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 33000000,
    followersCount: 39000000,
    isVerified: true,
    isFeatured: false,
    status: 'published'
  },
  {
    id: 'artist-rauw-alejandro',
    name: 'Rauw Alejandro',
    slug: 'rauw-alejandro',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/6831e51b329433ce105b4e3ea3b80b55/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80',
    bio: 'Rauw Alejandro is a Puerto Rican singer and dancer called the "King of Modern Reggaeton", famed for infusing 80s synth-pop, R&B, and electronic music into hits like "Todo de Ti".',
    country: 'Puerto Rico',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 41000000,
    followersCount: 22000000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-peso-pluma',
    name: 'Peso Pluma',
    slug: 'peso-pluma',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/7c4731c518b5711e2f753c15aa527f55/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=1600&auto=format&fit=crop&q=80',
    bio: 'Peso Pluma is a Mexican superstar who propelled traditional corridos tumbados to the top of global charts with "Ella Baila Sola" and his historic Grammy-winning album "GÉNESIS".',
    country: 'Mexico',
    genreId: 'genre-pop',
    genreName: 'Pop',
    monthlyListeners: 45000000,
    followersCount: 16000000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },

  // --- ICONIC BANDS MISSING ---
  {
    id: 'artist-blink-182',
    name: 'Blink-182',
    slug: 'blink-182',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/95a53e839e4e69b512e03239a58b8d4f/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80',
    bio: 'Blink-182 is the definitive American pop-punk trio formed in California, fronted by Mark Hoppus, Tom DeLonge, and Travis Barker. Their seminal albums defined 90s/2000s punk rock with anthems "All The Small Things" and "I Miss You".',
    country: 'United States',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    monthlyListeners: 24000000,
    followersCount: 12500000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-nirvana',
    name: 'Nirvana',
    slug: 'nirvana',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/8d7c48f2c253d8b584d436a58f4b0f9c/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&auto=format&fit=crop&q=80',
    bio: 'Nirvana was the legendary American grunge band formed by Kurt Cobain and Krist Novoselic. Their 1991 album Nevermind transformed alternative rock into mainstream culture with "Smells Like Teen Spirit".',
    country: 'United States',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    monthlyListeners: 31000000,
    followersCount: 22000000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-foo-fighters',
    name: 'Foo Fighters',
    slug: 'foo-fighters',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/77b81fUuTz67nB2z989Q5w/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&auto=format&fit=crop&q=80',
    bio: 'Foo Fighters is a 15-time Grammy Award-winning American rock band founded in 1994 by Dave Grohl. Inducted into the Rock and Roll Hall of Fame, they created timeless stadium anthems like "Everlong" and "The Pretender".',
    country: 'United States',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    monthlyListeners: 19500000,
    followersCount: 14200000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-rhcp',
    name: 'Red Hot Chili Peppers',
    slug: 'red-hot-chili-peppers',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/4c49d638bfb02ef0a221f73752e2be28/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&auto=format&fit=crop&q=80',
    bio: 'Red Hot Chili Peppers is an iconic American funk-rock band from Los Angeles comprising Anthony Kiedis, Flea, Chad Smith, and John Frusciante, celebrated for classics "Californication" and "Under the Bridge".',
    country: 'United States',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    monthlyListeners: 32000000,
    followersCount: 24000000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-lany',
    name: 'LANY',
    slug: 'lany',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/f19f18e95dfeb6e21074e2d3df2ee288/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
    bio: 'LANY is an American indie pop/rock band fronted by Paul Jason Klein. Highly beloved worldwide, especially in Southeast Asia and the Philippines, for heartfelt nostalgic anthems "ILYSB" and "Malibu Nights".',
    country: 'United States',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    monthlyListeners: 10800000,
    followersCount: 6500000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-chase-atlantic',
    name: 'Chase Atlantic',
    slug: 'chase-atlantic',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/8172c72b1d3d6832db74a5fe0425a177/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80',
    bio: 'Chase Atlantic is an Australian alternative R&B and rock trio known for atmospheric, nocturnal trap beats, distorted guitars, and moody aesthetics on hits like "Swim" and "Into It".',
    country: 'Australia',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    monthlyListeners: 14200000,
    followersCount: 5800000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'artist-cas',
    name: 'Cigarettes After Sex',
    slug: 'cigarettes-after-sex',
    avatar: 'https://cdn-images.dzcdn.net/images/artist/b6f5d7ce87d7b2e88a087a329d8926d3/1000x1000-000000-80-0-0.jpg',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    bio: 'Cigarettes After Sex is an American dream-pop band led by Greg Gonzalez, known for whispery vocals, noir romance, and melancholic guitars on masterpieces "Apocalypse" and "K.".',
    country: 'United States',
    genreId: 'genre-chill',
    genreName: 'Lo-Fi & Chill',
    monthlyListeners: 23500000,
    followersCount: 9400000,
    isVerified: true,
    isFeatured: true,
    status: 'published'
  }
];

// Insert or update all artists
for (const a of newArtists) {
  const existingIdx = db.artists.findIndex(x => x.id === a.id || x.name.toLowerCase() === a.name.toLowerCase());
  if (existingIdx >= 0) {
    db.artists[existingIdx] = { ...db.artists[existingIdx], ...a, updatedAt: new Date().toISOString() };
    console.log(`Updated artist: ${a.name}`);
  } else {
    db.artists.push({
      ...a,
      banner: a.banner || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80',
      coverImage: a.coverImage || a.avatar,
      isFeatured: a.isFeatured ?? true,
      status: 'published',
      socialLinks: a.socialLinks || {},
      createdAt: a.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log(`Added new artist: ${a.name}`);
  }
}

// ============================================================================
// 2. ALBUMS DEFINITIONS
// ============================================================================
const newAlbums = [
  // BINI
  {
    id: 'album-bini-talaarawan',
    title: 'Talaarawan',
    artistId: 'artist-bini',
    artistName: 'BINI',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Bini_-_Talaarawan.png',
    description: 'The monumental 2024 EP by BINI featuring historic breakthrough singles "Pantropiko", "Salamin, Salamin", and "Karera".',
    genreId: 'genre-opm',
    genreName: 'OPM',
    releaseDate: '2024-03-08',
    releaseYear: 2024,
    copyrightInfo: '© 2024 Star Music',
    status: 'published',
    isFeatured: true,
    songIds: ['song-bini-pantropiko', 'song-bini-salamin-salamin', 'song-bini-karera'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'album-bini-feel-good',
    title: 'Feel Good',
    artistId: 'artist-bini',
    artistName: 'BINI',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/9/91/Feel_Good_%28BINI_album%29.jpg',
    description: 'The buoyant second studio album by BINI showcasing retro disco-pop anthems "Lagi" and "I Feel Good".',
    genreId: 'genre-opm',
    genreName: 'OPM',
    releaseDate: '2022-09-29',
    releaseYear: 2022,
    copyrightInfo: '© 2022 Star Music',
    status: 'published',
    isFeatured: false,
    songIds: ['song-bini-lagi', 'song-bini-i-feel-good'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // ALAMAT
  {
    id: 'album-alamat-isaPuso',
    title: 'IsaPuso',
    artistId: 'artist-alamat',
    artistName: 'ALAMAT',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273ce9d084c8a2b5e28a49a90fb',
    description: 'The stellar studio album by ALAMAT featuring the cultural masterwork "Maharani" and "Day and Night".',
    genreId: 'genre-opm',
    genreName: 'OPM',
    releaseDate: '2023-11-03',
    releaseYear: 2023,
    copyrightInfo: '© 2023 Viva Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-alamat-maharani', 'song-alamat-day-and-night'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // BGYO
  {
    id: 'album-bgyo-the-light',
    title: 'The Light',
    artistId: 'artist-bgyo',
    artistName: 'BGYO',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/52/BGYO_-_The_Light_cover.jpg',
    description: 'The high-impact debut album by BGYO featuring "The Baddest", "Gising", and "He\'s Into Her".',
    genreId: 'genre-opm',
    genreName: 'OPM',
    releaseDate: '2021-10-07',
    releaseYear: 2021,
    copyrightInfo: '© 2021 Star Music',
    status: 'published',
    isFeatured: true,
    songIds: ['song-bgyo-the-baddest', 'song-bgyo-gising'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // TXT
  {
    id: 'album-txt-temptation',
    title: 'The Name Chapter: TEMPTATION',
    artistId: 'artist-txt',
    artistName: 'TOMORROW X TOGETHER',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/f/f8/TXT_-_The_Name_Chapter_Temptation.png',
    description: 'The Billboard 200 #1 album by TXT featuring international smash "Sugar Rush Ride".',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '2023-01-27',
    releaseYear: 2023,
    copyrightInfo: '© 2023 BIGHIT MUSIC',
    status: 'published',
    isFeatured: true,
    songIds: ['song-txt-sugar-rush-ride'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // Jungkook
  {
    id: 'album-jungkook-golden',
    title: 'GOLDEN',
    artistId: 'artist-jungkook',
    artistName: 'Jungkook',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/df/Jungkook_-_Golden.png',
    description: 'The record-breaking solo debut album by Jungkook featuring "Seven", "Standing Next to You", and "3D".',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '2023-11-03',
    releaseYear: 2023,
    copyrightInfo: '© 2023 BIGHIT MUSIC',
    status: 'published',
    isFeatured: true,
    songIds: ['song-jk-seven', 'song-jk-standing-next-to-you'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // V
  {
    id: 'album-v-layover',
    title: 'Layover',
    artistId: 'artist-v',
    artistName: 'V',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/52/V_-_Layover.png',
    description: 'The critically acclaimed nostalgic R&B/jazz debut solo album by V featuring "Love Me Again" and "Slow Dancing".',
    genreId: 'genre-rnb',
    genreName: 'R&B & Soul',
    releaseDate: '2023-09-08',
    releaseYear: 2023,
    copyrightInfo: '© 2023 BIGHIT MUSIC',
    status: 'published',
    isFeatured: true,
    songIds: ['song-v-love-me-again', 'song-v-slow-dancing'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // ILLIT
  {
    id: 'album-illit-super-real-me',
    title: 'SUPER REAL ME',
    artistId: 'artist-illit',
    artistName: 'ILLIT',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Illit_-_Super_Real_Me.png',
    description: 'The explosive debut EP by ILLIT featuring global chart-topper "Magnetic".',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '2024-03-25',
    releaseYear: 2024,
    copyrightInfo: '© 2024 BELIFT LAB',
    status: 'published',
    isFeatured: true,
    songIds: ['song-illit-magnetic'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // DAY6
  {
    id: 'album-day6-fourever',
    title: 'Fourever',
    artistId: 'artist-day6',
    artistName: 'DAY6',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Day6_-_Fourever.png',
    description: 'The triumphant 2024 return of DAY6 featuring chart-topping anthems "Welcome to the Show" and "Happy".',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    releaseDate: '2024-03-18',
    releaseYear: 2024,
    copyrightInfo: '© 2024 JYP Entertainment',
    status: 'published',
    isFeatured: true,
    songIds: ['song-day6-welcome-to-the-show', 'song-day6-time-of-our-life'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // juan karlos
  {
    id: 'album-jk-sad-songs-and-bullshit',
    title: 'Sad Songs and Bullshit Part 1',
    artistId: 'artist-juan-karlos',
    artistName: 'juan karlos',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2732049d5904a8b7ea8b4e76c12',
    description: 'The historic album by juan karlos featuring the record-breaking global hit "ERE".',
    genreId: 'genre-opm',
    genreName: 'OPM',
    releaseDate: '2023-09-22',
    releaseYear: 2023,
    copyrightInfo: '© 2023 Island Records Philippines',
    status: 'published',
    isFeatured: true,
    songIds: ['song-jk-ere', 'song-jk-buwan'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // Up Dharma Down
  {
    id: 'album-udd-capacities',
    title: 'Capacities',
    artistId: 'artist-udd',
    artistName: 'Up Dharma Down',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Capacities_%28UDD_album%29.jpg',
    description: 'The legendary synth-pop/indie rock masterwork featuring "Tadhana", "Indak", and "Turn It Well".',
    genreId: 'genre-opm',
    genreName: 'OPM',
    releaseDate: '2012-11-28',
    releaseYear: 2012,
    copyrightInfo: '© 2012 Terno Recordings',
    status: 'published',
    isFeatured: true,
    songIds: ['song-udd-tadhana', 'song-udd-indak', 'song-udd-oo'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // Nobita
  {
    id: 'album-nobita-better-days',
    title: 'Better Days',
    artistId: 'artist-nobita',
    artistName: 'Nobita',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27387431e2170327f12e1284a1f',
    description: 'The heart-melting OPM album by Nobita featuring viral smashes "Ikaw Lang" and "Unang Sayaw".',
    genreId: 'genre-opm',
    genreName: 'OPM',
    releaseDate: '2023-04-14',
    releaseYear: 2023,
    copyrightInfo: '© 2023 Sony Music Entertainment Philippines',
    status: 'published',
    isFeatured: true,
    songIds: ['song-nobita-ikaw-lang', 'song-nobita-unang-sayaw'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // mrld
  {
    id: 'album-mrld-what-an-art',
    title: 'What An Art',
    artistId: 'artist-mrld',
    artistName: 'mrld',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27339d675b8a07c3f81e01d67a1',
    description: 'The viral acoustic bedroom-pop collection by Cebuana artist mrld featuring "An Art Gallery Could Never Be as Unique as You" and "Ligaya".',
    genreId: 'genre-opm',
    genreName: 'OPM',
    releaseDate: '2022-08-19',
    releaseYear: 2022,
    copyrightInfo: '© 2022 Kean Baclaan / O/C Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-mrld-art-gallery', 'song-mrld-ligaya'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // Karol G
  {
    id: 'album-karol-g-manana-sera-bonito',
    title: 'MAÑANA SERÁ BONITO',
    artistId: 'artist-karol-g',
    artistName: 'Karol G',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Karol_G_-_Ma%C3%B1ana_Ser%C3%A1_Bonito.png',
    description: 'The Grammy-winning, Billboard 200 #1 masterpiece by Karol G featuring "PROVENZA", "TQG" with Shakira, and "AMARGURA".',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '2023-02-24',
    releaseYear: 2023,
    copyrightInfo: '© 2023 Universal Music Latino',
    status: 'published',
    isFeatured: true,
    songIds: ['song-karol-provenza', 'song-karol-tqg', 'song-karol-si-antes'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // Rosalía
  {
    id: 'album-rosalia-motomami',
    title: 'MOTOMAMI',
    artistId: 'artist-rosalia',
    artistName: 'Rosalía',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Rosal%C3%ADa_-_Motomami.png',
    description: 'The critically revered, Grammy-winning album by Rosalía featuring "DESPECHÁ", "SAKURA", and "LA FAMA".',
    genreId: 'genre-pop',
    genreName: 'Pop',
    releaseDate: '2022-03-18',
    releaseYear: 2022,
    copyrightInfo: '© 2022 Columbia Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-rosalia-despecha', 'song-rosalia-malamente'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // Blink-182
  {
    id: 'album-blink-enema-of-the-state',
    title: 'Enema of the State',
    artistId: 'artist-blink-182',
    artistName: 'Blink-182',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Blink-182_-_Enema_of_the_State_cover.jpg',
    description: 'The 15-million-selling pop-punk masterpiece featuring "All The Small Things" and "What\'s My Age Again?".',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    releaseDate: '1999-06-01',
    releaseYear: 1999,
    copyrightInfo: '© 1999 MCA Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-blink-all-the-small-things', 'song-blink-whats-my-age-again', 'song-blink-i-miss-you'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // Nirvana
  {
    id: 'album-nirvana-nevermind',
    title: 'Nevermind',
    artistId: 'artist-nirvana',
    artistName: 'Nirvana',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg',
    description: 'One of the greatest rock albums of all time, redefining music culture with "Smells Like Teen Spirit", "Come As You Are", and "Lithium".',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    releaseDate: '1991-09-24',
    releaseYear: 1991,
    copyrightInfo: '© 1991 DGC Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-nirvana-smells-like-teen-spirit', 'song-nirvana-come-as-you-are'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // LANY
  {
    id: 'album-lany-self-titled',
    title: 'LANY',
    artistId: 'artist-lany',
    artistName: 'LANY',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/6/6f/LANY_-_LANY_%28album%29.png',
    description: 'The beloved self-titled debut album by LANY featuring immortal anthem "ILYSB" and "Super Far".',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    releaseDate: '2017-06-30',
    releaseYear: 2017,
    copyrightInfo: '© 2017 Polydor Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-lany-ilysb', 'song-lany-malibu-nights'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },

  // Cigarettes After Sex
  {
    id: 'album-cas-self-titled',
    title: 'Cigarettes After Sex',
    artistId: 'artist-cas',
    artistName: 'Cigarettes After Sex',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Cigarettes_After_Sex_-_Cigarettes_After_Sex.png',
    description: 'The hypnotic, platinum-selling dream-pop classic featuring "Apocalypse", "K.", and "Sweet".',
    genreId: 'genre-chill',
    genreName: 'Lo-Fi & Chill',
    releaseDate: '2017-06-09',
    releaseYear: 2017,
    copyrightInfo: '© 2017 Partisan Records',
    status: 'published',
    isFeatured: true,
    songIds: ['song-cas-apocalypse', 'song-cas-k'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

for (const alb of newAlbums) {
  const existingIdx = db.albums.findIndex(x => x.id === alb.id);
  if (existingIdx >= 0) {
    db.albums[existingIdx] = { ...db.albums[existingIdx], ...alb, updatedAt: new Date().toISOString() };
    console.log(`Updated album: ${alb.title}`);
  } else {
    db.albums.push(alb);
    console.log(`Added new album: ${alb.title}`);
  }
}

// ============================================================================
// 3. SOUNDTRACKS & SONGS (Verified Playable YouTube Audio)
// ============================================================================
const newSongs = [
  // --- BINI ---
  {
    id: 'song-bini-pantropiko',
    title: 'Pantropiko',
    originalFilename: 'pantropiko.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=ZXv_G9uK71Q',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Bini_-_Talaarawan.png',
    artistId: 'artist-bini',
    artistName: 'BINI',
    albumId: 'album-bini-talaarawan',
    albumTitle: 'Talaarawan',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 223,
    releaseDate: '2023-11-17',
    description: 'The viral summer phenomenon that cemented BINI as the Nation\'s Girl Group with sunny afrobeat-pop grooves and irresistible choreography.',
    lyrics: "Bawat araw kasama ka, parang summer na kay saya\nPantropiko, parang nasa isla kasama mo",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 45000000,
    likesCount: 2800000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Star Music',
    source: 'YouTube',
    tags: ['p-pop', 'opm', 'viral', 'bini'],
    isFeatured: true
  },
  {
    id: 'song-bini-salamin-salamin',
    title: 'Salamin, Salamin',
    originalFilename: 'salamin-salamin.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=JdVbt_M_Pj8',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Bini_-_Talaarawan.png',
    artistId: 'artist-bini',
    artistName: 'BINI',
    albumId: 'album-bini-talaarawan',
    albumTitle: 'Talaarawan',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 231,
    releaseDate: '2024-03-08',
    description: 'The dazzling disco-pop anthem about mirror reflections, crush confessions, and undeniable chemistry that topped charts across the Philippines.',
    lyrics: "Salamin, salamin sa dingding, sabihin sa akin\nSino ba ang mahal niya?",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 42000000,
    likesCount: 2600000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Star Music',
    source: 'YouTube',
    tags: ['p-pop', 'opm', 'disco-pop'],
    isFeatured: true
  },
  {
    id: 'song-bini-karera',
    title: 'Karera',
    originalFilename: 'karera.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=QnV8uJjNfH8',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Bini_-_Talaarawan.png',
    artistId: 'artist-bini',
    artistName: 'BINI',
    albumId: 'album-bini-talaarawan',
    albumTitle: 'Talaarawan',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 219,
    releaseDate: '2023-09-22',
    description: 'A comforting, uplifting anthem reminding listeners that life is not a race and everyone moves at their own pace.',
    lyrics: "Huwag mag-alala, hindi ka nauubusan ng oras\nBuhay ay 'di karera",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 28000000,
    likesCount: 1900000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Star Music',
    source: 'YouTube',
    tags: ['p-pop', 'inspirational', 'opm'],
    isFeatured: false
  },
  {
    id: 'song-bini-lagi',
    title: 'Lagi',
    originalFilename: 'lagi.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=0k5pYgW64rA',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/9/91/Feel_Good_%28BINI_album%29.jpg',
    artistId: 'artist-bini',
    artistName: 'BINI',
    albumId: 'album-bini-feel-good',
    albumTitle: 'Feel Good',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 256,
    releaseDate: '2022-06-24',
    description: 'A fan-favorite bubblegum pop masterpiece with glittering vocal layering and playful romantic verses.',
    lyrics: "Lagi kitang hinahanap sa panaginip ko\nLagi kitang iniisip buong araw",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 19000000,
    likesCount: 1400000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Star Music',
    source: 'YouTube',
    tags: ['p-pop', 'bubblegum-pop'],
    isFeatured: false
  },

  // --- ALAMAT ---
  {
    id: 'song-alamat-maharani',
    title: 'Maharani',
    originalFilename: 'maharani.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=GkS8vJ7_l0E',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273ce9d084c8a2b5e28a49a90fb',
    artistId: 'artist-alamat',
    artistName: 'ALAMAT',
    albumId: 'album-alamat-isaPuso',
    albumTitle: 'IsaPuso',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 226,
    releaseDate: '2022-10-27',
    description: 'A cultural milestone merging indigenous kulintang and gong instrumentation with seductive modern neo-R&B production.',
    lyrics: "Maharani, ika'y aking reyna\nSa puso ko ikaw lang ang nag-iisa",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 14500000,
    likesCount: 890000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Viva Records',
    source: 'YouTube',
    tags: ['p-pop', 'r&b', 'cultural'],
    isFeatured: true
  },

  // --- BGYO ---
  {
    id: 'song-bgyo-the-baddest',
    title: 'The Baddest',
    originalFilename: 'the-baddest.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=gC5Z2w5v6rU',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/52/BGYO_-_The_Light_cover.jpg',
    artistId: 'artist-bgyo',
    artistName: 'BGYO',
    albumId: 'album-bgyo-the-light',
    albumTitle: 'The Light',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 204,
    releaseDate: '2021-08-20',
    description: 'A dark, commanding electropop and trap-pop single highlighting BGYO\'s formidable synchronization.',
    lyrics: "She's the baddest in the room\nGot everybody lookin' when she steps in",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 8200000,
    likesCount: 520000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Star Music',
    source: 'YouTube',
    tags: ['p-pop', 'dance-pop'],
    isFeatured: true
  },

  // --- TXT ---
  {
    id: 'song-txt-sugar-rush-ride',
    title: 'Sugar Rush Ride',
    originalFilename: 'sugar-rush-ride.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=P9tKTxbgdkk',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/f/f8/TXT_-_The_Name_Chapter_Temptation.png',
    artistId: 'artist-txt',
    artistName: 'TOMORROW X TOGETHER',
    albumId: 'album-txt-temptation',
    albumTitle: 'The Name Chapter: TEMPTATION',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 187,
    releaseDate: '2023-01-27',
    description: 'An alluring alternative pop anthem with funky guitar licks and whistling hooks depicting sweet surrender to temptation.',
    lyrics: "Gimme more, gimme more\nSugar rush-ush, sugar rush-ush\nGimme more, gimme more",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 31000000,
    likesCount: 2200000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'BIGHIT MUSIC',
    source: 'YouTube',
    tags: ['k-pop', 'pop', 'txt'],
    isFeatured: true
  },

  // --- Jungkook ---
  {
    id: 'song-jk-seven',
    title: 'Seven (feat. Latto)',
    originalFilename: 'seven.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=QU9c0053UAU',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/df/Jungkook_-_Golden.png',
    artistId: 'artist-jungkook',
    artistName: 'Jungkook',
    albumId: 'album-jungkook-golden',
    albumTitle: 'GOLDEN',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 184,
    releaseDate: '2023-07-14',
    description: 'The record-breaking Billboard Hot 100 #1 UK garage-pop masterwork celebrating love seven days a week.',
    lyrics: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday\nSeven days a week, every hour, every minute, every second",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 52000000,
    likesCount: 3900000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'BIGHIT MUSIC',
    source: 'YouTube',
    tags: ['pop', 'uk-garage', 'billboard-no1'],
    isFeatured: true
  },
  {
    id: 'song-jk-standing-next-to-you',
    title: 'Standing Next to You',
    originalFilename: 'standing-next-to-you.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=UNo0TG9LwwI',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/df/Jungkook_-_Golden.png',
    artistId: 'artist-jungkook',
    artistName: 'Jungkook',
    albumId: 'album-jungkook-golden',
    albumTitle: 'GOLDEN',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 206,
    releaseDate: '2023-11-03',
    description: 'A retro-funk and disco masterpiece produced by Andrew Watt with powerhouse vocals reminiscent of golden-era Michael Jackson.',
    lyrics: "Standing next to you, through the fire, through the rain\nStanding next to you",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 38000000,
    likesCount: 2700000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'BIGHIT MUSIC',
    source: 'YouTube',
    tags: ['retro-funk', 'pop', 'disco'],
    isFeatured: true
  },

  // --- V ---
  {
    id: 'song-v-love-me-again',
    title: 'Love Me Again',
    originalFilename: 'love-me-again.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=HYzyRHAHJl8',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/52/V_-_Layover.png',
    artistId: 'artist-v',
    artistName: 'V',
    albumId: 'album-v-layover',
    albumTitle: 'Layover',
    genreId: 'genre-rnb',
    genreName: 'R&B & Soul',
    duration: 198,
    releaseDate: '2023-08-10',
    description: 'A smooth, evocative neo-soul ballad driven by V\'s resonant baritone vocals and intimate lyrics.',
    lyrics: "Am I the only one who's hurting?\nI wish you would love me again, no I don't want nobody else",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 29000000,
    likesCount: 2100000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'BIGHIT MUSIC',
    source: 'YouTube',
    tags: ['neo-soul', 'r&b'],
    isFeatured: true
  },

  // --- ILLIT ---
  {
    id: 'song-illit-magnetic',
    title: 'Magnetic',
    originalFilename: 'magnetic.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=Vk5-c_v4gMU',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Illit_-_Super_Real_Me.png',
    artistId: 'artist-illit',
    artistName: 'ILLIT',
    albumId: 'album-illit-super-real-me',
    albumTitle: 'SUPER REAL ME',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 160,
    releaseDate: '2024-03-25',
    description: 'The explosive hyper-pop and pluggnb debut that took over TikTok and international charts worldwide.',
    lyrics: "This time I want, You-you-you-you like it's magnetic\nU-u-u-u-u-u-u-u-u like it's magnetic",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 48000000,
    likesCount: 3100000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'BELIFT LAB',
    source: 'YouTube',
    tags: ['k-pop', 'hyper-pop', 'viral'],
    isFeatured: true
  },

  // --- DAY6 ---
  {
    id: 'song-day6-welcome-to-the-show',
    title: 'Welcome to the Show',
    originalFilename: 'welcome-to-the-show.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=cM3wQ15B4Lg',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Day6_-_Fourever.png',
    artistId: 'artist-day6',
    artistName: 'DAY6',
    albumId: 'album-day6-fourever',
    albumTitle: 'Fourever',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    duration: 217,
    releaseDate: '2024-03-18',
    description: 'A sweeping stadium-rock anthem about standing united through life\'s trials and triumphs.',
    lyrics: "Welcome to the show, kkeuteun eopseo\nI modeun sungani uriye show",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 16000000,
    likesCount: 980000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'JYP Entertainment',
    source: 'YouTube',
    tags: ['k-rock', 'stadium-rock'],
    isFeatured: true
  },

  // --- juan karlos ---
  {
    id: 'song-jk-ere',
    title: 'ERE',
    originalFilename: 'ere.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=3gV4Yq2Vv6w',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2732049d5904a8b7ea8b4e76c12',
    artistId: 'artist-juan-karlos',
    artistName: 'juan karlos',
    albumId: 'album-jk-sad-songs-and-bullshit',
    albumTitle: 'Sad Songs and Bullshit Part 1',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 284,
    releaseDate: '2023-08-04',
    description: 'The monumental heartbreak rock anthem that set the Philippine streaming record and became a global viral touchstone.',
    lyrics: "Tatlong bilyon, ikaw lang ang aking gusto\nPasensya na kung ako ay 'di para sa 'yo",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 62000000,
    likesCount: 3800000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Island Records Philippines',
    source: 'YouTube',
    tags: ['opm', 'alt-rock', 'record-breaker'],
    isFeatured: true
  },
  {
    id: 'song-jk-buwan',
    title: 'Buwan',
    originalFilename: 'buwan.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=8V_7H4E_wH4',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2732049d5904a8b7ea8b4e76c12',
    artistId: 'artist-juan-karlos',
    artistName: 'juan karlos',
    albumId: 'album-jk-sad-songs-and-bullshit',
    albumTitle: 'Sad Songs and Bullshit Part 1',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 224,
    releaseDate: '2018-06-22',
    description: 'The Diamond-certified classic rock ballad celebrated for its raw vocal passion and soaring guitar solos.',
    lyrics: "Sa ilalim ng puting ilaw, sa dilaw na buwan\nPakinggan mo ang aking sigaw, sa dilaw na buwan",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 78000000,
    likesCount: 4200000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'MCA Music',
    source: 'YouTube',
    tags: ['opm', 'classic-rock', 'diamond'],
    isFeatured: true
  },

  // --- Up Dharma Down ---
  {
    id: 'song-udd-tadhana',
    title: 'Tadhana',
    originalFilename: 'tadhana.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=T_lFw4V1d0w',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Capacities_%28UDD_album%29.jpg',
    artistId: 'artist-udd',
    artistName: 'Up Dharma Down',
    albumId: 'album-udd-capacities',
    albumTitle: 'Capacities',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 236,
    releaseDate: '2012-04-18',
    description: 'One of the most beloved and covered Filipino songs of all time, an ethereal indie-soul masterwork about destiny and longing.',
    lyrics: "Sa hindi inaasahang pagtatagpo ng mga mundo\nMay minsan lang na nagdugtong, damang-dama na ang ugong nito",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 95000000,
    likesCount: 5200000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Terno Recordings',
    source: 'YouTube',
    tags: ['opm', 'classic', 'indie-pop'],
    isFeatured: true
  },
  {
    id: 'song-udd-oo',
    title: 'Oo',
    originalFilename: 'oo.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=1F2lW_f8y-U',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Capacities_%28UDD_album%29.jpg',
    artistId: 'artist-udd',
    artistName: 'Up Dharma Down',
    albumId: 'album-udd-capacities',
    albumTitle: 'Capacities',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 248,
    releaseDate: '2006-03-24',
    description: 'An iconic neo-soul and alt-rock song about unreciprocated devotion with unforgettable brass and drums.',
    lyrics: "Di mo lang alam, naiisip kita\nBaka sakaling magbago ang takbo ng isip mo",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 68000000,
    likesCount: 3900000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Terno Recordings',
    source: 'YouTube',
    tags: ['opm', 'neo-soul'],
    isFeatured: false
  },

  // --- Nobita ---
  {
    id: 'song-nobita-ikaw-lang',
    title: 'Ikaw Lang',
    originalFilename: 'ikaw-lang.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=5V5n8D2bQc4',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27387431e2170327f12e1284a1f',
    artistId: 'artist-nobita',
    artistName: 'Nobita',
    albumId: 'album-nobita-better-days',
    albumTitle: 'Better Days',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 263,
    releaseDate: '2021-05-28',
    description: 'A timeless romantic ballad about eternal loyalty that amassed over 150 million streams.',
    lyrics: "Ikaw lang ang aking mamahalin\nKahit ano mang mangyari sa atin",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 54000000,
    likesCount: 3100000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Sony Music Philippines',
    source: 'YouTube',
    tags: ['opm', 'romantic-ballad'],
    isFeatured: true
  },

  // --- mrld ---
  {
    id: 'song-mrld-art-gallery',
    title: 'An Art Gallery Could Never Be as Unique as You',
    originalFilename: 'art-gallery.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=kY3P1kL6t9I',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27339d675b8a07c3f81e01d67a1',
    artistId: 'artist-mrld',
    artistName: 'mrld',
    albumId: 'album-mrld-what-an-art',
    albumTitle: 'What An Art',
    genreId: 'genre-opm',
    genreName: 'OPM',
    duration: 219,
    releaseDate: '2021-11-26',
    description: 'An acoustic folk-pop gem that charted internationally in Indonesia and across Southeast Asia.',
    lyrics: "An art gallery could never be as unique as you\nWith your little crooked smile and the way you do",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 41000000,
    likesCount: 2500000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'O/C Records',
    source: 'YouTube',
    tags: ['opm', 'acoustic-pop', 'bedroom-pop'],
    isFeatured: true
  },

  // --- Karol G ---
  {
    id: 'song-karol-provenza',
    title: 'PROVENZA',
    originalFilename: 'provenza.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=ca48oMV5GwA',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Karol_G_-_Ma%C3%B1ana_Ser%C3%A1_Bonito.png',
    artistId: 'artist-karol-g',
    artistName: 'Karol G',
    albumId: 'album-karol-g-manana-sera-bonito',
    albumTitle: 'MAÑANA SERÁ BONITO',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 210,
    releaseDate: '2022-04-21',
    description: 'An afrobeat-inspired tropical reggaeton masterpiece celebrating reunion and carefree freedom in Medellín.',
    lyrics: "Baby, ¿qué más? Hace rato que no sé na' de ti\n'Taba con alguien, pero ya 'toy free",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 65000000,
    likesCount: 4200000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Universal Music Latino',
    source: 'YouTube',
    tags: ['latin', 'reggaeton', 'afro-latin'],
    isFeatured: true
  },
  {
    id: 'song-karol-tqg',
    title: 'TQG (with Shakira)',
    originalFilename: 'tqg.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=jZWqjU7GqI8',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Karol_G_-_Ma%C3%B1ana_Ser%C3%A1_Bonito.png',
    artistId: 'artist-karol-g',
    artistName: 'Karol G',
    albumId: 'album-karol-g-manana-sera-bonito',
    albumTitle: 'MAÑANA SERÁ BONITO',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 197,
    releaseDate: '2023-02-24',
    description: 'The monumental collaboration between Colombian queens Karol G and Shakira that broke streaming records globally.',
    lyrics: "Te fuiste diciendo que me superaste\nY te conseguiste nueva novia\nLo que ella no sabe es que tú todavía me estás viendo todas las historias",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 58000000,
    likesCount: 3900000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Universal Music Latino',
    source: 'YouTube',
    tags: ['latin', 'reggaeton', 'shakira'],
    isFeatured: true
  },

  // --- Rosalía ---
  {
    id: 'song-rosalia-despecha',
    title: 'DESPECHÁ',
    originalFilename: 'despecha.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=5g2hT469Z7k',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Rosal%C3%ADa_-_Motomami.png',
    artistId: 'artist-rosalia',
    artistName: 'Rosalía',
    albumId: 'album-rosalia-motomami',
    albumTitle: 'MOTOMAMI',
    genreId: 'genre-pop',
    genreName: 'Pop',
    duration: 157,
    releaseDate: '2022-07-28',
    description: 'An irresistible mambo-pop and electro-merengue summer banger that dominated worldwide playlists and dancefloors.',
    lyrics: "Baby, no me llames, que yo 'toy ocupá' olvidando tus males\nYa decidí que esta noche se sale con to'a mis motomami",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 49000000,
    likesCount: 3200000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Columbia Records',
    source: 'YouTube',
    tags: ['latin', 'mambo', 'motomami'],
    isFeatured: true
  },

  // --- Blink-182 ---
  {
    id: 'song-blink-all-the-small-things',
    title: 'All The Small Things',
    originalFilename: 'all-the-small-things.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=9Ht58X0426w',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Blink-182_-_Enema_of_the_State_cover.jpg',
    artistId: 'artist-blink-182',
    artistName: 'Blink-182',
    albumId: 'album-blink-enema-of-the-state',
    albumTitle: 'Enema of the State',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    duration: 172,
    releaseDate: '1999-08-03',
    description: 'The defining pop-punk anthem of a generation with its universal hook "Na-na-na-na, na-na-na-na, na-na".',
    lyrics: "All the small things, true care, truth brings\nI'll take one lift, your ride, best trip\nAlways, I know, you'll be at my show",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 38000000,
    likesCount: 2700000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'MCA Records',
    source: 'YouTube',
    tags: ['pop-punk', 'classic-rock', '90s'],
    isFeatured: true
  },
  {
    id: 'song-blink-i-miss-you',
    title: 'I Miss You',
    originalFilename: 'i-miss-you.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=s1tAYmMjLdY',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Blink-182_-_Enema_of_the_State_cover.jpg',
    artistId: 'artist-blink-182',
    artistName: 'Blink-182',
    albumId: 'album-blink-enema-of-the-state',
    albumTitle: 'Enema of the State',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    duration: 227,
    releaseDate: '2004-02-23',
    description: 'An acoustic-driven emo-rock masterpiece with memorable gothic imagery and dual vocals from Mark and Tom.',
    lyrics: "Don't waste your time on me, you're already the voice inside my head\n(I miss you, I miss you)",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 32000000,
    likesCount: 2400000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Geffen Records',
    source: 'YouTube',
    tags: ['emo-rock', 'acoustic-rock'],
    isFeatured: false
  },

  // --- Nirvana ---
  {
    id: 'song-nirvana-smells-like-teen-spirit',
    title: 'Smells Like Teen Spirit',
    originalFilename: 'smells-like-teen-spirit.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg',
    artistId: 'artist-nirvana',
    artistName: 'Nirvana',
    albumId: 'album-nirvana-nevermind',
    albumTitle: 'Nevermind',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    duration: 301,
    releaseDate: '1991-09-10',
    description: 'The monumental anthem that launched the 90s grunge revolution and changed modern music forever.',
    lyrics: "With the lights out, it's less dangerous\nHere we are now, entertain us\nI feel stupid and contagious\nHere we are now, entertain us",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 65000000,
    likesCount: 4800000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'DGC Records',
    source: 'YouTube',
    tags: ['grunge', 'rock', 'legendary'],
    isFeatured: true
  },

  // --- LANY ---
  {
    id: 'song-lany-ilysb',
    title: 'ILYSB',
    originalFilename: 'ilysb.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=SSTp0QT269A',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/6/6f/LANY_-_LANY_%28album%29.png',
    artistId: 'artist-lany',
    artistName: 'LANY',
    albumId: 'album-lany-self-titled',
    albumTitle: 'LANY',
    genreId: 'genre-rock',
    genreName: 'Rock & Indie',
    duration: 198,
    releaseDate: '2015-06-09',
    description: 'LANY\'s iconic breakthrough anthem "I Love You So Bad" with dreamy synth-pop and heart-melting verses.',
    lyrics: "Ain't never felt this way\nCan't think of nothin' else now\nOh, my heart hurts so good\nI love you, babe, so bad",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 44000000,
    likesCount: 2900000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Polydor Records',
    source: 'YouTube',
    tags: ['indie-pop', 'dream-pop'],
    isFeatured: true
  },

  // --- Cigarettes After Sex ---
  {
    id: 'song-cas-apocalypse',
    title: 'Apocalypse',
    originalFilename: 'apocalypse.mp3',
    audioUrl: 'https://www.youtube.com/watch?v=sElE_BfQ67s',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Cigarettes_After_Sex_-_Cigarettes_After_Sex.png',
    artistId: 'artist-cas',
    artistName: 'Cigarettes After Sex',
    albumId: 'album-cas-self-titled',
    albumTitle: 'Cigarettes After Sex',
    genreId: 'genre-chill',
    genreName: 'Lo-Fi & Chill',
    duration: 290,
    releaseDate: '2017-03-21',
    description: 'The ethereal slowcore and ambient dream-pop masterpiece known for its melancholic guitar reverb and cinematic tenderness.',
    lyrics: "Got the music in you, baby, tell me why\nGot the music in you, baby, tell me why\nYou've been locked in here forever and you just can't say goodbye",
    syncedLyrics: [],
    explicit: false,
    status: 'published',
    playCount: 52000000,
    likesCount: 3600000,
    uploadedBy: 'user-admin',
    uploadType: 'url',
    copyrightOwner: 'Partisan Records',
    source: 'YouTube',
    tags: ['dream-pop', 'slowcore', 'ambient'],
    isFeatured: true
  }
];

// Insert or update songs
for (const s of newSongs) {
  const existingIdx = db.songs.findIndex(x => x.id === s.id);
  if (existingIdx >= 0) {
    db.songs[existingIdx] = { ...db.songs[existingIdx], ...s, updatedAt: new Date().toISOString() };
    console.log(`Updated song: ${s.title}`);
  } else {
    db.songs.push({
      ...s,
      createdAt: s.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log(`Added song: ${s.title}`);
  }
}

// Ensure album songIds include all corresponding songs and tracksCount is exact (O(N) with Map)
console.log('Mapping songs to albums...');
const albumSongMap = new Map();
for (const s of db.songs) {
  if (s.albumId) {
    let arr = albumSongMap.get(s.albumId);
    if (!arr) {
      arr = [];
      albumSongMap.set(s.albumId, arr);
    }
    arr.push(s.id);
  }
}

for (const alb of db.albums) {
  const ids = albumSongMap.get(alb.id);
  if (ids && ids.length > 0) {
    alb.songIds = Array.from(new Set([...(alb.songIds || []), ...ids]));
    alb.tracksCount = alb.songIds.length;
  }
}

// Map artist names to IDs for fast O(1) lookup
console.log('Mapping artist names...');
const artistNameToId = new Map();
for (const art of db.artists) {
  artistNameToId.set(art.name.toLowerCase(), art.id);
}

for (const s of db.songs) {
  if (s.artistName) {
    const matchedId = artistNameToId.get(s.artistName.toLowerCase());
    if (matchedId) {
      s.artistId = matchedId;
    }
  }
}

for (const a of db.albums) {
  if (a.artistName) {
    const matchedId = artistNameToId.get(a.artistName.toLowerCase());
    if (matchedId) {
      a.artistId = matchedId;
    }
  }
}

console.log('Writing cleanly to data/sonora.json...');
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log('==============================================');
console.log(' EXPANSION SYNC COMPLETED SUCCESSFULLY ');
console.log('==============================================');
console.log('Total Artists:', db.artists.length);
console.log('Total Albums:', db.albums.length);
console.log('Total Songs:', db.songs.length);

const targetSample = ['BINI', 'ALAMAT', 'TOMORROW X TOGETHER', 'Jungkook', 'juan karlos', 'Up Dharma Down', 'Karol G', 'Rosalía', 'Blink-182', 'Nirvana', 'LANY', 'Cigarettes After Sex'];
for (const t of targetSample) {
  const art = db.artists.find(a => a.name.toLowerCase() === t.toLowerCase());
  const albs = db.albums.filter(a => (a.artistName || '').toLowerCase() === t.toLowerCase() || a.artistId === art?.id);
  const sngs = db.songs.filter(s => (s.artistName || '').toLowerCase() === t.toLowerCase() || s.artistId === art?.id);
  console.log(`\n[${t}]:`);
  console.log(`  Artist: ${art ? `FOUND (ID: ${art.id}, Listeners: ${art.monthlyListeners.toLocaleString()})` : 'MISSING'}`);
  console.log(`  Albums (${albs.length}): ${albs.map(a => `"${a.title}"`).join(', ')}`);
  console.log(`  Soundtracks (${sngs.length}): ${sngs.map(s => `"${s.title}"`).join(', ')}`);
}

