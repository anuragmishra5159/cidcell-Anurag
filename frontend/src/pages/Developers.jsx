import { Github, Linkedin, Code } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';
import ProfileCard from '../components/ui/ProfileCard';

import { developers } from '../data/developersData';

function getColorConfig(color) {
  switch(color) {
    case 'blue': return { text: 'text-blue-400', border: 'border-blue-500/30 group-hover:border-blue-500/50', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]', bgGlow: 'bg-blue-500/10' };
    case 'magenta': return { text: 'text-accent-magenta', border: 'border-accent-magenta/30 group-hover:border-accent-magenta/50', glow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:shadow-[0_0_25px_rgba(217,70,239,0.5)]', bgGlow: 'bg-accent-magenta/10' };
    case 'cyan': return { text: 'text-accent-cyan', border: 'border-accent-cyan/30 group-hover:border-accent-cyan/50', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]', bgGlow: 'bg-accent-cyan/10' };
    default: return { text: 'text-accent', border: 'border-accent/30 group-hover:border-accent/50', glow: 'shadow-glow-purple hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]', bgGlow: 'bg-accent/10' };
  }
}

export default function Developers() {
  return (
    <div className="pt-32 min-h-screen pb-24 relative overflow-hidden bg-bg text-white">
      {/* Background Ambience */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-glow-blue rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-glow-magenta rounded-full pointer-events-none -z-10"></div>

      <div className="relative z-10 container-max mx-auto px-4 text-center">
        <div className="inline-flex px-4 py-1.5 glass-panel rounded-full border border-accent/20 mb-6 items-center gap-2 shadow-glow-purple mx-auto">
             <Code size={14} className="text-accent" />
             <span className="font-semibold uppercase tracking-[0.2em] text-xs text-secondary">The Engineers</span>
        </div>
        <SectionHeading title="Site Developers" subtitle="" isCenter compact />
        <p className="text-slate-300 font-medium max-w-2xl mx-auto -mt-6 mb-16">
          Meet the creators behind the CID-Cell platform architecture.
        </p>
      </div>

      <div className="container-max mx-auto mt-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {developers.map((dev, idx) => {
            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <ProfileCard
                    name={dev.name}
                    title={dev.role}
                    avatarUrl={dev.image}
                    handle={dev.github.split('/').pop() || 'developer'}
                    status="Contributor"
                    githubUrl={dev.github}
                    linkedinUrl={dev.linkedin}
                    className="w-full max-w-[280px] mx-auto"
                    innerGradient={
                      dev.color === 'accent' ? 'linear-gradient(145deg, rgba(139,92,246,0.3) 0%, rgba(0,0,0,0) 100%)' :
                      dev.color === 'blue'   ? 'linear-gradient(145deg, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0) 100%)' :
                      dev.color === 'magenta'? 'linear-gradient(145deg, rgba(217,70,239,0.3) 0%, rgba(0,0,0,0) 100%)' :
                                               'linear-gradient(145deg, rgba(6,182,212,0.3) 0%, rgba(0,0,0,0) 100%)'
                    }
                  />
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Call to action */}
        <ScrollReveal delay={400}>
          <div className="mt-24 max-w-4xl mx-auto glass-panel border border-accent/30 p-10 md:p-14 text-center relative overflow-hidden group hover:border-accent/60 transition-colors shadow-glow-purple">
            <div className="absolute top-0 right-0 w-64 h-64 bg-glow-accent rounded-full rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-glow-blue rounded-full rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
            
            <h4 className="font-heading text-3xl md:text-5xl uppercase tracking-widest font-black text-white mb-6 relative z-10 leading-tight">
              Want to <br className="md:hidden" /> <span className="text-accent">Contribute?</span>
            </h4>
            <p className="text-slate-300 font-medium text-base md:text-lg mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
              CID-Cell is an open community. Whether you're interested in making modifications to this site, or starting a new open-source project, we're always looking for collaborators.
            </p>
            <a
              href="https://github.com/CID-CELL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black font-bold uppercase tracking-widest text-sm px-8 py-3.5 rounded-full hover:scale-105 hover:bg-accent hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-glow-purple relative z-10"
            >
              <Github size={18} className="fill-current" /> View on GitHub
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}