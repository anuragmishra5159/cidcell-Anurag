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
    <section className="section-padding bg-bg border-t-3 border-b-3 border-primary relative overflow-hidden">
      <div className="container-max mx-auto relative z-10">
        <SectionHeading
          subtitle="Our Pillars"
          title="Vision & Mission"
          description="CID-Cell is driven by three core pillars that shape every initiative, event, and project we undertake."
        />

        <div className="grid md:grid-cols-3 gap-12">
          {pillars.map(({ icon: Icon, title, desc, color }, idx) => (
            <ScrollReveal key={title} delay={idx * 150} className="h-full">
            <div className="text-center group h-full">
              <div className="bg-white border-3 border-primary shadow-neo rounded-neo p-8 h-full flex flex-col items-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
                <div
                  className={`w-24 h-24 ${color} border-3 border-primary rounded-full flex items-center justify-center mb-6 shadow-neo-sm group-hover:shadow-none transition-all`}
                >
                  <Icon size={40} className="text-primary" />
                </div>
                <h3 className="font-heading font-black text-3xl text-primary uppercase mb-4">{title}</h3>
                <p className="text-primary font-medium leading-relaxed">{desc}</p>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
