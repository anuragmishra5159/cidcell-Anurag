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

const sections = [
  {
    title: 'Role-based Roadmaps',
    items: roleBasedRoadmaps,
    icon: BriefcaseBusiness,
    cardClass: 'bg-white',
    iconClass: 'bg-highlight-yellow',
    hoverClass: 'hover:bg-highlight-yellow',
  },
  {
    title: 'Skill-based Roadmaps',
    items: skillBasedRoadmaps,
    icon: Wrench,
    cardClass: 'bg-white',
    iconClass: 'bg-highlight-blue',
    hoverClass: 'hover:bg-highlight-blue',
  },
  {
    title: 'Project Ideas',
    items: projectIdeas,
    icon: Lightbulb,
    cardClass: 'bg-white',
    iconClass: 'bg-highlight-pink',
    hoverClass: 'hover:bg-highlight-pink',
  },
  {
    title: 'Best Practices',
    items: bestPractices,
    icon: ShieldCheck,
    cardClass: 'bg-white',
    iconClass: 'bg-highlight-teal',
    hoverClass: 'hover:bg-highlight-teal',
  },
];

function RoadmapButton({ item, hoverClass }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${item.label} roadmap in a new tab`}
      className={`group flex h-full items-center justify-between gap-3 border-2 border-primary p-3 md:p-4 font-bold uppercase text-sm md:text-base bg-white shadow-neo transition-all duration-300 ${hoverClass} hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-white`}
    >
      <span className="text-primary text-left leading-tight tracking-[0.05em]">
        {item.label}
      </span>
      
      <div className="flex items-center gap-3 shrink-0">
        {item.isNew && (
          <span className="border-2 border-primary bg-highlight-pink px-2 py-1 text-[10px] leading-none transform -rotate-6 shadow-[2px_2px_0_0_#1a1a1a] font-black group-hover:rotate-6 transition-transform duration-300">
            NEW!!
          </span>
        )}
        <div className="w-8 h-8 border-2 border-primary flex items-center justify-center bg-highlight-blue group-hover:bg-white group-hover:text-primary transition-all duration-300 shadow-[2px_2px_0_0_#1a1a1a] group-active:shadow-none group-active:translate-x-1 group-active:translate-y-1">
          <ExternalLink size={16} strokeWidth={2} className="text-inherit transform group-hover:scale-125 transition-transform" />
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
    <div className="bg-[#FFFDF5] min-h-screen pt-32 pb-24 border-b-8 border-primary relative overflow-hidden">
      {/* Bold, heavy geometric decorations */}
      <div className="pointer-events-none absolute top-24 -right-16 w-32 h-32 md:w-48 md:h-48 bg-highlight-purple border-2 border-primary rounded-none shadow-neo transform rotate-[15deg]"></div>
      <div className="pointer-events-none absolute bottom-32 -left-12 w-24 h-24 md:w-36 md:h-36 bg-highlight-teal border-2 border-primary shadow-neo rotate-12"></div>
      <div className="pointer-events-none absolute top-72 left-8 w-12 h-12 bg-highlight-pink border-2 border-primary shadow-neo rotate-[-25deg] hidden lg:block"></div>
      
      {/* Additional playful neo-brutalist background elements */}
      <div className="pointer-events-none absolute top-[35%] right-[8%] w-16 h-16 rounded-full bg-white border-2 border-primary shadow-neo hidden xl:block"></div>
      <div className="pointer-events-none absolute top-[18%] left-[12%] w-24 h-8 bg-highlight-orange border-2 border-primary shadow-neo transform -rotate-[20deg] hidden lg:block"></div>
      <div className="pointer-events-none absolute top-[55%] left-[-2rem] w-32 h-16 bg-highlight-yellow border-2 border-primary shadow-neo rounded-full transform -rotate-[40deg] hidden md:block"></div>
      <div className="pointer-events-none absolute bottom-[15%] right-[4%] w-14 h-14 bg-transparent border-[5px] border-highlight-blue transform rotate-45 hidden lg:block opacity-80"></div>
      <div className="pointer-events-none absolute top-[80%] left-[6%] w-8 h-8 bg-primary rounded-full hidden lg:block"></div>
      
      <section className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 relative">
          <div className="inline-block px-4 py-2 bg-highlight-blue border-2 border-primary shadow-neo transform -rotate-3 mb-6 font-bold uppercase tracking-widest text-xs sm:text-sm text-primary transition-neo hover:rotate-0 hover:scale-105">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={16} className="animate-pulse" />
              Developer Growth Hub
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl uppercase tracking-widest leading-none mb-6 text-primary">
            Learning <br className="md:hidden" />
            <span className="bg-highlight-yellow px-4 py-1 border-2 border-primary inline-block shadow-neo mt-2 md:mt-0">Roadmaps</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-lg font-semibold uppercase tracking-wide text-primary border-2 border-primary p-4 text-center bg-white shadow-neo transition-neo">
            Pick a role, skill, project track, or best-practice path and jump directly to <u className="decoration-highlight-yellow decoration-2 underline-offset-4">roadmap.sh</u> resources.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-10 relative z-20">
          <label htmlFor="roadmap-search" className="sr-only">Search roadmap buttons</label>
          <div className="flex items-center gap-3 bg-white focus-within:bg-highlight-yellow focus-within:-translate-y-1 focus-within:translate-x-1 focus-within:shadow-none border-2 border-primary px-4 py-3 shadow-neo transition-neo group">
            <Search size={24} className="text-primary shrink-0 group-focus-within:animate-bounce" />
            <input
              id="roadmap-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH ROADMAPS, SKILLS, AND TRACKS..."
              className="w-full bg-transparent outline-none text-base md:text-lg font-bold text-primary placeholder:text-primary/60 uppercase tracking-wider pr-10"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 p-1.5 bg-highlight-pink hover:bg-highlight-orange border-2 border-primary shadow-neo hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all focus:outline-none"
                aria-label="Clear search"
              >
                <X size={20} strokeWidth={2.5} className="text-primary" />
              </button>
            )}
          </div>
        </div>

        {filteredSections.length === 0 ? (
          <div className="bg-highlight-orange border-2 border-primary shadow-neo p-8 text-center transform -rotate-2 hover:rotate-0 transition-neo flex flex-col items-center justify-center gap-4 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-white border-2 border-primary rounded-full flex items-center justify-center shadow-neo mb-2">
              <Search size={32} className="text-primary" />
            </div>
            <p className="font-heading text-2xl uppercase text-primary tracking-wide">
              No Matches Found
            </p>
            <p className="font-bold text-base uppercase bg-white px-3 py-1.5 border-2 border-primary transform rotate-2">Try a different keyword</p>
            <button 
              onClick={() => setQuery('')}
              className="mt-3 px-6 py-3 bg-highlight-yellow border-2 border-primary text-base font-bold uppercase tracking-widest shadow-neo hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-10">
            {filteredSections.map((section, index) => (
              <section 
                key={section.title} 
                className={`${section.cardClass} border-2 border-primary shadow-neo p-5 md:p-8 relative group transition-neo duration-300`}
              >
                {/* Large Background Icon */}
                <div className="absolute -right-8 -bottom-8 opacity-[0.05] group-hover:opacity-10 transition-all transform group-hover:scale-125 group-hover:-rotate-12 duration-700 pointer-events-none hidden md:block">
                  <section.icon size={200} />
                </div>
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 relative z-10">
                  <div className={`p-3 border-2 border-primary shadow-neo transition-neo ${section.iconClass}`}>
                    <section.icon size={24} strokeWidth={2} />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-widest text-primary bg-white px-4 py-2 border-2 border-primary shadow-neo transition-neo">
                    {section.title}
                  </h2>
                </div>
                
                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 relative z-10">
                  {section.items.map((item) => (
                    <RoadmapButton key={`${section.title}-${item.label}`} item={item} hoverClass={section.hoverClass} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
