import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { NotificationItem } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ notifications: [] });
  }

  const notifications = db.getNotificationsForUser(user.id);
  return NextResponse.json({ notifications });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, message, type, link, userId } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: userId || 'all',
      title: title.trim(),
      message: message.trim(),
      type: type || 'system',
      link: link || undefined,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    db.addNotification(notif);

    return NextResponse.json({ success: true, notification: notif });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send notification' }, { status: 500 });
  }
}
