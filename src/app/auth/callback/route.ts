import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { SerializeOptions } from "cookie";
import { NextResponse, type NextRequest } from "next/server";
import { resolvePublicSupabaseEnv } from "@/lib/supabaseEnv";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");
  const { url: supabaseUrl, anonKey: supabaseAnonKey } =
    resolvePublicSupabaseEnv();

  const safeNext =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";

  const response = NextResponse.redirect(new URL(safeNext, requestUrl.origin));

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: SerializeOptions) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: SerializeOptions) {
        response.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const login = new URL("/login", requestUrl.origin);
      login.searchParams.set("error", encodeURIComponent(error.message));
      return NextResponse.redirect(login);
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=session", requestUrl.origin));
  }

  return response;
}
