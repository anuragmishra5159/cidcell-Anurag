import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Award } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

export default function AboutPreview() {
  return (
    <section className="section-padding bg-white relative">
      
      
      <div className="container-max mx-auto">
        <SectionHeading
          subtitle="About CID"
          title="Structured Platform for Innovation"
          description="CID-Cell (Collaborative Innovation & Development Cell) operates under the Department of Computer Science & Engineering to foster a culture of hands-on learning and real-world problem solving."
        />

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Hands-On Learning',
              desc: 'Engage in project-based learning sessions from semester 1 through Capstone. Build real products and develop industry-ready skills.',
              icon: Zap,
              bg: 'bg-highlight-yellow',
            },
            {
              title: 'Innovation Ecosystem',
              desc: 'Hackathons, innovation sprints, coding challenges, and open-source contributions create a thriving ecosystem of creativity and problem solving.',
              icon: Target,
              bg: 'bg-highlight-orange',
            },
            {
              title: 'Industry Readiness',
              desc: 'Guest lectures from industry experts, mentorship programs, and collaborative initiatives ensure students are placement-ready by final year.',
              icon: Award,
              bg: 'bg-highlight-blue',
            },
          ].map((card, idx) => (
            <ScrollReveal key={card.title} delay={idx * 150}>
            <div
              className={`group border-3 border-primary bg-white shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 p-8 flex flex-col items-start relative overflow-hidden h-full`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} border-b-3 border-l-3 border-primary rounded-bl-full -mr-4 -mt-4 transition-transform hover:scale-110`}></div>
              
              <div className={`w-16 h-16 ${card.bg} border-3 border-primary rounded-full flex items-center justify-center mb-6 relative z-10 shadow-neo-sm group-hover:shadow-none transition-all`}>
                <card.icon size={32} className="text-primary" />
              </div>
              
              <h3 className="font-heading text-3xl font-black text-primary mb-4 uppercase leading-none relative z-10">{card.title}</h3>
              <p className="text-primary font-medium text-lg leading-relaxed relative z-10 border-l-4 border-gray-200 pl-4">{card.desc}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/about" className="btn-neo-secondary text-lg px-8 py-4 border-3 hover:bg-highlight-teal">
            Learn more about CID <ArrowRight size={24} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
