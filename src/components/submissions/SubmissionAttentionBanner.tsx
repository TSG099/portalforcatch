"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export type AttentionItem = {
  id: string;
  toy_name: string;
  status: "rejected" | "needs_revision";
  admin_feedback: string | null;
  reviewed_at: string | null;
};

const STORAGE_KEY = "catch_dismissed_submission_alerts";

function loadDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function alertKey(item: AttentionItem): string {
  return `${item.id}:${item.reviewed_at ?? ""}`;
}

export function SubmissionAttentionBanner({
  items,
}: {
  items: AttentionItem[];
}) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    queueMicrotask(() => {
      setDismissed(loadDismissed());
    });
  }, []);

  const persistDismiss = useCallback((key: string) => {
    const next = loadDismissed();
    next.add(key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    setDismissed(next);
  }, []);

  const visible = useMemo(
    () => items.filter((item) => !dismissed.has(alertKey(item))),
    [items, dismissed]
  );

  if (visible.length === 0) return null;

  return (
    <section
      className="rounded-xl border border-amber-200/90 bg-amber-50/80 p-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-amber-950">Submission updates</h2>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/85">
            An admin reviewed one or more of your toys. Dismiss each notice when you&apos;re done.
          </p>
        </div>
        <Link
          href="/my-submissions"
          className="shrink-0 text-xs font-medium text-[#3d9488] underline decoration-[#3d9488]/35 underline-offset-[3px] hover:text-[#4AA89A]"
        >
          View all
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {visible.map((item) => {
          const key = alertKey(item);
          const isRejected = item.status === "rejected";
          return (
            <li
              key={key}
              className={`rounded-lg border px-3 py-2.5 text-sm ${
                isRejected
                  ? "border-red-200/90 bg-white text-red-950"
                  : "border-sky-200/90 bg-white text-sky-950"
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{item.toy_name}</p>
                  <p className="mt-0.5 text-xs font-medium opacity-90">
                    {isRejected
                      ? "Not approved for the shared catalog."
                      : "Revision requested — please update and resubmit when ready."}
                  </p>
                  {item.admin_feedback ? (
                    <p className="mt-2 whitespace-pre-wrap rounded-lg bg-black/[0.03] px-2 py-1.5 text-xs leading-relaxed">
                      <span className="font-semibold">Reviewer note: </span>
                      {item.admin_feedback}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs italic opacity-80">
                      No additional written feedback for this decision.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => persistDismiss(key)}
                  className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Dismiss
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
