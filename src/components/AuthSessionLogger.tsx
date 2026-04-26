"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

/**
 * Logs auth + profile for debugging (browser console only).
 */
export function AuthSessionLogger() {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        console.log("[auth debug] session", session?.user?.id ?? null);
        console.log("[auth debug] user", user);
        if (!user) return;
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (cancelled) return;
        if (error) {
          console.warn("[auth debug] profile error", error.message);
          return;
        }
        console.log("[auth debug] profile", profile);
        console.log("[auth debug] chapter_id", profile?.chapter_id ?? null);
      } catch (e) {
        console.warn("[auth debug]", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
