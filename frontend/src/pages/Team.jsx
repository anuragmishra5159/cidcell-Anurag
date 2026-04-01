import { useState, useEffect } from 'react';
import axios from 'axios';
import { Linkedin, Github, Users, ShieldCheck, Zap } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';

// ── Mentorship (Static) ──────────────────────────────────────────────────
const mentors = [
  { 
    name: 'Dr. Manish Dixit', 
    role: 'Faculty Mentor', 
    accent: 'border-accent-blue/50 bg-accent-blue/10 text-accent-blue', 
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    image: '/manishsir.jpg.jpeg', 
    bio: 'A visionary educator with over two decades of experience, dedicated to fostering innovation and technical excellence.'
  },
  { 
    name: 'Atul Chauhan', 
    role: 'Co-Mentor', 
    accent: 'border-accent-magenta/50 bg-accent-magenta/10 text-accent-magenta', 
    glow: 'shadow-[0_0_15px_rgba(217,70,239,0.2)]',
    image: '/atul2.jpeg', 
    bio: 'Brings industry-aligned perspective and practical engineering wisdom to the team, helping bridge the gap between theory and execution.'
  },
];

const staticSubTeams = [];
const staticCoreTeam = [];
const staticStudentBoard = [];

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

// ── Components ─────────────────────────────────────────────────────────────

function LeaderCard({ person, delay, isDynamic = false }) {
  const name = isDynamic ? person.user?.username : person.name;
  const role = isDynamic ? person.designation : person.role;
  const accent = person.accent || 'border-accent/50 bg-accent/10 text-accent';
  const glow = person.glow || 'shadow-glow-purple';
  const imageUrl = isDynamic ? person.user?.profilePicture : person.image;

  return (
    <ScrollReveal delay={delay} className="h-full w-full max-w-[450px] mx-auto text-center cursor-default">
      <div className={`glass-panel p-8 md:p-10 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center h-full relative overflow-hidden group hover:${glow} border ${accent.split(' ')[0]}`}>
        {/* Glow behind the card internally */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${accent.split(' ')[1]} rounded-full blur-[50px] opacity-30 group-hover:scale-150 transition-transform duration-700`}></div>
        
        <div className={`w-36 h-36 md:w-44 md:h-44 rounded-full bg-surface border border-white/10 shadow-glass flex items-center justify-center mb-6 z-10 overflow-hidden group-hover:border-white/30 transition-colors p-1.5`}>
           <div className="w-full h-full rounded-full overflow-hidden bg-bg relative">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading font-black text-4xl text-slate-500">
                  {getInitials(name)}
                </span>
              </div>
            )}
           </div>
        </div>
        
        <h3 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase leading-tight mb-2 z-10 group-hover:scale-105 transition-transform">
          {name}
        </h3>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-border rounded-full mb-6 z-10 shadow-glass">
           <ShieldCheck size={12} className="text-secondary" />
           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
             {role}
           </p>
        </div>
        
        {person.bio && (
          <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8 z-10 max-w-[320px] mx-auto">
            {person.bio}
          </p>
        )}

        {person.domain && (
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest z-10 mb-4 bg-white/5 px-2 py-1 rounded-md">
            {person.domain}
          </p>
        )}

        <div className="flex gap-4 mt-auto z-10 pt-6 border-t border-border w-full justify-center">
          {(isDynamic ? person.user?.socialLinks?.linkedin : person.linkedin) && (
            <a href={isDynamic ? person.user.socialLinks.linkedin : person.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-border text-secondary hover:text-white hover:border-blue-400 hover:bg-blue-400/20 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all">
               <Linkedin size={16} />
            </a>
          )}
          {(isDynamic ? person.user?.socialLinks?.github : person.github) && (
            <a href={isDynamic ? person.user.socialLinks.github : person.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-border text-secondary hover:text-white hover:border-white hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all">
               <Github size={16} />
            </a>
          )}
          {(isDynamic ? person.user?.socialLinks?.leetcode : person.leetcode) && (
            <a href={isDynamic ? person.user.socialLinks.leetcode : person.leetcode} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-border text-secondary hover:text-white hover:border-yellow-400 hover:bg-yellow-400/20 hover:shadow-[0_0_10px_rgba(250,204,21,0.3)] transition-all font-black text-[10px]">
               LC
            </a>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

function MemberCard({ member, delay }) {
  const name = member.user?.username || member.name;
  const linkedin = member.user?.socialLinks?.linkedin || member.linkedin;
  const github = member.user?.socialLinks?.github || member.github;
  const leetcode = member.user?.socialLinks?.leetcode || member.leetcode;

  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="glass-card flex items-center gap-5 p-4 md:p-5 h-full relative group hover:-translate-y-1 hover:shadow-glow-purple transition-all duration-300 overflow-hidden cursor-default border border-white/5 hover:border-accent/40">
        
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-surface border border-white/10 shrink-0 z-10 overflow-hidden p-1 group-hover:border-accent/30 shadow-glass">
            <div className="w-full h-full rounded-full overflow-hidden bg-bg relative">
              {member.user?.profilePicture ? (
                <img 
                  src={member.user.profilePicture} 
                  alt={name} 
                  className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading font-black text-xl text-slate-500 leading-none">
                    {getInitials(name)}
                  </span>
                </div>
              )}
            </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-grow text-left overflow-hidden z-10 h-full justify-center">
          <h4 className="font-heading font-bold text-lg md:text-xl text-white uppercase leading-tight truncate mb-1.5 group-hover:text-accent transition-colors">
            {name}
          </h4>
          
          <div className="flex flex-col gap-1.5 mb-2">
            <p className="inline-block px-2.5 py-1 bg-surface border border-border rounded-md text-[9px] font-bold uppercase tracking-widest text-slate-300 self-start group-hover:bg-accent/10 group-hover:border-accent/30 group-hover:text-accent transition-colors">
              {member.designation || member.role}
            </p>
            {member.domain && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{member.domain}</p>}
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border group-hover:border-accent/20 transition-colors">
            <div className="flex gap-2.5">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                  <Linkedin size={14} />
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Github size={14} />
                </a>
              )}
              {leetcode && (
                <a href={leetcode} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-yellow-400 font-bold text-[9px] transition-colors leading-[14px]">
                  LC
                </a>
              )}
            </div>
            {member.user?.email && (
              <span className="text-[9px] font-medium text-slate-600 truncate max-w-[100px]">
                {member.user.email}
              </span>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Team() {
  const initialSubGroups = {};
  staticSubTeams.forEach(m => {
    const d = m.domain || 'General';
    if (!initialSubGroups[d]) initialSubGroups[d] = [];
    initialSubGroups[d].push(m);
  });

  const [teamData, setTeamData] = useState({
    board: [...staticStudentBoard],
    core: [...staticCoreTeam],
    subGroups: initialSubGroups
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/members`);
        const members = res.data;

        const board = [...members.filter(m => m.team === 'Student Board'), ...staticStudentBoard];
        const core = [...members.filter(m => m.team === 'Core Team'), ...staticCoreTeam];
        
        const subTeams = [...members.filter(m => m.team === 'Sub-Teams'), ...staticSubTeams];
        const groups = {};
        subTeams.forEach(m => {
          const domain = m.domain || 'General';
          if (!groups[domain]) groups[domain] = [];
          groups[domain].push(m);
        });

        setTeamData({ board, core, subGroups: groups });
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="bg-bg min-h-screen text-white pt-32 pb-20 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-glow-blue rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-glow-magenta rounded-full pointer-events-none -z-10"></div>

      {/* Hero */}
      <section className="relative overflow-hidden mb-24">
        <div className="container-max mx-auto px-4 text-center">
          <div className="inline-flex px-4 py-1.5 glass-panel rounded-full border border-accent/20 mb-6 items-center gap-2 shadow-glow-purple">
             <Zap size={14} className="text-accent" />
             <span className="font-semibold uppercase tracking-[0.2em] text-xs text-secondary">Our People</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-[6rem] font-black text-white mb-6 uppercase leading-none drop-shadow-2xl">
            Meet the {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-magenta to-accent filter drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
               Network
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto glass-panel p-4 border-l-2 border-accent leading-relaxed inline-block">
            The dedicated architects, mentors, and developers driving the CID-Cell forward.
          </p>
        </div>
      </section>

      {/* Mentorship */}
      <section className="relative z-10 mb-32">
        <div className="container-max mx-auto px-4">
          <SectionHeading subtitle="Advisors" title="Mentorship" />
          <div className="grid sm:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto">
            {mentors.map((person, i) => (
              <LeaderCard key={person.name} person={person} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Student Board */}
      {teamData.board.length > 0 && (
        <section className="relative z-10 mb-32">
          <div className="container-max mx-auto px-4">
            <SectionHeading subtitle="Leadership" title="Student Board" />
            <div className="grid sm:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto">
              {teamData.board.map((person, i) => (
                <LeaderCard key={person._id} person={person} delay={i * 100} isDynamic={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Core Team */}
      {teamData.core.length > 0 && (
        <section className="relative z-10 mb-32">
          <div className="container-max mx-auto px-4">
            <SectionHeading subtitle="Executives" title="Core Team" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
              {teamData.core.map((person, i) => (
                 <MemberCard key={person._id || i} member={person} delay={i * 50} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sub-Teams */}
      {Object.keys(teamData.subGroups).length > 0 && (
        <section className="relative z-10">
          <div className="container-max mx-auto px-4">
            <SectionHeading subtitle="Departments" title="Sub-Teams" />
            <div className="flex flex-col gap-12 max-w-[1400px] mx-auto">
              {Object.entries(teamData.subGroups).map(([domain, members], di) => {
                return (
                  <div key={domain} className="glass-panel p-6 md:p-10 border border-white/10 rounded-[2rem] shadow-glass relative group overflow-hidden">
                    {/* Domain BG Glow */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-glow-accent rounded-full rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150 group-hover:bg-accent/10"></div>
                    
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-accent shadow-glass">
                         <Users size={18} />
                      </div>
                      <h3 className="font-heading text-2xl md:text-3xl font-black text-white uppercase tracking-widest drop-shadow-md">
                        {domain.toLowerCase().endsWith('team') ? domain : `${domain} Team`}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 relative z-10">
                      {members.map((member, mi) => (
                        <MemberCard
                          key={member._id || mi}
                          member={member}
                          delay={mi * 50}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {loading && (
         <div className="flex flex-col items-center justify-center py-20 gap-4 mt-12 relative z-10">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <div className="font-medium text-slate-400 text-sm tracking-widest uppercase">Fetching Roster...</div>
         </div>
      )}

    </div>
  );
}
