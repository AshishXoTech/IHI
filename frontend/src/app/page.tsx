import { LandingNav } from '@/components/landing/LandingNav';
import { ParachuteHacker } from '@/components/landing/ParachuteHacker';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { IHIEngineScene } from '@/components/landing/IHIEngineScene';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[var(--organizer-bg)] text-[var(--organizer-ink-primary)] selection:bg-[var(--organizer-gold)] selection:text-white font-sans flex flex-col">
      {/* MANDATORY BLUEPRINT GRAPH-PAPER BACKGROUND */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--organizer-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--organizer-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
        }}
      />

      <LandingNav />
      <ParachuteHacker />

      {/* Main Content wrapped to prevent horizontal overflow from absolute shapes */}
      <main id="main" className="relative z-10 flex flex-col w-full overflow-hidden">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <IHIEngineScene />
        <DashboardPreview />
        <WorkflowSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
}