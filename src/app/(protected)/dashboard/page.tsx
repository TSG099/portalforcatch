import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { listApprovedToysForCatalog } from "@/lib/approvedToyCatalog";
import { catalogDifficultyLabel } from "@/lib/catalogUi";
import { SubmissionAttentionBanner } from "@/components/submissions/SubmissionAttentionBanner";
import { Resource, ToySubmission, Role } from "@/types/database";

function submissionStatusLine(status: ToySubmission["status"]): string {
  switch (status) {
    case "pending":
      return "Under review";
    case "needs_revision":
      return "Revision requested";
    case "approved":
      return "Approved";
    case "rejected":
      return "Not approved";
    default:
      return "—";
  }
}

function toyInitials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function statusProgress(status: ToySubmission["status"]): number {
  switch (status) {
    case "approved":
      return 100;
    case "rejected":
      return 100;
    case "needs_revision":
      return 55;
    case "pending":
    default:
      return 35;
  }
}

function progressBarClass(status: ToySubmission["status"]): string {
  switch (status) {
    case "approved":
      return "bg-[#4AA89A]";
    case "rejected":
      return "bg-red-400";
    case "needs_revision":
      return "bg-amber-400";
    default:
      return "bg-sky-400";
  }
}

function statusBadgeClass(status: ToySubmission["status"]): string {
  switch (status) {
    case "approved":
      return "bg-[#eef8f7] text-[#2d7a6e] ring-[#c5ebe4]";
    case "rejected":
      return "bg-red-50 text-red-800 ring-red-100";
    case "needs_revision":
      return "bg-amber-50 text-amber-900 ring-amber-100";
    default:
      return "bg-sky-50 text-sky-900 ring-sky-100";
  }
}

type MetricProps = {
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
};

function MetricCard({ label, value, icon, iconBg }: MetricProps) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_6px_32px_rgba(63,58,54,0.06)] backdrop-blur-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>{icon}</div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[#3F3A36]">{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v15.128A9 9 0 009 18c2.305 0 4.408.867 6 2.292m0-14.042A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v15.128a8.997 8.997 0 01-6 2.292m0-14.042v14.042"
      />
    </svg>
  );
}

function IconStack({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5m4.179 2.25L12 12.75l5.571-3m-11.142 0L12 5.25m0 0l4.179 2.25M12 5.25l-4.179 2.25M12 5.25l4.179 2.25m0 0L21.75 8l-4.179 2.25M12 12.75l-4.179-2.25M12 12.75l4.179-2.25m0 0l4.179 2.25M12 15.75l-4.179-2.25M12 15.75l4.179-2.25"
      />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;
  const role = profile.role as Role;
  if (role === "admin") redirect("/admin");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [
    catalogCountRes,
    myTotalRes,
    myPendingRes,
    myApprovedRes,
    mySubmissionsRes,
    resourcesRes,
    catalogSpotlight,
  ] = await Promise.all([
    supabase.from("toy_submissions").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("toy_submissions").select("id", { count: "exact", head: true }).eq("submitted_by", user.id),
    supabase
      .from("toy_submissions")
      .select("id", { count: "exact", head: true })
      .eq("submitted_by", user.id)
      .eq("status", "pending"),
    supabase
      .from("toy_submissions")
      .select("id", { count: "exact", head: true })
      .eq("submitted_by", user.id)
      .eq("status", "approved"),
    supabase
      .from("toy_submissions")
      .select("*")
      .eq("submitted_by", user.id)
      .order("created_at", { ascending: false })
      .limit(24),
    supabase.from("resources").select("*").order("created_at", { ascending: false }).limit(6),
    listApprovedToysForCatalog({ limit: 1 }),
  ]);

  const submissions = (mySubmissionsRes.data ?? []) as ToySubmission[];
  const resList = (resourcesRes.data ?? []) as Resource[];
  const spotlightToy = catalogSpotlight.items[0] ?? null;

  const catalogTotal = catalogCountRes.count ?? 0;
  const mySubmissionsTotal = myTotalRes.count ?? 0;
  const myPendingTotal = myPendingRes.count ?? 0;
  const myApprovedTotal = myApprovedRes.count ?? 0;

  const attentionItems = submissions
    .filter(
      (s) =>
        (s.status === "rejected" || s.status === "needs_revision") &&
        Boolean(s.reviewed_at)
    )
    .map((s) => ({
      id: String(s.id),
      toy_name: s.toy_name,
      status: s.status as "rejected" | "needs_revision",
      admin_feedback: s.admin_feedback,
      reviewed_at: s.reviewed_at,
    }));

  const tableRows = submissions.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#3F3A36] md:text-[1.65rem]">
            Welcome back{profile.name ? `, ${profile.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            Your chapter hub for catalog inspiration, submissions, and resources.
          </p>
        </div>
      </div>

      <SubmissionAttentionBanner items={attentionItems} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Catalog adaptations"
          value={catalogTotal}
          iconBg="bg-sky-100 text-sky-600"
          icon={<IconBook className="h-5 w-5" />}
        />
        <MetricCard
          label="Your submissions"
          value={mySubmissionsTotal}
          iconBg="bg-[#fde8e4] text-[#e85a3d]"
          icon={<IconStack className="h-5 w-5" />}
        />
        <MetricCard
          label="In review"
          value={myPendingTotal}
          iconBg="bg-violet-100 text-violet-600"
          icon={<IconClock className="h-5 w-5" />}
        />
        <MetricCard
          label="Approved (yours)"
          value={myApprovedTotal}
          iconBg="bg-[#d4f0eb] text-[#3d9488]"
          icon={<IconCheck className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <section className="lg:col-span-8">
          <div className="rounded-[22px] border border-white/80 bg-white/95 shadow-[0_6px_32px_rgba(63,58,54,0.06)] backdrop-blur-sm">
            <div className="flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#3F3A36]">My submissions</h2>
                <p className="mt-0.5 text-sm text-zinc-500">Status and progress for toys you&apos;ve sent to CATCH.</p>
              </div>
              <Link
                href="/my-submissions"
                className="shrink-0 text-sm font-medium text-[#3d9488] underline decoration-[#3d9488]/35 underline-offset-[3px] hover:text-[#4AA89A]"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              {tableRows.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="text-sm text-zinc-500">No submissions yet.</p>
                  <Link
                    href="/submit-toy"
                    data-catch-primary="true"
                    className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white"
                  >
                    Submit a toy
                  </Link>
                </div>
              ) : (
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                      <th className="px-5 py-3 pl-6 sm:px-6">Adaptation</th>
                      <th className="px-3 py-3">Difficulty</th>
                      <th className="hidden px-3 py-3 md:table-cell">Status</th>
                      <th className="px-5 py-3 pr-6 sm:px-6">Progress</th>
                      <th className="w-12 px-3 py-3 pr-6" aria-label="Open">
                        <span className="sr-only">Open</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {tableRows.map((sub) => {
                      const pct = statusProgress(sub.status);
                      const viewHref =
                        sub.status === "approved" ? `/catalog/${sub.id}` : "/my-submissions";
                      return (
                        <tr key={sub.id} className="transition hover:bg-zinc-50/80">
                          <td className="px-5 py-3.5 pl-6 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white shadow-sm"
                                style={{
                                  background: "linear-gradient(135deg, #5DBAAB 0%, #4AA89A 100%)",
                                }}
                                aria-hidden
                              >
                                {toyInitials(sub.toy_name)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-[#3F3A36]">{sub.toy_name}</p>
                                <p className="mt-0.5 text-xs text-zinc-400 md:hidden">
                                  <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${statusBadgeClass(sub.status)}`}
                                  >
                                    {submissionStatusLine(sub.status)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-zinc-600">{catalogDifficultyLabel(sub.difficulty)}</td>
                          <td className="hidden px-3 py-3.5 md:table-cell">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusBadgeClass(sub.status)}`}
                            >
                              {submissionStatusLine(sub.status)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 pr-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-2 min-w-[72px] flex-1 overflow-hidden rounded-full bg-zinc-100">
                                <div
                                  className={`h-full rounded-full transition-all ${progressBarClass(sub.status)}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-10 shrink-0 tabular-nums text-xs font-medium text-zinc-500">
                                {pct}%
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 pr-6">
                            <Link
                              href={viewHref}
                              className="inline-flex rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-[#3d9488]"
                              aria-label={`Open ${sub.toy_name}`}
                            >
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <section className="rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_6px_32px_rgba(63,58,54,0.06)] backdrop-blur-sm sm:p-6">
            <h2 className="text-base font-semibold text-[#3F3A36]">Catalog spotlight</h2>
            <p className="mt-1 text-sm text-zinc-500">A featured adaptation from the community catalog.</p>
            {!spotlightToy ? (
              <p className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-500">
                No catalog entries yet. Approved submissions will appear here for everyone.
              </p>
            ) : (
              <Link
                href={`/catalog/${spotlightToy.id}`}
                className="mt-4 block overflow-hidden rounded-2xl border border-zinc-100 transition hover:border-[#b9e5df] hover:shadow-md"
              >
                <div className="aspect-[16/10] bg-zinc-100">
                  {spotlightToy.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={spotlightToy.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-300">
                      <IconBook className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-[#3F3A36]">{spotlightToy.toy_name}</p>
                  <p className="mt-1 text-xs text-[#3d9488]">View in catalog →</p>
                </div>
              </Link>
            )}
          </section>

          <section className="rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_6px_32px_rgba(63,58,54,0.06)] backdrop-blur-sm sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-semibold text-[#3F3A36]">Quick links</h2>
              <Link
                href="/resources"
                className="rounded-full p-1.5 text-[#3d9488] transition hover:bg-[#eef8f7]"
                aria-label="Browse resources"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Link>
            </div>
            <p className="mt-1 text-sm text-zinc-500">Shortcuts and recent workshop files.</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/catalog"
                  className="block rounded-xl border border-[#fff3d6] bg-[#fffbeb] px-3 py-2.5 text-sm font-medium text-[#92400e] transition hover:bg-[#fff3d6]"
                >
                  Browse full toy catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/submit-toy"
                  className="block rounded-xl border border-[#ffd8cf]/90 bg-[#fff5f3] px-3 py-2.5 text-sm font-medium text-[#9a3412] transition hover:bg-[#ffe8e0]"
                >
                  Start a new submission
                </Link>
              </li>
              <li>
                <a
                  href="https://catch-inc.org"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-[#d8ebe7] bg-[#f7fcfb] px-3 py-2.5 text-sm font-medium text-[#2d7a6e] transition hover:bg-[#eef8f7]"
                >
                  CATCH website
                </a>
              </li>
            </ul>
            {resList.length > 0 && (
              <div className="mt-5 border-t border-zinc-100 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Recent resources</p>
                <ul className="mt-2 space-y-1.5">
                  {resList.slice(0, 4).map((r) => (
                    <li key={r.id}>
                      {r.file_url ? (
                        <a
                          href={r.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-sm text-[#3d9488] underline decoration-[#3d9488]/30 underline-offset-2 hover:text-[#4AA89A]"
                        >
                          {r.title}
                        </a>
                      ) : (
                        <span className="block truncate text-sm text-zinc-500">{r.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
