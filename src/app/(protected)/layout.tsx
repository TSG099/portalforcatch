import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { PortalAppShell } from "@/components/chapter/PortalAppShell";
import { getPortalProfile } from "@/lib/portalProfile";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getPortalProfile();

  if (!profile) {
    redirect("/login");
  }

  console.log("[protected layout] profile", profile);
  console.log("[protected layout] chapter_id", profile.chapter_id ?? null);

  return <PortalAppShell profile={profile}>{children}</PortalAppShell>;
}
