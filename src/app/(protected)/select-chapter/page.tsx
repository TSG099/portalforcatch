"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Chapter } from "@/types/database";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function SelectChapterPage() {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("role, chapter_id")
        .eq("id", user.id)
        .single();

      console.log("[select-chapter] user", user.id);
      console.log("[select-chapter] profile", profile);

      if (cancelled) return;
      if (pErr || !profile) {
        setError(pErr?.message ?? "Profile not found.");
        setLoading(false);
        return;
      }

      if (profile.role === "admin") {
        router.replace("/admin");
        return;
      }
      if (profile.chapter_id) {
        router.replace("/dashboard");
        return;
      }

      const { data: rows, error: cErr } = await supabase
        .from("chapters")
        .select("*")
        .eq("status", "approved")
        .order("university_name", { ascending: true });

      if (cancelled) return;
      if (cErr) {
        setError(cErr.message);
        setLoading(false);
        return;
      }
      setChapters((rows ?? []) as Chapter[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedId) {
      setError("Choose a chapter.");
      return;
    }
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const { error: upErr } = await supabase
      .from("profiles")
      .update({ chapter_id: selectedId })
      .eq("id", user.id);

    if (upErr) {
      setError(upErr.message);
      setSaving(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    console.log("[select-chapter] updated profile", profile);
    console.log("[select-chapter] chapter_id", profile?.chapter_id);

    router.replace("/dashboard");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
        Loading chapters…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#3F3A36]">Select your chapter</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Your account is not linked to a chapter yet. Pick yours to continue.
        </p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div>
          <label htmlFor="chapter" className="text-xs font-medium text-zinc-500">
            Chapter
          </label>
          <select
            id="chapter"
            required
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900"
          >
            <option value="">— Choose —</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.university_name} — {c.chapter_name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          data-catch-primary="true"
          className="w-full rounded-full px-4 py-3 text-sm font-semibold shadow-md disabled:opacity-60"
        >
          {saving ? "Saving…" : "Continue to dashboard"}
        </button>
      </form>
    </div>
  );
}
