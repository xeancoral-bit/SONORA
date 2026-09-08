import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit verification code.' },
        { status: 400 }
      );
    }

    const result = verifyOtp(trimmedEmail, cleanOtp);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Verification failed.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully.',
      resetToken: result.resetToken
    });
  } catch (error: any) {
    console.error('Verify OTP API error:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred during verification.' },
      { status: 500 }
    );
  }
}
