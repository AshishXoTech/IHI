// frontend/src/components/landing/LandingNav.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Problem", href: "#problem" },
    { name: "Solution", href: "#solution" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Hackathons", href: "/hackathons" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Become a Sponsor", href: "/sponsors#apply" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] transition-all"
      style={{
        backgroundColor: "var(--organizer-surface)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        
        {/* ═══════════════════════════════════════
            LEFT: Reverted Monochrome {IHI} Logo
            ═══════════════════════════════════════ */}
        <Link
          href="/"
          className="group flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span className="font-display text-2xl font-black tracking-tighter text-[var(--organizer-ink-primary)]">
            {"{IHI}"}
          </span>
          <span className="hidden sm:inline-block border-l-2 border-[var(--organizer-border)] pl-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--organizer-ink-muted)]">
            OS 2.0
          </span>
        </Link>

        {/* ═══════════════════════════════════════
            CENTER: Desktop Navigation Links (No Judge Portal)
            ═══════════════════════════════════════ */}
        <div className="hidden xl:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-secondary)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-[var(--organizer-gold-deep)] hover:underline underline-offset-4"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Medium Screen Nav */}
        <div className="hidden lg:flex xl:hidden items-center gap-4 text-xs font-mono font-bold uppercase tracking-wider text-[var(--organizer-ink-secondary)]">
          <Link href="#features" className="hover:text-[var(--organizer-gold-deep)]">Features</Link>
          <Link href="#pricing" className="hover:text-[var(--organizer-gold-deep)]">Pricing</Link>
          <Link href="/hackathons" className="hover:text-[var(--organizer-gold-deep)]">Hackathons</Link>
          <Link href="/sponsors" className="hover:text-[var(--organizer-gold-deep)]">Sponsors</Link>
        </div>

        {/* ═══════════════════════════════════════
            RIGHT: Auth & CTA
            ═══════════════════════════════════════ */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)] transition-colors hover:text-[var(--organizer-gold-deep)]"
          >
            Sign In
          </Link>

          <Link
            href="/login"
            className="group flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)] transition-all hover:-translate-y-0.5 hover:bg-[var(--organizer-gold-deep)] hover:text-white"
            style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex lg:hidden items-center justify-center border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-2"
          style={{ boxShadow: "2px 2px 0px 0px var(--organizer-ink-primary)" }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-[var(--organizer-ink-primary)]" />
          ) : (
            <Menu className="h-5 w-5 text-[var(--organizer-ink-primary)]" />
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] lg:hidden"
          >
            <div className="flex flex-col space-y-3 px-6 py-6 font-mono text-xs font-bold uppercase tracking-widest text-[var(--organizer-ink-primary)]">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-[var(--organizer-border)] pb-2 transition-colors hover:text-[var(--organizer-gold-deep)]"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] py-3 text-center"
                >
                  Sign In
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] py-3 text-center"
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}