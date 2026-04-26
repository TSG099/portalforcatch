"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import type { Role } from "@/types/database";
import { createSupabaseBrowserClient } from "@/lib/supabase";

function EyeIcon({ off }: { off?: boolean }) {
  if (off) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectAfterLogin = searchParams.get("redirect") ?? "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(userError?.message ?? "Session not found after sign-in.");
      setLoading(false);
      return;
    }

    console.log("[login] user", user);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.role) {
      setError(profileError?.message ?? "Profile not found for this user.");
      setLoading(false);
      return;
    }

    console.log("[login] profile", profile);
    console.log("[login] chapter_id", profile.chapter_id ?? null);

    const role = profile.role as Role;

    if (redirectAfterLogin && redirectAfterLogin.startsWith("/") && !redirectAfterLogin.startsWith("//")) {
      router.push(redirectAfterLogin);
      return;
    }

    if (role === "admin") {
      router.push("/admin");
      return;
    }

    if (!profile.chapter_id) {
      router.push("/select-chapter");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF7E3] md:flex-row">
      <section
        className="relative flex min-h-[280px] flex-1 flex-col text-white md:min-h-screen md:w-1/2 md:max-w-[50%]"
        style={{
          background: "linear-gradient(145deg, #5DBAAB 0%, #4AA89A 50%, #3d9488 100%)",
        }}
      >
        <div className="relative flex flex-1 flex-col justify-center px-8 py-12 md:px-14 md:py-16 lg:px-16">
          <div className="mx-auto max-w-md text-center md:text-left">
            <div className="flex flex-col items-center gap-3 md:items-start">
              <Image
                src="/catch-logo.png"
                alt="CATCH"
                width={1080}
                height={1080}
                className="h-20 w-20 shrink-0 object-contain drop-shadow-md md:h-24 md:w-24"
                priority
              />
              <h1 className="text-3xl font-semibold tracking-tight md:text-[2rem]">
                <span className="tracking-[0.02em]">CATCH</span> Chapter Portal
              </h1>
            </div>
            <p className="mt-6 text-base leading-relaxed text-white/90">
              We strive to <span className="font-medium text-white">&ldquo;catch&rdquo;</span> the children who fall
              through the cracks of the mainstream toy market.
            </p>
          </div>
        </div>
        <p className="mx-auto max-w-md px-8 pb-8 text-center text-[11px] text-white/70 md:px-14 md:text-left lg:px-16">
          © {new Date().getFullYear()} CATCH
        </p>
      </section>

      <section
        className="flex flex-1 flex-col justify-center px-6 py-12 text-[#3F3A36] md:w-1/2 md:max-w-[50%] md:px-12 md:py-16 lg:px-20"
        style={{ colorScheme: "light" }}
      >
        <div className="mx-auto w-full max-w-[420px]">
          <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
          <p className="mt-2 text-sm text-zinc-500">Use your chapter email to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="text-xs font-medium text-zinc-500">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="catch-field mt-2 w-full px-4 py-3 text-sm placeholder:text-zinc-400"
                placeholder="you@chapter.org"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="login-password" className="text-xs font-medium text-zinc-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#3d9488] transition hover:text-[#4AA89A]"
                >
                  {showPassword ? "Hide" : "Show"}
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="catch-field mt-2 w-full px-4 py-3 text-sm"
              />
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#3d9488] underline decoration-[#3d9488]/35 underline-offset-[3px] hover:text-[#4AA89A] hover:decoration-[#4AA89A]/45"
                >
                  Forgot password
                </Link>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-100/90 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              data-catch-primary="true"
              className="w-full cursor-pointer appearance-none px-4 py-3.5 text-sm font-medium transition"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-zinc-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#3d9488] underline decoration-[#3d9488]/35 underline-offset-[3px] hover:text-[#4AA89A]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFF7E3] text-sm text-zinc-500">
          Loading…
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
