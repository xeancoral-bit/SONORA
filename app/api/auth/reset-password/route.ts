import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { validateResetToken, consumeResetToken } from '@/lib/otpService';
import { sendPasswordChangedEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, resetToken, newPassword, confirmPassword } = body;

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required reset parameters.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Verify reset token
    const isValidToken = validateResetToken(trimmedEmail, resetToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Your password reset session has expired or is invalid. Please request a new code.' },
        { status: 403 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Password rule validations
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter.' },
        { status: 400 }
      );
    }
    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter.' },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number.' },
        { status: 400 }
      );
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one special character.' },
        { status: 400 }
      );
    }

    // Fetch user
    const user = db.getUserByEmail(trimmedEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      );
    }

    // Check if new password is identical to previous password
    if (verifyPassword(newPassword, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Your new password must be different from your previous password.' },
        { status: 400 }
      );
    }

    // Hash and update password securely
    user.passwordHash = hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    db.saveUser(user);

    // Consume reset token so it cannot be reused
    consumeResetToken(resetToken);

    // Add security notification in database
    db.addNotification({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: 'Password Changed',
      message: 'Your SONORA password was updated successfully. If this wasn’t you, contact support.',
      type: 'system',
      link: '/profile',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Send confirmation email via Resend
    sendPasswordChangedEmail(user.email, user.name).catch((err) =>
      console.warn('Failed to send security alert email:', err)
    );

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully updated.'
    });
  } catch (error: any) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
