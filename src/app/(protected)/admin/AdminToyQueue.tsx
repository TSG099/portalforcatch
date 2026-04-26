"use client";

import { useEffect, useMemo, useState } from "react";
import type { ToySubmission } from "@/types/database";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  rejected: "bg-red-50 text-red-700 border border-red-100",
  needs_revision: "bg-blue-50 text-blue-700 border border-blue-100",
};

/** Slightly longer than server Supabase timeouts + DB round-trips */
const FETCH_MS = 60_000;

function reviewFetchSignal(): AbortSignal {
  if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
    return AbortSignal.timeout(FETCH_MS);
  }
  const c = new AbortController();
  setTimeout(() => c.abort(), FETCH_MS);
  return c.signal;
}

export default function AdminToyQueue({
  submissions,
}: {
  submissions: ToySubmission[];
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  /** Hide rows immediately so the UI doesn’t depend on RSC refresh. */
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const visible = new Set((submissions ?? []).map((s) => String(s.id)));
    setHiddenIds((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        if (visible.has(id)) next.add(id);
      });
      return next;
    });
  }, [submissions]);

  const list = useMemo(
    () =>
      (submissions ?? []).filter((s) => !hiddenIds.has(String(s.id))),
    [submissions, hiddenIds]
  );

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected" | "needs_revision"
  ) => {
    setError(null);
    setBusyId(id);
    const pathId = encodeURIComponent(String(id));
    try {
      const res = await fetch(`/api/admin/toy-submissions/${pathId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          admin_feedback:
            status === "needs_revision" || status === "rejected"
              ? feedback[id] ?? null
              : null,
        }),
        signal: reviewFetchSignal(),
      });

      const payload = (await res.json().catch(() => null)) as
        | { error?: string; ok?: boolean }
        | null;

      if (!res.ok) {
        throw new Error(payload?.error ?? `Request failed (${res.status})`);
      }

      setHiddenIds((prev) => new Set(prev).add(String(id)));
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") {
        setError(
          "Request timed out. Confirm NEXT_PUBLIC_SUPABASE_URL matches your project, .env.local has a valid SUPABASE_SERVICE_ROLE_KEY, restart npm run dev, and check the terminal for errors."
        );
      } else {
        setError(e instanceof Error ? e.message : "Unexpected error.");
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-600">
        {list.length} item(s) awaiting review.
      </p>
      {error && (
        <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {list.length === 0 ? (
        <p className="text-sm text-zinc-600">No pending submissions.</p>
      ) : (
        list.map((sub) => (
          <article
            key={sub.id}
            className="rounded-xl border border-[#F2E6CF] bg-[#FFFDF8] p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-base font-semibold text-[#3F3A36]">
                    {sub.toy_name}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[sub.status] ?? ""}`}
                  >
                    {sub.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  Difficulty: {sub.difficulty} • Submitted{" "}
                  {new Date(sub.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-zinc-700">
                  {sub.instructions}
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 md:max-w-[360px]">
                {sub.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element -- external Supabase URLs
                  <img
                    src={sub.image_url}
                    alt={`${sub.toy_name} preview`}
                    className="h-24 w-full rounded-lg border border-[#F2E6CF] object-cover"
                    loading="lazy"
                  />
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === sub.id}
                    onClick={() => updateStatus(sub.id, "approved")}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-[#e85a3d] bg-[#FF6B4A] px-3 text-sm font-semibold text-white shadow-sm hover:bg-[#FF5738] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === sub.id}
                    onClick={() => updateStatus(sub.id, "rejected")}
                    className="inline-flex h-9 items-center justify-center rounded-full border-2 border-[#FF5738] bg-white px-3 text-sm font-semibold text-[#c2410c] hover:bg-orange-50 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-600">
                    Note to submitter (optional — shown on reject or revision)
                  </label>
                  <textarea
                    rows={2}
                    value={feedback[sub.id] ?? ""}
                    onChange={(e) =>
                      setFeedback((prev) => ({
                        ...prev,
                        [sub.id]: e.target.value,
                      }))
                    }
                    className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/25"
                  />
                  <button
                    type="button"
                    disabled={busyId === sub.id}
                    onClick={() => updateStatus(sub.id, "needs_revision")}
                    className="inline-flex h-9 w-full items-center justify-center rounded-full border border-[#e85a3d] bg-[#FF6B4A] px-3 text-sm font-semibold text-white shadow-sm hover:bg-[#FF5738] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Request revision
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
