"use client";

import Link from "next/link";
import type { Role } from "@/types/database";

function roleLabel(role: Role): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "leader":
      return "Chapter leader";
    case "member":
    default:
      return "Chapter member";
  }
}

function initials(name: string | null, email: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "??";
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

type Props = {
  name: string | null;
  email: string | null;
  role: Role;
};

export function DashboardTopBar({ name, email, role }: Props) {
  const displayName = name?.trim() || email?.split("@")[0] || "Member";

  return (
    <header className="flex w-full justify-center px-1">
      <div className="inline-flex items-center gap-0.5 rounded-full border border-zinc-200/80 bg-white/95 px-1.5 py-1.5 shadow-[0_4px_28px_rgba(63,58,54,0.07)] backdrop-blur-md">
        <Link
          href="/catalog"
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-[#eef8f7] hover:text-[#3d9488]"
          aria-label="Browse toy catalog"
          title="Catalog"
        >
          <IconSearch className="h-5 w-5" />
        </Link>
        <Link
          href="/submit-toy"
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-[#fff5f3] hover:text-[#FF5738]"
          aria-label="Submit a toy"
          title="Submit toy"
        >
          <IconPlus className="h-5 w-5" />
        </Link>
        <span className="mx-0.5 hidden h-7 w-px bg-zinc-200 sm:block" aria-hidden />
        <div className="flex items-center gap-2.5 pl-1 pr-2 sm:pl-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-semibold text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #FF6B4A 0%, #FF5738 100%)" }}
            aria-hidden
          >
            {initials(name, email)}
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium leading-tight text-[#3F3A36]">{displayName}</p>
            <p className="truncate text-xs text-zinc-500">{roleLabel(role)}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
