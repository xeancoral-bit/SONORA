import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { SupportMessage, ConversationStatus } from '@/lib/types';
import { generateSupportAiResponse } from '@/lib/supportAiService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conversation = db.getConversationById(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // STRICT USER PRIVACY GUARD: Users can ONLY access their own conversation
    if (user.role !== 'admin' && conversation.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: Access denied to this conversation' }, { status: 403 });
    }

    // Mark messages as read by the current viewer
    db.markConversationReadBy(conversation.id, user.role === 'admin' ? 'admin' : 'user');

    const messages = db.getMessagesForConversation(conversation.id);
    const updatedConv = db.getConversationById(conversation.id);

    return NextResponse.json({
      conversation: updatedConv,
      messages,
      adminStatus: db.getAdminOnlineStatus()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conversation = db.getConversationById(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Access control
    if (user.role !== 'admin' && conversation.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { message, attachmentUrl } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const isUserSender = user.role !== 'admin';

    // Create the message
    const newMsg: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      conversationId: conversation.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: isUserSender ? 'user' : 'admin',
      senderType: isUserSender ? 'user' : 'admin',
      message: message.trim(),
      category: conversation.category,
      attachmentUrl: attachmentUrl || undefined,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    db.addSupportMessage(newMsg);

    let aiMessage: SupportMessage | null = null;
    const adminStatus = db.getAdminOnlineStatus();

    if (!isUserSender) {
      // Admin replied directly
      db.updateConversationStatus(conversation.id, 'replied');

      // Create notification for the user
      db.addNotification({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId: conversation.userId,
        title: 'New Message from SONORA Support',
        message: 'The SONORA Administrator has replied to your support conversation.',
        type: 'system',
        link: '/messages',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    } else {
      // User sent follow-up
      if (!adminStatus.isOnline) {
        // AI answers while admin is offline
        const aiResponse = generateSupportAiResponse(message, conversation.category, user.name);

        aiMessage = {
          id: `msg-ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          conversationId: conversation.id,
          senderId: 'ai-assistant',
          senderName: 'SONORA Support Assistant',
          senderRole: 'admin',
          senderType: 'ai',
          message: aiResponse.reply,
          category: aiResponse.categoryDetected || conversation.category,
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

      // Notify admin
      db.addNotification({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId: 'admin',
        title: 'New Support Message',
        message: `${user.name} sent a message in their support thread.`,
        type: 'admin_alert',
        link: '/admin/messages',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    const messages = db.getMessagesForConversation(conversation.id);
    const updatedConv = db.getConversationById(conversation.id);

    return NextResponse.json({
      success: true,
      conversation: updatedConv,
      messages,
      sentMessage: newMsg,
      aiMessage
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to post message' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const conversation = db.getConversationById(id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Access control: User can only trigger handoff ('waiting_admin') or admin can set any status
    if (user.role !== 'admin' && conversation.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status, note } = body;

    const validStatuses: ConversationStatus[] = [
      'new',
      'unread',
      'ai_assisted',
      'waiting_admin',
      'replied',
      'resolved'
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid conversation status' }, { status: 400 });
    }

    // If regular user requested "Contact Administrator"
    if (status === 'waiting_admin') {
      db.updateConversationStatus(conversation.id, 'waiting_admin');

      // Create a system confirmation message in the thread
      const handoffMsg: SupportMessage = {
        id: `msg-system-${Date.now()}`,
        conversationId: conversation.id,
        senderId: 'system',
        senderName: 'System Notice',
        senderRole: 'admin',
        senderType: 'ai',
        message: '🔔 Conversation escalated to the SONORA Administrator. The admin will review this conversation and reply as soon as they are online.',
        category: conversation.category,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      db.addSupportMessage(handoffMsg);

      // High-priority alert to admin
      db.addNotification({
        id: `notif-${Date.now()}`,
        userId: 'admin',
        title: 'Urgent: Support Request Escalated',
        message: `${conversation.userName} requested direct Administrator assistance.`,
        type: 'admin_alert',
        link: '/admin/messages',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    } else if (user.role === 'admin') {
      db.updateConversationStatus(conversation.id, status);

      if (status === 'resolved') {
        const resolvedMsg: SupportMessage = {
          id: `msg-system-${Date.now()}`,
          conversationId: conversation.id,
          senderId: 'system',
          senderName: 'System Notice',
          senderRole: 'admin',
          senderType: 'admin',
          message: `✅ This support conversation has been marked as Resolved by the administrator.${note ? ` Note: ${note}` : ''}`,
          category: conversation.category,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        db.addSupportMessage(resolvedMsg);

        db.addNotification({
          id: `notif-${Date.now()}`,
          userId: conversation.userId,
          title: 'Support Issue Resolved',
          message: 'Your support ticket has been marked as resolved by the SONORA Administrator.',
          type: 'system',
          link: '/messages',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    const updatedConv = db.getConversationById(conversation.id);
    const messages = db.getMessagesForConversation(conversation.id);

    return NextResponse.json({
      success: true,
      conversation: updatedConv,
      messages
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update conversation' }, { status: 500 });
  }
}
