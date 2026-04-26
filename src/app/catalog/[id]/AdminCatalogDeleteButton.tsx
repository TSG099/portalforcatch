"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  toyName: string;
};

export default function AdminCatalogDeleteButton({ id, toyName }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    setError(null);
    const ok = window.confirm(
      `Delete this catalog entry?\n\n${toyName}\n\nThis permanently deletes the row from toy_submissions.`
    );
    if (!ok) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/toy-submissions/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const payload = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok) {
        throw new Error(payload?.error ?? `Delete failed (${res.status})`);
      }

      router.push("/catalog");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void onDelete()}
        disabled={busy}
        className="inline-flex w-full items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {busy ? "Deleting…" : "Delete from catalog"}
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

