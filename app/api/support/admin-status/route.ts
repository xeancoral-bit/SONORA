import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const status = db.getAdminOnlineStatus();
    return NextResponse.json({ status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch admin status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Administrator privileges required' }, { status: 403 });
    }

    const body = await request.json();
    const { isOnline, statusMessage } = body;

    const updated = db.setAdminOnlineStatus(Boolean(isOnline), statusMessage);

    // Log admin activity
    db.addLog({
      id: `log-${Date.now()}`,
      adminId: user.id,
      adminName: user.name,
      action: 'admin_status_change',
      details: `Administrator toggled availability to: ${isOnline ? 'Online 🟢' : 'Offline ⚫'}`,
      targetType: 'system',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, status: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update admin status' }, { status: 500 });
  }
}
