"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/registrations", label: "Registrations" },
  { href: "/dashboard/teams", label: "Teams" },
  { href: "/dashboard/judging", label: "Judging" },
];

export function OrganizerNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Organizer navigation"
      className="fixed inset-x-0 top-0 z-50 h-14 border-b border-ink-secondary/30 bg-tower-base/90 px-4 backdrop-blur md:h-16 md:px-6"
    >
      <div className="mx-auto flex h-full max-w-content items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            aria-label="IHI Dashboard Home"
            className="text-surface-raised transition-opacity duration-micro hover:opacity-80"
          >
            {/* Assuming Logo accepts a subtle dark-mode prop or uses currentColor */}
            <Logo size="sm" priority />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`rounded-sm px-3 py-1.5 font-body text-body-sm transition-colors duration-micro ${
                      isActive
                        ? "bg-tower-raised text-surface-raised"
                        : "text-signal-neutral hover:bg-tower-raised/50 hover:text-surface-raised"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 font-mono text-label text-signal-neutral md:flex">
            <span className="h-2 w-2 rounded-full bg-signal-good" />
            SYS_RDY
          </div>
          <button className="rounded-sm border border-ink-secondary/50 bg-tower-raised px-3 py-1 font-body text-label text-surface-raised transition-colors duration-micro hover:border-surface-raised/30">
            Event Settings
          </button>
        </div>
      </div>
    </nav>
  );
}