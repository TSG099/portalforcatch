import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServiceRoleClient } from "@/lib/supabaseServiceRole";
import { readSupabaseJwtRole } from "@/lib/supabaseJwt";

export type ToyReviewStatus = "approved" | "rejected" | "needs_revision";

const ALLOWED: readonly ToyReviewStatus[] = [
  "approved",
  "rejected",
  "needs_revision",
];

export function isToyReviewStatus(s: string): s is ToyReviewStatus {
  return (ALLOWED as readonly string[]).includes(s);
}

/** Persist optional admin notes for rejections and revision requests. */
export function resolveAdminFeedback(
  status: ToyReviewStatus,
  raw: string | null | undefined
): string | null {
  if (status !== "needs_revision" && status !== "rejected") return null;
  const t = typeof raw === "string" ? raw.trim() : "";
  return t.length > 0 ? t : null;
}

export type ReviewToySubmissionResult =
  | { ok: true; usedServiceRole: boolean }
  | {
      ok: false;
      error: string;
      usedServiceRole?: boolean;
    };

/**
 * Approve / reject / request revision. Call only from server (Route Handler or Server Action).
 */
export async function reviewToySubmission(
  supabase: SupabaseClient,
  rawSubmissionId: string,
  status: string,
  adminFeedback: string | null
): Promise<ReviewToySubmissionResult> {
  const id = decodeURIComponent(String(rawSubmissionId)).trim();

  if (!isToyReviewStatus(status)) {
    return { ok: false, error: "Invalid status" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.role || profile.role !== "admin") {
    return { ok: false, error: "Forbidden" };
  }

  const admin_feedback = resolveAdminFeedback(status, adminFeedback);
  const reviewed_at = new Date().toISOString();

  const payload = {
    status,
    admin_feedback,
    reviewed_at,
  };

  const rawServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/^['"]|['"]$/g, "").trim() ??
    "";
  if (rawServiceKey && rawServiceKey !== "your-service-role-key") {
    const jwtRole = readSupabaseJwtRole(rawServiceKey);
    if (jwtRole && jwtRole !== "service_role") {
      return {
        ok: false,
        error:
          "SUPABASE_SERVICE_ROLE_KEY is not the service_role secret. In Supabase: Project Settings → API → copy the service_role JWT, not the anon or publishable key.",
      };
    }
  }

  const service = createSupabaseServiceRoleClient();
  const db = service ?? supabase;

  const { data: rows, error: updateError } = await db
    .from("toy_submissions")
    .update(payload)
    .eq("id", id)
    .select("id");

  if (updateError) {
    return {
      ok: false,
      error: updateError.message,
      usedServiceRole: Boolean(service),
    };
  }

  if (!rows?.length) {
    let detail =
      "No submission was updated. Add SUPABASE_SERVICE_ROLE_KEY (service_role JWT) to .env.local and restart the dev server, or apply the SQL migration \"Admins can update toy submissions\".";

    if (service) {
      const { data: existing } = await service
        .from("toy_submissions")
        .select("id, status")
        .eq("id", id)
        .maybeSingle();

      if (!existing) {
        detail = `No row with id "${id}" in toy_submissions. Your app URL must point at the same Supabase project as the DB where this submission exists.`;
      } else {
        detail = `Row exists (status: ${existing.status}) but UPDATE returned 0 rows. Check for triggers, constraints, or that column "status" allows value "${status}".`;
      }
    }

    return {
      ok: false,
      error: detail,
      usedServiceRole: Boolean(service),
    };
  }

  // No revalidatePath/after here: those paths interacted badly with Server Actions + dev
  // overlay (“Rendering”). Catalog/admin pages are dynamic or use service-role reads.

  return { ok: true, usedServiceRole: Boolean(service) };
}
