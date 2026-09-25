import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { IHIEngineScene } from '@/components/landing/IHIEngineScene';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ParachuteHacker } from '@/components/landing/ParachuteHacker';


export default function LandingPage() {
  return (
    /* Wrapped in the new Blueprint Light Theme */
    <div className="relative min-h-screen bg-white text-black bg-blueprint selection:bg-gold-light selection:text-black">
      <LandingNav />
      {/* Single premium parachute character — right side only */}
      <ParachuteHacker />

      {/* overflow-hidden prevents horizontal scroll from floating animations */}
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