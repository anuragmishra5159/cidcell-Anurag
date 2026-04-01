import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Award } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

export default function AboutPreview() {
  return (
    <section className="w-full min-h-screen flex items-center bg-transparent py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-glow-accent rounded-full hidden lg:block -z-10" style={{ willChange: 'transform' }}></div>
      <div className="absolute bottom-20 left-10 w-[200px] h-[200px] bg-glow-blue rounded-full hidden lg:block -z-10" style={{ willChange: 'transform' }}></div>
      
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <SectionHeading
          subtitle="About CID"
          title="Structured Platform for Innovation"
          description="CID-Cell (Collaborative Innovation & Development Cell) operates under the Department of Computer Science & Engineering to foster a culture of hands-on learning and real-world problem solving."
          compact
        />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: 'Hands-On Learning',
              desc: 'Engage in project-based learning sessions from semester 1 through Capstone. Build real products and develop industry-ready skills.',
              icon: Zap,
              color: 'text-accent',
              bg: 'bg-accent/10',
            },
            {
              title: 'Innovation Ecosystem',
              desc: 'Hackathons, innovation sprints, coding challenges, and open-source contributions create a thriving ecosystem of creativity and problem solving.',
              icon: Target,
              color: 'text-accent-magenta',
              bg: 'bg-accent-magenta/10',
            },
            {
              title: 'Industry Readiness',
              desc: 'Guest lectures from industry experts, mentorship programs, and collaborative initiatives ensure students are placement-ready by final year.',
              icon: Award,
              color: 'text-accent-blue',
              bg: 'bg-accent-blue/10',
            },
          ].map((card, idx) => (
            <ScrollReveal key={card.title} delay={idx * 150}>
            <div className="glass-panel p-8 flex flex-col items-start h-full group">
              <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-glass`}>
                <card.icon size={28} />
              </div>
              
              <h3 className="font-heading text-xl font-bold text-white mb-3 tracking-wide">{card.title}</h3>
              <p className="text-secondary font-medium text-sm leading-relaxed border-l-2 border-border pl-4 group-hover:border-accent/50 transition-colors">{card.desc}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/about" className="btn-neo-secondary px-8">
            Explore Documentation <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
