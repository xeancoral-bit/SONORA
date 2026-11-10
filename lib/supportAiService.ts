import { SupportCategory, Song, Artist, Album, SyncedLyricLine } from './types';
import { db } from './db';

export interface AiMessage {
  senderType: 'user' | 'admin' | 'ai';
  message: string;
  createdAt?: string;
}

export interface AiResponseResult {
  reply: string;
  suggestHandoff: boolean;
  categoryDetected?: SupportCategory;
  confidence?: number;
  needsClarification?: boolean;
  clarificationQuestion?: string;
}

export interface AiContext {
  conversationHistory: AiMessage[];
  userName?: string;
  userId?: string;
}

const DEFAULT_NAME = 'there';

// ---------------------------------------------------------------------------
// SONORA domain knowledge (used both for intent detection and replies)
// ---------------------------------------------------------------------------

const SONORA_TOPIC_KEYWORDS = [
  'sonora', 'music', 'song', 'artist', 'album', 'lyric', 'lyrics', 'playlist',
  'player', 'audio', 'play', 'soundtrack', 'track', 'genre', 'like', 'favorite',
  'collection', 'account', 'login', 'profile', 'request', 'support', 'help',
  'playback', 'volume', 'buffer', 'pause', 'skip', 'queue', 'synth', 'streaming'
];

const HUMAN_REQUEST_KEYWORDS = [
  'human', 'admin', 'administrator', 'real person', 'agent', 'representative',
  'talk to someone', 'urgent', 'escalate', 'emergency', 'refund', 'banned',
  'delete account', 'contact admin', 'speak to'
];

const DOMAIN_KEYWORDS: Record<SupportCategory, string[]> = {
  music_request: ['request', 'add song', 'new song', 'upload music', 'missing song',
    'catalog', 'track to', 'song to', 'add a track', 'music request'],
  issue_report: ['issue', 'problem', 'bug', 'error', 'not working', 'broken', 'fix',
    'glitch', 'report', 'crash', 'fail', 'failure', 'stuck', 'buffering'],
  account_support: ['account', 'password', 'profile', 'login', 'email', 'signup',
    'register', 'locked', 'banned', 'credentials', 'sign in', 'sign out'],
  feedback: ['feedback', 'suggest', 'feature', 'idea', 'improve', 'compliment',
    'suggestion', 'request feature'],
  general: ['how do i', 'how to', 'what is', 'help', 'guide', 'tutorial',
    'explain', 'walkthrough', 'steps', 'sonora', 'platform']
};

// ---------------------------------------------------------------------------
// Troubleshooting step-by-step guides
// ---------------------------------------------------------------------------

const TROUBLESHOOTING: Record<string, string[]> = {
  player: [
    '1. Refresh the page to reset the audio pipeline.',
    '2. Pause and resume the current track, or click a different song to reinitialize playback.',
    '3. Check that your browser tab is not muted (look for the mute icon on the tab).',
    '4. Verify your system/device volume is up and not routed to Bluetooth headphones.',
    '5. Ensure browser autoplay permissions allow audio (interact with the page first).',
    '6. If a streaming source is restricted in your region, SONORA auto-engages its Web Audio synthesis engine as a fallback.',
    '7. Try a different browser or an incognito window to rule out extensions.'
  ],
  lyrics: [
    '1. Confirm the track actually has synced lyrics (look for the highlighted lyric line in the player).',
    '2. Use the language pill at the top of the lyrics panel to switch translations (20+ languages available).',
    '3. Use the (A- / A+) buttons to adjust lyric font size for readability.',
    '4. If lyrics are out of sync or missing for a specific song, tell me the song title so the administrator can inspect its LRCLIB data.',
    '5. Refresh the track to re-fetch lyrics metadata.'
  ],
  account: [
    '1. Click your avatar in the top-right header to open your profile and edit name, bio, or favorite genres.',
    '2. Use the Settings page to update your password and login credentials.',
    '3. Make sure you are signing in with the correct email/username tied to your SONORA account.',
    '4. If you are locked out or need an email change, this requires administrator intervention — click "Contact Administrator".'
  ],
  search: [
    '1. Use the search bar at the top of the page and type the song title, artist, or album name.',
    '2. Filter results by genre if you have too many matches.',
    '3. If a song you expect is not appearing, it may be marked unavailable or still pending review — request it via "Request Music".'
  ],
  playlist: [
    '1. Click the "+" button next to Playlists in the sidebar to create a new playlist.',
    '2. On any song row or in the full-screen player, use the options menu (⋯) or heart icon to save to Liked Songs or a playlist.',
    '3. In playlist settings, toggle public/private to control whether other users can discover it on Browse.'
  ]
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

function getFirstName(userName?: string): string {
  if (!userName) return DEFAULT_NAME;
  return userName.split(' ')[0] || DEFAULT_NAME;
}

function isLikelySonoraRelated(text: string): boolean {
  return containsAny(text, SONORA_TOPIC_KEYWORDS);
}

function wantsHuman(text: string): boolean {
  return containsAny(text, HUMAN_REQUEST_KEYWORDS);
}

// Score each SONORA domain by keyword overlap; return best match + confidence.
function classifyDomain(text: string, category?: SupportCategory): {
  domain: SupportCategory;
  confidence: number;
} {
  // Start from the explicitly selected category if provided.
  const scores: Record<SupportCategory, number> = {
    music_request: 0,
    issue_report: 0,
    account_support: 0,
    feedback: 0,
    general: 0
  };

  if (category && scores[category] !== undefined) {
    scores[category] += 2; // explicit user category carries weight
  }

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    let hits = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) hits += 1;
    }
    scores[domain as SupportCategory] += hits;
  }

  let best: SupportCategory = 'general';
  let bestScore = 0;
  for (const [domain, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = domain as SupportCategory;
    }
  }

  const totalPossible = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalPossible > 0 ? Math.min(bestScore / Math.max(totalPossible * 0.6, 1), 1) : 0;

  return { domain: best, confidence };
}

// ---------------------------------------------------------------------------
// Database lookups for real SONORA data
// ---------------------------------------------------------------------------

function findSongByTitleOrArtist(query: string): Song[] | null {
  try {
    const songs = db.getSongs();
    if (!songs || songs.length === 0) return null;
    const q = normalize(query);
    return songs.filter((s) =>
      normalize(s.title).includes(q) ||
      normalize(s.artistName).includes(q) ||
      normalize(s.albumTitle || '').includes(q)
    ).slice(0, 5);
  } catch {
    return null;
  }
}

function findArtistByName(query: string): Artist | null {
  try {
    const artists = db.getArtists();
    if (!artists) return null;
    const q = normalize(query);
    return artists.find((a) => normalize(a.name).includes(q) || normalize(a.name) === q) || null;
  } catch {
    return null;
  }
}

function findAlbumByTitle(query: string): Album | null {
  try {
    const albums = db.getAlbums();
    if (!albums) return null;
    const q = normalize(query);
    return albums.find((a) => normalize(a.title).includes(q) || normalize(a.title) === q) || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Response builders
// ---------------------------------------------------------------------------

function unrelatedReply(name: string): AiResponseResult {
  return {
    reply: `Hi ${name}! I'm the SONORA Support Assistant, and I specialize in helping with the SONORA music platform.\n\nYour question doesn't appear to be related to SONORA, so I'm not able to give you a reliable answer on that topic. I can help you with:\n\n• 🎵 Music requests & catalog additions\n• ⚠️ Audio player & playback troubleshooting\n• 🎙️ Live lyrics synchronization & translations\n• 📋 Playlists, favorites, and collections\n• 👤 Account & profile assistance\n\nCould you rephrase your question around one of these SONORA topics, or let me know which feature you'd like help with?`,
    suggestHandoff: false,
    categoryDetected: 'general',
    confidence: 1,
    needsClarification: true,
    clarificationQuestion: 'Which SONORA feature or issue would you like help with?'
  };
}

function handoffReply(name: string): AiResponseResult {
  return {
    reply: `Hi ${name}, I understand you'd like to speak directly with the SONORA Administrator.\n\nThe administrator is currently offline. I've logged your message in your private support thread. You can click "Contact Administrator" below to mark this as an urgent human support request, and the administrator will be notified as soon as they return.\n\nIn the meantime, if you can describe your issue in detail (what you were doing, what happened, and which song or feature is affected), I'll include that context so the admin can help you faster.`,
    suggestHandoff: true,
    categoryDetected: 'general',
    confidence: 1
  };
}

function clarificationReply(name: string, question: string, category: SupportCategory): AiResponseResult {
  return {
    reply: `Hi ${name}! I want to make sure I give you the right answer, but I need a little more information about your question.\n\n${question}\n\nOnce you clarify, I'll be able to give you specific steps for SONORA.`,
    suggestHandoff: false,
    categoryDetected: category,
    confidence: 0.3,
    needsClarification: true,
    clarificationQuestion: question
  };
}

function notSureReply(name: string, topic: string): AiResponseResult {
  return {
    reply: `Hi ${name}! I'm not fully confident about the specifics of "${topic}" in SONORA, and I don't want to guess or give you incorrect steps.\n\nHere is what I can do instead:\n• If this is about a specific song, artist, or album, share the exact title and I'll look it up in the SONORA catalog.\n• If this is a technical problem, describe what you see and I'll walk you through troubleshooting.\n• Otherwise, click "Contact Administrator" and a human will look into it for you.\n\nWhat would you like to do?`,
    suggestHandoff: false,
    categoryDetected: 'general',
    confidence: 0.2,
    needsClarification: true,
    clarificationQuestion: `Could you tell me more about the ${topic} issue you're experiencing?`
  };
}

// ---------------------------------------------------------------------------
// Domain-specific responses using real DB data
// ---------------------------------------------------------------------------

function musicRequestReply(name: string, text: string): AiResponseResult {
  const songMatches = findSongByTitleOrArtist(text);
  let extra = '';
  if (songMatches && songMatches.length > 0) {
    extra = `\n\nI found these tracks already in the SONORA catalog that may match what you're looking for:\n` +
      songMatches.map((s) => `• ${s.title} — ${s.artistName} (${s.albumTitle || 'single'})`).join('\n') +
      '\n\nIf one of these is what you wanted, you can play it directly. Otherwise, submit a music request and the administrator will add it.';
  } else {
    extra = `\n\nI didn't find an exact match in the current catalog, so submitting a music request is the best way to get it added.`;
  }
  return {
    reply: `Hi ${name}! I can help you request music for the SONORA catalog.\n\nTo make sure the administrator can add the exact track quickly, please include:\n• Song Title\n• Artist Name\n• Album (optional)\n• Audio or video reference link (optional, e.g. YouTube)\n\nOnce the administrator reviews and approves your request, the song will be available in the catalog and you'll be notified.${extra}`,
    suggestHandoff: false,
    categoryDetected: 'music_request',
    confidence: 0.85
  };
}

function issueReportReply(name: string, text: string): AiResponseResult {
  const lower = normalize(text);
  let guideKey = 'player';
  if (containsAny(lower, ['lyric', 'synchroniz', 'timing', 'highlight', 'words', 'translation'])) guideKey = 'lyrics';
  else if (containsAny(lower, ['account', 'password', 'profile', 'login', 'email', 'locked'])) guideKey = 'account';
  else if (containsAny(lower, ['search', 'find', 'discover'])) guideKey = 'search';
  else if (containsAny(lower, ['playlist', 'collection', 'like', 'favorite'])) guideKey = 'playlist';

  const steps = TROUBLESHOOTING[guideKey] || TROUBLESHOOTING['player'];
  return {
    reply: `Hi ${name}! I'm sorry you're running into an issue with SONORA. Here are step-by-step troubleshooting steps that usually resolve this:\n\n${steps.join('\n')}\n\nIf none of these steps help, please reply with:\n• The exact song or feature affected\n• What you see or hear (error message, silence, freeze, etc.)\n• Your device and browser\n\nThen I can escalate this to the SONORA Administrator with full context.`,
    suggestHandoff: containsAny(lower, ['banned', 'locked', 'delete account', 'refund']) || false,
    categoryDetected: 'issue_report',
    confidence: 0.8
  };
}

function accountSupportReply(name: string): AiResponseResult {
  const steps = TROUBLESHOOTING['account'];
  return {
    reply: `Hi ${name}! Here is how to manage your SONORA account:\n\n${steps.join('\n')}\n\nIf you are completely locked out or need an email address changed, click "Contact Administrator" so a human can verify your identity and assist directly.`,
    suggestHandoff: false,
    categoryDetected: 'account_support',
    confidence: 0.85
  };
}

function feedbackReply(name: string): AiResponseResult {
  return {
    reply: `Thank you so much for your feedback, ${name}!\n\nI've noted your suggestion in this support thread for the SONORA development and administration team. We continuously improve SONORA based on listener ideas and community feedback.\n\nThe administrator will review your feedback during the next platform update. If you'd like to elaborate on your idea, feel free to share more details.`,
    suggestHandoff: false,
    categoryDetected: 'feedback',
    confidence: 0.9
  };
}

function generalHelpReply(name: string, text: string): AiResponseResult {
  const lower = normalize(text);
  // Look for song/artist/album references to look up in DB
  const lookup = findSongByTitleOrArtist(text);
  let lookupNote = '';
  if (lookup && lookup.length > 0) {
    lookupNote = `\n\nI found these matching tracks in SONORA:\n` +
      lookup.map((s) => `• ${s.title} — ${s.artistName}`).join('\n') +
      '\nYou can play any of these directly from the catalog.';
  }

  return {
    reply: `Hello ${name}! I'm the automated SONORA Support Assistant. I can help you with common questions about the platform:\n\n• 🎵 Music Requests — ask to add songs, albums, or artists to the catalog\n• ⚠️ Playback Troubleshooting — fix audio, buffering, or player errors\n• 🎙️ Lyrics — sync, translations, and font-size customization\n• 📋 Playlists & Favorites — create, save, and share collections\n• 👤 Account — profile, password, and login help\n\nJust describe what you're trying to do or the problem you're seeing, and I'll walk you through it.${lookupNote}`,
    suggestHandoff: false,
    categoryDetected: 'general',
    confidence: 0.6,
    needsClarification: !isLikelySonoraRelated(lower) ? false : false,
    clarificationQuestion: 'Which SONORA feature would you like help with?'
  };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function generateSupportAiResponse(
  userMessage: string,
  category?: SupportCategory,
  userName?: string,
  conversationHistory: AiMessage[] = [],
  userId?: string
): AiResponseResult {
  const text = normalize(userMessage);
  const name = getFirstName(userName);

  // 0. Explicit request for a human / administrator takes priority.
  if (wantsHuman(text)) {
    return handoffReply(name);
  }

  // 1. Determine if the message is even about SONORA.
  const sonoraRelated = isLikelySonoraRelated(text);
  if (!sonoraRelated && text.length > 3) {
    // Very short greetings are fine; treat as general help.
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|sup)$/.test(text);
    if (!isGreeting) {
      return unrelatedReply(name);
    }
  }

  // 2. Classify the intent domain.
  const classification = classifyDomain(text, category);
  const { domain, confidence } = classification;

  // 3. If confidence is too low and it's clearly SONORA-related, ask for clarification.
  if (confidence < 0.35 && sonoraRelated) {
    return clarificationReply(
      name,
      'Are you asking about music requests, playback/technical issues, your account, playlists, or something else about SONORA?',
      domain
    );
  }

  // 4. Route to the appropriate domain handler with real data lookups.
  switch (domain) {
    case 'music_request':
      return musicRequestReply(name, text);
    case 'issue_report':
      return issueReportReply(name, text);
    case 'account_support':
      return accountSupportReply(name);
    case 'feedback':
      return feedbackReply(name);
    case 'general':
    default:
      return generalHelpReply(name, text);
  }
}

// ---------------------------------------------------------------------------
// Optional OpenAI integration (used only when OPENAI_API_KEY is configured)
// ---------------------------------------------------------------------------

export async function generateSupportAiResponseWithLLM(
  userMessage: string,
  category?: SupportCategory,
  userName?: string,
  conversationHistory: AiMessage[] = [],
  userId?: string
): Promise<AiResponseResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fall back to the rule-based engine when no LLM key is configured.
    return generateSupportAiResponse(userMessage, category, userName, conversationHistory, userId);
  }

  try {
    const systemPrompt = `
You are the SONORA Support Assistant, an automated AI support agent for the SONORA music streaming platform.

RULES:
1. Clearly identify yourself as the automated "SONORA Support Assistant" — never claim to be the administrator.
2. Never falsely claim an action was completed (e.g., don't say a song was added unless the admin confirmed it).
3. Only answer questions related to the SONORA platform. If a user asks about an unrelated topic, politely explain you only support SONORA and list the topics you can help with.
4. Provide clear, professional, step-by-step troubleshooting for player, lyrics, account, playlist, and search issues.
5. If you don't have enough information to answer reliably, say so honestly and ask a clarifying question — do not invent information.
6. If a user requests a human administrator or reports something urgent (banned account, refund, delete account), set suggestHandoff to true.
7. Use the conversation history below for context so you don't ask the user to repeat themselves.
8. Keep responses concise but helpful, formatted with bullet points or numbered steps where appropriate.

SONORA TOPICS YOU CAN HELP WITH:
- Music requests & catalog additions
- Audio player & playback troubleshooting
- Live lyrics synchronization, translations, and font-size customization
- Playlists, favorites, and collections
- Account & profile assistance (password, login, profile edits)

CONVERSATION HISTORY:
${conversationHistory.map((m) => `${m.senderType === 'user' ? 'User' : m.senderType === 'ai' ? 'Assistant' : 'Admin'}: ${m.message}`).join('\n') || '(none)'}

USER CATEGORY: ${category || 'general'}
USER NAME: ${userName || 'there'}

USER MESSAGE: "${userMessage}"

Respond with a JSON object containing: reply (string), suggestHandoff (boolean), categoryDetected (one of: music_request, issue_report, account_support, feedback, general), confidence (0-1), needsClarification (boolean), clarificationQuestion (string or null).
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Try to parse JSON from the LLM response.
    let parsed: any = null;
    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        parsed = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
      }
    } catch {
      parsed = null;
    }

    if (parsed && typeof parsed.reply === 'string') {
      return {
        reply: parsed.reply,
        suggestHandoff: Boolean(parsed.suggestHandoff),
        categoryDetected: parsed.categoryDetected || category || 'general',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
        needsClarification: Boolean(parsed.needsClarification),
        clarificationQuestion: parsed.clarificationQuestion || undefined
      };
    }

    // Fallback if LLM didn't return valid JSON.
    return {
      reply: content || `Hi ${name}, I received your message but I'm having trouble generating a helpful response right now. Could you rephrase your question about SONORA?`,
      suggestHandoff: false,
      categoryDetected: category || 'general',
      confidence: 0.5
    };
  } catch (err) {
    // On any LLM failure, fall back to the rule-based engine.
    return generateSupportAiResponse(userMessage, category, userName, conversationHistory, userId);
  }
}
