import Link from "next/link";
import type { ReactNode } from "react";
import { ChapterSidebar } from "@/components/chapter/ChapterSidebar";
import { DashboardTopBar } from "@/components/chapter/DashboardTopBar";
import type { Profile, Role } from "@/types/database";

type Props = {
  profile: Profile;
  children: ReactNode;
};

export function PortalAppShell({ profile, children }: Props) {
  const isAdmin = profile.role === "admin";

  return (
    <div className="flex min-h-screen gap-4 bg-gradient-to-br from-[#e4e9ec] via-[#eef1f4] to-[#f2f0ec] p-3 text-[#3F3A36] md:gap-6 md:p-5 lg:p-6">
      <ChapterSidebar isAdmin={isAdmin} />

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <DashboardTopBar
          name={profile.name}
          email={profile.email}
          role={profile.role as Role}
        />

        <main className="min-h-0 flex-1 overflow-y-auto pb-4">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>

        <p className="text-center text-[11px] leading-relaxed text-zinc-500">
          We strive to &ldquo;catch&rdquo; the children who fall through the cracks of the mainstream toy market.{" "}
          <Link
            href="https://catch-inc.org"
            className="text-[#3d9488] underline decoration-[#3d9488]/35 underline-offset-[3px] transition hover:text-[#4AA89A] hover:decoration-[#4AA89A]/50"
          >
            CATCH
          </Link>
        </p>
      </div>
    </div>
  );
}
