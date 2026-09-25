import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { SignupForm } from "@/components/auth/SignupForm";
import { IhiWordmarkBg } from "@/components/auth/IhiWordmarkBg";
import { GlobalStatsCard } from "@/components/auth/GlobalStatsCard";

export const metadata = {
  title: "Create Account",
  description: "Sign up as a participant or organizer for IHI.",
};

export default function SignupPage() {
  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Decorative Red/Green/Blue background (reused from Step 4) */}
      <IhiWordmarkBg />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        {/* ── Left: Brand + Form ── */}
        <section className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mb-10">
            <Logo href="/" size="md" priority />
          </div>

          <Suspense
            fallback={
              <div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-gray-100" />
            }
          >
            <SignupForm />
          </Suspense>

          <p className="mt-12 font-body text-xs text-gray-400">
            Protected by httpOnly JWT ·{" "}
            <Link href="/" className="underline-offset-2 hover:text-black hover:underline">
              Back to home
            </Link>
          </p>
        </section>

        {/* ── Right: Impact Stats (Desktop) ── */}
        <section className="hidden flex-1 items-center justify-center border-l border-gray-100 bg-gray-50/80 px-10 py-16 lg:flex">
          <GlobalStatsCard />
        </section>
      </div>
    </div>
  );
}