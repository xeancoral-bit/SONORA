const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Circular Sonora logo matching Image 2 exactly:
// Circular blue ring, black interior, 4 blue equalizer bars
const circularSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="bar1Grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
    <linearGradient id="bar2Grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#dbeafe" />
    </linearGradient>
    <linearGradient id="bar3Grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
    <linearGradient id="bar4Grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1d4ed8" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>

  <!-- Black Background circle with vibrant blue circular border ring -->
  <circle cx="256" cy="256" r="236" fill="#08080a" stroke="url(#ringGrad)" stroke-width="28" />

  <!-- 4 Equalizer Soundwave Bars -->
  <!-- Bar 1 (Medium Left) -->
  <rect x="132" y="170" width="44" height="172" rx="22" fill="url(#bar1Grad)" />

  <!-- Bar 2 (Tall Center-Left) -->
  <rect x="202" y="100" width="44" height="312" rx="22" fill="url(#bar2Grad)" />

  <!-- Bar 3 (Medium-Tall Center-Right) -->
  <rect x="272" y="146" width="44" height="220" rx="22" fill="url(#bar3Grad)" />

  <!-- Bar 4 (Short Right) -->
  <rect x="342" y="200" width="44" height="112" rx="22" fill="url(#bar4Grad)" />
</svg>`;

// Helper: Convert array of PNG buffers to multi-size Windows .ico file
function pngsToIco(pngItems) {
  const numImages = pngItems.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO format
  header.writeUInt16LE(numImages, 4);

  let offset = 6 + 16 * numImages;
  const entries = [];
  for (const item of pngItems) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // colors in palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngItems.map((p) => p.buffer)]);
}

async function run() {
  const root = process.cwd();
  const svgBuffer = Buffer.from(circularSvg);

  // Generate resolutions
  console.log('Rendering circular logo PNG buffers...');
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const png64 = await sharp(svgBuffer).resize(64, 64).png().toBuffer();
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();

  // Create standard multi-size Windows/browser .ico file
  const icoBuffer = pngsToIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ]);

  // 1. Overwrite app/favicon.ico (The primary Next.js favicon that was showing the 1st image!)
  fs.writeFileSync(path.join(root, 'app', 'favicon.ico'), icoBuffer);
  console.log('Updated app/favicon.ico');

  // 2. Write public/favicon.ico
  fs.writeFileSync(path.join(root, 'public', 'favicon.ico'), icoBuffer);
  console.log('Updated public/favicon.ico');

  // 3. Write public/favicon.png
  fs.writeFileSync(path.join(root, 'public', 'favicon.png'), png32);
  console.log('Updated public/favicon.png');

  // 4. Overwrite icons in public/icons/
  const iconsDir = path.join(root, 'public', 'icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
  fs.writeFileSync(path.join(iconsDir, 'icon.svg'), circularSvg);
  fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), png512);
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), png512);
  fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), png192);
  fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), png180);
  console.log('Updated public/icons/*');

  // 5. Overwrite mobile/assets/
  const mobileAssets = path.join(root, 'mobile', 'assets');
  if (fs.existsSync(mobileAssets)) {
    fs.writeFileSync(path.join(mobileAssets, 'favicon.png'), png32);
    fs.writeFileSync(path.join(mobileAssets, 'icon.png'), png512);
    fs.writeFileSync(path.join(mobileAssets, 'adaptive-icon.png'), png512);
    fs.writeFileSync(path.join(mobileAssets, 'splash.png'), png512);
    console.log('Updated mobile/assets/*');
  }

  // 6. Replace public/vercel.svg and public/next.svg with Sonora circular logo
  // so no Vercel logo exists anywhere in public/
  fs.writeFileSync(path.join(root, 'public', 'vercel.svg'), circularSvg);
  fs.writeFileSync(path.join(root, 'public', 'next.svg'), circularSvg);
  console.log('Replaced public/vercel.svg and public/next.svg');

  // 7. Clear .next favicon caches if existing
  const nextCacheFiles = [
    path.join(root, '.next', 'server', 'app', 'favicon.ico', 'body'),
    path.join(root, '.next', 'server', 'app', 'favicon.ico.body')
  ];
  for (const f of nextCacheFiles) {
    if (fs.existsSync(f)) {
      try {
        fs.unlinkSync(f);
        console.log('Cleared Next.js cache file:', f);
      } catch {}
    }
  }

  console.log('ALL ICONS SUCCESSFULLY REPLACED WITH CIRCULAR SONORA LOGO (IMAGE 2)!');
}

run().catch(console.error);

