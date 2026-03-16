import { Link } from 'react-router-dom';
import {
  MonitorSmartphone,
  Trophy,
  FolderGit2,
  Globe,
  Mic2,
  ArrowRight
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const activities = [
  {
    icon: MonitorSmartphone,
    title: 'Workshops',
    desc: 'Hands-on sessions on Web Dev, AI/ML, Cybersecurity, Cloud, and IoT.',
    bg: 'bg-highlight-teal',
  },
  {
    icon: Trophy,
    title: 'Hackathons',
    desc: 'Intra- and inter-college hackathons to solve real-world problems in 24-48 hours.',
    bg: 'bg-highlight-orange',
  },
  {
    icon: FolderGit2,
    title: 'Projects',
    desc: 'Micro, Macro, and Capstone projects built with industry-standard technologies.',
    bg: 'bg-highlight-purple',
  },
  {
    icon: Globe,
    title: 'Open Source',
    desc: 'Active contributions to open-source repositories and Git/GitHub programs.',
    bg: 'bg-highlight-green',
  },
  {
    icon: Mic2,
    title: 'Guest Lectures',
    desc: 'Sessions with industry experts and alumni sharing real-world insights.',
    bg: 'bg-highlight-pink',
  },
];

export default function KeyActivities() {
  return (
    <section className="w-full min-h-screen flex items-center py-20 bg-transparent relative overflow-hidden z-0">
      
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1A1A 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute -left-20 top-20 w-40 h-40 bg-highlight-teal border-4 border-primary shadow-neo hidden lg:block transform -rotate-12 -z-0"></div>
      <div className="absolute right-10 bottom-10 font-heading font-black text-6xl md:text-8xl lg:text-9xl text-primary opacity-5 transform rotate-3 pointer-events-none z-0 tracking-widest hidden sm:block">ACTIVITIES</div>

      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <SectionHeading
          subtitle="What We Do"
          title="Key Activities"
          description="From workshops to hackathons, CID-Cell offers diverse opportunities to learn, build, and grow."
          compact
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(({ icon: Icon, title, desc, bg }, idx) => (
            <ScrollReveal key={title} delay={idx * 100}>
            <div
              className={`border-4 border-primary p-6 shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 bg-white group flex flex-col items-start h-full relative z-10`}
            >
              <div
                className={`w-20 h-20 ${bg} border-4 border-primary flex items-center justify-center mb-6 transition-transform group-hover:-rotate-6 shadow-neo-sm`}
              >
                <Icon size={36} className="text-primary stroke-[3px]" />
              </div>
              <h3 className="font-heading font-black text-3xl uppercase text-primary mb-4 tracking-wider">{title}</h3>
              <p className="text-primary font-bold text-base leading-relaxed border-l-4 border-primary pl-4">{desc}</p>
            </div>
            </ScrollReveal>
          ))}

          {/* CTA card */}
          <Link
            to="/events"
            className="bg-primary text-white border-4 border-primary p-6 flex flex-col items-center justify-center text-center shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group lg:col-span-1 border-t-4 relative z-10"
          >
            <div className="w-20 h-20 bg-white border-4 border-primary flex items-center justify-center mb-6 group-hover:scale-110 shadow-neo transition-transform">
               <ArrowRight size={36} className="text-primary stroke-[4px]" />
            </div>
            <h3 className="font-heading font-black text-3xl uppercase mb-3 tracking-wider">
              Explore All Events
            </h3>
            <p className="text-white border-2 border-white px-4 py-2 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">See our upcoming and past events</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
