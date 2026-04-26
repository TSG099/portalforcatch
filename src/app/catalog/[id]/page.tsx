import Link from "next/link";
import { getApprovedToyByIdForCatalog } from "@/lib/approvedToyCatalog";
import { catalogDifficultyLabel } from "@/lib/catalogUi";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AdminCatalogDeleteButton from "./AdminCatalogDeleteButton";

export const dynamic = "force-dynamic";

export default async function ToyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: roleRow } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null as { role?: string } | null };
  const isAdmin = roleRow?.role === "admin";

  const { toy, errorMessage } = await getApprovedToyByIdForCatalog(
    decodeURIComponent(id).trim()
  );
  if (errorMessage || !toy) notFound();

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link
          href="/catalog"
          className="font-medium text-[#4AA89A] transition hover:text-[#3d9488] hover:underline"
        >
          ← Toy catalog
        </Link>
      </nav>

      <header className="overflow-hidden rounded-3xl border border-[#F2E6CF] bg-white shadow-sm ring-1 ring-[#F2E6CF]/60">
        <div
          className="h-2 w-full"
          style={{
            background: "linear-gradient(90deg, #5DBAAB 0%, #4AA89A 50%, #FF6B4A 100%)",
          }}
          aria-hidden
        />
        <div className="px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#4AA89A]">
                Approved adaptation
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#3F3A36] md:text-3xl">
                {toy.toy_name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #FF6B4A 0%, #FF5738 100%)",
                  }}
                >
                  {catalogDifficultyLabel(toy.difficulty)}
                </span>
                <span className="inline-flex items-center rounded-full border border-[#B9E8EA] bg-[#eef8f7] px-3 py-1 text-xs font-medium text-[#3F3A36]">
                  In catalog
                </span>
              </div>
            </div>
            {toy.image_url && (
              <div className="mx-auto w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border border-[#F2E6CF] bg-[#f5f6f8] shadow-inner md:mx-0 md:max-w-[280px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={toy.image_url}
                  alt={toy.toy_name}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <section className="space-y-5 md:col-span-2">
          {!toy.image_url && (
            <div className="rounded-2xl border border-dashed border-[#F2E6CF] bg-white py-12 text-center text-sm text-zinc-500 shadow-sm ring-1 ring-[#F2E6CF]/80">
              No reference image for this entry.
            </div>
          )}

          <div className="rounded-2xl border border-[#F2E6CF] bg-white p-5 shadow-sm ring-1 ring-zinc-200/40 md:p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[#3F3A36]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef8f7] text-base">
                📋
              </span>
              Materials
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
              {toy.materials || "No materials listed."}
            </p>
          </div>

          <div className="rounded-2xl border border-[#F2E6CF] bg-white p-5 shadow-sm ring-1 ring-zinc-200/40 md:p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-[#3F3A36]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF3D6] text-base">
                ✏️
              </span>
              Instructions
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
              {toy.instructions || "No instructions provided."}
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl border border-[#F2E6CF] bg-white p-5 shadow-sm ring-1 ring-zinc-200/40">
            <h2 className="text-sm font-bold text-[#3F3A36]">Safety notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
              {toy.safety_notes || "None provided."}
            </p>
          </div>

          {(toy.video_url || toy.file_url) && (
            <div className="space-y-4 rounded-2xl border border-[#F2E6CF] bg-white p-5 shadow-sm ring-1 ring-zinc-200/40">
              <h2 className="text-sm font-bold text-[#3F3A36]">Media & files</h2>
              {toy.video_url && (
                <div className="space-y-2">
                  <video
                    src={toy.video_url}
                    controls
                    className="w-full max-h-56 rounded-xl border border-[#F2E6CF] bg-black/5"
                    playsInline
                  />
                  <a
                    href={toy.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm font-semibold text-[#FF5738] hover:text-[#FF6B4A] hover:underline"
                  >
                    Open video in new tab →
                  </a>
                </div>
              )}
              {toy.file_url && (
                <a
                  href={toy.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#e85a3d] bg-[#FF6B4A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#FF5738]"
                >
                  Download attachment
                </a>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm ring-1 ring-red-100/70">
              <h2 className="text-sm font-bold text-[#3F3A36]">Admin</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Remove this approved entry from the shared catalog.
              </p>
              <div className="mt-4">
                <AdminCatalogDeleteButton id={String(toy.id)} toyName={toy.toy_name} />
              </div>
            </div>
          )}

          <Link
            href="/catalog"
            className="flex w-full items-center justify-center rounded-full border-2 border-[#4AA89A] bg-white py-3 text-sm font-semibold text-[#3d9488] transition hover:bg-[#eef8f7]"
          >
            Back to catalog
          </Link>
        </section>
      </div>
    </div>
  );
}
