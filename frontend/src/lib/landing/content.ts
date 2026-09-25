/**
 * Static landing-page copy.
 * Centralised so components stay presentational and copy edits
 * don't force re-verification of motion/a11y logic.
 */

export const NAV_LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
] as const;

export const HERO = {
  eyebrow: "Innovative Hack Intelligence",
  headlinePlain: "The operating system for",
  headlineGradient: "modern hackathons.",
  body:
    "IHI orchestrates registrations, team formation, submissions, and judging on one deterministic timeline — so organisers ship results instead of chasing spreadsheets.",
  primaryCta: { label: "Launch an event", href: "/signup" },
  secondaryCta: { label: "See the dashboard", href: "#features" },
} as const;

export const PROBLEM = {
  eyebrow: "The problem",
  heading: "Hackathon ops shouldn't be a fire drill.",
  body:
    "Most events are held together by three spreadsheets, a Slack thread, and one exhausted organiser. Registrations drift, teams fracture at the deadline, judges score in incompatible units, and the winners' list ships hours late.",
  points: [
    {
      title: "Fragmented tooling",
      body: "Forms, docs, chat, and scoring live in four disconnected surfaces.",
    },
    {
      title: "Opaque judging",
      body: "Rubrics vary judge-to-judge; correction workflows barely exist.",
    },
    {
      title: "Last-mile chaos",
      body: "Publishing results requires manual reconciliation under time pressure.",
    },
  ],
} as const;

export const SOLUTION = {
  eyebrow: "The solution",
  heading: "One deterministic pipeline, end to end.",
  body:
    "IHI models every event as a state machine: registration → team formation → submission → judging → publish. Each stage has explicit readiness gates. Nothing advances until the data underneath it is clean.",
  pillars: [
    {
      title: "Deterministic gates",
      body: "Every stage transition is auditable and reversible.",
    },
    {
      title: "AI copilot",
      body: "Briefings surface risk signals before they become incidents.",
    },
    {
      title: "Judge-first UX",
      body: "Rubric parity enforced at the schema level, not by convention.",
    },
  ],
} as const;

export const FEATURES = {
  eyebrow: "Platform",
  heading: "Built for the operator, tuned for the participant.",
  body:
    "Every module maps to a real hackathon workflow — no generic project-management abstractions.",
  cards: [
    {
      title: "Registration health",
      body: "Live counts, drop-off signals, and eligibility validation.",
    },
    {
      title: "Team formation",
      body: "Skill-based discovery pool with join-request moderation.",
    },
    {
      title: "Submission gate",
      body: "Server-authoritative countdown; late writes are rejected atomically.",
    },
    {
      title: "Judging rubric",
      body: "Weighted criteria, correction workflow, and inter-judge parity checks.",
    },
    {
      title: "AI briefing",
      body: "Every dashboard opens with a plain-English situational summary.",
    },
    {
      title: "Publish readiness",
      body: "A single gate that blocks release until every dependency is green.",
    },
  ],
} as const;

export const HOW_IT_WORKS = {
  eyebrow: "How it works",
  heading: "From setup to podium in five stages.",
  steps: [
    { n: "01", title: "Configure event", body: "Rubric, timeline, eligibility." },
    { n: "02", title: "Open registration", body: "Live health signals from minute one." },
    { n: "03", title: "Form teams", body: "Discovery pool + moderated join flow." },
    { n: "04", title: "Judge submissions", body: "Rubric-locked scoring queue." },
    { n: "05", title: "Publish results", body: "Readiness-gated single-click release." },
  ],
} as const;

export const CTA = {
  heading: "Run your next hackathon on IHI.",
  body: "Configure an event in under ten minutes. No credit card for the pilot tier.",
  primary: { label: "Start free", href: "/signup" },
  secondary: { label: "Talk to us", href: "mailto:hello@ihi.dev" },
} as const;

export const FOOTER = {
  columns: [
    {
      heading: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Pricing", href: "#" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Contact", href: "mailto:hello@ihi.dev" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ],
} as const;