import SectionHeading from './SectionHeading';
import React from 'react';
import ScrollReveal from './ScrollReveal';
import { ChevronRight } from 'lucide-react';

const semesters = [
  {
    sem: 'SEM 1',
    title: 'Node Initialization',
    desc: 'Introduction to CID-Cell core protocols, programming fundamentals, and architectural orientation sessions.',
    color: 'bg-orange-500',
    shadow: 'shadow-glow-orange'
  },
  {
    sem: 'SEM 2',
    title: 'Data & Constructs',
    desc: 'Data Structures, Algorithms, and Object-Oriented paradigms. Sub-routine project initiation.',
    color: 'bg-green-500',
    shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]'
  },
  {
    sem: 'SEM 3',
    title: 'Full Stack Integration',
    desc: 'Web virtualization (MERN / Serverless), database schemas, and reactive front-end modules.',
    color: 'bg-accent-blue',
    shadow: 'shadow-glow-blue'
  },
  {
    sem: 'SEM 4',
    title: 'Cloud & Architecture',
    desc: 'Advanced system scaling, cloud environments, CI/CD pipelines, and macro-level architecture.',
    color: 'bg-accent',
    shadow: 'shadow-glow-purple'
  },
  {
    sem: 'SEM 5-6',
    title: 'Domain Specialization',
    desc: 'Neural Networks, Cryptography, IoT edge tracking. Open-source contribution mandates.',
    color: 'bg-accent-cyan',
    shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]'
  },
  {
    sem: 'SEM 7-8',
    title: 'Deployment Ready',
    desc: 'Industry-grade application deployment, enterprise integration, and senior administration roles.',
    color: 'bg-white',
    shadow: 'shadow-[0_0_20px_rgba(255,255,255,0.3)]'
  },
];

export default function Timeline() {
  return (
    <section className="section-padding bg-bg relative overflow-hidden z-0 font-body text-white">
      {/* Grid Matrix Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      ></div>
      
      {/* Massive Background Typography */}
      <div className="absolute top-[10%] left-[-5%] font-black text-6xl md:text-9xl lg:text-[14rem] text-accent opacity-[0.02] transform -rotate-12 pointer-events-none z-0 whitespace-nowrap tracking-widest uppercase py-4">Trajectory</div>
      <div className="absolute bottom-[20%] right-[-5%] font-black text-6xl md:text-9xl lg:text-[14rem] text-accent-cyan opacity-[0.02] transform rotate-6 pointer-events-none z-0 whitespace-nowrap tracking-widest uppercase py-4">Sequence</div>

      {/* Floating Glass Orbs */}
      <div className="absolute top-[15%] left-[5%] w-64 h-64 bg-glow-accent rounded-full hidden md:block z-0"></div>
      <div className="absolute top-[40%] right-[5%] w-80 h-80 bg-glow-blue rounded-full hidden lg:block z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-[10%] left-[20%] w-56 h-56 bg-accent-cyan/10 rounded-full blur-[70px] hidden md:block z-0"></div>

      <div className="container-max mx-auto relative z-10 w-full px-4 sm:px-6">
        <SectionHeading
          subtitle="System Trajectory"
          title="Node Progression Log"
          description="A deterministic sequence designed to compile novice instances into enterprise-grade operational units."
        />

        <div className="relative mt-24">
          {/* Vertical central conduit (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2"></div>
          
          {/* Vertical conduit (Mobile) */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

          <div className="space-y-12 md:space-y-24">
            {semesters.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <ScrollReveal key={item.sem} delay={idx * 50} className="w-full">
                <div className="relative flex flex-col md:flex-row items-center justify-center w-full group">
                  
                  {/* Desktop: Left Side Content */}
                  <div className={`hidden md:block w-1/2 pr-16 text-right`}>
                     {isLeft && <TimelineCard item={item} align="right" idx={idx} />}
                  </div>

                  {/* Center/Left Hardware Node */}
                  <div className="absolute left-[32px] md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110">
                    <div className="w-4 h-4 rounded-full bg-bg border-4 border-white/20 relative flex items-center justify-center group-hover:border-white transition-colors duration-500 shadow-glass">
                        <div className={`absolute w-12 h-12 rounded-full ${item.color} opacity-20 blur-md scale-0 group-hover:scale-100 transition-transform duration-500`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.color} ${item.shadow}`}></div>
                    </div>
                  </div>
                  
                  {/* Desktop: Right Side Content */}
                  <div className={`hidden md:block w-1/2 pl-16 text-left`}>
                    {!isLeft && <TimelineCard item={item} align="left" idx={idx} />}
                  </div>
                  
                   {/* Mobile Content Display */}
                   <div className="md:hidden w-full pl-20 pr-0 py-2">
                      <TimelineCard item={item} align="left" idx={idx} />
                   </div>

                </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ item, align, idx }) {
  return (
    <div className={`
      glass-panel border border-white/10 p-6 lg:p-8 rounded-2xl shadow-glass 
      hover:border-white/30 hover:bg-surface/80 transition-all duration-300 relative overflow-hidden group/card
    `}>
      {/* Ambient background glow inside card */}
      <div className={`absolute top-0 ${align === 'right' ? 'right-0' : 'left-0'} w-32 h-32 ${item.color} opacity-5 blur-[40px] pointer-events-none group-hover/card:opacity-10 transition-opacity`}></div>
      
      <div className="relative z-10">
        <div className={`flex items-center gap-4 mb-4 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
             <h3 className="font-bold text-xl md:text-2xl text-white uppercase tracking-wider">
               {item.title}
             </h3>
             <span className={`px-3 py-1 bg-surface border border-white/10 text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-inner ${item.color.replace('bg-', 'text-')}`}>
               {item.sem}
             </span>
        </div>
        
        <p className={`text-slate-400 font-medium text-xs md:text-sm leading-relaxed border-t border-white/10 pt-4 ${align === 'right' ? 'text-right' : 'text-left'}`}>
          {item.desc}
        </p>

        {/* Decorative circuit line */}
        <div className={`absolute bottom-0 h-[2px] w-1/3 ${item.color} opacity-50 ${align === 'right' ? 'right-0' : 'left-0'}`}></div>
      </div>
    </div>
  );
}
