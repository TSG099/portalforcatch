import { createClient } from "@supabase/supabase-js";
import { resolvePublicSupabaseEnv } from "@/lib/supabaseEnv";
import { supabaseTimeoutFetch } from "@/lib/supabaseTimeoutFetch";

/**
 * Read-only Supabase client (anon key, no user session).
 * Use on public pages like the toy catalog so guests can see approved items
 * when RLS allows SELECT on approved rows for the `anon` role.
 */
export function createSupabasePublicClient() {
  const { url, anonKey } = resolvePublicSupabaseEnv();
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: supabaseTimeoutFetch,
    },
  });
}

/**
 * Same as `createSupabasePublicClient()` — a single shared anon client using
 * `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (via {@link resolvePublicSupabaseEnv}).
 *
 * **Not for auth:** sign-in / sign-up / session flows must use
 * `createSupabaseBrowserClient()` from `@/lib/supabase` (cookie-based, App Router).
 */
export const supabase = createSupabasePublicClient();
