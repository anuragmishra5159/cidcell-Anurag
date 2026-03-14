import { Linkedin, Github } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';

// ── Leadership ──────────────────────────────────────────────────────────────
const facultyCoordinator = [
  {
    name: 'Dr. Jane Teacher',
    role: 'Faculty Coordinator',
    accent: 'bg-highlight-green',
  },
];

const mentors = [
  {
    name: 'Dr. Manish Dixit',
    role: 'Faculty Mentor',
    accent: 'bg-highlight-blue',
  },
  {
    name: 'Atul Chauhan',
    role: 'Co-Mentor',
    accent: 'bg-highlight-orange',
  },
];

const studentChairs = [
  {
    name: 'Anuj Shrivastava',
    role: 'Student Chairman',
    accent: 'bg-highlight-yellow',
  },
  {
    name: 'John Student',
    role: 'Vice Chairman',
    accent: 'bg-highlight-pink',
  },
];

// ── Core Team ───────────────────────────────────────────────────────────────
const coreTeam = [
  {
    name: 'John Doe',
    role: 'Technical Lead',
    accent: 'bg-highlight-teal',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Jane Smith',
    role: 'Design Lead',
    accent: 'bg-highlight-pink',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Alice Johnson',
    role: 'Events Manager',
    accent: 'bg-highlight-green',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Bob Brown',
    role: 'Outreach Coordinator',
    accent: 'bg-highlight-blue',
    linkedin: '#',
    github: '#',
  },
];

// ── Sub-teams ───────────────────────────────────────────────────────────────
const teamSections = [
  {
    title: 'Frontend Team',
    tag: 'Web',
    accent: 'bg-highlight-blue',
    bg: 'bg-white',
    members: [
      { name: 'Krish Dargar',   linkedin: 'https://www.linkedin.com/in/krish-dargar-101774324/', github: 'https://github.com/KD2303' },
      { name: 'Anurag Mishra',  linkedin: 'https://www.linkedin.com/in/anuragmishra5159/',        github: 'https://github.com/anuragmishra5159' },
      { name: 'Nemish Nagaria', linkedin: 'https://www.linkedin.com/in/nemish-nagaria-555198313/', github: 'https://github.com/thedebroglie' },
    ],
  },
  {
    title: 'Backend Team',
    tag: 'Web',
    accent: 'bg-highlight-teal',
    bg: 'bg-highlight-blue',
    members: [
      { name: 'Arin Gupta',         linkedin: 'https://www.linkedin.com/in/arin-gupta-2b94b032a/',          github: 'https://github.com/githubarin-art' },
      { name: 'Sahil Jain',         linkedin: 'https://www.linkedin.com/in/sahil-jain-610907211/',          github: 'https://github.com/SAHILJAIN2024' },
      { name: 'Harsh Manmode',      linkedin: 'https://www.linkedin.com/in/harsh-manmode-2a0b91325',        github: 'https://github.com/Harsh-2006-git' },
      { name: 'Aditya Gupta',       linkedin: 'https://www.linkedin.com/in/aditya-gupta-4a037533a/',       github: 'https://github.com/Adityagupta-mits' },
      { name: 'Amit Manmode',       linkedin: 'https://www.linkedin.com/in/amit-manmode-5b1a23328/',       github: 'https://github.com/Amit-akm-22' },
      { name: 'Yogesh Sanodiya',    linkedin: 'https://www.linkedin.com/in/yogesh-sanodiya-8a2816298/',    github: 'https://github.com/yogeshsanodiya59-web' },
    ],
  },
  {
    title: 'AI / ML Team',
    tag: 'Intelligence',
    accent: 'bg-highlight-purple',
    bg: 'bg-white',
    members: [
      { name: 'Vansh Pratap Singh Jadon', linkedin: 'https://www.linkedin.com/in/vansh-pratap-singh-jadon-5407b2320', github: 'https://github.com/jadonvansh2005' },
    ],
  },
  {
    title: 'Data Science Team',
    tag: 'Analytics',
    accent: 'bg-highlight-green',
    bg: 'bg-highlight-teal',
    members: [
      { name: 'Astha Saini',  linkedin: 'https://www.linkedin.com/in/astha-saini-662369363/',  github: 'https://github.com/asthasaini2605' },
      { name: 'Alakh Gupta', linkedin: 'https://www.linkedin.com/in/alakh-gupta-475368311/', github: 'https://github.com/Alakh-gupta' },
      { name: 'Hariom Gourh', linkedin: 'https://www.linkedin.com/in/hariomgourh',             github: 'https://github.com/HariomGourh' },
    ],
  },
  {
    title: 'App Development Team',
    tag: 'Mobile',
    accent: 'bg-highlight-pink',
    bg: 'bg-white',
    members: [
      { name: 'Kanika Jain',          linkedin: 'https://www.linkedin.com/in/kanika-jain-5477b52b9/',          github: 'https://github.com/kanikajain2' },
      { name: 'Pushpendra Suryawanshi', linkedin: 'https://www.linkedin.com/in/pushpendra-suryawanshi-b8aa51338/', github: 'https://github.com/Pushpendra-7-ux' },
    ],
  },
  {
    title: 'Graphic Design Team',
    tag: 'Creatives',
    accent: 'bg-highlight-orange',
    bg: 'bg-highlight-blue',
    members: [
      { name: 'Prateek Amar Batham', linkedin: 'https://www.linkedin.com/in/prateek-amar-batham-827734329/', github: 'https://github.com/Omyx0' },
      { name: 'Palash Rai',          linkedin: 'https://www.linkedin.com/in/palash-rai2612',                  github: 'https://github.com/Palash-r26' },
    ],
  },
  {
    title: 'Videography Team',
    tag: 'Media',
    accent: 'bg-highlight-yellow',
    bg: 'bg-white',
    members: [
      { name: 'Sarvesh Baghel',  linkedin: 'https://www.linkedin.com/in/sarvesh-baghel-b3a726274/', github: 'https://github.com/sarveshbaghel' },
      { name: 'Shashank Nigam', linkedin: 'https://www.linkedin.com/in/shashanknigam2712/',  github: 'https://github.com/ShashankNigam27' },
      { name: 'Archit Varshney', linkedin: 'https://www.linkedin.com/in/archit-varshney-30b2773a2',  github: 'https://github.com/architvarshney7' },
      { name: 'Naveen Sharma',   linkedin: 'https://www.linkedin.com/in/naveen-sharma-64b51333a/' },
    ],
  },
  {
    title: 'Management Team',
    tag: 'Operations',
    accent: 'bg-highlight-purple',
    bg: 'bg-highlight-green',
    members: [
      { name: 'Prarthana Sharma', linkedin: 'https://www.linkedin.com/in/prarthana-sharma-8b3923368/', github: 'https://github.com/sharmaprarthana829-source' },
    ],
  },
  {
    title: 'Content Writing Team',
    tag: 'Content',
    accent: 'bg-highlight-blue',
    bg: 'bg-white',
    members: [
      { name: 'Aakriti Ahirwar', linkedin: 'https://www.linkedin.com/in/aakritiahirwar22/', github: 'https://github.com/aakriti1002' },
    ],
  },
];

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function LeaderCard({ person, delay }) {
  return (
    <ScrollReveal delay={delay} className="h-full w-full max-w-[280px] mx-auto">
      <div
        className={`${person.accent} border-3 border-black p-8 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 flex flex-col items-center text-center h-full relative overflow-hidden group z-10`}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-black/5 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-[2.5]"></div>
        <div className="w-24 h-24 bg-white border-3 border-black shadow-small flex items-center justify-center mb-5 transform -rotate-2 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 z-10">
          <span className="font-heading font-black text-3xl text-black">
            {getInitials(person.name)}
          </span>
        </div>
        <h3 className="font-heading font-bold text-2xl text-black uppercase leading-tight mb-3 z-10">
          {person.name}
        </h3>
        <p className="inline-block bg-black text-white px-3 py-1.5 text-xs font-bold uppercase transform rotate-1 z-10">
          {person.role}
        </p>
      </div>
    </ScrollReveal>
  );
}

// ── Member card ─────────────────────────────────────────────────────────────
function MemberCard({ member, accentClass, delay }) {
  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="bg-white border-3 border-black p-3.5 shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-200 flex items-center gap-4 h-full relative group">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 ${accentClass} transition-opacity duration-200`}></div>
        {/* Avatar */}
        <div
          className={`w-14 h-14 ${accentClass} border-2 border-black flex items-center justify-center transform -rotate-2 group-hover:rotate-2 transition-transform duration-300 shrink-0 z-10`}
        >
          <span className="font-heading font-black text-xl text-black leading-none">
            {getInitials(member.name)}
          </span>
        </div>

        <div className="flex flex-col flex-grow text-left overflow-hidden z-10">
          <h4 className="font-heading font-bold text-base md:text-lg text-black uppercase leading-tight truncate">
            {member.name}
          </h4>
          <div className="flex gap-2.5 mt-1.5">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} LinkedIn`}
                className="text-gray-600 hover:text-black hover:scale-110 transition-all"
              >
                <Linkedin size={18} className="stroke-[2.5px]" />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} GitHub`}
                className="text-gray-600 hover:text-black hover:scale-110 transition-all"
              >
                <Github size={18} className="stroke-[2.5px]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Team() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-32 pb-16 bg-highlight-yellow border-b-3 border-black relative overflow-hidden">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
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

      {/* ── Student Board ── */}
      <section className="section-padding bg-white border-b-3 border-black">
        <div className="container-max mx-auto">
          <SectionHeading subtitle="Leadership" title="Student Board" />
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {studentChairs.map((person, i) => (
              <LeaderCard key={person.name} person={person} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Team ── */}
      <section className="section-padding bg-highlight-blue border-b-3 border-black">
        <div className="container-max mx-auto">
          <SectionHeading subtitle="Executives" title="Core Team" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {coreTeam.map((person, i) => (
              <ScrollReveal key={person.name} delay={i * 100} className="h-full">
                <div
                  className={`${person.accent} border-3 border-black p-6 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 flex flex-col items-center text-center h-full`}
                >
                  <div className="w-16 h-16 bg-white border-3 border-black shadow-small flex items-center justify-center mb-4 transform rotate-1">
                    <span className="font-heading font-black text-xl text-black">
                      {getInitials(person.name)}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-black uppercase leading-tight mb-2">
                    {person.name}
                  </h3>
                  <p className="inline-block bg-black text-white px-2 py-1 text-xs font-bold uppercase transform -rotate-1 mb-4">
                    {person.role}
                  </p>
                  <div className="flex gap-3 mt-auto border-t-2 border-black pt-4 w-full justify-center">
                    {person.linkedin && (
                      <a
                        href={person.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-highlight-blue transition-colors"
                      >
                        <Linkedin size={14} className="stroke-[2.5px]" />
                      </a>
                    )}
                    {person.github && (
                      <a
                        href={person.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-highlight-yellow transition-colors"
                      >
                        <Github size={14} className="stroke-[2.5px]" />
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sub-team sections ── */}
      <section className="py-24 bg-highlight-cream border-b-3 border-black">
        <div className="container-max mx-auto px-4">
          <SectionHeading subtitle="Departments" title="Sub-Teams" />

          <div className="flex flex-col gap-10">
            {teamSections.map((section) => (
              <div key={section.title} className="bg-white border-3 border-black p-6 md:p-8 shadow-neo relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 ${section.accent} rounded-bl-full -mr-8 -mt-8 opacity-20 transition-transform duration-700 group-hover:scale-[3]`}></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-8 relative z-10">
                  <span className={`inline-block px-4 py-1.5 ${section.accent} border-2 border-black shadow-neo-sm text-black font-bold uppercase tracking-wider transform -rotate-1 self-start sm:self-auto`}>
                    {section.tag}
                  </span>
                  <h3 className="font-heading text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
                    {section.title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 relative z-10">
                  {section.members.map((member, mi) => (
                    <MemberCard
                      key={member.name}
                      member={member}
                      accentClass={section.accent}
                      delay={mi * 50}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Faculty & Mentors ── */}
      <section className="section-padding bg-white border-b-3 border-black">
        <div className="container-max mx-auto">
          <SectionHeading subtitle="Advisors" title="Mentorship" />

          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
            
            {/* Faculty Coordinator */}
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

            {/* Mentors */}
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

      {/* ── Join CTA ── */}
      <section className="section-padding bg-highlight-purple border-b-3 border-black">
        <div className="container-max mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-black mb-6 uppercase">
            Want to Join the Team?
          </h2>
          <p className="text-black font-medium text-xl max-w-xl mx-auto mb-8 bg-white border-2 border-black p-4 shadow-neo transform rotate-1">
            We're always looking for passionate students who want to lead, innovate, and make an impact.
          </p>
          <a
            href="/contact"
            className="btn-neo bg-black text-white hover:bg-gray-800 text-lg px-8 py-4"
          >
            Apply Now
          </a>
        </div>
      </section>
    </>
  );
}
