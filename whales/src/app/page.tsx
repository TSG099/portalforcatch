import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-sky-900/40">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(56,189,248,0.25),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
            Balaenoptera musculus
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Follow blue whales across the ocean—then protect where they roam.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sky-200/90">
            This site pairs an interactive movement map with a clear
            conservation lens. Understanding migration corridors and feeding
            hotspots is how we reduce ship strikes, noise, and other human
            pressures on the largest animal ever known.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/tracking"
              className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-900/30 transition hover:bg-sky-400"
            >
              Open movement map
            </Link>
            <Link
              href="/conservation"
              className="inline-flex rounded-full border border-sky-500/50 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-400 hover:bg-sky-950/50"
            >
              Why conservation matters
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:px-6">
        <article className="rounded-2xl border border-sky-800/40 bg-slate-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Track movements</h2>
          <p className="mt-2 text-sm leading-relaxed text-sky-200/75">
            Explore sample blue whale paths on a live map. Swap in real tag or
            survey data when you connect an API or research feed.
          </p>
        </article>
        <article className="rounded-2xl border border-sky-800/40 bg-slate-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">See the stakes</h2>
          <p className="mt-2 text-sm leading-relaxed text-sky-200/75">
            Shipping, noise, and climate-driven shifts in prey all intersect
            with where whales actually spend their time—maps make that visible.
          </p>
        </article>
        <article className="rounded-2xl border border-sky-800/40 bg-slate-900/30 p-6">
          <h2 className="text-lg font-semibold text-white">Act on science</h2>
          <p className="mt-2 text-sm leading-relaxed text-sky-200/75">
            Conservation is the point: movement tracking supports slower ships,
            quieter seas, and habitat protection that matches animal behavior.
          </p>
        </article>
      </section>
    </div>
  );
}
