"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25z"
      />
    </svg>
  );
}

function IconCatalog({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v15.128A9 9 0 009 18c2.305 0 4.408.867 6 2.292m0-14.042A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v15.128a8.997 8.997 0 01-6 2.292m0-14.042v14.042"
      />
    </svg>
  );
}

function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

function IconFolder({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
      />
    </svg>
  );
}

const nav = [
  { href: "/dashboard", label: "Dashboard", Icon: IconDashboard },
  { href: "/catalog", label: "Toy catalog", Icon: IconCatalog },
  { href: "/submit-toy", label: "Submit toy", Icon: IconUpload },
  { href: "/my-submissions", label: "My submissions", Icon: IconList },
  { href: "/resources", label: "Resources", Icon: IconFolder },
] as const;

function navActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  isAdmin: boolean;
};

export function ChapterSidebar({ isAdmin }: Props) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[#5c5854] transition ${
      active
        ? "bg-[#eef8f7] text-[#3d9488] shadow-[inset_0_0_0_1px_rgba(74,168,154,0.25)]"
        : "hover:bg-zinc-100 hover:text-[#3F3A36]"
    }`;

  return (
    <aside className="flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-[28px] border border-white/90 bg-white/95 py-5 shadow-[0_8px_40px_rgba(63,58,54,0.07)] backdrop-blur-md md:w-[84px] md:py-6">
      <Link
        href="/dashboard"
        className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 p-1 shadow-[0_2px_8px_rgba(74,168,154,0.25)] ring-1 ring-white/80 md:h-[52px] md:w-[52px]"
        aria-label="CATCH home"
      >
        <Image
          src="/catch-logo.png"
          alt="CATCH"
          width={1080}
          height={1080}
          className="h-full w-full object-contain"
          priority
        />
      </Link>

      <nav className="flex w-full flex-1 flex-col items-center gap-1.5 px-1 pt-2">
        {nav.map(({ href, label, Icon }) => {
          const active = navActive(pathname, href);
          return (
            <Link key={href} href={href} className={linkClass(active)} aria-label={label} title={label}>
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={linkClass(pathname.startsWith("/admin"))}
            aria-label="Admin"
            title="Admin"
          >
            <IconShield className="h-5 w-5" />
          </Link>
        )}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-1 border-t border-zinc-100 pt-3">
        <SignOutButton
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-[#5c5854] transition hover:bg-red-50 hover:text-red-600"
          aria-label="Log out"
          title="Log out"
        >
          <IconLogout className="h-5 w-5" />
        </SignOutButton>
      </div>
    </aside>
  );
}
