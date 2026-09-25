"use client";

import React from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";

/**
 * PricingSection — World-class transparent tiers
 * Startup-honest. No dark patterns. Gold highlight on Professional.
 */

const PRICING_TIERS = [
  {
    name: "Community",
    price: "₹0",
    per: null,
    limit: "UP TO 500 REGISTRATIONS",
    description:
      "Ideal for university clubs, local hackathons, and community innovation events.",
    features: [
      "Registration & Team Building Hub",
      "Standard Judging Rubrics",
      "Public Leaderboard & Rankings",
      "Participant Digital Certificates",
      "Community Email Support",
    ],
    highlight: false,
    cta: "Start free",
    href: "/signup",
  },
  {
    name: "Professional",
    price: "₹4,999",
    per: "/ event",
    limit: "UP TO 6,000 REGISTRATIONS",
    description:
      "The complete operating system for large-scale institutional and national hackathons.",
    features: [
      "Everything in Community, plus:",
      "AI-Powered Submission Briefings",
      "Advanced Conflict Detection",
      "Immutable Audit Log Export",
      "Publish Readiness Security Gates",
      "Priority 24/7 Support",
    ],
    highlight: true,
    cta: "Choose Professional",
    href: "/signup",
  },
  {
    name: "Enterprise",
    price: "₹9,999",
    per: "/ event",
    limit: "6,000+ · UNLIMITED",
    description:
      "For global multi-stage mega hackathons needing SLA, compliance, and white-labeling.",
    features: [
      "Everything in Professional, plus:",
      "Dedicated Compute Node",
      "Custom SLA Guarantee (99.99%)",
      "White-labeled Platform Branding",
      "Advanced Data Sovereignty Controls",
      "Dedicated Onboarding Manager",
    ],
    highlight: false,
    cta: "Go Enterprise",
    href: "/signup",
  },
];

function CheckIcon({ gold = false }: { gold?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={clsx("mt-0.5 shrink-0", gold ? "text-gold-dark" : "text-emerald-600")}
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingSection({ className = "" }: { className?: string }) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={clsx("relative border-t border-gray-100 bg-white", className)}
    >
      {/* Soft gold ambient */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
        
        {/* ── Header ── */}
        <FadeInUp className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gold-dark">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            Pricing
          </div>

          <h2
            id="pricing-heading"
            className="mt-5 font-display text-4xl font-black tracking-tight text-black sm:text-5xl leading-[1.1]"
          >
            Predictable pricing for{" "}
            <span className="text-gradient-gold">every scale.</span>
          </h2>

          <p className="mt-4 font-body text-lg text-gray-600 leading-relaxed">
            Transparent tiers designed for event organizers. No hidden fees. No surprise charges.
          </p>
        </FadeInUp>

        {/* ── Tiers ── */}
        <StaggerContainer
          as="div"
          className="mt-16 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-8"
          staggerDelay={0.1}
        >
          {PRICING_TIERS.map((tier) => (
            <StaggerItem key={tier.name} as="div" className="flex">
              <div
                className={clsx(
                  "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300",
                  tier.highlight
                    ? "border-gold/50 shadow-[0_20px_50px_-15px_rgba(201,162,39,0.25)] md:scale-[1.03] z-10"
                    : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md"
                )}
              >
                {/* Gold top bar for highlighted tier */}
                {tier.highlight && (
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
                )}

                {/* Card head */}
                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-black">
                      {tier.name}
                    </h3>
                    {tier.highlight && (
                      <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="font-display text-4xl font-black tracking-tight text-black tabular-nums">
                      {tier.price}
                    </span>
                    {tier.per && (
                      <span className="font-body text-sm font-medium text-gray-500">
                        {tier.per}
                      </span>
                    )}
                  </div>

                  {/* Limit badge */}
                  <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-gold-dark">
                    {tier.limit}
                  </p>

                  {/* Description */}
                  <p className="mt-4 min-h-[3.5rem] font-body text-sm leading-relaxed text-gray-600">
                    {tier.description}
                  </p>

                  {/* CTA */}
                  <Link
                    href={tier.href}
                    className={clsx(
                      "mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl font-body text-sm font-bold uppercase tracking-wider transition-all duration-200",
                      tier.highlight
                        ? "bg-black text-white hover:-translate-y-0.5 hover:bg-gray-900 hover:shadow-lg"
                        : "border-2 border-gray-200 bg-white text-black hover:border-black hover:bg-gray-50"
                    )}
                  >
                    {tier.cta}
                  </Link>
                </div>

                {/* Features footer */}
                <div className="border-t border-gray-100 bg-gray-50/80 px-7 py-7 md:px-8 md:py-8">
                  <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Included Features
                  </p>
                  <ul className="space-y-3.5">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckIcon gold={tier.highlight && i === 0} />
                        <span
                          className={clsx(
                            "font-body text-sm leading-snug",
                            i === 0 && tier.name !== "Community"
                              ? "font-semibold text-black"
                              : "text-gray-600"
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom note */}
        <FadeInUp className="mt-12 text-center">
          <p className="font-mono text-xs text-gray-400">
            // All plans include magic-link judge auth · append-only scores · audit export
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}