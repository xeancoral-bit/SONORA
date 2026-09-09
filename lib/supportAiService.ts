import { SupportCategory } from './types';

export interface AiResponseResult {
  reply: string;
  suggestHandoff: boolean;
  categoryDetected?: SupportCategory;
}

/**
 * SONORA Support Assistant - Automated Offline AI Support Engine
 * 
 * Rules:
 * 1. Clearly states automated identity ("SONORA Support Assistant").
 * 2. Never claims to be the administrator.
 * 3. Never falsely claims an uncompleted action was executed.
 * 4. Provides actionable troubleshooting for player, lyrics, playlists, and search.
 * 5. Intelligently recommends human administrator handoff when necessary.
 */
export function generateSupportAiResponse(
  userMessage: string,
  category?: SupportCategory,
  userName?: string
): AiResponseResult {
  const normalized = userMessage.toLowerCase().trim();
  const name = userName ? userName.split(' ')[0] : 'there';

  // Check for explicit human / admin request
  const wantsHuman = [
    'human',
    'admin',
    'administrator',
    'real person',
    'agent',
    'representative',
    'talk to someone',
    'urgent',
    'escalate',
    'emergency',
    'refund',
    'banned',
    'delete account'
  ].some((keyword) => normalized.includes(keyword));

  if (wantsHuman) {
    return {
      reply: `Hi ${name}, I understand you would like to communicate directly with the SONORA Administrator.\n\nSince the administrator is currently offline, I have logged your message in your private support thread. You can click "Contact Administrator" below to mark this as an urgent human support request, and the administrator will be notified immediately upon returning.`,
      suggestHandoff: true
    };
  }

  // 1. Music Requests
  if (category === 'music_request' || normalized.includes('request') || normalized.includes('add song') || normalized.includes('new song') || normalized.includes('upload music')) {
    return {
      reply: `Hi ${name}! I'm the SONORA Support Assistant.\n\nYour music request has been recorded in this private conversation for the administrator to review.\n\nTo ensure our admin can add the exact track to the SONORA catalog quickly, please make sure you've included:\n• Song Title\n• Artist Name\n• Album (optional)\n• Audio/Video reference link (optional)\n\nOnce the administrator reviews and processes your request, you will receive a notification and the song will be available in the catalog!`,
      suggestHandoff: false,
      categoryDetected: 'music_request'
    };
  }

  // 2. Lyrics & Synchronization Issues
  if (normalized.includes('lyric') || normalized.includes('synchroniz') || normalized.includes('timing') || normalized.includes('highlight') || normalized.includes('words')) {
    return {
      reply: `Hi ${name}! Regarding Live Lyrics:\n\nSONORA features an accurate real-time Live Lyrics synchronization engine directly connected to the music playback:\n• Highlighted Lyric: Corresponds exactly to what is currently being sung.\n• Intro Detection: While the musical intro plays, the system waits for vocals to begin before activating the first line.\n• Translations: You can switch between 20 languages (English, Filipino, Spanish, Japanese, etc.) via the language pill at the top of the lyrics panel.\n• Text Size: Use the (A- / A+) buttons to customize your reading size.\n\nIf lyrics are missing or out of sync for a specific track, please reply with the song title so the administrator can inspect its LRCLIB data.`,
      suggestHandoff: false,
      categoryDetected: 'issue_report'
    };
  }

  // 3. Audio Player & Playback Issues
  if (
    normalized.includes('player') ||
    normalized.includes('stop') ||
    normalized.includes('pause') ||
    normalized.includes('stuck') ||
    normalized.includes('buffer') ||
    normalized.includes('volume') ||
    normalized.includes('play') ||
    normalized.includes('not working') ||
    normalized.includes('sound')
  ) {
    return {
      reply: `Hi ${name}! I'm here to help with audio playback troubleshooting:\n\n1. Refresh the Player: Try pausing and resuming the song, or clicking another track to reset the audio pipeline.\n2. Browser Autoplay Permissions: Modern browsers (Chrome, Edge, Safari) sometimes block media autoplay until you interact with the page.\n3. Output Device: Verify your device audio is not muted or routed to external Bluetooth headphones.\n4. Synthesizer Fallback: If a streaming media source is temporarily restricted in your region, SONORA automatically engages its high-fidelity Web Audio synthesis engine.\n\nIf the playback still fails on a particular track, let me know which song is affected or click "Contact Administrator" to forward your ticket.`,
      suggestHandoff: false,
      categoryDetected: 'issue_report'
    };
  }

  // 4. Playlists & Collections
  if (normalized.includes('playlist') || normalized.includes('collection') || normalized.includes('like') || normalized.includes('favorite')) {
    return {
      reply: `Hi ${name}! Here is a quick guide on playlists and collections in SONORA:\n\n• Create a Playlist: Click the "+" button next to Playlists in the left sidebar.\n• Add Songs: On any song row or in the full-screen player, click the options menu (⋯) or heart icon to save to Liked Songs or your customized Playlists.\n• Public vs Private: In playlist settings, you can toggle whether other SONORA users can discover your playlist on Browse.\n\nLet me know if you are encountering an error while saving a playlist!`,
      suggestHandoff: false,
      categoryDetected: 'general'
    };
  }

  // 5. Account & Profile Support
  if (category === 'account_support' || normalized.includes('account') || normalized.includes('password') || normalized.includes('profile') || normalized.includes('login') || normalized.includes('email')) {
    return {
      reply: `Hi ${name}! For account and profile management:\n\n• Edit Profile: Click your avatar in the top right header to access your profile, update your display name, bio, and favorite genres.\n• Password & Security: Use the Settings page to update your login credentials.\n• Role Permissions: Normal user accounts can stream, create playlists, and request music. Administrator features are reserved for authorized accounts.\n\nIf you are locked out or need an email address change, this requires human administrator intervention. Click "Contact Administrator" below so our admin can assist you directly.`,
      suggestHandoff: true,
      categoryDetected: 'account_support'
    };
  }

  // 6. Feedback & Suggestions
  if (category === 'feedback' || normalized.includes('feedback') || normalized.includes('suggest') || normalized.includes('feature') || normalized.includes('idea') || normalized.includes('improve')) {
    return {
      reply: `Thank you so much for your feedback, ${name}!\n\nYour suggestion has been logged directly in this thread for the SONORA development and administration team. We continuously refine SONORA based on listener ideas and community feedback.\n\nThe administrator will review your suggestions during the next platform update!`,
      suggestHandoff: false,
      categoryDetected: 'feedback'
    };
  }

  // Default helpful response
  return {
    reply: `Hello ${name}! I'm the automated SONORA Support Assistant.\n\nThe SONORA Administrator is currently offline, but your message has been saved in this private conversation. I can help answer common questions regarding:\n\n• 🎵 Music Requests & Catalog Additions\n• ⚠️ Audio Player & Playback Troubleshooting\n• 🎙️ Live Lyrics Synchronization & Translations\n• 📋 Playlists, Favorites, and Collections\n• 👤 Account & Profile Assistance\n\nIf your issue requires direct administrator intervention, feel free to click "Contact Administrator" and we will notify the admin when they come online.`,
    suggestHandoff: false,
    categoryDetected: category || 'general'
  };
}
