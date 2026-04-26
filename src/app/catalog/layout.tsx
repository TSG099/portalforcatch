import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { PortalAppShell } from "@/components/chapter/PortalAppShell";
import { getPortalProfile } from "@/lib/portalProfile";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

async function CatalogNav() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-20 border-b border-[#ebe5dc]/90 bg-[#fffcf5]/90 backdrop-blur-md">
      <div
        className="h-0.5 w-full"
        style={{
          background: "linear-gradient(90deg, #5DBAAB 0%, #4AA89A 35%, #FF6B4A 100%)",
        }}
        aria-hidden
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/catch-logo.png"
            alt="CATCH"
            width={1080}
            height={1080}
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="text-[15px] font-semibold tracking-tight text-[#3F3A36] transition group-hover:text-[#3d9488]">
            Chapter Portal
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-[13px] font-medium">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-2.5 py-2 text-[#3d9488] transition hover:bg-[#eef8f7]/80"
              >
                Dashboard
              </Link>
              <Link
                href="/submit-toy"
                className="rounded-lg px-2.5 py-2 text-[#3d9488] transition hover:bg-[#eef8f7]/80"
              >
                Submit toy
              </Link>
              <Link
                href="/my-submissions"
                className="rounded-lg px-2.5 py-2 text-[#3d9488] transition hover:bg-[#eef8f7]/80"
              >
                My submissions
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-2.5 py-2 text-[#3F3A36] transition hover:bg-[#fff3d6]/60"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                data-catch-primary="true"
                className="rounded-full px-4 py-2 text-sm font-medium text-white transition"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function CatalogNavFallback() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#ebe5dc]/90 bg-[#fffcf5]/95">
      <div className="h-0.5 w-full bg-[#4AA89A]" aria-hidden />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        <div className="h-10 w-28 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-9 w-48 animate-pulse rounded-full bg-zinc-100" />
      </div>
    </header>
  );
}

function PublicCatalogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF7E3] text-[#3F3A36]">
      <Suspense fallback={<CatalogNavFallback />}>
        <CatalogNav />
      </Suspense>
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">{children}</div>
      <footer className="mx-auto mt-6 max-w-6xl px-4 pb-10 md:px-6">
        <div className="rounded-xl border border-[#ebe5dc]/90 bg-white/70 px-4 py-5 text-center">
          <p className="text-[11px] leading-relaxed text-zinc-500">
            Approved toy adaptations are shared across all CATCH university chapters.
            <br />
            <a
              href="https://catch-inc.org"
              className="mt-1 inline-block font-medium text-[#3d9488] underline decoration-[#3d9488]/35 underline-offset-[3px] hover:text-[#4AA89A]"
            >
              Learn more at CATCH
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default async function CatalogLayout({ children }: { children: ReactNode }) {
  const profile = await getPortalProfile();

  if (profile) {
    return <PortalAppShell profile={profile}>{children}</PortalAppShell>;
  }

  return <PublicCatalogLayout>{children}</PublicCatalogLayout>;
}
