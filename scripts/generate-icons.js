const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09090b" />
      <stop offset="100%" stop-color="#141418" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1d4ed8" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.2" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="url(#borderGrad)" stroke-width="6" />

  <g filter="url(#glow)">
    <rect x="146" y="210" width="36" height="110" rx="18" fill="url(#blueGrad)" />
    <rect x="206" y="140" width="36" height="240" rx="18" fill="#60a5fa" />
    <rect x="266" y="175" width="36" height="175" rx="18" fill="url(#blueGrad)" />
    <rect x="326" y="240" width="36" height="75" rx="18" fill="#3b82f6" />
  </g>
</svg>`;

const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBlueGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1d4ed8" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#09090b" />
  <g transform="translate(56, 56) scale(0.78)">
    <rect x="146" y="210" width="36" height="110" rx="18" fill="url(#mBlueGrad)" />
    <rect x="206" y="140" width="36" height="240" rx="18" fill="#60a5fa" />
    <rect x="266" y="175" width="36" height="175" rx="18" fill="url(#mBlueGrad)" />
    <rect x="326" y="240" width="36" height="75" rx="18" fill="#3b82f6" />
  </g>
</svg>`;

fs.writeFileSync(path.join(dir, 'icon.svg'), svg);

async function generate() {
  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(dir, 'icon-512x512.png'));
  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(path.join(dir, 'icon-maskable-512x512.png'));
  await sharp(Buffer.from(svg)).resize(192, 192).png().toFile(path.join(dir, 'icon-192x192.png'));
  await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(path.join(dir, 'apple-touch-icon.png'));
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(process.cwd(), 'public', 'favicon.png'));
  console.log('Successfully generated all PWA icons!');
}

generate().catch(console.error);
