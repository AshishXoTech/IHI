"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/Logo";

export function JudgeNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-14 border-b border-gray-800 bg-black/90 px-4 backdrop-blur md:h-16 md:px-6">
      <div className="mx-auto flex h-full max-w-container items-center justify-between">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="inline-flex transition-opacity hover:opacity-80">
            <Logo size="sm" priority invertPlate />
          </Link>
          <div className="hidden sm:flex h-5 w-px bg-gray-800" />
          <span className="hidden sm:inline-block font-body text-sm font-semibold uppercase tracking-wider text-gray-400">
            Evaluation Portal
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-500 md:flex pr-4 border-r border-gray-800">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Live
          </div>
          
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-gray-700 bg-transparent px-3 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:border-gray-500 hover:text-white"
          >
            End Session
          </button>
        </div>

      </div>
    </nav>
  );
}