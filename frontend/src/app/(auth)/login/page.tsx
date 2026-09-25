import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "@/components/auth/LoginForm";
import { IhiWordmarkBg } from "@/components/auth/IhiWordmarkBg";
import { SystemStatusCard } from "@/components/auth/SystemStatusCard";

export const metadata = {
  title: "Sign in",
  description: "Sign in to IHI as a participant, organizer, or judge.",
};

/**
 * Premium split login — MLH-inspired.
 * Left: form · Right: status (desktop).
 * Background: grid + IHI wordmark (red/green/blue glyphs only).
 * UI chrome: white / black / gold only.
 */
export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-white text-black">
      <IhiWordmarkBg />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        {/* ── Left: brand + form ── */}
        <section className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mb-10">
            {/* Logo owns link OR parent — not both */}
            <Logo href="/" size="md" priority />
          </div>

          <Suspense
            fallback={
              <div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-gray-100" />
            }
          >
            <LoginForm />
          </Suspense>

          <p className="mt-12 font-body text-xs text-gray-400">
            Protected by httpOnly JWT ·{" "}
            <Link href="/" className="underline-offset-2 hover:text-black hover:underline">
              Back to home
            </Link>
          </p>
        </section>

        {/* ── Right: status rail (desktop) ── */}
        <section className="hidden flex-1 items-center justify-center border-l border-gray-100 bg-gray-50/80 px-10 py-16 lg:flex">
          <SystemStatusCard />
        </section>
      </div>
    </div>
  );
}