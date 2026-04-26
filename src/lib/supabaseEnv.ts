/**
 * Single source of truth for public Supabase URL + anon key (server, middleware, edge, inlined client bundle).
 * Strips quotes and applies safe fallbacks for local dev when env placeholders are used.
 */
const FALLBACK_SUPABASE_URL = "https://nucdnkudbmzxhboxduic.supabase.co";
const FALLBACK_SUPABASE_ANON_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Y2Rua3VkYm16eGhib3hkdWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjE4ODgsImV4cCI6MjA4OTU5Nzg4OH0.i88XX6C06rX57UGV_pEZXNJAkWUpttHqBqi8mT3ni4o";

function stripQuotes(v: string): string {
  return v.replace(/^['"]|['"]$/g, "").trim();
}

export function resolvePublicSupabaseEnv(): {
  url: string;
  anonKey: string;
} {
  let url = stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  let anonKey = stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");

  if (!url || url === "your-supabase-url") {
    url = FALLBACK_SUPABASE_URL;
  }
  if (!anonKey || anonKey === "your-supabase-anon-key") {
    anonKey = FALLBACK_SUPABASE_ANON_JWT;
  }

  return { url, anonKey };
}

export function assertValidPublicSupabaseEnv(): void {
  const { url, anonKey } = resolvePublicSupabaseEnv();
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error("Invalid or missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!anonKey) {
    throw new Error("Invalid or missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
}
