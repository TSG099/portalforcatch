import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { ToySubmission } from "@/types/database";
import AdminToyQueue from "./AdminToyQueue";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: pendingData, error } = await supabase
    .from("toy_submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const pending = !error && pendingData ? pendingData : [];

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[#3F3A36]">
          Admin Console
        </h1>
        <p className="text-sm text-zinc-600">
          Review pending toy submissions.
        </p>
      </header>

      <section className="rounded-xl border border-[#F2E6CF] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[#3F3A36]">
            Pending submissions
          </h2>
        </div>

        <div className="mt-4">
          <AdminToyQueue submissions={(pending ?? []) as ToySubmission[]} />
        </div>
      </section>
    </div>
  );
}

