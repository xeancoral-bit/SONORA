import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, sanitizeUser } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const targetUser = db.getUserById(id);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { role, isActive } = body;

    if (role !== undefined) targetUser.role = role;
    if (isActive !== undefined) targetUser.isActive = Boolean(isActive);
    targetUser.updatedAt = new Date().toISOString();

    db.saveUser(targetUser);

    db.addLog({
      id: `log-${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action: 'Updated User',
      details: `Changed status/role for user "${targetUser.name}" (@${targetUser.username}) to role=${targetUser.role}, active=${targetUser.isActive}`,
      targetType: 'user',
      targetId: targetUser.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, user: sanitizeUser(targetUser) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  if (currentUser.id === id) {
    return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 });
  }

  const targetUser = db.getUserById(id);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  db.deleteUser(id);

  db.addLog({
    id: `log-${Date.now()}`,
    adminId: currentUser.id,
    adminName: currentUser.name,
    action: 'Deleted User',
    details: `Deleted user account "${targetUser.name}" (@${targetUser.username})`,
    targetType: 'user',
    targetId: id,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ success: true, message: 'User deleted' });
}
