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
