import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { SupportRequest, SupportMessage, SupportCategory } from '@/lib/types';
import { generateSupportAiResponse } from '@/lib/supportAiService';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const requests = db.getSupportRequests();
    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please sign in' }, { status: 401 });
    }

    const body = await request.json();
    const { requestType, title, artist, album, issueType, description, screenshotUrl, message } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const category: SupportCategory = requestType === 'music_request' ? 'music_request' : 'issue_report';
    const conversation = db.getOrCreateConversationForUser(user, category);

    let formattedContent = '';
    const supportReq: SupportRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: user.id,
      userName: user.name,
      conversationId: conversation.id,
      requestType: requestType === 'music_request' ? 'music_request' : 'issue_report',
      title: title.trim(),
      description: (description || message || '').trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (requestType === 'music_request') {
      supportReq.metadata = {
        artist: artist ? artist.trim() : undefined,
        album: album ? album.trim() : undefined
      };

      formattedContent = `🎵 [MUSIC REQUEST SUBMISSION]\n• Song Title: ${title.trim()}\n• Artist: ${artist?.trim() || 'Not specified'}\n• Album: ${album?.trim() || 'N/A'}${message ? `\n• Additional Message: ${message.trim()}` : ''}`;
    } else {
      supportReq.metadata = {
        issueType: issueType || 'player',
        screenshotUrl: screenshotUrl || undefined
      };

      formattedContent = `⚠️ [ISSUE REPORT SUBMISSION]\n• Area: ${issueType ? issueType.toUpperCase() : 'GENERAL'}\n• Title: ${title.trim()}\n• Description: ${description ? description.trim() : (message || '').trim()}${screenshotUrl ? `\n• Screenshot: ${screenshotUrl.trim()}` : ''}`;
    }

    db.createSupportRequest(supportReq);

    // Append formatted user message to thread
    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      conversationId: conversation.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'user',
      senderType: 'user',
      message: formattedContent,
      category,
      attachmentUrl: screenshotUrl || undefined,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.addSupportMessage(userMsg);

    // Notify Administrator
    db.addNotification({
      id: `notif-${Date.now()}`,
      userId: 'admin',
      title: requestType === 'music_request' ? 'New Music Request Submitted' : 'New Issue Report Submitted',
      message: `${user.name} submitted a ${requestType === 'music_request' ? 'music request for "' + title + '"' : 'problem report: "' + title + '"'}`,
      type: 'admin_alert',
      link: '/admin/messages',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    const adminStatus = db.getAdminOnlineStatus();
    let aiMessage: SupportMessage | null = null;

    if (!adminStatus.isOnline) {
      const aiResponse = generateSupportAiResponse(formattedContent, category, user.name);

      aiMessage = {
        id: `msg-ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        conversationId: conversation.id,
        senderId: 'ai-assistant',
        senderName: 'SONORA Support Assistant',
        senderRole: 'admin',
        senderType: 'ai',
        message: aiResponse.reply,
        category,
        isRead: false,
        createdAt: new Date(Date.now() + 400).toISOString()
      };

      db.addSupportMessage(aiMessage);
      db.updateConversationStatus(conversation.id, 'ai_assisted');
    } else {
      db.updateConversationStatus(conversation.id, 'unread');
    }

    const messages = db.getMessagesForConversation(conversation.id);
    const updatedConv = db.getConversationById(conversation.id);

    return NextResponse.json({
      success: true,
      request: supportReq,
      conversation: updatedConv,
      messages,
      sentMessage: userMsg,
      aiMessage
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit request' }, { status: 500 });
  }
}
