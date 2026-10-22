import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import '@/lib/env';

export async function createSupabaseClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' }).catch(() => null);

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    }
  );
}
