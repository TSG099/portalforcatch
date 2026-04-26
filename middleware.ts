import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { SerializeOptions } from "cookie";
import { resolvePublicSupabaseEnv } from "@/lib/supabaseEnv";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const { url: supabaseUrl, anonKey: supabaseAnonKey } =
    resolvePublicSupabaseEnv();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: SerializeOptions) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: SerializeOptions) {
        res.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = req.nextUrl;
  const pathname = url.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");
  const isAdminRoute = pathname.startsWith("/admin");
  const isSelectChapterRoute = pathname.startsWith("/select-chapter");
  const isCatalogRoute = pathname.startsWith("/catalog");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/submit-toy") ||
    pathname.startsWith("/my-submissions") ||
    pathname.startsWith("/resources") ||
    pathname.startsWith("/admin") ||
    isSelectChapterRoute;

  const isMemberAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/submit-toy") ||
    pathname.startsWith("/my-submissions") ||
    pathname.startsWith("/resources");

  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", url.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const needsProfileGate =
    Boolean(user) &&
    !isCatalogRoute &&
    (isAuthRoute || isAdminRoute || isMemberAppRoute || isSelectChapterRoute);

  type ProfileGate = {
    role: string | null;
    chapter_id: string | null;
  };
  let profileGate: ProfileGate | null = null;
  if (needsProfileGate && user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, chapter_id")
      .eq("id", user.id)
      .single();
    if (!profileError && profile) {
      profileGate = {
        role: profile.role ?? null,
        chapter_id: profile.chapter_id ?? null,
      };
    }
  }

  if (user && isAuthRoute) {
    if (!profileGate?.role) {
      return res;
    }
    if (profileGate.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (!profileGate.chapter_id) {
      return NextResponse.redirect(new URL("/select-chapter", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (user && isAdminRoute) {
    if (!profileGate?.role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (profileGate.role !== "admin") {
      if (!profileGate.chapter_id) {
        return NextResponse.redirect(new URL("/select-chapter", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (user && isSelectChapterRoute && profileGate) {
    if (profileGate.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (profileGate.chapter_id) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (user && isMemberAppRoute) {
    if (!profileGate?.role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (profileGate.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (!profileGate.chapter_id) {
      return NextResponse.redirect(new URL("/select-chapter", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/forgot-password",
    "/dashboard/:path*",
    "/catalog/:path*",
    "/submit-toy",
    "/my-submissions",
    "/resources/:path*",
    "/admin/:path*",
    "/select-chapter",
  ],
};
