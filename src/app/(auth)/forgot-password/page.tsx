"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createSupabaseBrowserClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: origin ? `${origin}/auth/callback?next=/login` : undefined,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setMessage("If an account exists for that email, you will receive a reset link shortly.");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF7E3] px-4 py-12">
      <div
        className="w-full max-w-[420px] rounded-2xl border border-zinc-200/80 bg-white p-8 text-[#3F3A36] shadow-[0_1px_2px_rgba(63,58,54,0.05)]"
        style={{ colorScheme: "light" }}
      >
        <h1 className="text-xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Enter your email and we&apos;ll send a link to choose a new password.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="reset-email" className="text-xs font-medium text-zinc-500">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="catch-field mt-2 w-full px-4 py-3 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          {message && <p className="text-sm text-emerald-800">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            data-catch-primary="true"
            className="w-full cursor-pointer appearance-none py-3 text-sm font-medium transition"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-zinc-600">
          <Link
            href="/login"
            className="font-medium text-[#3d9488] underline decoration-[#3d9488]/35 underline-offset-[3px] hover:text-[#4AA89A]"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
