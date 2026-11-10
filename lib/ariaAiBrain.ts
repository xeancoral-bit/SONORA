import { db } from '@/lib/db';
import { Song, Album, Artist } from '@/lib/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  suggestAdminHandoff?: boolean;
  action?: AriaAction;
  clarification?: AriaClarification;
}

export interface PlayerStatePayload {
  currentTrack: {
    id: string;
    title: string;
    artistName: string;
    albumTitle?: string;
    duration?: number;
  } | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  queueLength: number;
  hasNextTrack: boolean;
  nextTrack?: { id: string; title: string; artistName: string } | null;
  hasPreviousTrack: boolean;
  previousTrack?: { id: string; title: string; artistName: string } | null;
}

export type AriaActionType =
  | 'play'
  | 'pause'
  | 'resume'
  | 'next'
  | 'previous'
  | 'volume'
  | 'open_lyrics';

export interface AriaAction {
  type: AriaActionType;
  track?: Song;
  tracks?: Song[];
  volumeLevel?: number;
}

export interface ClarificationOption {
  trackId: string;
  title: string;
  artistName: string;
  albumTitle?: string;
}

export interface AriaClarification {
  type: 'artist' | 'song';
  songTitle?: string;
  options: ClarificationOption[];
}

export interface AriaResponse {
  reply: string;
  suggestedFollowUps: string[];
  suggestAdminHandoff?: boolean;
  action?: AriaAction;
  clarification?: AriaClarification;
}

export interface SonoraStats {
  artistCount: number;
  albumCount: number;
  songCount: number;
  genres: string[];
}

export function getSonoraCatalogStats(): SonoraStats {
  const songs = db.getSongs();
  const artists = db.getArtists();
  const albums = db.getAlbums();
  const genres = db.getGenres();
  return {
    artistCount: artists.length,
    albumCount: albums.length,
    songCount: songs.length,
    genres: genres.map((g) => g.name || g.slug),
  };
}

function cleanStr(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '3:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function searchSonoraCatalog(query: string) {
  const qClean = cleanStr(query);
  if (!qClean) return null;

  const songs = db.getSongs();
  const artists = db.getArtists();
  const albums = db.getAlbums();

  const matchedArtists = artists.filter((a) => {
    const aClean = cleanStr(a.name);
    return aClean.includes(qClean) || qClean.includes(aClean);
  });

  const matchedAlbums = albums.filter((a) => {
    const aClean = cleanStr(a.title);
    return aClean.includes(qClean) || qClean.includes(aClean);
  });

  const matchedSongs = songs.filter((s) => {
    const sClean = cleanStr(s.title);
    const aClean = cleanStr(s.artistName);
    return (
      sClean.includes(qClean) ||
      qClean.includes(sClean) ||
      (aClean.length > 2 && qClean.includes(aClean))
    );
  });

  return {
    artists: matchedArtists.slice(0, 5),
    albums: matchedAlbums.slice(0, 5),
    songs: matchedSongs.slice(0, 10),
  };
}

/**
 * Detect language: English, Cebuano/Bisaya, Tagalog, Spanish, Japanese, etc.
 */
export function detectLanguage(text: string): 'en' | 'ceb' | 'fil' | 'es' | 'ja' | 'ko' | 'other' {
  const lower = text.toLowerCase();
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';

  const cebWords = ['unsaon', 'ngano', 'unsay', 'dili', 'dli', 'wala', 'wla', 'deria', 'karon', 'kinsa', 'paminaw', 'palihog', 'ganahan', 'tukar', 'kaayo', 'nako', 'nimo', 'akong', 'imong', 'pud', 'pod', 'gyud', 'jud'];
  if (cebWords.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(lower))) return 'ceb';

  const filWords = ['paano', 'pano', 'bakit', 'hindi', 'ndi', 'sino', 'saan', 'paki', 'tumutugtog', 'tugtog', 'pakinggan', 'ano', 'meron', 'aking', 'kamusta', 'kumusta'];
  if (filWords.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(lower))) return 'fil';

  if (/\b(hola|cómo|canción|álbum|artista|reproducir|gracias|por favor)\b/i.test(lower)) return 'es';

  return 'en';
}

/**
 * Check if the user is answering a previous clarification question
 */
function extractClarificationAnswer(
  userPrompt: string,
  history: ChatMessage[]
): { pendingSongTitle: string; requestedArtist: string } | null {
  if (!history || history.length === 0) return null;

  // Look for the most recent assistant message that asked for artist clarification
  let clarificationMsg: ChatMessage | null = null;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'assistant') {
      const content = history[i].content;
      if (
        content.includes("Which artist's version of") ||
        content.includes("Which artist's version would you like") ||
        content.includes("Kinsang bersyon") ||
        content.includes("Kaninong bersyon")
      ) {
        clarificationMsg = history[i];
        break;
      }
    }
  }

  if (!clarificationMsg) return null;

  // Extract song title from clarification message
  let pendingTitle = '';
  if (clarificationMsg.clarification?.songTitle) {
    pendingTitle = clarificationMsg.clarification.songTitle;
  } else {
    const match = clarificationMsg.content.match(/Which artist's version of \*\*([^*]+)\*\*/i);
    if (match && match[1]) {
      pendingTitle = match[1].trim();
    }
  }

  if (!pendingTitle) return null;

  // Now extract artist mentioned in userPrompt
  // e.g. "The version by Lola Amour", "Lola Amour", "by Lola Amour", "version by BINI", "si BINI"
  let cleanUserArtist = userPrompt
    .replace(/^(the\s+)?(version\s+)?(by\s+)?/i, '')
    .replace(/^(ang\s+)?(bersyon\s+)?(ni\s+|kay\s+)?/i, '')
    .replace(/^(yung\s+)?(kay\s+)/i, '')
    .trim();

  // Clean trailing punctuation
  cleanUserArtist = cleanUserArtist.replace(/[.?!]+$/, '').trim();

  if (cleanUserArtist.length > 1) {
    return {
      pendingSongTitle: pendingTitle,
      requestedArtist: cleanUserArtist,
    };
  }

  return null;
}

/**
 * Main local intelligent engine for Aria AI Assistant
 */
export async function getAriaResponse(
  userPrompt: string,
  history: ChatMessage[] = [],
  userName: string = 'Friend',
  playerState?: PlayerStatePayload
): Promise<AriaResponse> {
  const query = userPrompt.trim();
  const qClean = cleanStr(query);
  const lang = detectLanguage(query);

  const songs = db.getSongs();
  const artists = db.getArtists();
  const albums = db.getAlbums();

  // =========================================================================
  // 1. CHECK CLARIFICATION FOLLOW-UP (Requirement 4 & 6)
  // e.g., User asked "Play Kanata", AI asked "Which artist's version...?",
  // and now user answers: "The version by Lola Amour" or "Lola Amour".
  // =========================================================================
  const clarificationFollowUp = extractClarificationAnswer(query, history);
  if (clarificationFollowUp) {
    const { pendingSongTitle, requestedArtist } = clarificationFollowUp;
    const reqArtistClean = cleanStr(requestedArtist);
    const targetTitleClean = cleanStr(pendingSongTitle);

    // Search for matching song with both title and artist
    const matchedSong = songs.find((s) => {
      const sTitle = cleanStr(s.title);
      const sArtist = cleanStr(s.artistName);
      const titleMatches = sTitle === targetTitleClean || sTitle.includes(targetTitleClean) || targetTitleClean.includes(sTitle);
      const artistMatches = sArtist === reqArtistClean || sArtist.includes(reqArtistClean) || reqArtistClean.includes(sArtist);
      return titleMatches && artistMatches;
    });

    if (matchedSong) {
      return {
        reply: `I found the correct track. Playing **${matchedSong.title}** by **${matchedSong.artistName}** now! 🎵\n\n* **Album:** *${matchedSong.albumTitle || 'Single'}*\n* **Duration:** ${formatDuration(matchedSong.duration)}\n* **Genre:** ${matchedSong.genreName}`,
        suggestedFollowUps: [
          'Pause music',
          'Show lyrics',
          `What album is this from?`,
          `Play another song by ${matchedSong.artistName}`
        ],
        action: {
          type: 'play',
          track: matchedSong,
          tracks: [matchedSong]
        }
      };
    }
  }

  // =========================================================================
  // 2. PLAYBACK CONTROL COMMANDS (Pause, Resume, Skip, Previous, Now Playing, Volume)
  // =========================================================================

  // --- PAUSE COMMAND ---
  if (
    /^(pause|stop|pause the music|stop the music|pahuway|ihunong|hinto|tigil|pause song)$/i.test(qClean) ||
    /\b(pause the music|pause playback|pause song|stop playing)\b/i.test(qClean)
  ) {
    if (playerState?.isPlaying) {
      const trackName = playerState.currentTrack?.title || 'the current song';
      const artistName = playerState.currentTrack?.artistName ? ` by **${playerState.currentTrack.artistName}**` : '';
      return {
        reply: `Paused playback for **"${trackName}"**${artistName}. ⏸️`,
        suggestedFollowUps: ['Resume playing', 'Skip to next track', 'Who sings this song?'],
        action: { type: 'pause' }
      };
    } else if (playerState?.currentTrack) {
      return {
        reply: `Playback is already paused for **"${playerState.currentTrack.title}"**. Say "Resume" whenever you want to keep listening. ⏸️`,
        suggestedFollowUps: ['Resume playback', 'Skip to next song', 'What album is this from?']
      };
    } else {
      return {
        reply: 'There is currently no music playing to pause. Would you like me to play a featured track?',
        suggestedFollowUps: ['Play BINI', 'Play Sabrina Carpenter', 'Recommend top songs']
      };
    }
  }

  // --- RESUME / CONTINUE COMMAND ---
  if (
    /^(resume|continue|unpause|play again|padayon|padayona|ipagpatuloy|tuloy|resume playback)$/i.test(qClean) ||
    /\b(resume playback|continue playing|unpause music)\b/i.test(qClean)
  ) {
    if (playerState?.isPlaying) {
      return {
        reply: `**"${playerState.currentTrack?.title || 'Music'}"** is already actively playing on SONORA! 🎵`,
        suggestedFollowUps: ['Pause music', 'Skip to next track', 'What album is this from?']
      };
    } else if (playerState?.currentTrack) {
      return {
        reply: `Resumed playback for **"${playerState.currentTrack.title}"** by **${playerState.currentTrack.artistName}**! 🎵`,
        suggestedFollowUps: ['Pause music', 'Skip song', 'Show lyrics'],
        action: { type: 'resume' }
      };
    } else {
      const topSong = songs[0];
      return {
        reply: `No track was currently paused. Starting playback with **"${topSong.title}"** by **${topSong.artistName}**! 🎵`,
        suggestedFollowUps: ['Pause music', 'Next song', 'Show lyrics'],
        action: { type: 'play', track: topSong, tracks: [topSong] }
      };
    }
  }

  // --- SKIP / NEXT COMMAND (Requirement 5) ---
  if (
    /^(skip|next|next song|next track|skip song|skip this|sunod|susunod|skip track)$/i.test(qClean) ||
    /\b(skip to next|play next track|skip this song|skip track)\b/i.test(qClean)
  ) {
    if (playerState?.hasNextTrack && playerState.nextTrack) {
      return {
        reply: `Skipped to next track in queue: **"${playerState.nextTrack.title}"** by **${playerState.nextTrack.artistName}**! ⏭️`,
        suggestedFollowUps: ['Pause music', 'What song is playing?', 'Next track'],
        action: { type: 'next' }
      };
    } else {
      // Must clearly inform user queue is empty and offer to find or add another song!
      return {
        reply: 'The playback queue is currently empty, so there is no next track to skip to. Would you like me to find or play another song for you?',
        suggestedFollowUps: ['Play recommended songs', 'Play another song by this artist', 'Play top OPM hits']
      };
    }
  }

  // --- PREVIOUS COMMAND ---
  if (
    /^(previous|previous song|previous track|prev|go back|balik|nakaraan|unang kanta)$/i.test(qClean) ||
    /\b(play previous|back to previous|previous song)\b/i.test(qClean)
  ) {
    if (playerState?.hasPreviousTrack && playerState.previousTrack) {
      return {
        reply: `Going back to previous track: **"${playerState.previousTrack.title}"** by **${playerState.previousTrack.artistName}**! ⏮️`,
        suggestedFollowUps: ['Pause music', 'What song is playing?', 'Next song'],
        action: { type: 'previous' }
      };
    } else {
      return {
        reply: 'There is no previous track in your listening history for this session.',
        suggestedFollowUps: ['Play recommended songs', 'What song is playing now?']
      };
    }
  }

  // --- NOW PLAYING COMMAND ---
  if (
    /\b(now playing|what song is playing|what is this song|what is playing|karon nagtukar|unsay nagtukar|ano ang tumutugtog|currently playing|current song)\b/i.test(qClean)
  ) {
    if (playerState?.currentTrack) {
      const cur = playerState.currentTrack;
      const matchedDbSong = songs.find((s) => s.id === cur.id);
      return {
        reply: `🎧 **Currently Playing:**\n\n* **Title:** "${cur.title}"\n* **Artist:** **${cur.artistName}**\n* **Album:** *${cur.albumTitle || matchedDbSong?.albumTitle || 'Single'}*\n* **Playback State:** ${playerState.isPlaying ? '▶ Active Playback' : '⏸ Paused'}\n* **Volume:** ${Math.round(playerState.volume * 100)}%\n* **Duration:** ${formatDuration(cur.duration || matchedDbSong?.duration || 0)}`,
        suggestedFollowUps: [
          playerState.isPlaying ? 'Pause music' : 'Resume playback',
          `Show more songs by ${cur.artistName}`,
          'What album is this from?',
          'Show lyrics'
        ]
      };
    } else {
      return {
        reply: 'No track is currently playing on SONORA. You can ask me to play any artist, album, or song!',
        suggestedFollowUps: ['Play BINI', 'Play Sabrina Carpenter', 'Recommend top songs']
      };
    }
  }

  // --- VOLUME CONTROL COMMANDS ---
  if (
    /\b(volume|loud|louder|soft|softer|mute|unmute|kusog|hinay|lakasan|hinaan)\b/i.test(qClean)
  ) {
    if (/\bmute\b/i.test(qClean) && !/\bunmute\b/i.test(qClean)) {
      return {
        reply: 'Muted audio playback. 🔇',
        suggestedFollowUps: ['Unmute volume', 'Set volume to 50%'],
        action: { type: 'volume', volumeLevel: 0 }
      };
    }
    if (/\bunmute\b/i.test(qClean)) {
      return {
        reply: 'Unmuted audio playback to 75%. 🔊',
        suggestedFollowUps: ['Pause music', 'Set volume to 100%'],
        action: { type: 'volume', volumeLevel: 0.75 }
      };
    }
    const percentMatch = query.match(/(\d{1,3})\s*%/);
    if (percentMatch) {
      const parsed = Math.max(0, Math.min(100, parseInt(percentMatch[1], 10)));
      const vol = parsed / 100;
      return {
        reply: `Set volume to **${parsed}%**. 🔊`,
        suggestedFollowUps: ['Pause music', 'What song is playing?'],
        action: { type: 'volume', volumeLevel: vol }
      };
    }
    if (/\b(up|louder|increase|patas|lakasan)\b/i.test(qClean)) {
      const cur = playerState?.volume ?? 0.8;
      const newVol = Math.min(1.0, Math.round((cur + 0.15) * 100) / 100);
      return {
        reply: `Increased volume to **${Math.round(newVol * 100)}%**. 🔊`,
        suggestedFollowUps: ['Volume up more', 'Volume down'],
        action: { type: 'volume', volumeLevel: newVol }
      };
    }
    if (/\b(down|softer|lower|decrease|hinay|hinaan)\b/i.test(qClean)) {
      const cur = playerState?.volume ?? 0.8;
      const newVol = Math.max(0.0, Math.round((cur - 0.15) * 100) / 100);
      return {
        reply: `Decreased volume to **${Math.round(newVol * 100)}%**. 🔉`,
        suggestedFollowUps: ['Volume up', 'Mute'],
        action: { type: 'volume', volumeLevel: newVol }
      };
    }
  }

  // --- LYRICS COMMAND ---
  if (
    /\b(lyrics|show lyrics|display lyrics|show me the lyrics|tan-awa ang lyrics|titik)\b/i.test(qClean)
  ) {
    const curTrack = playerState?.currentTrack;
    if (curTrack) {
      return {
        reply: `Opening synchronized lyrics for **"${curTrack.title}"** by **${curTrack.artistName}**! 🎤\n\nYou can also click the **Lyrics icon** on the player bar to toggle synchronized scrolling and choose from 20+ language translations.`,
        suggestedFollowUps: ['What album is this from?', 'Pause music', 'Next song'],
        action: { type: 'open_lyrics' }
      };
    } else {
      return {
        reply: 'Synchronized lyrics are available for tracks as they play. Start playing a track and ask for lyrics again, or click the lyrics icon in the player bar!',
        suggestedFollowUps: ['Play BINI', 'Play Sabrina Carpenter']
      };
    }
  }

  // =========================================================================
  // 3. CONTEXTUAL FOLLOW-UP QUESTIONS (Requirement 6)
  // "What album is this from?", "Who sings this song?", "Play another song from this artist"
  // =========================================================================

  // --- "WHAT ALBUM IS THIS FROM?" ---
  if (
    /\b(what album is this|which album is this|what album|unsa ni nga album|anong album)\b/i.test(qClean)
  ) {
    const targetTrack = playerState?.currentTrack;
    if (targetTrack) {
      const dbSong = songs.find((s) => s.id === targetTrack.id);
      const albumTitle = targetTrack.albumTitle || dbSong?.albumTitle;
      const matchedAlbum = albums.find(
        (a) =>
          a.id === dbSong?.albumId ||
          (albumTitle && cleanStr(a.title) === cleanStr(albumTitle))
      );

      return {
        reply: `**"${targetTrack.title}"** by **${targetTrack.artistName}** is from the album ***${albumTitle || 'Official Single'}***${matchedAlbum?.releaseDate ? ` (released in ${matchedAlbum.releaseDate.slice(0, 4)})` : ''}.\n\n* **Genre:** ${matchedAlbum?.genreName || dbSong?.genreName || 'Music'}\n* **Track Count:** ${matchedAlbum?.totalTracks || matchedAlbum?.tracksCount || 1} track${(matchedAlbum?.totalTracks || 1) > 1 ? 's' : ''}`,
        suggestedFollowUps: [
          `Play another song from this artist`,
          `Who sings this song?`,
          'Show lyrics'
        ]
      };
    } else {
      return {
        reply: 'There is no track currently playing. Play a song first, and I will happily give you all of its album, release, and discography details!',
        suggestedFollowUps: ['Play BINI', 'Play Sabrina Carpenter', 'Recommend songs']
      };
    }
  }

  // --- "WHO SINGS THIS SONG?" ---
  if (
    /\b(who sings this|who is the artist|who sings|kinsa nagkanta|sino ang kumakanta|artist ani)\b/i.test(qClean)
  ) {
    const targetTrack = playerState?.currentTrack;
    if (targetTrack) {
      const dbArtist = artists.find(
        (a) => cleanStr(a.name) === cleanStr(targetTrack.artistName)
      );
      return {
        reply: `**"${targetTrack.title}"** is performed by **${targetTrack.artistName}**.\n\n* **Genre:** ${dbArtist?.genreName || 'Pop'}\n* **Monthly Listeners:** ${(dbArtist?.monthlyListeners || 1500000).toLocaleString()}\n* **Bio:** ${dbArtist?.bio || `${targetTrack.artistName} is a featured artist on SONORA.`}`,
        suggestedFollowUps: [
          `Play another song by ${targetTrack.artistName}`,
          'What album is this from?',
          'Pause music'
        ]
      };
    } else {
      return {
        reply: 'No song is currently playing. Start a song, and I will show you full artist credentials and listeners!',
        suggestedFollowUps: ['Play BINI', 'Play Lola Amour', 'Play Bruno Mars']
      };
    }
  }

  // --- "PLAY ANOTHER SONG FROM THIS ARTIST" ---
  if (
    /\b(play another song from this artist|another song from this artist|more from this artist|another song by this artist|more songs by this artist|lain kanta ani nga artist)\b/i.test(qClean)
  ) {
    const artistName = playerState?.currentTrack?.artistName;
    if (artistName) {
      const artistClean = cleanStr(artistName);
      const artistSongs = songs.filter(
        (s) =>
          cleanStr(s.artistName).includes(artistClean) &&
          s.id !== playerState?.currentTrack?.id
      );

      if (artistSongs.length > 0) {
        const nextSong = artistSongs[0];
        return {
          reply: `Playing another track by **${artistName}**: **"${nextSong.title}"**! 🎵\n\n* **Album:** *${nextSong.albumTitle || 'Single'}*\n* **Duration:** ${formatDuration(nextSong.duration)}`,
          suggestedFollowUps: [
            'Pause music',
            'Show lyrics',
            `Play another song by ${artistName}`
          ],
          action: {
            type: 'play',
            track: nextSong,
            tracks: artistSongs
          }
        };
      } else {
        return {
          reply: `**"${playerState.currentTrack?.title}"** is currently the only registered track for **${artistName}** on SONORA. Would you like me to recommend similar artists?`,
          suggestedFollowUps: ['Recommend similar artists', 'Play top songs']
        };
      }
    } else {
      return {
        reply: 'There is no active artist playing right now. Tell me any artist you love (e.g. "Play BINI" or "Play Lola Amour") and I will stream their music immediately!',
        suggestedFollowUps: ['Play BINI', 'Play Lola Amour', 'Play Sabrina Carpenter']
      };
    }
  }

  // =========================================================================
  // 4. INTELLIGENT SONG & ARTIST PLAY REQUESTS (Requirement 3 & 4)
  // Supports:
  // - "Play [Song] by [Artist]"
  // - "Play [Song]" (with disambiguation clarification if multiple artists match)
  // - "Play [Artist]"
  // =========================================================================
  const isPlayRequest =
    /^(play|can you play|please play|tukar|patukara|i-play|patugtugin|tugtog)\b/i.test(query) ||
    /\b(can you play|please play|i want to listen to|i want to hear)\b/i.test(query);

  if (isPlayRequest) {
    // Strip "play", "can you play", "please play", etc.
    const playTarget = query
      .replace(/^(can\s+you\s+)?(please\s+)?(play|tukar|patukara|i-play|patugtugin|tugtog)\s+/i, '')
      .replace(/^(i\s+want\s+to\s+listen\s+to|i\s+want\s+to\s+hear)\s+/i, '')
      .trim();

    // Check "by" separator: e.g. "Kanata by Lola Amour" or "Espresso by Sabrina Carpenter"
    const byMatch = playTarget.match(/^(.+?)\s+by\s+(.+)$/i);
    if (byMatch) {
      const reqTitle = byMatch[1].trim();
      const reqArtist = byMatch[2].trim();
      const tClean = cleanStr(reqTitle);
      const aClean = cleanStr(reqArtist);

      const matched = songs.find((s) => {
        const sTitle = cleanStr(s.title);
        const sArtist = cleanStr(s.artistName);
        return (
          (sTitle === tClean || sTitle.includes(tClean) || tClean.includes(sTitle)) &&
          (sArtist === aClean || sArtist.includes(aClean) || aClean.includes(sArtist))
        );
      });

      if (matched) {
        return {
          reply: `I found **${matched.title}** by **${matched.artistName}**. Playing it now on SONORA! 🎵\n\n* **Album:** *${matched.albumTitle || 'Single'}*\n* **Duration:** ${formatDuration(matched.duration)}\n* **Genre:** ${matched.genreName}`,
          suggestedFollowUps: [
            'Pause music',
            'Show lyrics',
            `What album is this from?`,
            `Play another song by ${matched.artistName}`
          ],
          action: {
            type: 'play',
            track: matched,
            tracks: [matched]
          }
        };
      }
    }

    // Check if target matches an Artist name directly (e.g. "Play BINI", "Play Lola Amour")
    const targetClean = cleanStr(playTarget);
    const matchedArtist = artists.find((a) => {
      const aClean = cleanStr(a.name);
      return aClean === targetClean || aClean.includes(targetClean) || targetClean.includes(aClean);
    });

    if (matchedArtist && targetClean.length > 2) {
      const artistSongs = songs.filter(
        (s) =>
          cleanStr(s.artistName) === cleanStr(matchedArtist.name) ||
          s.artistId === matchedArtist.id
      );

      if (artistSongs.length > 0) {
        const topSong = artistSongs[0];
        return {
          reply: `Playing top tracks by **${matchedArtist.name}**, starting with **"${topSong.title}"**! 🎵\n\n* **Artist:** ${matchedArtist.name} (${matchedArtist.genreName || 'Music'})\n* **Album:** *${topSong.albumTitle || 'Official'}*\n* **Monthly Listeners:** ${(matchedArtist.monthlyListeners || 1000000).toLocaleString()}`,
          suggestedFollowUps: [
            'Pause music',
            'Skip to next song',
            `Show lyrics`,
            `What album is this from?`
          ],
          action: {
            type: 'play',
            track: topSong,
            tracks: artistSongs
          }
        };
      }
    }

    // Now check if playTarget matches song title(s)
    const matchingSongs = songs.filter((s) => {
      const sTitleClean = cleanStr(s.title);
      return (
        sTitleClean === targetClean ||
        sTitleClean.startsWith(targetClean + ' ') ||
        (targetClean.length > 3 && sTitleClean.includes(targetClean))
      );
    });

    if (matchingSongs.length > 0) {
      // Group distinct artists
      const distinctArtistsMap = new Map<string, Song>();
      for (const s of matchingSongs) {
        const aKey = cleanStr(s.artistName);
        if (!distinctArtistsMap.has(aKey)) {
          distinctArtistsMap.set(aKey, s);
        }
      }

      // Requirement 4: Multiple artists match -> DO NOT randomly select a track!
      // Ask clarification: "Which artist's version of [Title] would you like me to play?"
      if (distinctArtistsMap.size > 1) {
        const optionsList = Array.from(distinctArtistsMap.values()).map((s) => ({
          trackId: s.id,
          title: s.title,
          artistName: s.artistName,
          albumTitle: s.albumTitle,
        }));

        const optionsText = optionsList
          .map((o) => `• **${o.artistName}** — *${o.albumTitle || 'Official Release'}*`)
          .join('\n');

        return {
          reply: `Which artist's version of **${matchingSongs[0].title}** would you like me to play?\n\n${optionsText}`,
          suggestedFollowUps: optionsList.map((o) => `The version by ${o.artistName}`),
          clarification: {
            type: 'artist',
            songTitle: matchingSongs[0].title,
            options: optionsList,
          }
        };
      }

      // Single distinct artist match -> Play immediately!
      const songToPlay = matchingSongs[0];
      return {
        reply: `I found **"${songToPlay.title}"** by **${songToPlay.artistName}**. Playing it now on SONORA! 🎵\n\n* **Album:** *${songToPlay.albumTitle || 'Single'}*\n* **Duration:** ${formatDuration(songToPlay.duration)}\n* **Genre:** ${songToPlay.genreName}`,
        suggestedFollowUps: [
          'Pause music',
          'Show lyrics',
          `What album is this from?`,
          `Play another song by ${songToPlay.artistName}`
        ],
        action: {
          type: 'play',
          track: songToPlay,
          tracks: matchingSongs
        }
      };
    }

    // Song not found
    return {
      reply: `I searched our 50,000+ tracks but couldn't find **"${playTarget}"** in our database. You can try searching with both the song title and artist name (e.g. "Play [Song] by [Artist]"), or use the **Request Music** form in the top bar!`,
      suggestedFollowUps: [
        'Recommend top trending songs',
        'Play BINI',
        'Play Lola Amour',
        'Play Sabrina Carpenter'
      ]
    };
  }

  // =========================================================================
  // 5. RECOMMENDATIONS & DISCOVERY (Requirement 7)
  // =========================================================================
  const isRecommendRequest =
    /\b(recommend|suggest|suggestion|recommendations|rekomenda|sugyot|paminawon|pakinggan|maganda|nindot|top songs|trending)\b/i.test(qClean);

  if (isRecommendRequest) {
    // Filter by genre if mentioned
    let targetGenre = '';
    if (/\b(pop|k-pop|p-pop)\b/i.test(qClean)) targetGenre = 'Pop';
    else if (/\b(rock|indie|alternative)\b/i.test(qClean)) targetGenre = 'Rock';
    else if (/\b(r&b|soul)\b/i.test(qClean)) targetGenre = 'R&B';
    else if (/\b(hip hop|rap|trap)\b/i.test(qClean)) targetGenre = 'Hip-Hop';
    else if (/\b(opm)\b/i.test(qClean)) targetGenre = 'OPM';

    let candidates = songs;
    if (targetGenre) {
      if (targetGenre === 'OPM') {
        const opmArtists = ['bini', 'sb19', 'lola amour', 'arthur nery', 'dionela', 'maki', 'hev abi'];
        candidates = songs.filter((s) => opmArtists.some((a) => cleanStr(s.artistName).includes(a)));
      } else {
        candidates = songs.filter((s) => s.genreName?.toLowerCase().includes(targetGenre.toLowerCase()));
      }
    }

    if (candidates.length === 0) candidates = songs;

    // Pick top 5 songs with highest playCount or recently added
    const recs = candidates
      .slice()
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, 5);

    const recLines = recs
      .map(
        (s, i) =>
          `${i + 1}. **"${s.title}"** by **${s.artistName}** — *${s.albumTitle || 'Single'}* (${formatDuration(s.duration)})`
      )
      .join('\n');

    return {
      reply: `🎶 **Here are top recommended ${targetGenre ? `${targetGenre} ` : ''}tracks from the SONORA database:**\n\n${recLines}\n\nTap any song below or ask me to play it directly!`,
      suggestedFollowUps: recs.slice(0, 3).map((s) => `Play ${s.title} by ${s.artistName}`),
      action: {
        type: 'play',
        track: recs[0],
        tracks: recs
      }
    };
  }

  // =========================================================================
  // 6. ARTIST OR ALBUM INFORMATION SEARCH (Requirement 2)
  // =========================================================================
  const catalogMatch = searchSonoraCatalog(query);
  if (catalogMatch && catalogMatch.artists.length > 0) {
    const art = catalogMatch.artists[0];
    const artistAlbums = albums.filter((a) => a.artistId === art.id || cleanStr(a.artistName) === cleanStr(art.name));
    const artistSongs = songs.filter((s) => s.artistId === art.id || cleanStr(s.artistName) === cleanStr(art.name));

    let reply = `✨ **${art.name}** is registered in the official SONORA music library!\n\n`;
    reply += `* **Genre:** ${art.genreName || 'Music'}\n`;
    reply += `* **Country/Region:** ${art.country || 'Global'}\n`;
    reply += `* **Monthly Listeners:** ${(art.monthlyListeners || 1200000).toLocaleString()}\n`;
    reply += `* **Verified Status:** ${art.isVerified ? ' Verified Official Artist' : 'Community'}\n\n`;

    if (artistAlbums.length > 0) {
      reply += `💿 **Albums & EPs (${artistAlbums.length}):**\n`;
      artistAlbums.slice(0, 4).forEach((a) => {
        reply += `  • *${a.title}* (${a.releaseDate?.slice(0, 4) || 'Official'})\n`;
      });
      reply += '\n';
    }

    if (artistSongs.length > 0) {
      reply += `🎵 **Top Tracks (${artistSongs.length} in library):**\n`;
      artistSongs.slice(0, 5).forEach((s) => {
        reply += `  • **${s.title}** (${formatDuration(s.duration)}) — *${s.albumTitle || 'Single'}*\n`;
      });
      reply += '\n';
    }

    reply += `Ask me **"Play ${art.name}"** or tap any track below to start streaming immediately!`;

    return {
      reply,
      suggestedFollowUps: [
        `Play ${art.name}`,
        `Play another song by ${art.name}`,
        `What are other ${art.genreName || 'similar'} artists?`
      ]
    };
  }

  // Check if query matches specific song metadata inquiry
  if (catalogMatch && catalogMatch.songs.length > 0) {
    const s = catalogMatch.songs[0];
    return {
      reply: `🎵 **"${s.title}"** by **${s.artistName}** is ready to stream on SONORA!\n\n* **Album:** *${s.albumTitle || 'Single'}*\n* **Genre:** ${s.genreName}\n* **Duration:** ${formatDuration(s.duration)}\n* **Release Date:** ${s.releaseDate || 'Official'}\n\nSay **"Play ${s.title}"** or tap below to listen right away!`,
      suggestedFollowUps: [
        `Play ${s.title} by ${s.artistName}`,
        `Show more songs by ${s.artistName}`,
        'Show lyrics'
      ]
    };
  }

  // =========================================================================
  // 7. GREETING & GENERAL PLATFORM QUESTIONS
  // =========================================================================
  if (/^(hello|hi|hey|kumusta|kamusta|maayong|hola|good day|good morning|good evening)/i.test(qClean) || qClean.length < 4) {
    const stats = getSonoraCatalogStats();
    let greeting = `✨ **Hello, ${userName}! I'm Aria**, your personal AI Music Maestro for SONORA.`;
    if (lang === 'ceb') {
      greeting = `✨ **Kumusta, ${userName}! Ako si Aria**, ang imong opisyal nga AI Music Assistant dinhi sa SONORA.`;
    } else if (lang === 'fil') {
      greeting = `✨ **Kamusta, ${userName}! Ako si Aria**, ang iyong AI Music Assistant dito sa SONORA.`;
    }

    return {
      reply: `${greeting}\n\nOur platform currently hosts **${stats.artistCount.toLocaleString()} artists**, **${stats.albumCount.toLocaleString()} albums**, and **${stats.songCount.toLocaleString()} full-length songs** across genres like ${stats.genres.slice(0, 5).join(', ')}.\n\nI can execute actual playback commands right here:\n* 🎵 **Play songs or artists:** *"Play Espresso by Sabrina Carpenter"*, *"Play BINI"*\n* ⏸️ **Control playback:** *"Pause"*, *"Resume"*, *"Skip song"*, *"Previous"*\n* 🎧 **Track info:** *"What song is playing?"*, *"What album is this from?"*\n* 🔊 **Adjust volume:** *"Set volume to 80%"*, *"Louder"*, *"Mute"*\n* 🎤 **Show lyrics & translations:** *"Show lyrics"*\n\nWhat song or artist would you like to hear today?`,
      suggestedFollowUps: [
        'Play BINI',
        'Play Lola Amour',
        'Play Sabrina Carpenter',
        'What song is playing now?'
      ]
    };
  }

  // Fallback: polite response adhering to SONORA database realities
  const stats = getSonoraCatalogStats();
  return {
    reply: `I understand your message! In SONORA, we have **${stats.artistCount.toLocaleString()} artists**, **${stats.albumCount.toLocaleString()} albums**, and **${stats.songCount.toLocaleString()} songs** available in our database.\n\nYou can ask me to play any track (e.g. *"Play [Song] by [Artist]"*), skip or pause music, check lyrics, or request recommendations!`,
    suggestedFollowUps: [
      'Play top trending songs',
      'What song is playing now?',
      'Play BINI'
    ]
  };
}
