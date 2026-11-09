import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/browse(.*)',
  '/genres(.*)',
  '/songs(.*)',
  '/albums(.*)',
  '/artists(.*)',
  '/search(.*)',
  '/auth(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback(.*)',
  '/welcome(.*)',
  '/api(.*)',
]);

// If CLERK_SECRET_KEY is present and valid, initialize Clerk middleware.
// Otherwise, pass through safely so the application never throws "@clerk/nextjs: Missing secretKey".
const hasClerkSecret = Boolean(
  process.env.CLERK_SECRET_KEY &&
  !process.env.CLERK_SECRET_KEY.includes('your_clerk_secret_key')
);

const clerkHandler = hasClerkSecret
  ? clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        await auth.protect();
      }
    })
  : null;

export function proxy(request: NextRequest, event: NextFetchEvent) {
  if (clerkHandler) {
    return clerkHandler(request, event);
  }
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
