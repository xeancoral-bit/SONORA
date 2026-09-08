import { Resend } from 'resend';

// Primary Resend API Key from environment variables
const RESEND_API_KEY =
  process.env.RESEND_API_KEY ||
  process.env.RESEND_BACKUP_API_KEY ||
  '';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export const resendClient = new Resend(RESEND_API_KEY);

export interface SendEmailResult {
  success: boolean;
  delivered: boolean;
  id?: string;
  error?: string;
  warning?: string;
  devOtp?: string;
}

/**
 * Sends a 6-digit OTP verification email via Resend
 */
export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  maskedEmail?: string
): Promise<SendEmailResult> {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>SONORA Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0c0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 40px auto; background-color: #12141a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <!-- Header Branding -->
          <tr>
            <td align="center" style="padding: 36px 30px 20px 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: #00e5a3; width: 36px; height: 36px; border-radius: 10px; line-height: 36px; text-align: center; box-shadow: 0 0 20px rgba(0, 229, 163, 0.4);">
                      <span style="font-size: 18px; color: #000000; font-weight: 900;">&#9835;</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: 3px; color: #ffffff; text-transform: uppercase;">SONORA</span>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="font-size: 11px; color: #71717a; letter-spacing: 1px; text-transform: uppercase;">Your Music. Your Moment.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px 24px 30px; text-align: center;">
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 400; color: #ffffff; margin: 0 0 12px 0;">
                Verification Code
              </h1>
              <p style="font-size: 14px; line-height: 22px; color: #a1a1aa; margin: 0 0 28px 0;">
                You recently requested to reset your password for your SONORA account. Use the 6-digit code below to complete your verification.
              </p>

              <!-- OTP Code Display -->
              <div style="background: rgba(0, 229, 163, 0.06); border: 1px solid rgba(0, 229, 163, 0.3); border-radius: 14px; padding: 18px 24px; margin: 0 auto 28px auto; display: inline-block;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #00f298; display: block; text-align: center; text-indent: 10px;">
                  ${otpCode}
                </span>
              </div>

              <!-- Security Notice -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(255, 255, 255, 0.02); border-radius: 10px; padding: 14px; text-align: left;">
                <tr>
                  <td style="font-size: 12px; line-height: 18px; color: #71717a;">
                    <strong style="color: #e4e4e7;">Important:</strong> This verification code is valid for <strong>5 minutes</strong>. For your security, never share this code with anyone.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px 28px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #52525b; line-height: 16px;">
              If you didn't request a password reset, you can safely ignore this email.<br/>
              &copy; ${new Date().getFullYear()} SONORA Music Streaming. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const response = await resendClient.emails.send({
      from: `SONORA Security <${FROM_EMAIL}>`,
      to: toEmail,
      subject: `Your SONORA Verification Code: ${otpCode}`,
      html: emailHtml
    });

    if (response.error) {
      console.warn('Resend send warning:', response.error);

      // Handle Resend testing domain restriction (only allows sending to verified account email on free tier)
      const isSandboxRestriction =
        response.error.message?.includes('only send testing emails') ||
        response.error.name === 'validation_error';

      return {
        success: true,
        delivered: !isSandboxRestriction,
        warning: isSandboxRestriction
          ? `Resend Free Sandbox: Can only deliver externally to verified test email. In development, code is ${otpCode}.`
          : response.error.message,
        devOtp: otpCode
      };
    }

    console.log(`[SONORA Email] OTP sent successfully to ${toEmail} (ID: ${response.data?.id})`);
    return {
      success: true,
      delivered: true,
      id: response.data?.id
    };
  } catch (err: any) {
    console.error('[SONORA Email] Resend exception:', err);
    return {
      success: true,
      delivered: false,
      warning: err?.message || 'Email delivery service temporarily unavailable.',
      devOtp: otpCode
    };
  }
}

/**
 * Sends a notification email after a password has been successfully reset
 */
export async function sendPasswordChangedEmail(
  toEmail: string,
  username?: string
): Promise<SendEmailResult> {
  const timestamp = new Date().toUTCString();

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset Successful</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0c0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 40px auto; background-color: #12141a; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden;">
          <tr>
            <td align="center" style="padding: 36px 30px 20px 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
              <span style="font-size: 20px; font-weight: 800; letter-spacing: 3px; color: #ffffff; text-transform: uppercase;">SONORA</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 30px; text-align: center;">
              <div style="display: inline-block; background: rgba(0, 229, 163, 0.1); border: 1px solid rgba(0, 229, 163, 0.3); width: 48px; height: 48px; border-radius: 50%; line-height: 48px; text-align: center; margin-bottom: 16px;">
                <span style="font-size: 24px; color: #00f298;">&#10003;</span>
              </div>
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 400; color: #ffffff; margin: 0 0 12px 0;">
                Password Reset Successful
              </h1>
              <p style="font-size: 14px; line-height: 22px; color: #a1a1aa; margin: 0 0 20px 0;">
                Hello ${username || 'Music Lover'},<br/>
                Your SONORA account password was successfully updated on <strong>${timestamp}</strong>.
              </p>
              <p style="font-size: 12px; color: #71717a; margin: 0;">
                If you initiated this change, no further action is needed.<br/>
                If you did not make this change, please contact SONORA support immediately.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #52525b;">
              &copy; ${new Date().getFullYear()} SONORA Music Streaming.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const response = await resendClient.emails.send({
      from: `SONORA Security <${FROM_EMAIL}>`,
      to: toEmail,
      subject: 'Security Alert: Your SONORA Password Has Been Changed',
      html: emailHtml
    });

    return {
      success: true,
      delivered: !response.error,
      id: response.data?.id
    };
  } catch (err: any) {
    console.error('[SONORA Email] Password changed alert error:', err);
    return { success: true, delivered: false, warning: err?.message };
  }
}
