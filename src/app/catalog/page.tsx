import Link from "next/link";
import { listApprovedToysForCatalog } from "@/lib/approvedToyCatalog";
import { catalogDifficultyLabel } from "@/lib/catalogUi";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const { items: catalog, errorMessage, viaServiceRole } =
    await listApprovedToysForCatalog();

  return (
    <div className="space-y-10">
      <section
        className="rounded-2xl px-6 py-8 text-white sm:px-8 sm:py-9 md:px-10"
        style={{
          background: "linear-gradient(145deg, #5DBAAB 0%, #4AA89A 50%, #3d9488 100%)",
        }}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">Community</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Toy catalog</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 md:text-[15px]">
            Vetted adaptations from chapters across the network — open to everyone for inspiration. Log in to submit
            your own builds or manage your chapter.
          </p>
          {catalog.length > 0 && (
            <p className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/95">
              {catalog.length} approved adaptation{catalog.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </section>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
          <p className="font-semibold">Couldn&apos;t load catalog</p>
          <p className="mt-1 text-red-700/90">{errorMessage}</p>
        </div>
      )}

      {process.env.NODE_ENV === "development" &&
        !viaServiceRole &&
        !errorMessage &&
        catalog.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950 shadow-sm">
            <strong>Dev:</strong> Catalog reads are using the <strong>anon</strong> key. If
            approved rows exist in Supabase but don&apos;t show here, set{" "}
            <code className="rounded bg-white/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
            <code className="rounded bg-white/80 px-1">.env.local</code> and restart the dev
            server, or add an RLS policy allowing <code className="rounded bg-white/80 px-1">SELECT</code>{" "}
            on <code className="rounded bg-white/80 px-1">status = &apos;approved&apos;</code> for
            role <code className="rounded bg-white/80 px-1">anon</code>.
          </div>
        )}

      <section>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Directory</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#3F3A36]">All adaptations</h2>
            <p className="mt-1 text-sm text-zinc-500">Open a card for materials, instructions, and media.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.length === 0 && !errorMessage && (
            <div className="col-span-full rounded-xl border border-dashed border-zinc-200/90 bg-white/80 py-14 text-center">
              <p className="mx-auto max-w-sm text-sm text-zinc-500">
                No approved toys in the catalog yet. When chapter submissions are approved, they&apos;ll appear here
                for everyone to browse.
              </p>
              <Link
                href="/login"
                data-catch-primary="true"
                className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white"
              >
                Log in to submit
              </Link>
            </div>
          )}
          {catalog.map((toy, index) => {
            const featured = catalog.length > 1 && index === 1;
            return (
              <Link
                key={toy.id}
                href={`/catalog/${toy.id}`}
                className={`group flex flex-col overflow-hidden rounded-xl border bg-white transition ${
                  featured
                    ? "border-[#4AA89A] shadow-[0_0_0_1px_rgba(74,168,154,0.35)]"
                    : "border-zinc-200/80 hover:border-zinc-300"
                }`}
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#eef8f7] to-[#fff3d6]">
                  {toy.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Supabase public URLs
                    <img
                      src={toy.image_url}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:opacity-[0.97]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-300">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs font-medium text-zinc-400">No preview</span>
                    </div>
                  )}
                  <div className="absolute right-3 top-3">
                    <span
                      className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                      style={{
                        background: "linear-gradient(135deg, #FF6B4A 0%, #FF5738 100%)",
                      }}
                    >
                      {catalogDifficultyLabel(toy.difficulty)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-base font-medium text-[#3F3A36]">{toy.toy_name}</h3>
                  <p className="mt-3 border-t border-[#f2e6cf]/80 pt-3 text-xs text-zinc-500">Chapter adaptation</p>
                  <span className="mt-3 text-xs font-medium text-[#3d9488] group-hover:underline">
                    View details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
