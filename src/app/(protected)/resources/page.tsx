import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Resource } from "@/types/database";
import Link from "next/link";

async function getResources(): Promise<Resource[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Resource[];
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const resources = await getResources();
  const categories = Array.from(
    new Set(resources.map((r) => r.category))
  ).sort();
  const selected = searchParams?.category;
  const visibleResources = selected
    ? resources.filter((r) => r.category === selected)
    : resources;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Resources
        </h1>
        <p className="text-sm text-zinc-500">
          Shared templates, guides, and safety documentation for all
          chapters.
        </p>
      </header>

      <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/resources"
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
              !selected
                ? "border-[#e85a3d] bg-[#FF6B4A] text-white shadow-sm hover:bg-[#FF5738]"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/resources?category=${encodeURIComponent(cat)}`}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                selected === cat
                  ? "border-[#e85a3d] bg-[#FF6B4A] text-white shadow-sm hover:bg-[#FF5738]"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-sm text-zinc-500">
            No resources published yet.
          </p>
        )}

        {(selected ? [selected] : categories).map((cat) => (
          <section key={cat} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {cat}
            </h2>
            <div className="space-y-2">
              {visibleResources
                .filter((r) => r.category === cat)
                .map((r) => (
                  <article
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {r.title}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {r.description}
                      </p>
                    </div>
                    {r.file_url && (
                      <a
                        href={r.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-[#e85a3d] bg-[#FF6B4A] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#FF5738]"
                      >
                        Open
                      </a>
                    )}
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

