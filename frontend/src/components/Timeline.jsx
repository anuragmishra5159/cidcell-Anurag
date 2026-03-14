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
    <section className="section-padding bg-white relative overflow-hidden border-t-3 border-b-3 border-black">
      {/* Decorative background grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }} 
      ></div>

      <div className="container-max mx-auto relative z-10">
        <SectionHeading
          subtitle="Learning Roadmap"
          title="Academic to Industry Journey"
          description="A structured semester-wise roadmap that transforms students from beginners to industry-ready professionals."
        />

        <div className="relative mt-24">
          {/* Vertical central line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-black -translate-x-1/2"></div>
          
          {/* Vertical line (Mobile) */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-1 bg-black"></div>

          <div className="space-y-24">
            {semesters.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <ScrollReveal key={item.sem} delay={idx * 50} className="w-full">
                <div className="relative flex flex-col md:flex-row items-center justify-center w-full">
                  
                  {/* Desktop: Left Side Content */}
                  <div className={`hidden md:block w-1/2 pr-16 text-right`}>
                     {isLeft && <TimelineCard item={item} align="right" />}
                  </div>

                  {/* Center/Left Marker */}
                  <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-10">
                    <div className="w-12 h-12 bg-black border-4 border-white flex items-center justify-center shadow-neo">
                       <span className="text-white font-bold text-lg font-heading">{idx + 1}</span>
                    </div>
                  </div>
                  
                  {/* Desktop: Right Side Content */}
                  <div className={`hidden md:block w-1/2 pl-16 text-left`}>
                    {!isLeft && <TimelineCard item={item} align="left" />}
                  </div>
                  
                   {/* Mobile Content Display */}
                   <div className="md:hidden w-full pl-24 pr-4">
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
      relative bg-white border-3 border-black p-6 shadow-neo 
      hover:translate-x-1 hover:translate-y-1 hover:shadow-none 
      transition-all duration-200 group
    `}>
      {/* Heavy Colored Side Bar */}
      <div className={`absolute top-0 bottom-0 w-4 ${item.color} border-r-3 border-black left-0 border-r-black`}></div>
      
      <div className="pl-6">
        <span className={`inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase mb-3 transform -rotate-1`}>
          {item.sem}
        </span>
        
        <h3 className="font-heading font-black text-2xl text-black uppercase mb-2 leading-tight">
          {item.title}
        </h3>
        
        <p className="text-black font-medium text-sm leading-relaxed border-t-2 border-black pt-2 mt-2">
          {item.desc}
        </p>
      </div>
    </div>
  );
}
