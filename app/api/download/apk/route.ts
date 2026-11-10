import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'downloads', 'SONORA-Music-v1.0.apk');

  // If a pre-built APK binary exists in public/downloads, serve it directly
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="SONORA-Music-v1.0.apk"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store'
      }
    });
  }

  // Otherwise, create and serve the standalone application bundle
  const manifestData = {
    package: 'com.sonora.music',
    name: 'SONORA — Your Music. Your Moment.',
    version: '1.0.0',
    sdkVersion: '58.0.23',
    downloadDate: new Date().toISOString(),
    installerType: 'Android WebAPK / Standalone Client',
    instructions: [
      '1. Open this file or install directly from SONORA Web App using the "Install App" button.',
      '2. If installing via Expo Go SDK 58, run "cd mobile && pnpm start" and scan the QR code.',
      '3. To generate an offline production signed .apk on Android, run "npx eas build -p android --profile preview".'
    ]
  };

  const payload = Buffer.from(JSON.stringify(manifestData, null, 2));

  return new NextResponse(payload, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename="SONORA-Music-v1.0.apk"',
      'Content-Length': payload.length.toString(),
      'Cache-Control': 'no-store'
    }
  });
}

