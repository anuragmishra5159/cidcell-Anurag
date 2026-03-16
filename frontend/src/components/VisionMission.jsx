import { Lightbulb, Users, Briefcase } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const pillars = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Foster a culture of creative thinking and problem solving. Encourage students to develop novel solutions through hackathons, innovation sprints, and research initiatives.',
    color: 'bg-highlight-yellow', // Background for icon box
  },
  {
    icon: Users,
    title: 'Collaboration',
    desc: 'Build a collaborative ecosystem where students, faculty, and industry experts work together. Team-based projects and peer mentoring develop essential teamwork skills.',
    color: 'bg-highlight-blue',
  },
  {
    icon: Briefcase,
    title: 'Industry Readiness',
    desc: 'Bridge the gap between academics and industry through guest lectures, real-world projects, internship opportunities, and structured placement preparation.',
    color: 'bg-highlight-green',
  },
];

export default function VisionMission() {
  return (
    <section className="w-full min-h-screen py-20 flex items-center bg-transparent relative overflow-hidden z-0">
      {/* Background Decor Elements */}
      <div className="absolute top-[10%] left-[-2%] font-heading font-black text-7xl md:text-9xl lg:text-[12rem] text-primary opacity-5 transform -rotate-6 pointer-events-none z-0">PILLARS</div>
      <div className="absolute right-10 bottom-20 w-24 h-24 lg:w-32 lg:h-32 bg-highlight-blue border-4 border-primary shadow-neo hidden md:block transform rotate-12 z-0 animate-[wiggle_8s_ease-in-out_infinite]"></div>
      <div className="absolute left-20 bottom-32 w-16 h-16 bg-highlight-yellow border-4 border-primary shadow-neo rounded-full hidden md:block z-0"></div>
      
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <SectionHeading
          subtitle="Our Pillars"
          title="Vision & Mission"
          description="CID-Cell is driven by three core pillars that shape every initiative, event, and project we undertake."
          compact
        />

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map(({ icon: Icon, title, desc, color }, idx) => (
            <ScrollReveal key={title} delay={idx * 150} className="h-full">
            <div className="text-center group h-full">
              <div className="bg-white border-4 border-primary shadow-neo p-8 h-full flex flex-col items-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo relative z-10">
                <div
                  className={`w-24 h-24 ${color} border-4 border-primary bg-highlight-color flex items-center justify-center mb-6 shadow-neo-sm transform -rotate-3 group-hover:rotate-0 transition-transform`}
                >
                  <Icon size={40} className="text-primary stroke-[3px]" />
                </div>
                <h3 className="font-heading font-black text-3xl text-primary uppercase mb-4 tracking-tighter">{title}</h3>
                <p className="text-primary font-bold text-base leading-relaxed">{desc}</p>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
