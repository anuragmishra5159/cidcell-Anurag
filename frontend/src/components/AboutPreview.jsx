import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Award } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

export default function AboutPreview() {
  return (
    <section className="w-full min-h-screen flex items-center bg-transparent py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-0 w-32 h-32 bg-highlight-yellow border-4 border-primary shadow-neo hidden lg:block transform rotate-12 -z-10 translate-x-12"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-highlight-pink border-4 border-primary shadow-neo hidden lg:block transform -rotate-6 -z-10"></div>
      <div className="absolute top-1/3 left-0 w-12 h-12 bg-highlight-teal border-4 border-primary shadow-neo hidden lg:block transform -translate-x-6 -z-10"></div>
      
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <SectionHeading
          subtitle="About CID"
          title="Structured Platform for Innovation"
          description="CID-Cell (Collaborative Innovation & Development Cell) operates under the Department of Computer Science & Engineering to foster a culture of hands-on learning and real-world problem solving."
          compact
        />

        <div className="grid md:grid-cols-3 gap-6">
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
              className={`group border-3 border-primary bg-white shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 p-6 flex flex-col items-start relative overflow-hidden h-full`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} border-b-3 border-l-3 border-primary rounded-bl-full -mr-4 -mt-4 transition-transform hover:scale-110`}></div>
              
              <div className={`w-14 h-14 ${card.bg} border-3 border-primary rounded-full flex items-center justify-center mb-5 relative z-10 shadow-neo-sm group-hover:shadow-none transition-all`}>
                <card.icon size={28} className="text-primary" />
              </div>
              
              <h3 className="font-heading text-2xl font-black text-primary mb-3 uppercase leading-none relative z-10 tracking-widest">{card.title}</h3>
              <p className="text-primary font-medium text-base leading-relaxed relative z-10 border-l-4 border-gray-200 pl-4 font-body">{card.desc}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/about" className="btn-neo-secondary text-base px-7 py-3 border-3 hover:bg-highlight-teal">
            Learn more about CID <ArrowRight size={24} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
