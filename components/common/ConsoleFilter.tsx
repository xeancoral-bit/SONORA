'use client';

import { useEffect } from 'react';

/**
 * Checks if a console message is a known benign browser extension notice,
 * third-party telemetry warning (e.g. Liner AI extension, DoubleClick),
 * or Chromium internal Windows WebGPU log.
 */
function isIgnored(args: any[]): boolean {
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
    text.includes('requestAdapter() on Windows') ||
    text.includes('crbug.com/369219127') ||
    text.includes('delivery-sdk') ||
    text.includes('liner-core') ||
    text.includes('liner.com') ||
    text.includes('x-device-id') ||
    text.includes("Failed to execute 'postMessage' on 'DOMWindow'") ||
    text.includes('www-widgetapi.js') ||
    text.includes('googleads.g.doubleclick.net') ||
    text.includes('viewthroughconversion') ||
    text.includes('doubleclick') ||
    text.includes('ERR_FAILED') ||
    text.includes('NotSupportedError') ||
    (text.includes('CORS policy') && text.includes('googleads'))
  );
}

// Immediate execution when imported on client to catch logs before React finishes mounting
if (typeof window !== 'undefined') {
  const w = window as any;
  if (!w.__sonora_console_filtered) {
    w.__sonora_console_filtered = true;

    const origWarn = console.warn;
    const origErr = console.error;
    const origLog = console.log;
    const origInfo = console.info;

    console.warn = function (...args: any[]) {
      if (isIgnored(args)) return;
      origWarn.apply(console, args);
    };

    console.error = function (...args: any[]) {
      if (isIgnored(args)) return;
      origErr.apply(console, args);
    };

    console.log = function (...args: any[]) {
      if (isIgnored(args)) return;
      origLog.apply(console, args);
    };

    console.info = function (...args: any[]) {
      if (isIgnored(args)) return;
      origInfo.apply(console, args);
    };

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const reasonStr = String(event?.reason || '');
      if (
        reasonStr.includes('googleads') ||
        reasonStr.includes('doubleclick') ||
        reasonStr.includes('ERR_FAILED') ||
        reasonStr.includes('liner')
      ) {
        event.preventDefault();
      }
    });
  }
}

/**
 * Client-side console filter component
 */
export function ConsoleFilter() {
  useEffect(() => {
    // Already patched in global scope; keep effect alive for component lifecycle
  }, []);

  return null;
}

