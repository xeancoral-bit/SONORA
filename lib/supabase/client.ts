import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

  const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
  const safeKey = supabaseKey || 'placeholder-anon-key';

  return createBrowserClient(safeUrl, safeKey);
}
