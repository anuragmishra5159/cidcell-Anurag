import { useState, useEffect } from 'react';
import axios from 'axios';
import { Linkedin, Github } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';

// ── Mentorship (Static) ──────────────────────────────────────────────────
const facultyCoordinator = [
  { name: 'Dr. Jane Teacher', role: 'Faculty Coordinator', accent: 'bg-highlight-green' },
];

const mentors = [
  { name: 'Dr. Manish Dixit', role: 'Faculty Mentor', accent: 'bg-highlight-blue' },
  { name: 'Atul Chauhan', role: 'Co-Mentor', accent: 'bg-highlight-orange' },
];

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

// ── Components ─────────────────────────────────────────────────────────────

function LeaderCard({ person, delay, isDynamic = false }) {
  const name = isDynamic ? person.user?.username : person.name;
  const role = isDynamic ? person.designation : person.role;
  const accent = person.accent || 'bg-highlight-yellow';

  return (
    <ScrollReveal delay={delay} className="h-full w-full max-w-[280px] mx-auto text-center">
      <div
        className={`${accent} border-3 border-black p-8 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 flex flex-col items-center h-full relative overflow-hidden group z-10`}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-black/5 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-[2.5]"></div>
        <div className="w-24 h-24 bg-white border-3 border-black shadow-small flex items-center justify-center mb-5 transform -rotate-2 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 z-10">
          <span className="font-heading font-black text-3xl text-black">
            {getInitials(name)}
          </span>
        </div>
        <h3 className="font-heading font-bold text-2xl text-black uppercase leading-tight mb-1 z-10">
          {name}
        </h3>
        <p className="inline-block bg-black text-white px-3 py-1 text-[10px] font-bold uppercase transform rotate-1 z-10 mb-3">
          {role}
        </p>
        {person.domain && (
          <p className="text-[10px] font-black text-black/40 uppercase tracking-widest z-10 mb-4">
            {person.domain}
          </p>
        )}

        {((isDynamic && person.user?.socialLinks) || (!isDynamic && (person.linkedin || person.github || person.leetcode))) && (
          <div className="flex gap-3 mt-auto z-10 pt-4 border-t border-black/5 w-full justify-center">
            {(isDynamic ? person.user.socialLinks.linkedin : person.linkedin) && (
              <a href={isDynamic ? person.user.socialLinks.linkedin : person.linkedin} target="_blank" className="text-black hover:scale-110 transition-transform"><Linkedin size={16} /></a>
            )}
            {(isDynamic ? person.user.socialLinks.github : person.github) && (
              <a href={isDynamic ? person.user.socialLinks.github : person.github} target="_blank" className="text-black hover:scale-110 transition-transform"><Github size={16} /></a>
            )}
            {(isDynamic ? person.user.socialLinks.leetcode : person.leetcode) && (
              <a href={isDynamic ? person.user.socialLinks.leetcode : person.leetcode} target="_blank" className="text-black hover:scale-110 transition-transform font-black text-[10px] bg-black text-white px-1 leading-none rounded">LC</a>
            )}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}

function MemberCard({ member, accentClass, delay }) {
  const name = member.user?.username || member.name;
  const linkedin = member.user?.socialLinks?.linkedin || member.linkedin;
  const github = member.user?.socialLinks?.github || member.github;
  const leetcode = member.user?.socialLinks?.leetcode || member.leetcode;

  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="bg-white border-3 border-black p-3.5 shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-200 flex items-center gap-4 h-full relative group">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 ${accentClass} transition-opacity duration-200`}></div>
        
        {/* Avatar */}
        <div
          className={`w-14 h-14 ${accentClass} border-2 border-black flex items-center justify-center transform -rotate-2 group-hover:rotate-2 transition-transform duration-300 shrink-0 z-10`}
        >
          <span className="font-heading font-black text-xl text-black leading-none">
            {getInitials(name)}
          </span>
        </div>

        <div className="flex flex-col flex-grow text-left overflow-hidden z-10">
          <h4 className="font-heading font-bold text-base md:text-lg text-black uppercase leading-tight truncate">
            {name}
          </h4>
          <div className="flex flex-col gap-0.5 mb-2">
            <p className="text-[9px] font-black text-slate-800 uppercase tracking-tighter">{member.designation}</p>
            {member.domain && <p className="text-[8px] font-bold text-slate-400 uppercase">{member.domain}</p>}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex gap-2">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-all"
                >
                  <Linkedin size={14} />
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-all"
                >
                  <Github size={14} />
                </a>
              )}
              {leetcode && (
                <a
                  href={leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-bold transition-all text-[8px] font-black border-2 border-slate-100 px-1 rounded bg-slate-50"
                >
                  LC
                </a>
              )}
            </div>
            {member.user?.email && (
              <span className="text-[8px] font-medium text-slate-300 truncate max-w-[80px]">
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
  const [teamData, setTeamData] = useState({
    board: [],
    core: [],
    subGroups: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/members`);
        const members = res.data;

        const board = members.filter(m => m.team === 'Student Board');
        const core = members.filter(m => m.team === 'Core Team');
        
        const subTeams = members.filter(m => m.team === 'Sub-Teams');
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

  const getSubTeamAccent = (index) => {
    const accents = ['bg-highlight-blue', 'bg-highlight-teal', 'bg-highlight-purple', 'bg-highlight-green', 'bg-highlight-pink', 'bg-highlight-orange', 'bg-highlight-yellow'];
    return accents[index % accents.length];
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-highlight-yellow border-b-3 border-black relative overflow-hidden">
        <div className="container-max mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 bg-black text-white text-sm font-bold uppercase mb-4 shadow-neo transform -rotate-2">
            Our People
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-black mb-6 uppercase leading-none">
            Meet the{' '}
            <span className="p-1 bg-highlight-purple text-black inline-block transform rotate-1 border-3 border-black shadow-small">
              Team
            </span>
          </h1>
          <p className="text-black text-xl font-medium max-w-2xl mx-auto border-l-4 border-black pl-4">
            The dedicated mentors and student leaders who drive CID-Cell forward.
          </p>
        </div>
      </section>

      {/* Student Board */}
      <section className="section-padding bg-white border-b-3 border-black">
        <div className="container-max mx-auto">
          <SectionHeading subtitle="Leadership" title="Student Board" />
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {teamData.board.map((person, i) => (
              <LeaderCard key={person._id} person={person} delay={i * 120} isDynamic={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="section-padding bg-highlight-blue border-b-3 border-black">
        <div className="container-max mx-auto">
          <SectionHeading subtitle="Executives" title="Core Team" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {teamData.core.map((person, i) => (
              <ScrollReveal key={person._id} delay={i * 100} className="h-full">
                <div
                  className={`bg-highlight-teal border-3 border-black p-6 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 flex flex-col items-center text-center h-full`}
                >
                  <div className="w-16 h-16 bg-white border-3 border-black shadow-small flex items-center justify-center mb-4 transform rotate-1">
                    <span className="font-heading font-black text-xl text-black">
                      {getInitials(person.user?.username)}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-black uppercase leading-tight mb-1">
                    {person.user?.username}
                  </h3>
                  <p className="inline-block bg-black text-white px-2 py-0.5 text-[9px] font-bold uppercase transform -rotate-1 mb-2">
                    {person.designation}
                  </p>
                  {person.domain && (
                    <p className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-4">
                      {person.domain}
                    </p>
                  )}
                  <div className="flex flex-col items-center gap-1 mt-auto border-t-2 border-black pt-4 w-full">
                    <div className="flex gap-3 justify-center mb-1">
                      {person.user?.socialLinks?.linkedin && (
                        <a
                          href={person.user.socialLinks.linkedin}
                          target="_blank"
                          className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-highlight-blue transition-colors"
                        >
                          <Linkedin size={12} className="stroke-[2.5px]" />
                        </a>
                      )}
                      {person.user?.socialLinks?.github && (
                        <a
                          href={person.user.socialLinks.github}
                          target="_blank"
                          className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-highlight-yellow transition-colors"
                        >
                          <Github size={12} className="stroke-[2.5px]" />
                        </a>
                      )}
                      {person.user?.socialLinks?.leetcode && (
                        <a
                          href={person.user.socialLinks.leetcode}
                          target="_blank"
                          className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-highlight-pink transition-colors font-black text-[8px]"
                        >
                          LC
                        </a>
                      )}
                    </div>
                    {person.user?.email && (
                      <span className="text-[8px] font-bold text-black/40 truncate w-full uppercase">
                        {person.user.email}
                      </span>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Teams */}
      <section className="py-24 bg-highlight-cream border-b-3 border-black">
        <div className="container-max mx-auto px-4">
          <SectionHeading subtitle="Departments" title="Sub-Teams" />
          <div className="flex flex-col gap-10">
            {Object.entries(teamData.subGroups).map(([domain, members], di) => {
              const accent = getSubTeamAccent(di);
              return (
                <div key={domain} className="bg-white border-3 border-black p-6 md:p-8 shadow-neo relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${accent} rounded-bl-full -mr-8 -mt-8 opacity-20 transition-transform duration-700 group-hover:scale-[3]`}></div>
                  
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <h3 className="font-heading text-3xl md:text-4xl font-black text-black uppercase tracking-widest">
                      {domain} Team
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 relative z-10">
                    {members.map((member, mi) => (
                      <MemberCard
                        key={member._id}
                        member={member}
                        accentClass={accent}
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

      {/* Mentorship */}
      <section className="section-padding bg-white border-b-3 border-black">
        <div className="container-max mx-auto px-4">
          <SectionHeading subtitle="Advisors" title="Mentorship" />
          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
            <div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-1 bg-black flex-grow"></div>
                <h3 className="font-heading text-2xl md:text-3xl font-black text-black uppercase px-4 text-center">Faculty Coordinator</h3>
                <div className="h-1 bg-black flex-grow"></div>
              </div>
              <div className="flex justify-center">
                {facultyCoordinator.map((person, i) => (
                  <LeaderCard key={person.name} person={person} delay={i * 120} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-1 bg-black flex-grow"></div>
                <h3 className="font-heading text-2xl md:text-3xl font-black text-black uppercase px-4 text-center">Mentors</h3>
                <div className="h-1 bg-black flex-grow"></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {mentors.map((person, i) => (
                  <LeaderCard key={person.name} person={person} delay={i * 120} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
