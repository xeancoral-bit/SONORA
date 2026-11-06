import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Song, Album, Artist, SyncedLyricLine } from '@/lib/types';
import { parseLrc, autoGenerateSyncedLyrics } from '@/lib/lyricsService';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .replace(/\s*\(with[^)]+\)/gi, '')
    .replace(/\s*ft\.[^,)]+/gi, '')
    .replace(/\s*\(from [^)]+\)/gi, '')
    .replace(/\s*-\s*from [^)]+/gi, '')
    .replace(/\s*\(music from [^)]+\)/gi, '')
    .replace(/\s*\(soundtrack\)/gi, '')
    .replace(/\s*\(original motion picture soundtrack\)/gi, '')
    .replace(/\s*\(taylor's version\)/gi, '')
    .replace(/\s*\(taylor’s version\)/gi, '')
    .replace(/\s*\(deluxe[^)]*\)/gi, '')
    .replace(/\s*\[deluxe[^\]]*\]/gi, '')
    .replace(/\s*\(expanded[^)]*\)/gi, '')
    .replace(/\s*\(bonus[^)]*\)/gi, '')
    .replace(/\s*\(special[^)]*\)/gi, '')
    .replace(/\s*\(platinum[^)]*\)/gi, '')
    .replace(/\s*-\s*single/gi, '')
    .replace(/\s*-\s*ep/gi, '')
    .replace(/\s*\(live[^)]*\)/gi, '')
    .replace(/\s*\[remastered[^\]]*\]/gi, '')
    .replace(/\s*\(remastered[^)]*\)/gi, '')
    .replace(/\s*\(clean\)/gi, '')
    .replace(/\s*\(explicit\)/gi, '')
    .replace(/\s*-\s*radio edit/gi, '')
    .replace(/\s*\(radio edit\)/gi, '')
    .trim();
}

function cleanArtist(artist: string): string {
  return artist
    .replace(/&.*/, '')
    .replace(/feat\..*/i, '')
    .replace(/ft\..*/i, '')
    .replace(/,\s*.*/, '')
    .trim();
}

function mapGenre(rawName?: string): { id: string; name: string } {
  const lower = (rawName || '').toLowerCase();
  if (lower.includes('pop') || lower.includes('k-pop') || lower.includes('dance')) {
    return { id: 'genre-pop', name: 'Pop' };
  }
  if (lower.includes('rock') || lower.includes('alternative') || lower.includes('indie') || lower.includes('metal')) {
    return { id: 'genre-rock', name: 'Rock & Indie' };
  }
  if (lower.includes('hip-hop') || lower.includes('rap') || lower.includes('trap')) {
    return { id: 'genre-hiphop', name: 'Hip-Hop' };
  }
  if (lower.includes('r&b') || lower.includes('soul') || lower.includes('urban')) {
    return { id: 'genre-rnb', name: 'R&B & Soul' };
  }
  if (lower.includes('electronic') || lower.includes('edm') || lower.includes('house') || lower.includes('techno')) {
    return { id: 'genre-electronic', name: 'Electronic' };
  }
  if (lower.includes('country') || lower.includes('folk') || lower.includes('bluegrass')) {
    return { id: 'genre-country', name: 'Country' };
  }
  if (lower.includes('soundtrack') || lower.includes('score') || lower.includes('classical')) {
    return { id: 'genre-classical', name: 'Modern Classical' };
  }
  if (lower.includes('acoustic') || lower.includes('singer')) {
    return { id: 'genre-acoustic', name: 'Acoustic' };
  }
  return { id: 'genre-pop', name: 'Pop' };
}

async function fetchLyrics(artist: string, title: string, durationSec: number = 210): Promise<{ synced: SyncedLyricLine[]; plain: string }> {
  const cTitle = cleanTitle(title);
  const cArtist = cleanArtist(artist);

  // 1. Exact match via /get
  try {
    const getUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cTitle)}&artist_name=${encodeURIComponent(cArtist)}`;
    const res = await fetch(getUrl, {
      headers: { 'User-Agent': 'SonoraMusic/2.0' },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) {
        return {
          synced: parseLrc(data.syncedLyrics),
          plain: data.plainLyrics || data.syncedLyrics,
        };
      }
      if (data.plainLyrics) {
        return {
          synced: autoGenerateSyncedLyrics(data.plainLyrics, durationSec),
          plain: data.plainLyrics,
        };
      }
      if (data.instrumental) {
        return {
          synced: [
            { time: 0, text: '♪ Instrumental Intro ♪' },
            { time: Math.round(durationSec * 0.25), text: '♪ Melodic Flow ♪' },
            { time: Math.round(durationSec * 0.5), text: '♪ Instrumental Solo & Harmonics ♪' },
            { time: Math.round(durationSec * 0.75), text: '♪ Dynamic Build ♪' },
            { time: Math.max(0, durationSec - 15), text: '♪ Outro Fade ♪' },
          ],
          plain: '♪ Instrumental track ♪',
        };
      }
    }
  } catch {}

  // 2. Fuzzy search via /search
  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cTitle} ${cArtist}`)}`;
    const sRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'SonoraMusic/2.0' },
      signal: AbortSignal.timeout(4000)
    });
    if (sRes.ok) {
      const items = await sRes.json();
      if (Array.isArray(items) && items.length > 0) {
        const withSynced = items.find((i: any) => i.syncedLyrics);
        if (withSynced) {
          return {
            synced: parseLrc(withSynced.syncedLyrics),
            plain: withSynced.plainLyrics || withSynced.syncedLyrics,
          };
        }
        if (items[0].plainLyrics) {
          return {
            synced: autoGenerateSyncedLyrics(items[0].plainLyrics, durationSec),
            plain: items[0].plainLyrics,
          };
        }
      }
    }
  } catch {}

  // 3. Guaranteed synchronized fallback sequence
  return {
    synced: [
      { time: 0, text: `♪ ${cTitle} by ${cArtist || 'Artist'} ♪` },
      { time: Math.round(durationSec * 0.15), text: '♪ Verse 1 ♪' },
      { time: Math.round(durationSec * 0.35), text: '♪ Chorus ♪' },
      { time: Math.round(durationSec * 0.55), text: '♪ Verse 2 ♪' },
      { time: Math.round(durationSec * 0.72), text: '♪ Chorus & Bridge ♪' },
      { time: Math.max(0, durationSec - 18), text: '♪ Outro ♪' },
    ],
    plain: `♪ ${cTitle} by ${cArtist || 'Artist'} ♪\nVerse 1\nChorus\nVerse 2\nChorus & Bridge\nOutro`,
  };
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const artistQuery = (body.artistName || '').trim();
    const maxAlbums = Math.min(Math.max(Number(body.maxAlbums) || 5, 1), 15);

    if (!artistQuery) {
      return NextResponse.json({ error: 'Please enter an artist or singer name.' }, { status: 400 });
    }

    // 1. Search artist albums from iTunes API
    const itunesAlbumUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistQuery)}&entity=album&limit=25`;
    const albumRes = await fetch(itunesAlbumUrl, { signal: AbortSignal.timeout(8000) });
    if (!albumRes.ok) {
      return NextResponse.json({ error: 'Failed to communicate with music metadata provider.' }, { status: 502 });
    }

    const albumData = await albumRes.json();
    const rawAlbums: any[] = albumData.results || [];
    if (rawAlbums.length === 0) {
      return NextResponse.json({ error: `No albums found for "${artistQuery}". Please check the spelling.` }, { status: 404 });
    }

    // Filter relevant albums: prioritize official studio albums & official soundtracks, ignore remixes & tributes
    const seenTitles = new Set<string>();
    const filteredAlbums: any[] = [];
    const queryLower = artistQuery.toLowerCase();

    for (const alb of rawAlbums) {
      const titleLower = alb.collectionName.toLowerCase();
      const artistLower = alb.artistName.toLowerCase();
      const isRemixOrUnofficial =
        /\b(remix|remixes|the remixes|club mix|karaoke|tribute|instrumental version)\b/i.test(titleLower) ||
        /\b(- single|\(single\))\b/i.test(titleLower);

      if (
        !isRemixOrUnofficial &&
        (artistLower.includes(queryLower) || queryLower.includes(artistLower)) &&
        !seenTitles.has(titleLower)
      ) {
        seenTitles.add(titleLower);
        filteredAlbums.push(alb);
        if (filteredAlbums.length >= maxAlbums) break;
      }
    }

    const albumsToProcess = filteredAlbums.length > 0 ? filteredAlbums : rawAlbums.slice(0, maxAlbums);
    const officialArtistName = albumsToProcess[0]?.artistName || artistQuery;
    const artistSlug = slugify(officialArtistName);
    const artistId = `artist-${artistSlug}`;
    const primaryGenre = mapGenre(albumsToProcess[0]?.primaryGenreName || 'Pop');

    const heroArtwork = albumsToProcess[0]?.artworkUrl100
      ? albumsToProcess[0].artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
      : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80';

    // 2. Ensure Artist exists
    let existingArtist = db.getArtistById(artistId);
    if (!existingArtist) {
      const newArtist: Artist = {
        id: artistId,
        name: officialArtistName,
        avatar: heroArtwork,
        banner: heroArtwork,
        bio: `${officialArtistName} is an internationally recognized multi-platinum artist featured on SONORA.`,
        country: 'Global',
        genreId: primaryGenre.id,
        genreName: primaryGenre.name,
        monthlyListeners: 45000000,
        followersCount: 22000000,
        isVerified: true,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.saveArtist(newArtist);
      existingArtist = newArtist;
    }

    const importedAlbumsSummary: any[] = [];
    let totalImportedSongs = 0;

    // 3. For each album, fetch its soundtrack / tracks
    for (const alb of albumsToProcess) {
      const collectionId = alb.collectionId;
      const albumTitle = alb.collectionName;
      const albumSlug = slugify(albumTitle);
      const albumId = `album-${albumSlug}`;
      const coverHd = alb.artworkUrl100
        ? alb.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg')
        : heroArtwork;
      const albumGenre = mapGenre(alb.primaryGenreName);
      const releaseDate = alb.releaseDate ? alb.releaseDate.split('T')[0] : '2020-01-01';

      // Lookup tracks in this album
      const lookupUrl = `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`;
      const lookupRes = await fetch(lookupUrl, { signal: AbortSignal.timeout(8000) });
      if (!lookupRes.ok) continue;

      const lookupData = await lookupRes.json();
      const rawTracks = (lookupData.results || []).filter((r: any) => r.wrapperType === 'track');
      const songIdsForAlbum: string[] = [];
      const seenBaseTitles = new Set<string>();

      for (const t of rawTracks) {
        const trackTitle = t.trackName;
        const isAlternateOrRemix = /\b(remix|radio single remix|club mix|acoustic version|instrumental version)\b/i.test(trackTitle);
        const cleanBaseTitle = cleanTitle(trackTitle).toLowerCase();
        if (seenBaseTitles.has(cleanBaseTitle) && isAlternateOrRemix) {
          continue; // Prioritize original studio version, skip remix duplicate
        }
        seenBaseTitles.add(cleanBaseTitle);
        const songSlug = slugify(cleanTitle(trackTitle));
        const songId = `song-${artistSlug}-${songSlug}`;
        const durationSec = t.trackTimeMillis ? Math.round(t.trackTimeMillis / 1000) : 210;

        // Fetch synced lyrics from LRCLIB
        const lyricsInfo = await fetchLyrics(officialArtistName, trackTitle, durationSec);

        const songObj: Song = {
          id: songId,
          title: trackTitle,
          originalFilename: `${songSlug}.mp3`,
          audioUrl: t.previewUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${officialArtistName} ${trackTitle}`)}`,
          audioPath: t.previewUrl || undefined,
          coverImage: coverHd,
          artistId: artistId,
          artistName: officialArtistName,
          albumId: albumId,
          albumTitle: albumTitle,
          genreId: albumGenre.id,
          genreName: albumGenre.name,
          duration: durationSec,
          releaseDate: releaseDate,
          description: `Track #${t.trackNumber || 1} from "${albumTitle}" by ${officialArtistName}.`,
          lyrics: lyricsInfo.plain,
          syncedLyrics: lyricsInfo.synced,
          multilingualLyrics: { en: lyricsInfo.synced },
          explicit: t.trackExplicitness === 'explicit',
          status: 'published',
          playCount: Math.floor(Math.random() * 500000) + 100000,
          likesCount: Math.floor(Math.random() * 30000) + 5000,
          uploadedBy: user.id,
          uploadType: 'url',
          sourceType: 'external_url',
          sourcePlatform: 'direct',
          isFeatured: true,
          synthPreset: albumGenre.id === 'genre-rock' ? 'rock' : 'pop',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        db.saveSong(songObj);
        songIdsForAlbum.push(songId);
        totalImportedSongs++;
      }

      // Create or update Album object
      const albumObj: Album = {
        id: albumId,
        title: albumTitle,
        artistId: artistId,
        artistName: officialArtistName,
        coverImage: coverHd,
        description: `Official studio album "${albumTitle}" by ${officialArtistName}.`,
        genreId: albumGenre.id,
        genreName: albumGenre.name,
        releaseDate: releaseDate,
        copyrightInfo: alb.copyright || `© ${releaseDate.slice(0, 4)} ${officialArtistName}`,
        status: 'published',
        isFeatured: true,
        songIds: songIdsForAlbum,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.saveAlbum(albumObj);
      importedAlbumsSummary.push({
        id: albumId,
        title: albumTitle,
        coverImage: coverHd,
        tracksCount: songIdsForAlbum.length,
        releaseDate,
      });
    }

    return NextResponse.json({
      success: true,
      artist: {
        id: artistId,
        name: officialArtistName,
        avatar: heroArtwork,
      },
      albumsCount: importedAlbumsSummary.length,
      songsCount: totalImportedSongs,
      albums: importedAlbumsSummary,
    });
  } catch (err: any) {
    console.error('[auto-import error]:', err);
    return NextResponse.json({ error: err.message || 'Auto-import failed.' }, { status: 500 });
  }
}
