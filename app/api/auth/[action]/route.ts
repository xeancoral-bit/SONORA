import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  getCurrentUser,
  sanitizeUser,
  AUTH_COOKIE_NAME
} from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  const body = await request.json().catch(() => ({}));

  if (action === 'login') {
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = db.getUserByEmail(email) || db.getUserByUsername(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Your account has been deactivated by an admin' }, { status: 403 });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
      token
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  }

  if (action === 'register') {
    const { name, username, email, password, confirmPassword, avatar } = body;

    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (db.getUserByEmail(email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    if (db.getUserByUsername(username)) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      role: 'user' as const,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
      bio: 'New music lover on SONORA.',
      favoriteGenres: ['genre-pop', 'genre-electronic'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      preferences: {
        autoplay: true,
        audioQuality: 'high' as const,
        crossfade: 2,
        normalizeVolume: true,
        explicitFilter: false,
        theme: 'dark' as const
      }
    };

    db.saveUser(newUser);

    // Add welcome notification
    db.addNotification({
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to SONORA!',
      message: 'Explore millions of tracks, build your playlists, and follow your favorite artists.',
      type: 'system',
      link: '/browse',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Notify admin of new registration
    db.addNotification({
      id: `notif-admin-${Date.now()}`,
      userId: 'admin',
      title: 'New User Registered',
      message: `User ${newUser.name} (@${newUser.username}) just signed up.`,
      type: 'admin_alert',
      link: '/admin/users',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      username: newUser.username
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(newUser),
      token
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  }

  if (action === 'logout') {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  if (action === 'reset-password') {
    const { email, newPassword } = body;
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    if (newPassword) {
      user.passwordHash = hashPassword(newPassword);
      user.updatedAt = new Date().toISOString();
      db.saveUser(user);
      return NextResponse.json({ success: true, message: 'Password has been reset successfully' });
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions sent to your email.'
    });
  }

  if (action === 'switch-role') {
    const { targetRole } = body;
    const currentUser = await getCurrentUser();
    
    // Only admin accounts are permitted to switch demo roles
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.email !== 'admin@sonora.io')) {
      return NextResponse.json({ error: 'Unauthorized: Only admin accounts can switch demo roles' }, { status: 403 });
    }

    const targetUser = targetRole === 'admin' ? db.getUserByEmail('admin@sonora.io') : db.getUserByEmail('xean@sonora.io');
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      
    const token = generateToken({
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      username: targetUser.username
    });
    const response = NextResponse.json({ success: true, user: sanitizeUser(targetUser) });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  if (action === 'me') {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: sanitizeUser(user) });
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
