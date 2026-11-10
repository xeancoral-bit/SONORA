// Sonora Listening Streaks & Vinyl Collector Gamification Service
// Tracks daily listening habits, unlocked vinyl badges, and motivates daily usage.

export interface VinylBadge {
  id: string;
  title: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  icon: string;
  unlockedAt?: string;
}

export interface UserListeningStats {
  currentStreak: number;
  longestStreak: number;
  lastListenedDate: string; // YYYY-MM-DD
  todaySongsCount: number;
  totalSongsCount: number;
  unlockedBadgeIds: string[];
}

export const ALL_BADGES: VinylBadge[] = [
  {
    id: 'first_drop',
    title: 'First Needle Drop',
    description: 'Began your musical journey on Sonora by playing your first track.',
    tier: 'bronze',
    icon: '🎵',
  },
  {
    id: 'streak_3',
    title: '3-Day Groove',
    description: 'Kept the momentum going for 3 consecutive days.',
    tier: 'bronze',
    icon: '🔥',
  },
  {
    id: 'streak_7',
    title: '7-Day Maestro',
    description: 'A full week of non-stop musical inspiration.',
    tier: 'silver',
    icon: '⚡',
  },
  {
    id: 'streak_30',
    title: '30-Day Sonora Legend',
    description: 'Master audiophile! Reached a legendary 30-day daily listening streak.',
    tier: 'diamond',
    icon: '👑',
  },
  {
    id: 'night_owl',
    title: 'Midnight Reverie',
    description: 'Enjoyed late-night vibes between 11:00 PM and 4:00 AM.',
    tier: 'silver',
    icon: '🌙',
  },
  {
    id: 'audiophile_25',
    title: 'Vinyl Collector',
    description: 'Listened to more than 25 tracks across Sonora.',
    tier: 'bronze',
    icon: '💿',
  },
  {
    id: 'audiophile_100',
    title: 'Sonic Connoisseur',
    description: 'Streamed over 100 tracks in your musical universe.',
    tier: 'gold',
    icon: '🏆',
  },
  {
    id: 'soundscape_zen',
    title: 'Zen Soundscaper',
    description: 'Explored ambient soundscapes (rain, cafe, or campfire) while listening.',
    tier: 'silver',
    icon: '🌧️',
  },
];

const STORAGE_KEY = 'sonora_user_listening_stats';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getListeningStats(): UserListeningStats {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastListenedDate: getTodayString(),
      todaySongsCount: 0,
      totalSongsCount: 0,
      unlockedBadgeIds: ['first_drop'],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stats = JSON.parse(raw) as UserListeningStats;
      const today = getTodayString();
      const yesterday = getYesterdayString();

      // Check if day changed
      if (stats.lastListenedDate !== today) {
        if (stats.lastListenedDate !== yesterday) {
          // Missed at least one full day -> streak resets
          stats.currentStreak = 0;
        }
        stats.todaySongsCount = 0;
      }
      return stats;
    }
  } catch {}

  const initial: UserListeningStats = {
    currentStreak: 1,
    longestStreak: 1,
    lastListenedDate: getTodayString(),
    todaySongsCount: 1,
    totalSongsCount: 1,
    unlockedBadgeIds: ['first_drop'],
  };
  saveListeningStats(initial);
  return initial;
}

export function saveListeningStats(stats: UserListeningStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    window.dispatchEvent(new CustomEvent('sonora_streak_updated', { detail: stats }));
  } catch {}
}

export interface RecordPlayResult {
  stats: UserListeningStats;
  newBadges: VinylBadge[];
}

export function recordTrackPlay(): RecordPlayResult {
  const stats = getListeningStats();
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const newlyUnlocked: VinylBadge[] = [];

  const unlockBadge = (id: string) => {
    if (!stats.unlockedBadgeIds.includes(id)) {
      stats.unlockedBadgeIds.push(id);
      const b = ALL_BADGES.find((item) => item.id === id);
      if (b) newlyUnlocked.push(b);
    }
  };

  if (stats.lastListenedDate === today) {
    // Already listened today
    stats.todaySongsCount += 1;
  } else if (stats.lastListenedDate === yesterday) {
    // Continued streak from yesterday!
    stats.currentStreak += 1;
    stats.lastListenedDate = today;
    stats.todaySongsCount = 1;
  } else {
    // Starting a fresh streak
    stats.currentStreak = 1;
    stats.lastListenedDate = today;
    stats.todaySongsCount = 1;
  }

  stats.totalSongsCount += 1;

  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }

  // Check Badge Conditions
  if (stats.totalSongsCount >= 1) unlockBadge('first_drop');
  if (stats.currentStreak >= 3) unlockBadge('streak_3');
  if (stats.currentStreak >= 7) unlockBadge('streak_7');
  if (stats.currentStreak >= 30) unlockBadge('streak_30');
  if (stats.totalSongsCount >= 25) unlockBadge('audiophile_25');
  if (stats.totalSongsCount >= 100) unlockBadge('audiophile_100');

  // Check Night Owl condition (hour >= 23 or hour < 4)
  const currentHour = new Date().getHours();
  if (currentHour >= 23 || currentHour < 4) {
    unlockBadge('night_owl');
  }

  saveListeningStats(stats);
  return { stats, newBadges: newlyUnlocked };
}

export function recordSoundscapeUsed(): VinylBadge | null {
  const stats = getListeningStats();
  if (!stats.unlockedBadgeIds.includes('soundscape_zen')) {
    stats.unlockedBadgeIds.push('soundscape_zen');
    saveListeningStats(stats);
    return ALL_BADGES.find((b) => b.id === 'soundscape_zen') || null;
  }
  return null;
}
