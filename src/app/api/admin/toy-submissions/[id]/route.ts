import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { createSupabaseServiceRoleClient } from "@/lib/supabaseServiceRole";
import {
  isToyReviewStatus,
  reviewToySubmission,
} from "@/lib/reviewToySubmission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const supabase = await createSupabaseServerClient();

    const body = (await req.json().catch(() => null)) as
      | { status?: string; admin_feedback?: string | null }
      | null;
    const status = body?.status;

    if (!status || !isToyReviewStatus(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const admin_feedback =
      status === "rejected" || status === "needs_revision"
        ? body?.admin_feedback ?? null
        : null;

    const result = await reviewToySubmission(
      supabase,
      rawId,
      status,
      admin_feedback
    );

    if (!result.ok) {
      const code =
        result.error === "Unauthorized"
          ? 401
          : result.error === "Forbidden"
            ? 403
            : 400;
      return NextResponse.json(
        {
          error: result.error,
          usedServiceRole: result.usedServiceRole,
        },
        { status: code }
      );
    }

    return NextResponse.json({
      ok: true,
      usedServiceRole: result.usedServiceRole,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error.";
    console.error("[admin toy-submissions POST]", err);
    return NextResponse.json(
      {
        error:
          message.includes("abort") || message.includes("Abort")
            ? "Supabase request timed out — check NEXT_PUBLIC_SUPABASE_URL and network."
            : message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = decodeURIComponent(String(rawId)).trim();
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.role || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const service = createSupabaseServiceRoleClient();
    const db = service ?? supabase;

    const { data: deleted, error: delError } = await db
      .from("toy_submissions")
      // Only remove catalog entries via this route.
      .delete()
      .eq("id", id)
      .eq("status", "approved")
      .select("id");

    if (delError) {
      return NextResponse.json(
        { error: delError.message, usedServiceRole: Boolean(service) },
        { status: 400 }
      );
    }

    if (!deleted?.length) {
      return NextResponse.json(
        {
          error: "Not found (or not an approved catalog entry).",
          usedServiceRole: Boolean(service),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, usedServiceRole: Boolean(service) });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error.";
    console.error("[admin toy-submissions DELETE]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
