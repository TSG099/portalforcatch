"use client";

import type { ReactNode } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function SignOutButton({
  className,
  children,
  "aria-label": ariaLabel,
  title,
}: {
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
  title?: string;
}) {
  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    // Hard navigation avoids a slow RSC refresh + “Rendering” in dev after logout.
    window.location.assign("/login");
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className={className}
      aria-label={ariaLabel}
      title={title}
    >
      {children ?? "Logout"}
    </button>
  );
}
