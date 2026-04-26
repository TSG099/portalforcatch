import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/tracking", label: "Movement map" },
  { href: "/conservation", label: "Conservation" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-sky-900/40 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-sky-100 group-hover:text-white">
            Blue Whale Atlas
          </span>
          <span className="text-xs text-sky-400/90">
            Movement & conservation focus
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1 sm:gap-2" aria-label="Main">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-sky-200/90 transition-colors hover:bg-sky-950/80 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
