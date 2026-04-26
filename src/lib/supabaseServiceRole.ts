import { loadEnvConfig } from "@next/env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { resolvePublicSupabaseEnv } from "@/lib/supabaseEnv";
import { supabaseTimeoutFetch } from "@/lib/supabaseTimeoutFetch";

let attemptedEnvReload = false;

function reloadEnvFromDiskIfNeeded(): void {
  if (typeof window !== "undefined") return;
  const hasKey = Boolean(
    (process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY)
      ?.trim()
  );
  if (hasKey || attemptedEnvReload) return;
  attemptedEnvReload = true;
  try {
    loadEnvConfig(process.cwd());
  } catch {
    // ignore — Next normally loads env; this is a fallback for edge cases
  }
}

/** Normalize service role secret from env (quotes, BOM, whitespace). */
export function readServiceRoleKeyFromEnv(): string {
  reloadEnvFromDiskIfNeeded();
  const raw =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_KEY ??
    "";
  const key = raw.replace(/^\uFEFF/, "").replace(/^['"]|['"]$/g, "").trim();
  return key;
}

/**
 * Server-only client that bypasses RLS. Use only for trusted server code:
 * admin mutations after auth checks, or read-only catalog queries filtered to approved rows.
 * Returns null if SUPABASE_SERVICE_ROLE_KEY is not set.
 */
export function createSupabaseServiceRoleClient(): SupabaseClient | null {
  const { url: rawUrl } = resolvePublicSupabaseEnv();
  const url = rawUrl.trim();
  const key = readServiceRoleKeyFromEnv();
  if (
    !url ||
    !key ||
    url === "your-supabase-url" ||
    key === "your-service-role-key"
  ) {
    return null;
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: supabaseTimeoutFetch,
    },
  });
}

/** True when a non-placeholder service role key is available (for diagnostics only). */
export function isServiceRoleKeyConfigured(): boolean {
  const key = readServiceRoleKeyFromEnv();
  return Boolean(key && key !== "your-service-role-key");
}
