import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAriaResponse, getSonoraCatalogStats, searchSonoraCatalog } from '@/lib/ariaAiBrain';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { message, history, playerState } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const userName = user?.name || user?.username || 'Music Explorer';
    const cleanHistory = Array.isArray(history) ? history : [];

    const result = await getAriaResponse(message.trim(), cleanHistory, userName, playerState);

    // If OPENAI_API_KEY is configured, enhance Aria's conversational reply with GPT-4o-mini
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const catalogStats = getSonoraCatalogStats();
        const systemPrompt = `You are Aria, the official AI Music Assistant for SONORA Music Platform.
You are warm, intelligent, music-savvy, and fully multilingual.
You seamlessly understand and respond in whatever language the user speaks (English, Tagalog, Cebuano/Bisaya, Spanish, etc.) and naturally handle colloquialisms, slang, and mixed languages (e.g. Taglish, Bislish).

SONORA PLATFORM CONTEXT:
- Platform catalog: ${catalogStats.songCount.toLocaleString()} songs, ${catalogStats.albumCount.toLocaleString()} albums, ${catalogStats.artistCount.toLocaleString()} artists.
- Active player state: ${playerState?.currentTrack ? `Currently playing "${playerState.currentTrack.title}" by ${playerState.currentTrack.artistName}` : 'No track currently playing'}.
${result.action ? `An action has been detected: ${result.action.type}${result.action.track ? ` for "${result.action.track.title}"` : ''}.` : ''}

RULES:
1. If the user spoke in Bisaya/Cebuano, reply naturally in Bisaya. If in Tagalog, reply in Tagalog. If in English, reply in English.
2. Be concise, friendly, and helpful. Mention actual songs, albums, and artists available on SONORA.
3. If an action to play or control music is taken, acknowledge it warmly and enthusiastically.
4. Keep responses focused on music, playlists, lyrics, artists, and SONORA features.`;

        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...cleanHistory.slice(-6).map((h: any) => ({
                role: h.role === 'assistant' ? 'assistant' : 'user',
                content: h.content
              })),
              { role: 'user', content: message.trim() }
            ],
            temperature: 0.6,
            max_tokens: 450
          }),
          signal: AbortSignal.timeout(6000)
        });

        if (openAiRes.ok) {
          const aiData = await openAiRes.json();
          const aiReply = aiData.choices?.[0]?.message?.content?.trim();
          if (aiReply) {
            result.reply = aiReply;
          }
        }
      } catch {
        // Graceful fallback to Aria rule-based response
      }
    }

    return NextResponse.json({
      success: true,
      reply: result.reply,
      suggestedFollowUps: result.suggestedFollowUps,
      suggestAdminHandoff: result.suggestAdminHandoff,
      action: result.action,
      clarification: result.clarification,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in /api/support/ai-chat:', error);
    return NextResponse.json(
      {
        error: 'Aria encountered a momentary dissonance. Please try again.',
        reply: "I'm having a slight audio interference connecting to my neural network. Please ask your question again or explore our catalog!"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (q) {
      const results = searchSonoraCatalog(q);
      return NextResponse.json({ success: true, results });
    }

    const stats = getSonoraCatalogStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
