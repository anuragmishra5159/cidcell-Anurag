import { useMemo, useState, useDeferredValue } from 'react';
import {
  ExternalLink,
  Search,
  Sparkles,
  BriefcaseBusiness,
  Wrench,
  Lightbulb,
  ShieldCheck,
  X,
} from 'lucide-react';
import { roleBasedRoadmaps, skillBasedRoadmaps, projectIdeas, bestPractices } from '../data/roadmapData';
import ScrollReveal from '../components/ScrollReveal';

const sections = [
  {
    title: 'Role-based Roadmaps',
    items: roleBasedRoadmaps,
    icon: BriefcaseBusiness,
    color: 'accent',
  },
  {
    title: 'Skill-based Roadmaps',
    items: skillBasedRoadmaps,
    icon: Wrench,
    color: 'blue',
  },
  {
    title: 'Project Ideas',
    items: projectIdeas,
    icon: Lightbulb,
    color: 'magenta',
  },
  {
    title: 'Best Practices',
    items: bestPractices,
    icon: ShieldCheck,
    color: 'cyan',
  },
];

function getColorClasses(color) {
  switch(color) {
    case 'blue': return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', hover: 'group-hover:text-blue-400 group-hover:border-blue-500/50', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' };
    case 'magenta': return { text: 'text-accent-magenta', bg: 'bg-accent-magenta/10', border: 'border-accent-magenta/30', hover: 'group-hover:text-accent-magenta group-hover:border-accent-magenta/50', glow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]' };
    case 'cyan': return { text: 'text-accent-cyan', bg: 'bg-accent-cyan/10', border: 'border-accent-cyan/30', hover: 'group-hover:text-accent-cyan group-hover:border-accent-cyan/50', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' };
    default: return { text: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30', hover: 'group-hover:text-accent group-hover:border-accent/50', glow: 'shadow-glow-purple' };
  }
}

function RoadmapButton({ item, colorObj }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${item.label} roadmap in a new tab`}
      className={`group flex h-full items-center justify-between gap-3 glass-panel p-4 font-bold uppercase tracking-wide text-xs md:text-sm text-secondary hover:text-white transition-all duration-300 hover:-translate-y-1 ${colorObj.hover} hover:${colorObj.glow}`}
    >
      <span className="text-left leading-tight truncate">
        {item.label}
      </span>
      
      <div className="flex items-center gap-3 shrink-0">
        {item.isNew && (
          <span className={`px-2 py-1 text-[9px] rounded-md border ${colorObj.border} ${colorObj.bg} ${colorObj.text} font-black animate-pulse`}>
            NEW
          </span>
        )}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface border border-border group-hover:bg-white/10 transition-colors`}>
          <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </a>
  );
}

export default function Roadmap() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return sections;
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.label.toLowerCase().includes(normalizedQuery)),
      }))
      .filter((section) => section.items.length > 0);
  }, [normalizedQuery]);

  return (
    <div className="bg-bg min-h-screen pt-32 pb-24 border-b border-border relative overflow-hidden text-white">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute top-0 -right-20 w-[500px] h-[500px] bg-glow-accent rounded-full -z-10"></div>
      <div className="pointer-events-none absolute bottom-0 -left-20 w-[400px] h-[400px] bg-glow-blue rounded-full -z-10 animate-pulse-slow"></div>
      
      <section className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full border border-accent/20 mb-6 shadow-glow-purple">
             <Sparkles size={14} className="text-accent animate-pulse" />
             <span className="font-semibold uppercase tracking-[0.2em] text-xs text-secondary">Developer Growth Hub</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-none mb-6 font-black drop-shadow-xl text-white">
            Learning <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-cyan filter drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Roadmaps</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base font-medium text-slate-300 bg-surface/50 backdrop-blur-md rounded-2xl border border-border p-5 shadow-glass">
            Pick a role, skill, project track, or best-practice path and jump directly to <u className="decoration-accent decoration-2 underline-offset-4 font-bold text-white">roadmap.sh</u> verified resources.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16 relative z-20">
          <div className="flex items-center gap-3 glass-panel p-2 md:p-3 rounded-2xl shadow-glass border border-white/10 group focus-within:border-accent/50 focus-within:shadow-glow-purple transition-all">
            <div className="p-3">
               <Search size={20} className="text-secondary group-focus-within:text-accent transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roadmaps, skills, and tracks..."
              className="w-full bg-transparent outline-none text-sm md:text-base font-medium text-white placeholder:text-slate-500 pr-4"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-2.5 rounded-xl bg-surface hover:bg-white/10 border border-border hover:border-accent transition-all focus:outline-none shrink-0"
              >
                <X size={16} className="text-secondary hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {filteredSections.length === 0 ? (
          <div className="glass-panel border border-dashed border-border/50 p-12 text-center flex flex-col items-center justify-center gap-4 max-w-xl mx-auto rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-2 shadow-glass">
              <Search size={24} className="text-slate-500" />
            </div>
            <p className="font-heading text-xl md:text-2xl uppercase tracking-wide font-bold text-white">
              No Matches Found
            </p>
            <p className="text-sm text-slate-400">Try a different keyword or explore all categories.</p>
            <button 
              onClick={() => setQuery('')}
              className="mt-4 px-6 py-2.5 rounded-full bg-accent/20 border border-accent/50 text-accent font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-glow-purple text-xs"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {filteredSections.map((section, index) => {
              const colorObj = getColorClasses(section.color);
              const Icon = section.icon;
              return (
                <ScrollReveal key={section.title} delay={index * 50}>
                  <section className="relative">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-center gap-4 mb-8">
                      <div className={`p-3 rounded-2xl border ${colorObj.border} ${colorObj.bg} shadow-glass`}>
                        <Icon size={24} className={colorObj.text} />
                      </div>
                      <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-widest font-bold text-white">
                        {section.title}
                      </h2>
                      <div className="h-px bg-gradient-to-r from-border to-transparent flex-1 hidden md:block ml-4"></div>
                    </div>
                    
                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                      {section.items.map((item) => (
                        <RoadmapButton key={`${section.title}-${item.label}`} item={item} colorObj={colorObj} />
                      ))}
                    </div>
                  </section>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
