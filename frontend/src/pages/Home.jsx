import HeroSection from '../components/HeroSection';
import AboutPreview from '../components/AboutPreview';
import VisionMission from '../components/VisionMission';
import KeyActivities from '../components/KeyActivities';
import Benefits from '../components/Benefits';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <div className="relative bg-bg overflow-hidden scroll-smooth">
      
      {/* Abstract Deep Dark Background Orbs */}
      <div className="pointer-events-none absolute top-[30%] right-[-5rem] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl hidden lg:block" style={{ willChange: 'transform' }} />
      <div className="pointer-events-none absolute top-[60%] left-[-5rem] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl hidden lg:block" style={{ willChange: 'transform' }} />
      <div className="pointer-events-none absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-accent-magenta/5 rounded-full blur-3xl hidden lg:block" style={{ willChange: 'transform' }} />

      <HeroSection />

      {/* Dark mode smooth transitions between sections */}
      <div className="relative z-10">
        <AboutPreview />
      </div>

      <div className="relative z-10 mt-16">
        <VisionMission />
      </div>

      <div className="relative z-10 mt-16">
        <KeyActivities />
      </div>

      <div className="relative z-10 mt-16 pb-16">
        <Benefits />
      </div>

      <div className="relative z-10 border-t border-border bg-transparent">
        <CTASection />
      </div>
    </div>
  );
}
