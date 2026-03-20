import { Cpu, Target, Award, Flame } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const benefits = [
  {
    icon: Cpu,
    title: 'Technical Skills',
    desc: 'Master programming, full-stack development, AI/ML, cloud computing, and emerging technologies through structured learning.',
    color: 'bg-highlight-blue'
  },
  {
    icon: Target,
    title: 'Career Readiness',
    desc: 'Build a strong portfolio, gain interview experience, and develop soft skills that make you stand out to recruiters.',
    color: 'bg-highlight-yellow'
  },
  {
    icon: Award,
    title: 'Leadership',
    desc: 'Take ownership of projects, lead teams, mentor juniors, and build leadership skills that last a lifetime.',
    color: 'bg-highlight-purple'
  },
  {
    icon: Flame,
    title: 'Innovation Culture',
    desc: 'Be part of an ecosystem that celebrates creativity, experimentation, and out-of-the-box thinking.',
    color: 'bg-highlight-orange'
  },
];

export default function Benefits() {
  return (
    <section className="w-full min-h-screen flex items-center bg-transparent relative overflow-hidden py-20 z-0">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-40 bg-highlight-yellow transform -rotate-3 border-y-4 border-primary z-0 opacity-30"></div>
      <div className="absolute right-0 top-0 w-64 h-64 border-[16px] border-primary rounded-full opacity-10 translate-x-1/2 -translate-y-1/2 z-0 hidden md:block"></div>
      <div className="absolute left-10 bottom-20 font-heading font-black text-6xl md:text-8xl text-primary opacity-5 transform -rotate-90 origin-bottom-left pointer-events-none z-0 hidden sm:block">GROWTH</div>

      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <SectionHeading
          subtitle="Why Join"
          title="Benefits of CID-Cell"
          description="Joining CID-Cell gives you access to a transformative learning environment that goes far beyond the classroom."
          compact
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map(({ icon: Icon, title, desc, color }, idx) => (
            <ScrollReveal key={title} delay={idx * 100} className="h-full">
            <div
              className={`p-8 flex flex-col items-center text-center group bg-white border-4 border-primary shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-full relative z-10`}
            >
              <div className={`w-24 h-24 ${color} border-4 border-primary bg-highlight-color flex items-center justify-center mb-6 shadow-neo-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all`}>
                <Icon size={44} className="text-primary stroke-[3px]" />
              </div>
              <h3 className="font-heading text-2xl font-black uppercase text-primary mb-4 leading-tight tracking-widest">{title}</h3>
              <p className="text-primary text-base font-bold leading-relaxed font-body">{desc}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
