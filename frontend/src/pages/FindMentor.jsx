import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';
import { Search, Linkedin, Github, Code2, MessageCircle, Sparkles, Filter, Users as UsersIcon } from 'lucide-react';

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function MentorCard({ mentor, delay }) {
  const navigate = useNavigate();
  const name = mentor.user?.username || 'Unknown';
  const designation = mentor.designation || 'Mentor';
  const domain = mentor.domain || 'General';
  const profilePicture = mentor.user?.profilePicture;
  const linkedin = mentor.user?.socialLinks?.linkedin;
  const github = mentor.user?.socialLinks?.github;
  const leetcode = mentor.user?.socialLinks?.leetcode;
  const branch = mentor.user?.branch;
  const batch = mentor.user?.batch;
  const mentorId = mentor.user?._id;

  const handleChat = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/doubts/sessions`, {
        mentorId: mentorId,
        domain: domain
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/chat', { state: { selectedSessionId: res.data._id } });
    } catch (err) {
      console.error('Error starting chat session:', err);
    }
  };

  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-accent/40 hover:shadow-glow-purple hover:-translate-y-1">
        
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-glass opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Top Header/Banner */}
        <div className="relative h-28 bg-gradient-to-br from-accent/20 to-accent-magenta/10 border-b border-white/5 overflow-hidden p-5 flex justify-end items-start">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {domain && (
            <span className="relative z-10 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent-magenta shadow-xl">
              {domain}
            </span>
          )}
        </div>
        
        {/* Profile Content */}
        <div className="relative px-6 pb-8 flex flex-col flex-1 items-center -mt-12">
          
          {/* Avatar Container */}
          <div className="relative z-10 mb-5">
            <div className="w-24 h-24 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-accent/50 group-hover:shadow-glow-purple">
              {profilePicture ? (
                <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-heading font-black text-3xl text-white tracking-widest">
                  {getInitials(name)}
                </span>
              )}
            </div>
            {/* Status Glow Orb */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#121212] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>

          <div className="text-center w-full">
            <h3 className="font-heading font-black text-xl text-white uppercase leading-tight mb-1 tracking-widest transition-all duration-300 group-hover:text-accent">
              {name}
            </h3>
            <div className="flex items-center justify-center gap-2 mb-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {designation}
              </span>
            </div>

            {(batch || branch) && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {branch && (
                  <span className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    {branch}
                  </span>
                )}
                {batch && (
                   <span className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    {batch}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto w-full flex flex-col gap-3">
            <button
              onClick={handleChat}
              className="w-full relative z-10 py-3.5 bg-accent text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-glow-purple hover:bg-accent-magenta active:scale-95 flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} />
              Connect Now
            </button>

            <div className="flex items-center justify-center gap-4 py-2 opacity-60 hover:opacity-100 transition-opacity">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent transition-colors">
                  <Linkedin size={18} />
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                  <Github size={18} />
                </a>
              )}
              {leetcode && (
                <a href={leetcode} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent-magenta transition-colors">
                  <Code2 size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function MentorHub() {
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMentors();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/mentors?${params.toString()}`);

      const mapped = res.data.map(m => ({
          _id: m._id,
          designation: 'Staff Mentor',
          domain: m.domainOfExpertise,
          expertise: m.expertise || [],
          aboutMentor: m.aboutMentor || '',
          user: {
              _id: m._id,
              username: m.username,
              profilePicture: m.profilePicture,
              branch: m.department,
              batch: m.batch,
              socialLinks: m.socialLinks
          }
      }));

      const mentorsWithDomain = mapped.filter(member => member.domain && member.domain.trim() !== '');
      setMentors(mentorsWithDomain);

      // Extract unique domains
      const uniqueDomains = [...new Set(mentorsWithDomain.map(m => m.domain))].sort();
      setDomains(uniqueDomains);

      if (uniqueDomains.length > 0 && !selectedDomain) {
        setSelectedDomain(uniqueDomains[0]);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Neural transmission failed. Retrying in sector 7...');
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = selectedDomain
    ? mentors.filter(mentor => mentor.domain === selectedDomain)
    : mentors;

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-accent/40 overflow-x-hidden">
      
      {/* Dynamic Background Patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-glow-accent rounded-full rounded-full"></div>
        <div className="absolute bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-glow-magenta rounded-full rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-full text-accent-magenta text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-md mb-8">
                <Sparkles size={12} />
                Accessing Elite Network
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={100}>
              <h1 className="font-heading font-black text-5xl md:text-8xl text-center uppercase leading-[0.9] tracking-tighter mb-8 max-w-4xl">
                MENTOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-magenta">HUB</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="font-medium text-slate-400 text-base md:text-lg text-center max-w-xl mx-auto leading-relaxed border-t border-white/5 pt-8">
                Connect with domain experts who have built elite products and high-scale systems. Bridge the gap from student to professional.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-32">
        
        {loading && mentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-accent/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-2 border-accent rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] animate-pulse text-accent">Initializing Mentors...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-10 max-w-md">
                <p className="text-red-400 font-bold mb-2">Protocol Error</p>
                <p className="text-slate-400 text-sm">{error}</p>
             </div>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Search & Select Interface */}
            <ScrollReveal>
              <div className="flex flex-col items-center space-y-12">
                
                {/* Search Console */}
                <div className="w-full max-w-2xl relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-magenta rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
                    <div className="pl-6 text-slate-500">
                      <Search size={22} className="group-hover:text-accent transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search experts by name, tech stack, or domain..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-6 bg-transparent text-white font-medium text-lg outline-none placeholder:text-slate-600"
                    />
                    <div className="pr-4 hidden sm:block">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Filter size={12} />
                        Filtered
                      </div>
                    </div>
                  </div>
                </div>

                {/* Domain Selector */}
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setSelectedDomain(null)}
                    className={`group px-6 py-3 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all border ${
                      selectedDomain === null
                        ? 'bg-accent border-accent text-white shadow-glow-purple'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-accent/40 hover:text-white'
                    }`}
                  >
                    All Sectors
                  </button>

                  {domains.map((domain) => (
                    <button
                      key={domain}
                      onClick={() => setSelectedDomain(domain)}
                      className={`group px-6 py-3 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all border ${
                        selectedDomain === domain
                          ? 'bg-accent border-accent text-white shadow-glow-purple'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-accent/40 hover:text-white'
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Grid Section */}
            <div>
              {selectedDomain && (
                <ScrollReveal>
                  <div className="flex items-end gap-5 mb-12 border-b border-white/5 pb-8">
                    <h2 className="font-heading font-black text-3xl md:text-5xl text-white uppercase tracking-tighter">
                      {selectedDomain.split(' ')[0]} <span className="text-accent-magenta">{selectedDomain.split(' ').slice(1).join(' ')}</span>
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-glow-purple"></div>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                         {filteredMentors.length} Verified
                       </span>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {filteredMentors.length === 0 ? (
                <div className="py-40 text-center">
                   <div className="text-slate-500 font-bold uppercase tracking-[0.5em] text-sm opacity-50">Zero Matches Found in Domain</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filteredMentors.map((mentor, index) => (
                    <MentorCard key={mentor._id} mentor={mentor} delay={index * 50} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global Stats Bar */}
      {!loading && mentors.length > 0 && (
        <div className="border-t border-white/5 bg-white/[0.01] backdrop-blur-3xl py-20 relative overflow-hidden">
           <div className="absolute inset-0 bg-glow-accent rounded-full pointer-events-none"></div>
           <div className="max-w-7xl mx-auto px-4 relative z-10">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
                {[
                  { label: "Elite Mentors", value: mentors.length, icon: UsersIcon },
                  { label: "Active Domains", value: domains.length, icon: Sparkles },
                  { label: "Support Level", value: "24/7", icon: MessageCircle },
                  { label: "Success Rate", value: "98%", icon: Sparkles }
                ].map((stat, i) => (
                  <ScrollReveal key={i} delay={i * 100}>
                    <div className="space-y-4 group">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:text-white transition-all">
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-4xl font-heading font-black text-white">{stat.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">{stat.label}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
