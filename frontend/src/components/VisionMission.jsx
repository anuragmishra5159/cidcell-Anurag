import { Lightbulb, Users, Briefcase } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const pillars = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'Foster a culture of creative thinking and problem solving. Encourage students to develop novel solutions through hackathons, innovation sprints, and research initiatives.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Users,
    title: 'Collaboration',
    desc: 'Build a collaborative ecosystem where students, faculty, and industry experts work together. Team-based projects and peer mentoring develop essential teamwork skills.',
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
  },
  {
    icon: Briefcase,
    title: 'Industry Readiness',
    desc: 'Bridge the gap between academics and industry through guest lectures, real-world projects, internship opportunities, and structured placement preparation.',
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
  },
];

export default function VisionMission() {
  return (
    <section className="w-full min-h-screen py-20 flex items-center bg-transparent relative overflow-hidden z-0">
      {/* Background Decor Elements */}
      <div className="absolute top-[10%] left-[-2%] font-heading font-black text-6xl md:text-9xl text-white opacity-[0.02] transform -rotate-6 pointer-events-none z-0">PILLARS</div>
      <div className="absolute right-10 bottom-20 w-[300px] h-[300px] bg-glow-accent rounded-full hidden md:block z-0 pointer-events-none"></div>
      
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <SectionHeading
          subtitle="Our Pillars"
          title="Vision & Mission"
          description="CID-Cell is driven by three core pillars that shape every initiative, event, and project we undertake."
          compact
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {pillars.map(({ icon: Icon, title, desc, color, bg }, idx) => (
            <ScrollReveal key={title} delay={idx * 150} className="h-full">
            <div className="text-center group h-full">
              <div className="glass-panel p-8 h-full flex flex-col items-center relative z-10">
                <div className={`w-20 h-20 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 shadow-glass transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-glow-purple`}>
                  <Icon size={32} strokeWidth={2} />
                </div>
                <h3 className="font-heading font-semibold text-xl text-white uppercase mb-4 tracking-wider">{title}</h3>
                <p className="text-secondary font-medium text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
