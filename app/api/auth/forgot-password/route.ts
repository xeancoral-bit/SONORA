import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateOtp, getResendCooldown, maskEmail } from '@/lib/otpService';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if account exists in database
    const user = db.getUserByEmail(trimmedEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    // Check resend cooldown
    const cooldown = getResendCooldown(trimmedEmail);
    if (cooldown > 0) {
      return NextResponse.json(
        {
          error: `Please wait ${cooldown} seconds before requesting a new code.`,
          cooldownRemaining: cooldown
        },
        { status: 429 }
      );
    }

    // Generate secure 6-digit OTP (5-minute expiration)
    const { otp, expiresInSeconds, cooldownSeconds } = generateOtp(trimmedEmail);
    const masked = maskEmail(trimmedEmail);

    // Deliver OTP via Resend
    const sendResult = await sendOtpEmail(trimmedEmail, otp, masked);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${masked}`,
      maskedEmail: masked,
      expiresIn: expiresInSeconds,
      cooldown: cooldownSeconds,
      // Provide devOtp if Resend is operating in sandbox or local dev
      devOtp: sendResult.devOtp,
      warning: sendResult.warning
    });
  } catch (error: any) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
