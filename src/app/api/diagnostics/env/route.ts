import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { resolvePublicSupabaseEnv } from "@/lib/supabaseEnv";
import {
  isServiceRoleKeyConfigured,
  readServiceRoleKeyFromEnv,
} from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const resolved = resolvePublicSupabaseEnv();

  // Compare against the on-disk .env.local (to detect env overrides / stale dev servers).
  let fileSupabaseUrl: string | null = null;
  let fileAnonKey: string | null = null;
  const cwd = process.cwd();
  const envPath = path.resolve(cwd, ".env.local");
  let fileLine1: string | null = null;
  let fileServiceRolePresent = false;
  try {
    const envText = fs.readFileSync(envPath, "utf8");
    fileLine1 = envText.split(/\r?\n/)[0] ?? null;
    const lines = envText.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (key === "NEXT_PUBLIC_SUPABASE_URL") fileSupabaseUrl = value || null;
      if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY")
        fileAnonKey = value || null;
      if (
        key === "SUPABASE_SERVICE_ROLE_KEY" ||
        key === "SUPABASE_SERVICE_KEY"
      ) {
        const v = value.replace(/^['"]|['"]$/g, "").trim();
        fileServiceRolePresent = Boolean(
          v && v !== "your-service-role-key"
        );
      }
    }
  } catch {
    // ignore missing file
  }

  // Prefer on-disk .env.local values to avoid stale injected envs.
  const resolvedUrl = fileSupabaseUrl ?? supabaseUrl ?? null;
  const resolvedAnonKey = fileAnonKey ?? anonKey ?? null;

  return NextResponse.json(
    {
      now: Date.now(),
    cwd,
    envPath,
    process_NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ?? null,
    process_NEXT_PUBLIC_SUPABASE_ANON_KEY_present: Boolean(anonKey),
    // Normalized fields expected by the runtime client.
    NEXT_PUBLIC_SUPABASE_URL: resolvedUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: resolvedAnonKey,
    /** Same resolution the app uses everywhere (includes dev fallbacks). */
    app_resolved_url: resolved.url,
    app_resolved_anon_key_present: Boolean(resolved.anonKey),
    fileLine1,
    file_NEXT_PUBLIC_SUPABASE_URL: fileSupabaseUrl,
    file_NEXT_PUBLIC_SUPABASE_ANON_KEY_present: Boolean(fileAnonKey),
    /** Server-side only; never log the actual secret. */
    process_SUPABASE_SERVICE_ROLE_KEY_present: Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    ),
    app_service_role_configured: isServiceRoleKeyConfigured(),
    /** Length after trim (0 = missing / placeholder) — helps verify process loaded .env.local */
    app_service_role_key_char_length: readServiceRoleKeyFromEnv().length,
    file_SUPABASE_SERVICE_ROLE_KEY_present: fileServiceRolePresent,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  );
}

