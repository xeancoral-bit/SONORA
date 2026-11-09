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
    const rawIdentifier = (body.email || body.username || body.identifier || '').toString().trim();
    const rawPassword = (body.password || '').toString();
    const rememberMe = Boolean(body.rememberMe);

    if (!rawIdentifier || !rawPassword) {
      return NextResponse.json({ error: 'Email or username and password are required' }, { status: 400 });
    }

    const user = db.getUserByIdentifier(rawIdentifier);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or username or password' }, { status: 401 });
    }

    const passwordMatches =
      verifyPassword(rawPassword, user.passwordHash) ||
      verifyPassword(rawPassword.trim(), user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or username or password' }, { status: 401 });
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
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7 // 30 days or 7 days
    });

    return response;
  }

  if (action === 'register') {
    const { name, username, email, password, confirmPassword, avatar } = body;

    const rawName = (name || '').toString().trim();
    const rawUsername = (username || '').toString().trim().toLowerCase().replace(/^@+/, '');
    const rawEmail = (email || '').toString().trim().toLowerCase();
    const rawPassword = (password || '').toString();
    const rawConfirm = (confirmPassword || '').toString();

    if (!rawName || !rawUsername || !rawEmail || !rawPassword) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    if (rawPassword !== rawConfirm) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    if (rawPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (db.getUserByEmail(rawEmail)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    if (db.getUserByUsername(rawUsername)) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: rawName,
      username: rawUsername,
      email: rawEmail,
      passwordHash: hashPassword(rawPassword),
      role: 'user' as const,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rawUsername)}`,
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

  if (action === 'sso-sync') {
    const { email, name, username, avatar, clerkId, provider } = body;
    let rawEmail = (email || '').toString().trim().toLowerCase();

    if (!rawEmail && (username || name)) {
      const cleanPrefix = (username || name || 'user')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '');
      const domain = provider === 'facebook' ? 'facebook.com' : 'gmail.com';
      rawEmail = `${cleanPrefix || 'user'}@${domain}`;
    }

    if (!rawEmail) {
      return NextResponse.json({ error: 'Email or account identifier is required' }, { status: 400 });
    }

    let user = db.getUserByEmail(rawEmail);
    if (!user) {
      let baseUsername = (username || rawEmail.split('@')[0] || 'user')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '');
      if (!baseUsername) baseUsername = 'user';
      let finalUsername = baseUsername;
      let counter = 1;
      while (db.getUserByUsername(finalUsername)) {
        finalUsername = `${baseUsername}${counter++}`;
      }

      user = {
        id: clerkId || `user-${Date.now()}`,
        name: (name || finalUsername).toString().trim(),
        username: finalUsername,
        email: rawEmail,
        passwordHash: hashPassword(Math.random().toString(36) + Date.now().toString(36)),
        role: 'user' as const,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalUsername)}`,
        bio: 'Music lover on SONORA.',
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
      db.saveUser(user);

      db.addNotification({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: 'Welcome to SONORA!',
        message: 'Explore millions of tracks, build your playlists, and follow your favorite artists.',
        type: 'system',
        link: '/browse',
        isRead: false,
        createdAt: new Date().toISOString()
      });
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
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  }

  if (action === 'logout') {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0)
    });
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
