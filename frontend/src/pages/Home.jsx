import HeroSection from '../components/HeroSection';
import AboutPreview from '../components/AboutPreview';
import Timeline from '../components/Timeline';
import VisionMission from '../components/VisionMission';
import KeyActivities from '../components/KeyActivities';
import Benefits from '../components/Benefits';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <Timeline />
      <VisionMission />
      <KeyActivities />
      <Benefits />
      <CTASection />
    </>
  );
}
