import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabasePublicClient } from "@/lib/supabasePublic";
import { createSupabaseServiceRoleClient } from "@/lib/supabaseServiceRole";
import type { ToySubmission } from "@/types/database";

/**
 * Reads for the public catalog. Prefer service role (bypasses RLS) when
 * `SUPABASE_SERVICE_ROLE_KEY` is set so approved toys show up even if anon
 * SELECT policies are missing. Falls back to the anon client otherwise.
 */
function catalogReadClient(): {
  client: SupabaseClient;
  viaServiceRole: boolean;
} {
  const service = createSupabaseServiceRoleClient();
  if (service) {
    return { client: service, viaServiceRole: true };
  }
  return {
    client: createSupabasePublicClient(),
    viaServiceRole: false,
  };
}

export async function listApprovedToysForCatalog(options?: {
  limit?: number;
}): Promise<{
  items: ToySubmission[];
  errorMessage: string | null;
  /** False when using anon key — empty catalog may mean RLS is blocking reads. */
  viaServiceRole: boolean;
}> {
  const { client: supabase, viaServiceRole } = catalogReadClient();
  let q = supabase
    .from("toy_submissions")
    .select("id,toy_name,difficulty,image_url,created_at,status")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (options?.limit != null) {
    q = q.limit(options.limit);
  }

  const { data, error } = await q;

  if (error) {
    console.error("[catalog] list approved toys:", error.message);
    return { items: [], errorMessage: error.message, viaServiceRole };
  }

  return {
    items: (data as ToySubmission[]) ?? [],
    errorMessage: null,
    viaServiceRole,
  };
}

export async function getApprovedToyByIdForCatalog(
  id: string
): Promise<{ toy: ToySubmission | null; errorMessage: string | null }> {
  const { client: supabase } = catalogReadClient();
  const { data, error } = await supabase
    .from("toy_submissions")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (error) {
    console.error("[catalog] toy by id:", error.message);
    return { toy: null, errorMessage: error.message };
  }

  return {
    toy: data ? (data as ToySubmission) : null,
    errorMessage: null,
  };
}
