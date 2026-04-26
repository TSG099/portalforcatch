import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { ToySubmission } from "@/types/database";

async function getMySubmissions(): Promise<ToySubmission[]> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("toy_submissions")
    .select("*")
    .eq("submitted_by", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as ToySubmission[];
}

const statusStyles: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-800 border border-amber-200",
  approved:
    "bg-emerald-50 text-emerald-800 border border-emerald-200",
  rejected: "bg-red-50 text-red-900 border border-red-200",
  needs_revision:
    "bg-blue-50 text-blue-900 border border-blue-200",
};

export default async function MySubmissionsPage() {
  const submissions = await getMySubmissions();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">
          My Submissions
        </h1>
        <p className="text-sm text-zinc-500">
          When an admin rejects a toy or asks for changes, you&apos;ll see the
          decision and any reviewer notes here and on your dashboard.
        </p>
      </header>

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
        {submissions.length === 0 && (
          <div className="flex flex-col gap-3 text-sm text-zinc-500">
            <p>You haven&apos;t submitted any toys yet.</p>
            <Link
              href="/submit-toy"
              className="inline-flex w-fit rounded-full border border-[#e85a3d] bg-[#FF6B4A] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#FF5738]"
            >
              Submit a toy
            </Link>
          </div>
        )}

        {submissions.map((sub) => {
          const isRejected = sub.status === "rejected";
          const needsRev = sub.status === "needs_revision";
          const needsNotice = isRejected || needsRev;

          return (
            <div
              key={sub.id}
              className={`flex flex-col gap-3 rounded-xl border px-4 py-3 md:flex-row md:items-start md:justify-between ${
                needsNotice
                  ? isRejected
                    ? "border-red-200 bg-red-50/40"
                    : "border-blue-200 bg-blue-50/40"
                  : "border-zinc-100 bg-zinc-50"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-zinc-900">
                    {sub.toy_name}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[sub.status] ?? "bg-zinc-100 text-zinc-700 border border-zinc-200"}`}
                  >
                    {sub.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  Difficulty: {sub.difficulty} • Submitted{" "}
                  {new Date(sub.created_at).toLocaleDateString()}
                </p>

                {needsNotice && (
                  <div
                    className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
                      isRejected
                        ? "border-red-200 bg-white text-red-950"
                        : "border-blue-200 bg-white text-blue-950"
                    }`}
                  >
                    <p className="font-semibold">
                      {isRejected
                        ? "This submission was not added to the public catalog."
                        : "A reviewer asked you to revise this submission."}
                    </p>
                    {sub.admin_feedback ? (
                      <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed opacity-95">
                        <span className="font-semibold">Reviewer note: </span>
                        {sub.admin_feedback}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs italic opacity-80">
                        No written note was left for this decision.
                      </p>
                    )}
                    {sub.reviewed_at && (
                      <p className="mt-2 text-[11px] opacity-70">
                        Updated{" "}
                        {new Date(sub.reviewed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {sub.status === "approved" && (
                  <Link
                    href={`/catalog/${sub.id}`}
                    className="mt-3 inline-flex text-xs font-semibold text-[#3d9488] hover:underline"
                  >
                    View in toy catalog →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
