'use client';

import { useEffect } from 'react';

/**
 * Client-side console filter to cleanly suppress third-party iframe telemetry,
 * analytics beacon CORS rejections (e.g., YouTube DoubleClick tracking pixels),
 * and known benign framework development notices.
 */
export function ConsoleFilter() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const origWarn = console.warn;
    const origErr = console.error;

    const isIgnored = (args: any[]) => {
      const text = Array.from(args || [])
        .map((item) => {
          try {
            return typeof item === 'object' ? JSON.stringify(item) : String(item);
          } catch {
            return String(item);
          }
        })
        .join(' ');

      return (
        text.includes('Clerk has been loaded with development keys') ||
        text.includes('powerPreference option is currently ignored') ||
        text.includes('crbug.com/369219127') ||
        text.includes("Failed to execute 'postMessage' on 'DOMWindow'") ||
        text.includes('www-widgetapi.js') ||
        text.includes('googleads.g.doubleclick.net') ||
        text.includes('viewthroughconversion') ||
        text.includes('doubleclick') ||
        text.includes('ERR_FAILED') ||
        text.includes('NotSupportedError') ||
        (text.includes('CORS policy') && text.includes('googleads'))
      );
    };

    console.warn = function (...args: any[]) {
      if (isIgnored(args)) return;
      origWarn.apply(console, args);
    };

    console.error = function (...args: any[]) {
      if (isIgnored(args)) return;
      origErr.apply(console, args);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reasonStr = String(event?.reason || '');
      if (
        reasonStr.includes('googleads') ||
        reasonStr.includes('doubleclick') ||
        reasonStr.includes('ERR_FAILED')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.warn = origWarn;
      console.error = origErr;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}

