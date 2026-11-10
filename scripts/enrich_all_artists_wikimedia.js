const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const badHashes = [
  'd41d8cd98f00b204e9800998ecf8427e',
  'b315ca94d75039eaee4d5098ffb4e7ce',
  '59f19ef7639537f71120468962fa9c90',
  'bead7fcad96c8d76d49466e13b86068e',
  'bca0b297ea4b9711674db89bb3336be0',
  '485b03517852f5201c1074e532b2f703',
  '1e73998a4422e6b772591eeb00e622b7',
  'e0e0e40589c98cb9cf99b6222ccc955a',
  'ee29e36f8674af9fc2043abbeaa9cd9a',
  '431a80c0ed495e0729cd03593222d4d7',
  'dicebear.com'
];

function isBadAvatar(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return true;
  return badHashes.some(h => url.includes(h));
}

// Explicit verified high-resolution portraits for key target artists
const VERIFIED_OFFICIAL_PORTRAITS = {
  'Karol G': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/2023-11-16_Gala_de_los_Latin_Grammy%2C_15.jpg/1000px-2023-11-16_Gala_de_los_Latin_Grammy%2C_15.jpg',
  'Peso Pluma': 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Peso_Pluma%2C_performing_in_Monterrey_%282024-09-24%29_%281%29.png',
  'Feid': 'https://upload.wikimedia.org/wikipedia/commons/0/06/Feid_2022_%28cropped%29.jpg',
  'BINI': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/BINI_at_the_Senate_2026.jpg',
  'Nobita': 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Nobita_at_Ayala_Malls_Fairview_Terraces_-_2024-04-20_%2801%29.jpg',
  'juan karlos': 'https://cdn-images.dzcdn.net/images/artist/835d9492299771f3b4ecde16524e3dfa/1000x1000-000000-80-0-0.jpg',
  'Up Dharma Down': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Up_dharma_Down_%282010%29.jpg',
  'Gloc-9': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/GLOC-9.png',
  'mrld': 'https://cdn-images.dzcdn.net/images/artist/69fc4a0187ee5d32d009f1d15623e6d0/1000x1000-000000-80-0-0.jpg',
  'Orange & Lemons': 'https://cdn-images.dzcdn.net/images/artist/bc64780ee326ee08f7ac502e7a3fe2ab/1000x1000-000000-80-0-0.jpg',
  'Eraserheads': 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Eraserheads-Credit-WEU-Event-Management-Service-HERO%402000x1270.jpg',
  'Franco': 'https://cdn-images.dzcdn.net/images/artist/0dbf757e59d98ba49dd466d5e5d470c8/1000x1000-000000-80-0-0.jpg',
  'I Belong to the Zoo': 'https://cdn-images.dzcdn.net/images/artist/c1a2ff2f5e0296ee9fe515b1a8ed75db/1000x1000-000000-80-0-0.jpg',
  'ALAMAT': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Alamat_group.jpg',
  'BGYO': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/BGYO_%281%29%2C_February_2022.jpg/1000px-BGYO_%281%29%2C_February_2022.jpg',
  'SB19': 'https://upload.wikimedia.org/wikipedia/commons/4/43/SB19_at_Binibining_Pilipinas_2022_%28cropped%29.jpg',
  'Dan + Shay': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Dan_%2B_Shay_in_2019.jpg/1000px-Dan_%2B_Shay_in_2019.jpg',
  'Ricky Martin': 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ricky_Martin-4262.jpg',
  'VXON': 'https://upload.wikimedia.org/wikipedia/commons/4/44/VXON_band.jpg',
  'Bad Bunny': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg',
  'Rauw Alejandro': 'https://upload.wikimedia.org/wikipedia/commons/0/07/2023-11-16_Gala_de_los_Latin_Grammy%2C_Rauw_Alejandro.jpg',
  'Maluma': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Maluma_at_the_2020_MTV_Video_Music_Awards.png',
  'J Balvin': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/J_Balvin%2C_Noisey_Meets%3B_April_2018.jpg',
  'Rosalía': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/2023-11-16_Gala_de_los_Latin_Grammy%2C_Rosal%C3%ADa.jpg',
  'Blink-182': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Blink-182_2025_%28cropped_2%29.jpg',
  'Jungkook': 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Jung_Kook_of_BTS%2C_February_12%2C_2026_%281%29.png'
};

async function fetchWikiImage(name) {
  const queries = [
    name,
    `${name} (singer)`,
    `${name} (musician)`,
    `${name} (band)`,
    `${name} (group)`,
    `${name} (duo)`,
    `${name} (rapper)`
  ];

  for (const q of queries) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SonoraMusic/2.0 (contact@sonoramusic.com)' },
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const d = await res.json();
        const desc = (d.description || '').toLowerCase();
        // Prevent fictional / cartoon / anime characters
        if (!desc.includes('character') && !desc.includes('fictional') && !desc.includes('manga') && !desc.includes('anime')) {
          const img = d.originalimage?.source || d.thumbnail?.source;
          if (img) return img;
        }
      }
    } catch {}
  }
  return null;
}

async function fetchDeezerImage(name) {
  try {
    const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const d = await res.json();
      if (d.data && d.data[0]) {
        const pic = d.data[0].picture_xl || d.data[0].picture_big;
        if (pic && !isBadAvatar(pic)) {
          return pic;
        }
      }
    }
  } catch {}
  return null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('--- ENRICHING ALL ARTIST PROFILE IMAGES IN SONORA ---');
  let updatedCount = 0;

  // 1. First apply verified official portraits
  for (const [artistName, verifiedPhoto] of Object.entries(VERIFIED_OFFICIAL_PORTRAITS)) {
    const artist = db.artists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
    if (artist) {
      artist.avatar = verifiedPhoto;
      artist.coverImage = verifiedPhoto;
      updatedCount++;
      console.log(`[VERIFIED PORTRAIT] ${artist.name} -> ${verifiedPhoto}`);
    }
  }

  // 2. Scan remaining artists and enrich any with bad or Deezer-placeholder avatars
  console.log('\nScanning all artists for missing or placeholder profile photos...');
  for (let i = 0; i < db.artists.length; i++) {
    const artist = db.artists[i];

    // If artist already has a verified portrait or wikimedia image, keep it
    if (artist.avatar && (artist.avatar.includes('wikimedia.org') || artist.avatar.includes('wikipedia.org'))) {
      continue;
    }

    if (isBadAvatar(artist.avatar)) {
      console.log(`[UPGRADING] ${artist.name} (has placeholder/broken avatar)...`);
      let photo = await fetchWikiImage(artist.name);
      if (!photo) {
        photo = await fetchDeezerImage(artist.name);
      }
      if (!photo) {
        // Fallback to top album cover if available
        const album = db.albums.find(a => (a.artistName === artist.name || a.artistId === artist.id) && !isBadAvatar(a.coverImage));
        if (album?.coverImage) {
          photo = album.coverImage;
        }
      }

      if (photo) {
        artist.avatar = photo;
        artist.coverImage = photo;
        updatedCount++;
        console.log(`  -> SUCCESS: ${artist.name} -> ${photo.slice(0, 70)}`);
      } else {
        console.log(`  -> Keeping existing fallback for ${artist.name}`);
      }
      await sleep(60);
    }
  }

  console.log(`\nUpdated ${updatedCount} artist profile images.`);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('Database successfully saved.');
}

main().catch(console.error);

