"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { BlueWhaleTrack } from "@/data/blueWhaleTracks";

const WhaleMap = dynamic(
  () => import("@/components/WhaleMap").then((m) => m.WhaleMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[min(28rem,70vh)] w-full items-center justify-center rounded-xl border border-sky-800/50 bg-slate-900/60 text-sm text-sky-300/80"
        role="status"
        aria-live="polite"
      >
        Loading map…
      </div>
    ),
  },
);

type TrackingExplorerProps = {
  tracks: BlueWhaleTrack[];
};

export function TrackingExplorer({ tracks }: TrackingExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div>
        <WhaleMap tracks={tracks} selectedId={selectedId} />
        <p className="mt-3 text-xs text-sky-400/80">
          Map data © OpenStreetMap contributors. Tracks are sample geometry for
          demonstration.
        </p>
      </div>
      <aside className="flex flex-col gap-3 rounded-xl border border-sky-800/40 bg-slate-900/40 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-300/90">
          Tracks
        </h2>
        <p className="text-xs text-sky-200/70">
          Select a track to emphasize it on the map. Click points for dates and
          context.
        </p>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                selectedId === null
                  ? "border-sky-500/60 bg-sky-950/50 text-white"
                  : "border-sky-800/40 bg-slate-950/40 text-sky-200 hover:border-sky-600/50"
              }`}
            >
              All tracks
            </button>
          </li>
          {tracks.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  selectedId === t.id
                    ? "border-sky-500/60 bg-sky-950/50 text-white"
                    : "border-sky-800/40 bg-slate-950/40 text-sky-200 hover:border-sky-600/50"
                }`}
              >
                <span className="block font-medium">{t.region}</span>
                <span className="mt-0.5 block text-xs text-sky-300/70">
                  {t.individualLabel}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
