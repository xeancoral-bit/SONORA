import { NextResponse } from 'next/server';

/**
 * Same-origin fallback proxy for third-party browser extensions (e.g. Liner AI SDK)
 * Prevents cross-origin SameSite cookie rejections from browser extensions.
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', handled: true });
}

export async function POST() {
  return NextResponse.json({ status: 'ok', handled: true });
}

