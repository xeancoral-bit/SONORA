import crypto from 'crypto';

interface OtpEntry {
  email: string;
  hashedOtp: string;
  createdAt: number;
  expiresAt: number; // 5 minutes
  attempts: number; // max 5
  cooldownUntil: number; // 60 seconds
}

interface ResetSession {
  email: string;
  token: string;
  createdAt: number;
  expiresAt: number; // 10 minutes
}

// Global in-memory storage preserved across hot-reloads in Next.js development
const globalStore = global as unknown as {
  __sonora_otps?: Map<string, OtpEntry>;
  __sonora_reset_sessions?: Map<string, ResetSession>;
};

if (!globalStore.__sonora_otps) {
  globalStore.__sonora_otps = new Map<string, OtpEntry>();
}

if (!globalStore.__sonora_reset_sessions) {
  globalStore.__sonora_reset_sessions = new Map<string, ResetSession>();
}

const otpMap = globalStore.__sonora_otps;
const sessionMap = globalStore.__sonora_reset_sessions;

// Hash OTP with SHA-256 for secure constant-time matching without leaking plain OTP
function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp.trim()).digest('hex');
}

/**
 * Mask an email address like xe***@gmail.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email || '';
  const [localPart, domain] = email.toLowerCase().split('@');
  if (localPart.length <= 2) {
    return `${localPart}***@${domain}`;
  }
  const prefix = localPart.slice(0, 2);
  return `${prefix}***@${domain}`;
}

/**
 * Generates a random 6-digit OTP code and records it with a 5-minute expiration
 */
export function generateOtp(email: string): {
  otp: string;
  expiresInSeconds: number;
  cooldownSeconds: number;
} {
  const normalizedEmail = email.toLowerCase().trim();

  // Invalidate any existing OTP for this email
  otpMap.delete(normalizedEmail);

  // Generate 6-digit numeric OTP (100000 to 999999)
  const otpNumber = Math.floor(100000 + Math.random() * 900000);
  const otp = otpNumber.toString();

  const now = Date.now();
  const entry: OtpEntry = {
    email: normalizedEmail,
    hashedOtp: hashOtp(otp),
    createdAt: now,
    expiresAt: now + 5 * 60 * 1000, // 5 minutes
    attempts: 0,
    cooldownUntil: now + 60 * 1000 // 60 seconds cooldown
  };

  otpMap.set(normalizedEmail, entry);

  return {
    otp,
    expiresInSeconds: 300,
    cooldownSeconds: 60
  };
}

/**
 * Checks if the email is still within the 60s cooldown period for resending OTP
 */
export function getResendCooldown(email: string): number {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = otpMap.get(normalizedEmail);
  if (!existing) return 0;
  const remaining = Math.ceil((existing.cooldownUntil - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

/**
 * Verifies a 6-digit OTP for the given email
 */
export function verifyOtp(
  email: string,
  inputOtp: string
): {
  success: boolean;
  error?: string;
  resetToken?: string;
} {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = otpMap.get(normalizedEmail);

  if (!entry) {
    return {
      success: false,
      error: 'No active verification code found. Please request a new code.'
    };
  }

  // Check expiration
  if (Date.now() > entry.expiresAt) {
    otpMap.delete(normalizedEmail);
    return {
      success: false,
      error: 'Verification code has expired. Please request a new one.'
    };
  }

  // Check brute force attempts
  if (entry.attempts >= 5) {
    otpMap.delete(normalizedEmail);
    return {
      success: false,
      error: 'Too many incorrect attempts. For security, please request a new code.'
    };
  }

  const inputHash = hashOtp(inputOtp);
  if (inputHash !== entry.hashedOtp) {
    entry.attempts += 1;
    const remaining = 5 - entry.attempts;
    return {
      success: false,
      error: `Invalid verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
    };
  }

  // OTP verified successfully -> Invalidate OTP immediately
  otpMap.delete(normalizedEmail);

  // Generate cryptographically secure one-time reset token (valid for 10 minutes)
  const resetToken = crypto.randomBytes(32).toString('hex');
  sessionMap.set(resetToken, {
    email: normalizedEmail,
    token: resetToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  return {
    success: true,
    resetToken
  };
}

/**
 * Validates a reset token for password update
 */
export function validateResetToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const session = sessionMap.get(token);
  if (!session) return false;
  if (session.email !== email.toLowerCase().trim()) return false;
  if (Date.now() > session.expiresAt) {
    sessionMap.delete(token);
    return false;
  }
  return true;
}

/**
 * Consumes/invalidates the reset token after successful password change
 */
export function consumeResetToken(token: string): void {
  sessionMap.delete(token);
}
