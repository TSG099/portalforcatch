import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { SerializeOptions } from "cookie";
import { resolvePublicSupabaseEnv } from "@/lib/supabaseEnv";
import { supabaseTimeoutFetch } from "@/lib/supabaseTimeoutFetch";

export async function createSupabaseServerClient() {
  const { url: supabaseUrl, anonKey: supabaseAnonKey } =
    resolvePublicSupabaseEnv();

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: SerializeOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: SerializeOptions) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
    global: {
      fetch: supabaseTimeoutFetch,
    },
  });
}
