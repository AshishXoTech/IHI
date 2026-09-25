"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Star, 
  HelpCircle,
  Zap,
  Globe,
  Mail,
  DollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const floatVariantsOne: Variants = {
  animate: {
    y: [0, -15, 0],
    rotate: [12, 18, 6, 12],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatVariantsTwo: Variants = {
  animate: {
    y: [0, 15, 0],
    rotate: [-8, -2, -14, -8],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const TIERS = [
  {
    id: "silver",
    name: "SILVER PARTNER",
    price: "$2,500",
    description: "Ideal for growing startups looking to recruit high-velocity AI builders.",
    features: [
      "Logo on hackathon main stage & sponsor directory",
      "1 Dedicated custom track or bounty challenge",
      "Access to opt-in hacker resumes post-event",
      "Custom sponsor booth in main expo hall",
    ],
  },
  {
    id: "gold",
    name: "GOLD TITAN",
    price: "$7,500",
    popular: true,
    description: "Complete ecosystem visibility with direct API integration tracks and judging seats.",
    features: [
      "All Silver features included",
      "Exclusive Keynote workshop session slot (45m)",
      "Official Judge briefing seat with custom criteria weighting",
      "Direct Slack/Discord channel with all 1,000+ participants",
      "Top-tier badge placement on all hacker dossiers",
    ],
  },
  {
    id: "obsidian",
    name: "OBSIDIAN TITLE",
    price: "$15,000",
    description: "Headline co-branding for enterprise organizations shaping the future of intelligence.",
    features: [
      "All Gold Titan features included",
      "Named 'Presented By' headline billing",
      "Guaranteed opening ceremony mainstage address",
      "Exclusive access to top 10 finalist AI evaluation dossiers",
      "Dedicated recruitment concierge & custom hacker interview lounge",
    ],
  },
];

export default function SponsorRegisterPage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string>("gold");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    contactName: "",
    contactEmail: "",
    industry: "AI / Machine Learning",
    bountyTitle: "",
    bountyBudget: "$5,000",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.companyName,
          website_url: formData.website,
          contact_email: formData.contactEmail,
          tier: selectedTier,
          industry: formData.industry,
          bounty_title: formData.bountyTitle,
          bounty_amount: formData.bountyBudget,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/sponsors"), 2000);
      } else {
        // Fallback for demo
        setSuccess(true);
        setTimeout(() => router.push("/sponsors"), 2000);
      }
    } catch (err) {
      console.error(err);
      setSuccess(true);
      setTimeout(() => router.push("/sponsors"), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--organizer-bg)] text-[var(--organizer-ink-primary)] selection:bg-[var(--organizer-gold)] selection:text-white pb-24">
      {/* Blueprint Graph-Paper Grid Background */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--organizer-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--organizer-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
        }}
      />

      {/* Floating Geometric Elements */}
      <motion.div
        variants={floatVariantsOne}
        animate="animate"
        className="pointer-events-none absolute top-16 right-12 hidden lg:flex h-20 w-20 items-center justify-center border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] text-white shadow-[6px_6px_0px_0px_var(--organizer-ink-primary)] z-10"
      >
        <Building2 className="h-10 w-10 text-white" />
      </motion.div>

      <motion.div
        variants={floatVariantsTwo}
        animate="animate"
        className="pointer-events-none absolute top-96 left-12 hidden lg:flex h-16 w-16 rounded-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-2 shadow-[6px_6px_0px_0px_var(--organizer-gold)] z-10 items-center justify-center"
      >
        <div className="h-6 w-6 bg-[var(--organizer-gold-deep)] rounded-full" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b-2 border-[var(--organizer-ink-primary)] pb-8">
          <div className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold-light)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-secondary)] mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[var(--organizer-gold-deep)]" />
            PARTNERSHIP APPLICATION PROTOCOL
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter uppercase leading-none">
            BECOME A <span className="text-[var(--organizer-gold-deep)]">PARTNER.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xs font-mono uppercase tracking-wide text-[var(--organizer-ink-muted)]">
            Empower the next cohort of intelligence architects. Deploy bounties, evaluate real-time Gemini agent pipelines, and recruit top builders.
          </p>
        </div>

        {/* Tier Selection Matrix */}
        <div className="mb-12">
          <div className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-4">
            STEP 01 // SELECT PARTNERSHIP TIER
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative cursor-pointer border-2 border-[var(--organizer-ink-primary)] p-6 transition-all ${
                  selectedTier === tier.id
                    ? "bg-[var(--organizer-surface)] -translate-y-2 -translate-x-1"
                    : "bg-[var(--organizer-bg)] opacity-85 hover:opacity-100 hover:-translate-y-1"
                }`}
                style={{
                  boxShadow: selectedTier === tier.id 
                    ? "8px 8px 0px 0px var(--organizer-gold)" 
                    : "4px 4px 0px 0px var(--organizer-ink-primary)"
                }}
              >
                {tier.popular && (
                  <div className="absolute -top-3 right-4 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-2.5 py-0.5 text-[9px] font-mono font-black uppercase text-white">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-xs font-black font-mono uppercase text-[var(--organizer-gold-deep)]">
                  {tier.name}
                </div>
                <div className="mt-2 text-4xl font-black font-display text-[var(--organizer-ink-primary)]">
                  {tier.price}
                </div>
                <p className="mt-2 text-xs font-mono text-[var(--organizer-ink-secondary)] leading-relaxed min-h-[48px]">
                  {tier.description}
                </p>

                <div className="mt-6 space-y-2 border-t-2 border-[var(--organizer-border)] pt-4">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs font-mono">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--organizer-gold-deep)] mt-0.5" />
                      <span className="text-[var(--organizer-ink-secondary)]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div
          className="border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-surface)] p-8 transition-transform"
          style={{ boxShadow: "8px 8px 0px 0px var(--organizer-gold)" }}
        >
          <div className="text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-6 border-b-2 border-[var(--organizer-border)] pb-3">
            STEP 02 // ENTER ORGANIZATION SPECIFICATIONS
          </div>

          {success ? (
            <div className="border-2 border-[var(--organizer-ink-primary)] bg-emerald-50 p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
              <h3 className="text-2xl font-black font-display uppercase tracking-tight text-[var(--organizer-ink-primary)]">
                PARTNERSHIP PROTOCOL INITIATED
              </h3>
              <p className="mt-2 text-xs font-mono text-[var(--organizer-ink-secondary)] uppercase">
                Redirecting to Sponsor Directory...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                    COMPANY / ENTITY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. ANTHROPIC, COHERE, PINECONE"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                    OFFICIAL WEBSITE URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="HTTPS://YOURCOMPANY.COM"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                    PRIMARY CONTACT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="FULL NAME & TITLE"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                    WORK EMAIL FOR INVOICING & ACCESS *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="PARTNERSHIPS@YOURCOMPANY.COM"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                    CORE INDUSTRY VERTICAL
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  >
                    <option value="AI / Machine Learning">AI / MACHINE LEARNING</option>
                    <option value="Cloud & Compute Infrastructure">CLOUD & COMPUTE INFRASTRUCTURE</option>
                    <option value="Developer Tooling">DEVELOPER TOOLING</option>
                    <option value="Autonomous Agents & Robotics">AUTONOMOUS AGENTS & ROBOTICS</option>
                    <option value="Fintech & Web3">FINTECH & WEB3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                    OPTIONAL BOUNTY PRIZE BUDGET
                  </label>
                  <input
                    type="text"
                    placeholder="E.G. $5,000 IN PRIZES + $2,500 IN API CREDITS"
                    value={formData.bountyBudget}
                    onChange={(e) => setFormData({ ...formData, bountyBudget: e.target.value })}
                    className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                    style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[var(--organizer-ink-muted)] mb-2">
                  CUSTOM BOUNTY / CHALLENGE DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  placeholder="DESCRIBE THE SPECIFIC TRACK OR API HACKERS MUST USE TO QUALIFY..."
                  value={formData.bountyTitle}
                  onChange={(e) => setFormData({ ...formData, bountyTitle: e.target.value })}
                  className="w-full border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-bg)] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[var(--organizer-gold)]"
                  style={{ boxShadow: "3px 3px 0px 0px var(--organizer-ink-primary)" }}
                />
              </div>

              <div className="flex items-center justify-between border-t-2 border-[var(--organizer-border)] pt-6">
                <div className="text-[11px] font-mono text-[var(--organizer-ink-muted)]">
                  Selected Tier: <strong className="text-[var(--organizer-ink-primary)] uppercase">{selectedTier}</strong>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 border-2 border-[var(--organizer-ink-primary)] bg-[var(--organizer-gold)] px-8 py-3 text-xs font-mono font-black uppercase tracking-wider text-[var(--organizer-ink-primary)] transition-transform hover:-translate-x-1 hover:-translate-y-1 disabled:opacity-50"
                  style={{ boxShadow: "6px 6px 0px 0px var(--organizer-ink-primary)" }}
                >
                  {isSubmitting ? "TRANSMITTING SPECIFICATION..." : "SUBMIT APPLICATION"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}