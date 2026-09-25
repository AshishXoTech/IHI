import { HeroSection } from '@/components/landing/HeroSection';
import { LogoStrip } from '@/components/landing/LogoStrip';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';

export default function LandingPage() {
  return (
    /* Wrapped in Daylight Black/White/Gold styles */
    <div className="min-h-screen bg-white text-black selection:bg-gold selection:text-black">
      <LandingNav />
      <main id="main">
        <HeroSection />
        <LogoStrip />
        
        {/* Phase 1 Additions */}
        <ProblemSection />
        <SolutionSection />
        
        <FeaturesSection />
        <DashboardPreview />
        
        <WorkflowSection />
        {/* Phase 1 Addition (Unified interactive step-flow) */}
        <HowItWorksSection />
        
        {/* World-Class Light Mode Pricing Section */}
        <PricingSection />
        
        <StatsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}