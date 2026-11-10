const fs = require('fs');
const path = require('path');
const https = require('https');

const DB_PATH = path.join(__dirname, '..', 'data', 'sonora.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'sonora.backup.json');

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Check if a URL returns 302 or redirects to d41d8cd98f00b204e9800998ecf8427e
function checkUrlStatus(url) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return resolve({ ok: false });
    }
    try {
      https.get(url, (res) => {
        const loc = res.headers.location || '';
        if (res.statusCode === 302 || loc.includes('d41d8cd98f00b204e9800998ecf8427e') || loc.includes('b315ca94d75039eaee4d5098ffb4e7ce')) {
          resolve({ ok: false, redirectedTo: loc });
        } else if (res.statusCode === 200) {
          resolve({ ok: true });
        } else {
          resolve({ ok: false });
        }
      }).on('error', () => resolve({ ok: false }));
    } catch {
      resolve({ ok: false });
    }
  });
}

// Fetch live artist avatar from Deezer or iTunes
async function fetchFreshArtistAvatar(name) {
  try {
    const clean = name.replace(/\s*\(.*?\)/g, '').trim();
    const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(clean)}&limit=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data[0]) {
        const item = data.data[0];
        const art = item.picture_xl || item.picture_big;
        if (art && !art.includes('d41d8cd98f00b204e9800998ecf8427e')) {
          return art;
        }
      }
    }
  } catch {}

  // Fallback to iTunes song entity artwork
  try {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=song&limit=1`;
    const itRes = await fetch(itunesUrl, { signal: AbortSignal.timeout(4000) });
    if (itRes.ok) {
      const itData = await itRes.json();
      if (itData.results && itData.results[0]?.artworkUrl100) {
        return itData.results[0].artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg');
      }
    }
  } catch {}

  return null;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log(`Checking ${db.artists.length} artists for broken/redirected avatars...`);

  let replacedCount = 0;
  let alreadyGoodCount = 0;

  // Process in batches of 15
  const BATCH_SIZE = 15;
  for (let i = 0; i < db.artists.length; i += BATCH_SIZE) {
    const batch = db.artists.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (artist) => {
        const check = await checkUrlStatus(artist.avatar);
        if (!check.ok) {
          const fresh = await fetchFreshArtistAvatar(artist.name);
          if (fresh) {
            console.log(`[FIXED AVATAR] ${artist.name} -> ${fresh}`);
            artist.avatar = fresh;
            if (!artist.coverImage || artist.coverImage.includes('d41d8cd98f00b204e9800998ecf8427e')) {
              artist.coverImage = fresh;
            }
            replacedCount++;
          } else {
            console.log(`[NO FRESH AVATAR] ${artist.name}`);
          }
        } else {
          alreadyGoodCount++;
        }
      })
    );

    console.log(`Progress: ${Math.min(i + BATCH_SIZE, db.artists.length)} / ${db.artists.length} artists processed.`);
    await sleep(150);
  }

  console.log('\n--- SCAN RESULTS ---');
  console.log(`Already Good Avatars: ${alreadyGoodCount}`);
  console.log(`Replaced Stale/Redirected Avatars: ${replacedCount}`);

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('Database updated successfully.');
}

main().catch(console.error);

