import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conservation | Blue Whale Atlas",
  description:
    "Why blue whale conservation matters and how movement science supports protection.",
};

const priorities = [
  {
    title: "Ship strikes & shipping lanes",
    body: "Blue whales feed and travel near busy coasts. Slower speeds, adjusted routes, and seasonal protections reduce lethal collisions.",
  },
  {
    title: "Underwater noise",
    body: "Chronic noise masks the low-frequency calls blue whales use over long distances. Quieter operations and protected quiet periods help.",
  },
  {
    title: "Prey & climate shifts",
    body: "Their diet depends on dense patches of krill. Ocean warming and ecosystem change can move prey; conservation must follow the science.",
  },
  {
    title: "Entanglement & pollutants",
    body: "Fishing gear and contaminants add stress to already vulnerable populations. Gear innovation and monitoring complement habitat safeguards.",
  },
] as const;

export default function ConservationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Conservation comes first
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-sky-200/85">
        Blue whales are a global symbol of ocean health—and a reminder that
        recovery is possible when we treat habitat seriously. Tracking where
        they go turns abstract policy into maps, speed limits, and protected
        areas that match real animal behavior.
      </p>

      <section className="mt-10 space-y-6" aria-labelledby="priorities-heading">
        <h2
          id="priorities-heading"
          className="text-xl font-semibold text-sky-100"
        >
          Threats movement science helps address
        </h2>
        <ul className="space-y-4">
          {priorities.map((p) => (
            <li
              key={p.title}
              className="rounded-xl border border-sky-800/45 bg-slate-900/35 px-5 py-4"
            >
              <h3 className="font-medium text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sky-200/80">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-emerald-800/40 bg-emerald-950/20 px-5 py-5">
        <h2 className="text-lg font-semibold text-emerald-100">
          How you can help
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-emerald-100/85">
          <li>Support organizations that fund marine mammal research and rescue.</li>
          <li>Choose sustainable seafood and gear-conscious fisheries when you can.</li>
          <li>Advocate for science-based shipping and noise rules in whale habitat.</li>
          <li>Share accurate information—hope and urgency both matter.</li>
        </ul>
      </section>

      <p className="mt-10 text-center">
        <Link
          href="/tracking"
          className="inline-flex rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
        >
          View the movement map
        </Link>
      </p>
    </div>
  );
}
