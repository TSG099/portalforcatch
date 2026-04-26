import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { Profile } from "@/types/database";

/** Signed-in user with a profile row, or null (guest / missing profile). */
export async function getPortalProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) {
    console.error("[portalProfile]", error);
    return null;
  }
  if (!data) return null;
  return data as Profile;
}
