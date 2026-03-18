import HeroSection from '../components/HeroSection';
import AboutPreview from '../components/AboutPreview';
import VisionMission from '../components/VisionMission';
import KeyActivities from '../components/KeyActivities';
import Benefits from '../components/Benefits';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <div className="relative bg-bg overflow-hidden scroll-smooth">
      {/* Soft, muddy blurred background gradients */}
      <div className="pointer-events-none absolute top-[14%] right-[-4rem] w-64 h-64 bg-highlight-purple/20 rounded-full blur-[80px] hidden lg:block" />
      <div className="pointer-events-none absolute top-[46%] left-[-3rem] w-64 h-64 bg-highlight-teal/20 rounded-full blur-[100px] hidden lg:block" />
      <div className="pointer-events-none absolute bottom-[14%] right-[8%] w-64 h-64 bg-highlight-yellow/20 rounded-full blur-[80px] hidden lg:block" />

      <HeroSection />

      {/* Smooth gradient transitions between sections without harsh borders */}
      <div className="relative bg-gradient-to-b from-bg to-white transition-colors duration-1000">
        <AboutPreview />
      </div>

      <div className="relative bg-gradient-to-b from-white/50 to-white transition-colors duration-1000">
        <VisionMission />
      </div>

      <div className="relative bg-gradient-to-b from-white/50 to-white transition-colors duration-1000">
        <KeyActivities />
      </div>

      <div className="relative bg-gradient-to-b from-white to-highlight-teal/5 transition-colors duration-1000">
        <Benefits />
      </div>

      <div className="relative bg-gradient-to-b from-highlight-teal/5 to-highlight-yellow transition-colors duration-1000">
        <CTASection />
      </div>
    </div>
  );
}
