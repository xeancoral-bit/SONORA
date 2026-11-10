import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

/**
 * SONORA — Proxy (Next.js 16+ replaces middleware.ts)
 *
 * This project uses a custom JWT/session auth system (lib/auth.ts) for all
 * route protection and role checks. Clerk is used only for OAuth social login
 * UI components (ClerkProvider, useSignIn, useSignUp, useClerk, useUser).
 *
 * Per Clerk v7 guidance, auth checks should live in each page/layout/API route
 * rather than relying on path-based matching here (createRouteMatcher is deprecated).
 *
 * All routes are public at the proxy level — route protection is handled
 * inside each individual page, layout, and API route handler.
 */

// Only activate Clerk middleware when a valid secret key is configured.
// Falls back to NextResponse.next() so the app never throws on missing keys.
const hasClerkSecret = Boolean(
  process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes('your_clerk_secret_key')
);

const clerkHandler = hasClerkSecret ? clerkMiddleware() : null;

export function proxy(request: NextRequest, event: NextFetchEvent) {
  if (clerkHandler) {
    return clerkHandler(request, event);
  }
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
