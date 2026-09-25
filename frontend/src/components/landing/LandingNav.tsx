"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-gray-200/80 bg-white/90 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12">
        
        {/* ── Premium Logo Block ── */}
        <Link href="/" className="group flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-1.5">
            {/* Opening brace */}
            <span className="font-display text-[1.75rem] font-black leading-none text-gray-300 transition-colors group-hover:text-gray-400">
              {"{"}
            </span>

            {/* I H I — spaced, shadowed, distinct colors */}
            <div className="flex items-baseline gap-[3px]">
              <span
                className="font-display text-[2rem] font-black leading-none tracking-tight transition-transform group-hover:-translate-y-0.5"
                style={{
                  color: "#E4574C",
                  textShadow: "2.5px 2.5px 0 #B8362B",
                }}
              >
                I
              </span>
              <span
                className="font-display text-[2rem] font-black leading-none tracking-tight transition-transform group-hover:-translate-y-0.5"
                style={{
                  color: "#2FB67C",
                  textShadow: "2.5px 2.5px 0 #1E875A",
                }}
              >
                H
              </span>
              <span
                className="font-display text-[2rem] font-black leading-none tracking-tight transition-transform group-hover:-translate-y-0.5"
                style={{
                  color: "#3E6FF3",
                  textShadow: "2.5px 2.5px 0 #2A50BD",
                }}
              >
                I
              </span>
            </div>

            {/* Closing brace */}
            <span className="font-display text-[1.75rem] font-black leading-none text-gray-300 transition-colors group-hover:text-gray-400">
              {"}"}
            </span>
          </div>

          {/* Tiny gold accent line under logo */}
          <div className="ml-1 h-[2px] w-0 rounded-full bg-gold transition-all duration-500 group-hover:w-[72px]" />
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-9 md:flex">
          {[
            { label: "Problem", href: "#problem" },
            { label: "Solution", href: "#solution" },
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative font-body text-[13px] font-semibold tracking-wide text-gray-600 transition-colors hover:text-black after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ── CTAs ── */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden font-body text-[13px] font-semibold text-gray-600 transition-colors hover:text-black sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-black px-5 py-2.5 font-body text-[13px] font-bold tracking-wide text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-900 hover:shadow-lg"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}