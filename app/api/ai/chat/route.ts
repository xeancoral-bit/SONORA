import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateSupportAiResponseWithLLM, AiMessage } from '@/lib/supportAiService';
import { SupportCategory } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please sign in to chat.' }, { status: 401 });
    }

    const body = await request.json();
    const { message, category, conversationHistory } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const validCategory: SupportCategory = [
      'music_request',
      'issue_report',
      'account_support',
      'feedback',
      'general'
    ].includes(category) ? category : 'general';

    const history: AiMessage[] = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-10)
      : [];

    const aiResponse = await generateSupportAiResponseWithLLM(
      message.trim(),
      validCategory,
      user.name,
      history,
      user.id
    );

    return NextResponse.json({
      success: true,
      reply: aiResponse.reply,
      categoryDetected: aiResponse.categoryDetected || validCategory,
      suggestHandoff: aiResponse.suggestHandoff,
      needsClarification: aiResponse.needsClarification,
      clarificationQuestion: aiResponse.clarificationQuestion,
      confidence: aiResponse.confidence
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'The AI assistant is unavailable right now. Please try again later.' },
      { status: 500 }
    );
  }
}
