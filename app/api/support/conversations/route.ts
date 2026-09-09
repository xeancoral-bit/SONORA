import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { SupportCategory, SupportMessage } from '@/lib/types';
import { generateSupportAiResponse } from '@/lib/supportAiService';

function formatCategoryName(cat?: SupportCategory): string {
  switch (cat) {
    case 'music_request': return 'Music Request 🎵';
    case 'issue_report': return 'Report an Issue ⚠️';
    case 'account_support': return 'Account Support 👤';
    case 'feedback': return 'Feedback & Suggestion 💡';
    default: return 'General Inquiry ❓';
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminStatus = db.getAdminOnlineStatus();

    // If administrator, return all user conversations for the support inbox
    if (user.role === 'admin') {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const status = searchParams.get('status');
      const search = searchParams.get('search')?.toLowerCase();

      let conversations = db.getAllConversations();

      if (category && category !== 'all') {
        conversations = conversations.filter((c) => c.category === category);
      }
      if (status && status !== 'all') {
        conversations = conversations.filter((c) => c.status === status);
      }
      if (search) {
        conversations = conversations.filter(
          (c) =>
            c.userName.toLowerCase().includes(search) ||
            c.userEmail.toLowerCase().includes(search) ||
            (c.latestMessage && c.latestMessage.toLowerCase().includes(search))
        );
      }

      const counts = {
        total: conversations.length,
        new: conversations.filter((c) => c.status === 'new').length,
        waiting_admin: conversations.filter((c) => c.status === 'waiting_admin').length,
        ai_assisted: conversations.filter((c) => c.status === 'ai_assisted').length,
        unread: conversations.filter((c) => c.status === 'unread').length,
        resolved: conversations.filter((c) => c.status === 'resolved').length
      };

      return NextResponse.json({
        conversations,
        counts,
        adminStatus
      });
    }

    // STRICT USER PRIVACY: Regular users ONLY ever get their own single conversation
    const userConversation = db.getOrCreateConversationForUser(user);
    const messages = db.getMessagesForConversation(userConversation.id);

    return NextResponse.json({
      conversation: userConversation,
      messages,
      adminStatus
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch support conversations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to send a support message' }, { status: 401 });
    }

    const body = await request.json();
    const { message, category, attachmentUrl } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message text cannot be empty' }, { status: 400 });
    }

    const validCategory: SupportCategory = ['music_request', 'issue_report', 'account_support', 'feedback', 'general'].includes(category)
      ? category
      : 'general';

    // Get or initialize private conversation for user
    const conversation = db.getOrCreateConversationForUser(user, validCategory);

    // Create user message
    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      conversationId: conversation.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'user',
      senderType: 'user',
      message: message.trim(),
      category: validCategory,
      attachmentUrl: attachmentUrl || undefined,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    db.addSupportMessage(userMsg);

    // Notify administrator
    db.addNotification({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: 'admin',
      title: 'New Support Message',
      message: `${user.name} sent a message regarding ${formatCategoryName(validCategory)}`,
      type: 'admin_alert',
      link: '/admin/messages',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    const adminStatus = db.getAdminOnlineStatus();
    let aiMessage: SupportMessage | null = null;

    // If administrator is offline, generate automated AI Support Assistant reply
    if (!adminStatus.isOnline) {
      const aiResponse = generateSupportAiResponse(message, validCategory, user.name);

      aiMessage = {
        id: `msg-ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        conversationId: conversation.id,
        senderId: 'ai-assistant',
        senderName: 'SONORA Support Assistant',
        senderRole: 'admin',
        senderType: 'ai',
        message: aiResponse.reply,
        category: aiResponse.categoryDetected || validCategory,
        isRead: false,
        createdAt: new Date(Date.now() + 400).toISOString()
      };

      db.addSupportMessage(aiMessage);
      db.updateConversationStatus(
        conversation.id,
        aiResponse.suggestHandoff ? 'waiting_admin' : 'ai_assisted'
      );
    } else {
      db.updateConversationStatus(conversation.id, 'unread');
    }

    const updatedConv = db.getConversationById(conversation.id);

    return NextResponse.json({
      success: true,
      conversation: updatedConv,
      userMessage: userMsg,
      aiMessage,
      adminStatus
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
}
