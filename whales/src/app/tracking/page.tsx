import type { Metadata } from "next";
import { BLUE_WHALE_TRACKS } from "@/data/blueWhaleTracks";
import { TrackingExplorer } from "@/components/TrackingExplorer";

export const metadata: Metadata = {
  title: "Movement map | Blue Whale Atlas",
  description:
    "Explore illustrative blue whale movement paths and why mapping matters for conservation.",
};

export default function TrackingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Blue whale movements
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-sky-200/85">
          Researchers use satellite tags, photo-ID, acoustics, and vessel
          surveys to understand where blue whales travel. Clear maps help
          managers protect critical habitat from shipping noise, entanglement
          risk, and other threats.
        </p>
        <div
          className="mt-4 rounded-lg border border-amber-500/30 bg-amber-950/25 px-4 py-3 text-sm text-amber-100/90"
          role="note"
        >
          <strong className="font-medium">Sample data:</strong> the paths
          shown here are simplified, illustrative tracks—not live animal
          positions. Replace this layer with your telemetry feed or a trusted
          open dataset when you connect real services.
        </div>
      </header>
      <TrackingExplorer tracks={BLUE_WHALE_TRACKS} />
    </div>
  );
}
