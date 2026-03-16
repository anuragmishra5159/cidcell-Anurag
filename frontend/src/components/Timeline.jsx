import SectionHeading from './SectionHeading';
import React from 'react';
import ScrollReveal from './ScrollReveal';
import { ChevronRight } from 'lucide-react';

const semesters = [
  {
    sem: 'SEM 1',
    title: 'Orientation & Basics',
    desc: 'Introduction to CID-Cell, programming fundamentals, and orientation sessions.',
    color: 'bg-highlight-yellow',
  },
  {
    sem: 'SEM 2',
    title: 'DSA & OOP',
    desc: 'Data Structures, Algorithms, and Object-Oriented Programming. Micro project initiation.',
    color: 'bg-highlight-orange',
  },
  {
    sem: 'SEM 3',
    title: 'Full Stack Development',
    desc: 'Web development (MERN / Django), database design, and front-end frameworks.',
    color: 'bg-highlight-pink',
  },
  {
    sem: 'SEM 4',
    title: 'Advanced Stack & Cloud',
    desc: 'Advanced frameworks, cloud computing, DevOps basics, and macro project development.',
    color: 'bg-highlight-purple',
  },
  {
    sem: 'SEM 5-6',
    title: 'Specialization & Open Source',
    desc: 'AI/ML, Cybersecurity, IoT specialization tracks. Active open-source contributions.',
    color: 'bg-highlight-blue',
  },
  {
    sem: 'SEM 7-8',
    title: 'Capstone & Placement Ready',
    desc: 'Industry-grade capstone projects, placement preparation, and leadership roles.',
    color: 'bg-highlight-green',
  },
];

export default function Timeline() {
  return (
    <section className="section-padding bg-transparent relative overflow-hidden z-0">
      {/* Decorative background grid and shapes */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', 
          backgroundSize: '32px 32px' 
        }} 
      ></div>
      
      {/* Massive Background Text */}
      <div className="absolute top-[20%] left-[-10%] font-heading font-black text-6xl md:text-9xl lg:text-[14rem] text-primary opacity-5 transform -rotate-12 pointer-events-none z-0 whitespace-nowrap">ROADMAP</div>
      <div className="absolute bottom-[10%] right-[-5%] font-heading font-black text-6xl md:text-9xl lg:text-[14rem] text-primary opacity-5 transform rotate-6 pointer-events-none z-0 whitespace-nowrap">JOURNEY</div>

      {/* Heavy Floating Neo-brutalist Shapes */}
      <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-highlight-teal border-4 border-primary shadow-neo hidden md:block transform rotate-12 z-0"></div>
      <div className="absolute top-[30%] right-[5%] w-48 h-48 bg-highlight-yellow border-[12px] border-primary rounded-full hidden md:block opacity-30 z-0"></div>
      <div className="absolute top-[60%] left-[-2%] w-40 h-40 bg-highlight-purple border-4 border-primary shadow-neo hidden xl:block transform -rotate-6 z-0"></div>
      <div className="absolute bottom-[20%] right-[10%] w-24 h-24 bg-highlight-pink border-4 border-primary shadow-neo hidden md:block transform -rotate-12 z-0"></div>
      <div className="absolute bottom-[5%] left-[20%] w-32 h-32 border-[8px] border-primary rounded-none hidden lg:block opacity-20 transform -rotate-45 z-0"></div>

      <div className="container-max mx-auto relative z-10 w-full">
        <SectionHeading
          subtitle="Learning Roadmap"
          title="Academic to Industry Journey"
          description="A structured semester-wise roadmap that transforms students from beginners to industry-ready professionals."
        />

        <div className="relative mt-24">
          {/* Vertical central line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-2 bg-primary -translate-x-1/2 rounded-full"></div>
          
          {/* Vertical line (Mobile) */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-2 bg-primary rounded-full"></div>

          <div className="space-y-24">
            {semesters.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <ScrollReveal key={item.sem} delay={idx * 50} className="w-full">
                <div className="relative flex flex-col md:flex-row items-center justify-center w-full group">
                  
                  {/* Desktop: Left Side Content */}
                  <div className={`hidden md:block w-1/2 pr-16 text-right`}>
                     {isLeft && <TimelineCard item={item} align="right" />}
                  </div>

                  {/* Center/Left Marker */}
                  <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                    <div className="w-14 h-14 bg-white border-4 border-primary flex items-center justify-center shadow-neo-sm transform rotate-3 group-hover:rotate-0 transition-neo">
                       <span className="text-primary font-black text-2xl font-heading absolute z-10">{idx + 1}</span>
                       <div className={`absolute inset-0 opacity-50 ${item.color}`}></div>
                    </div>
                  </div>
                  
                  {/* Desktop: Right Side Content */}
                  <div className={`hidden md:block w-1/2 pl-16 text-left`}>
                    {!isLeft && <TimelineCard item={item} align="left" />}
                  </div>
                  
                   {/* Mobile Content Display */}
                   <div className="md:hidden w-full pl-24 pr-4 py-2">
                      <TimelineCard item={item} align="left" />
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

function TimelineCard({ item, align }) {
  // Mobile always aligns left, Desktop alternates
  
  return (
    <div className={`
      relative bg-white border-4 border-primary p-6 lg:p-8 shadow-neo 
      hover:translate-x-1 hover:translate-y-1 hover:shadow-none 
      transition-neo
    `}>
      {/* Heavy Colored Side Bar */}
      <div className={`absolute top-0 bottom-0 w-6 ${item.color} border-r-4 border-primary left-0`}></div>
      
      <div className="pl-6 md:pl-8">
        <span className={`inline-block px-4 py-1.5 bg-primary text-white text-xs font-black uppercase mb-4 shadow-neo-sm transform -rotate-1`}>
          {item.sem}
        </span>
        
        <h3 className="font-heading font-black text-3xl text-primary uppercase mb-3 leading-none tracking-tight">
          {item.title}
        </h3>
        
        <p className="text-primary/80 font-bold text-base leading-relaxed border-t-4 border-primary pt-3 mt-3">
          {item.desc}
        </p>
      </div>
    </div>
  );
}
