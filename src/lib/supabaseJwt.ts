/**
 * Decode `role` from a Supabase JWT (anon / service_role) without verifying the signature.
 * Used only to give actionable errors when the wrong key is pasted into env vars.
 */
export function readSupabaseJwtRole(secret: string): string | null {
  const trimmed = secret.trim();
  const parts = trimmed.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(json) as { role?: string };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}
