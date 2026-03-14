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
    <section className="section-padding bg-white border-t-3 border-b-3 border-primary relative overflow-hidden">
      
      {/* Decorative background pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

      <div className="container-max mx-auto relative z-10">
        <SectionHeading
          subtitle="What We Do"
          title="Key Activities"
          description="From workshops to hackathons, CID-Cell offers diverse opportunities to learn, build, and grow."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {activities.map(({ icon: Icon, title, desc, bg }, idx) => (
            <ScrollReveal key={title} delay={idx * 100}>
            <div
              className={`border-3 border-primary rounded-neo p-8 shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 bg-white group flex flex-col items-start h-full`}
            >
              <div
                className={`w-20 h-20 rounded-full ${bg} border-3 border-primary flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 shadow-neo-sm`}
              >
                <Icon size={36} className="text-primary" />
              </div>
              <h3 className="font-heading font-black text-3xl uppercase text-primary mb-4">{title}</h3>
              <p className="text-primary font-medium text-base leading-relaxed border-l-3 border-primary pl-4">{desc}</p>
            </div>
            </ScrollReveal>
          ))}

          {/* CTA card */}
          <Link
            to="/events"
            className="bg-primary text-white border-3 border-primary rounded-neo p-8 flex flex-col items-center justify-center text-center shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all group lg:col-span-1 border-t-3"
          >
            <div className="w-20 h-20 bg-white border-3 border-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <ArrowRight size={32} className="text-primary" />
            </div>
            <h3 className="font-heading font-black text-2xl uppercase mb-2">
              Explore All Events
            </h3>
            <p className="text-gray-300 font-medium text-sm">See our upcoming and past events</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
