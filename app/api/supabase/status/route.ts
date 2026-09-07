import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnon = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  const hasServiceRole = Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  );

  if (!url || !hasAnon) {
    return NextResponse.json(
      {
        connected: false,
        error: 'Missing Supabase environment variables (URL or Anon Key)',
        configured: {
          url: Boolean(url),
          anonKey: hasAnon,
          serviceRoleKey: hasServiceRole,
        },
      },
      { status: 500 }
    );
  }

  const startTime = Date.now();

  try {
    const adminClient = createAdminClient();

    // Check if client can connect and inspect schemas/tables
    const { data: songsData, error: songsError } = await adminClient
      .from('songs')
      .select('id')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    // Check if error is specifically missing table (PGRST205) or success
    const tableExists = !songsError || songsError.code !== 'PGRST205';

    return NextResponse.json({
      connected: true,
      latencyMs,
      supabaseUrl: url,
      configured: {
        url: true,
        anonKey: hasAnon,
        serviceRoleKey: hasServiceRole,
      },
      database: {
        songsTableReady: tableExists,
        note: tableExists
          ? 'Tables exist and are accessible'
          : 'Supabase connected! Schema tables have not yet been created in Supabase SQL editor.',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        connected: false,
        latencyMs: Date.now() - startTime,
        error: err instanceof Error ? err.message : 'Unknown connection error',
        configured: {
          url: true,
          anonKey: hasAnon,
          serviceRoleKey: hasServiceRole,
        },
      },
      { status: 500 }
    );
  }
}
