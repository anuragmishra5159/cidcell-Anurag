import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Pencil, LogOut, AlertTriangle,
  Linkedin, Github, Globe, Code2, CalendarDays,
  ExternalLink, ArrowRight, Plus, Users, Sparkles,
  Shield, FolderGit2, Lightbulb, Calendar, Map, CheckCircle2
} from 'lucide-react';
import { skillBasedRoadmaps, roleBasedRoadmaps } from '../data/roadmapData';

// ────────────────────────────────────────────────────
// UTILITIES
// ────────────────────────────────────────────────────

const ENROLLMENT_PATTERN = /^[A-Z0-9]{8,12}$/;

function parseUserIdentity(user) {
  if (!user) return { enrollmentNo: '', displayName: '' };
  const rawUsername = (user.username || '').trim();
  const parts = rawUsername.split(/\s+/);
  const firstPart = parts[0].toUpperCase();
  if (ENROLLMENT_PATTERN.test(firstPart) && /[0-9]/.test(firstPart)) {
    return { enrollmentNo: firstPart, displayName: parts.slice(1).join(' ') || rawUsername };
  }
  return { enrollmentNo: user.enrollmentNo || '', displayName: rawUsername };
}

function getMatchedRoadmaps(userSkills) {
  if (!userSkills || userSkills.length === 0) return [];

  const matched = [];
  const matchedLabels = new Set();

  // Step 1: Match skills to skillBasedRoadmaps (case-insensitive)
  skillBasedRoadmaps.forEach((roadmap) => {
    const lowerLabel = roadmap.label.toLowerCase();
    const isMatched = userSkills.some(skill => skill.toLowerCase() === lowerLabel);
    if (isMatched && !matchedLabels.has(roadmap.label)) {
      matched.push(roadmap);
      matchedLabels.add(roadmap.label);
      if (matched.length >= 4) return;
    }
  });

  // Step 2: If < 4 matches, fill with roleBasedRoadmaps based on skill->role mappings
  if (matched.length < 4) {
    const skillLower = userSkills.map(s => s.toLowerCase());

    const roleMap = {
      'React': 'Full Stack',
      'Node.js': 'Full Stack',
      'JavaScript': 'Full Stack',
      'TypeScript': 'Full Stack',
      'HTML': 'Full Stack',
      'CSS': 'Full Stack',
      'Python': 'AI and Data Scientist',
      'Machine Learning': 'AI and Data Scientist',
      'Data Analysis': 'AI and Data Scientist',
      'Figma': 'UX Design',
      'UI/UX Design': 'UX Design',
      'Docker': 'DevOps',
      'AWS': 'DevOps',
      'SQL': 'DevOps',
      'MongoDB': 'DevOps',
      'Java': 'Backend',
      'C++': 'Backend',
    };

    const roleSet = new Set();
    skillLower.forEach(skill => {
      Object.entries(roleMap).forEach(([skillKey, roleLabel]) => {
        if (skill.includes(skillKey.toLowerCase())) {
          roleSet.add(roleLabel);
        }
      });
    });

    roleBasedRoadmaps.forEach((roadmap) => {
      if (roleSet.has(roadmap.label) && !matchedLabels.has(roadmap.label)) {
        matched.push(roadmap);
        matchedLabels.add(roadmap.label);
        if (matched.length >= 4) return;
      }
    });
  }

  return matched.slice(0, 4);
}

// ────────────────────────────────────────────────────
// COMPONENTS
// ────────────────────────────────────────────────────

function SocialLink({ href, icon: Icon, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-between gap-3 border border-white/10 bg-surface/50 hover:bg-white/5 hover:border-accent transition-all shadow-glass px-4 py-3 rounded-xl group"
    >
      <div className="flex items-center gap-3">
        <Icon size={16} className="flex-shrink-0 text-slate-400 group-hover:text-accent transition-colors" />
        <span className="font-bold text-xs uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <ExternalLink size={12} className="text-slate-500 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </a>
  );
}

// ────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────

export default function Profile() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-bg font-bold text-accent animate-pulse uppercase tracking-widest gap-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        Decrypting Profile Metadata...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" />;

  const { enrollmentNo, displayName } = parseUserIdentity(user);
  const profileIncomplete = user?.userType === 'mentor' ? !(user.domainOfExpertise && user.department && user.aboutMentor) : !user.branch;
  const matchedRoadmaps = getMatchedRoadmaps(user.skills || []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-bg min-h-screen pt-32 pb-20 relative overflow-hidden text-white font-body">
      {/* Abstract Backgrounds */}
      <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-glow-blue rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── INCOMPLETE PROFILE BANNER ── */}
        {profileIncomplete && (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-orange-500/10 border border-orange-500/30 p-5 mb-8 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[30px] rounded-full group-hover:scale-150 transition-transform"></div>
            <AlertTriangle size={24} className="flex-shrink-0 text-orange-400" />
            <div className="flex-1 text-center sm:text-left">
                <p className="font-bold text-orange-400 uppercase tracking-widest text-sm mb-1">Incomplete Telemetry</p>
                <p className="text-xs text-slate-300">Your profile parameters require updates to function fully within the network.</p>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold uppercase tracking-[0.2em] text-[10px] px-6 py-3 rounded-xl hover:bg-orange-500 hover:text-white shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all whitespace-nowrap active:scale-95"
            >
              Initiate Calibration
            </button>
          </div>
        )}

        {/* ──────────────────────────────────────────────────
            SECTION A — TOP PROFILE CARD
            ────────────────────────────────────────────────── */}
        <div className="glass-panel border border-white/10 shadow-glass rounded-3xl p-8 mb-8 lg:flex lg:items-center lg:gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-glow-accent rounded-full pointer-events-none"></div>

          {/* LEFT — Avatar + User Type */}
          <div className="flex flex-col items-center mb-8 lg:mb-0 lg:flex-shrink-0 relative z-10">
            <div className="relative group/avatar cursor-pointer">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur flex-1 -z-10 group-hover/avatar:bg-accent/40 transition-colors"></div>
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=050505&color=fff&size=128`}
                alt={displayName}
                className="w-32 h-32 rounded-full border-2 border-white/20 shadow-glass object-cover bg-bg z-10 relative transition-transform duration-500 group-hover/avatar:scale-105"
              />
            </div>
            <span className="mt-5 bg-accent/20 text-accent border border-accent/40 px-4 py-1.5 rounded-full uppercase text-[10px] font-bold tracking-[0.2em] shadow-glow-purple flex items-center gap-2">
              <Shield size={12} /> {user.userType || 'Student Node'}
            </span>
          </div>

          {/* MIDDLE — Identity */}
          <div className="flex-1 text-center lg:text-left mb-8 lg:mb-0 relative z-10">
            <h1 className="font-black text-4xl lg:text-5xl uppercase text-white mb-2 tracking-widest drop-shadow-lg">
              {displayName}
            </h1>
            <p className="text-slate-400 font-medium text-sm mb-4 tracking-wider flex items-center justify-center lg:justify-start gap-2">
               <Globe size={14} className="text-accent-blue" />
               {user.email}
            </p>
            {enrollmentNo && (
              <span className="inline-block bg-surface border border-white/10 text-slate-300 font-bold uppercase text-xs px-4 py-1.5 rounded-md shadow-glass mb-6 tracking-[0.2em]">
                ID: {enrollmentNo}
              </span>
            )}
            
            {/* Branch + Batch pills */}
            {user.userType !== 'mentor' && (
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="bg-surface/50 border border-white/10 text-slate-300 uppercase text-[10px] font-bold tracking-widest px-4 py-2 rounded-lg backdrop-blur-sm shadow-glass">
                {user.branch || 'Branch Unknown'}
              </span>
              <span className="bg-surface/50 border border-white/10 text-slate-300 uppercase text-[10px] font-bold tracking-widest px-4 py-2 rounded-lg backdrop-blur-sm shadow-glass border-l-2 border-l-accent-cyan">
                {user.batch || 'Batch Unknown'}
              </span>
            </div>
            )}
          </div>

          {/* RIGHT — Action buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:flex-shrink-0 relative z-10 w-full lg:w-auto">
            <button
              onClick={() => navigate('/onboarding')}
              className="btn-glass-accent w-full sm:flex-1 lg:w-48"
            >
              <Pencil size={14} className="text-accent" />
              Configure
            </button>
            <button
              onClick={handleLogout}
              className="btn-glass-danger w-full sm:flex-1 lg:w-48"
            >
              <LogOut size={14} />
              Disconnect
            </button>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────
            SECTION B — DASHBOARD GRID (2 columns on lg)
            ────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-6">

          {user.userType === 'mentor' ? (
              <div className="glass-panel border border-white/10 rounded-2xl p-8 lg:col-span-12 shadow-glass relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-glow-accent rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors"></div>

                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                    <Shield size={16} /> Mentor Diagnostics
                  </span>
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Update
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="md:col-span-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-3 pl-1">Professional Overview</span>
                    <div className="font-medium text-sm text-slate-300 leading-relaxed bg-surface/50 border border-white/10 shadow-inner p-6 rounded-2xl backdrop-blur-sm relative">
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-accent opacity-50"></div>
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-accent opacity-50"></div>
                        {user.aboutMentor || 'No bio provided. Please run configuration node.'}
                    </div>
                  </div>
                  <div className="bg-surface/30 p-5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-3">Primary Domain</span>
                    <span className="bg-accent/10 border border-accent/30 text-accent font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg shadow-glow-purple inline-block">
                       {user.domainOfExpertise || 'Unspecified'}
                    </span>
                  </div>
                  <div className="bg-surface/30 p-5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-3">Operational Department</span>
                    <span className="bg-accent-blue/10 border border-blue-500/30 text-blue-400 font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.2)] inline-block">
                       {user.department || 'Unspecified'}
                    </span>
                  </div>
                </div>
              </div>
          ) : (
            <>
          {/* ────────────────────────────────────────
              CARD 1 — Skills & Expertise (left column)
              ──────────────────────────────────────── */}
          <div className="glass-panel border border-white/10 rounded-2xl p-8 lg:col-span-5 shadow-glass relative overflow-hidden">
             {/* Gradient glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-glow-accent rounded-full rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Code2 size={16} className="text-accent" /> Capability Matrix
              </span>
              <button
                onClick={() => navigate('/onboarding')}
                className="text-[10px] font-bold text-slate-400 hover:text-accent uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                <Plus size={10} /> Add
              </button>
            </div>

            {/* Skills */}
            <div className="relative z-10 mb-8">
                {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                    {user.skills.map((skill, i) => (
                    <span
                        key={i}
                        className="bg-surface/80 border border-white/10 hover:border-accent hover:text-accent transition-colors font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 shadow-glass rounded-lg text-slate-300 cursor-default"
                    >
                        {skill}
                    </span>
                    ))}
                </div>
                ) : (
                <div className="border border-white/10 border-dashed rounded-xl p-6 text-center bg-surface/30">
                    <p className="text-slate-500 font-medium text-xs uppercase tracking-widest mb-3">
                        No protocols loaded.
                    </p>
                    <button
                        onClick={() => navigate('/onboarding')}
                        className="bg-accent/20 border border-accent/50 text-accent font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-all shadow-glow-purple inline-flex items-center gap-2"
                    >
                        Inject Skills <ArrowRight size={10} />
                    </button>
                </div>
                )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full mb-8 relative z-10" />

            {/* Social Links */}
            <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 block mb-4 flex items-center gap-2">
                <Globe size={12} /> External Uplinks
                </span>
                <div className="space-y-3">
                <SocialLink href={user.socialLinks?.linkedin} icon={Linkedin} label="LinkedIn" />
                <SocialLink href={user.socialLinks?.github} icon={Github} label="GitHub" />
                <SocialLink href={user.socialLinks?.leetcode} icon={Code2} label="LeetCode" />
                <SocialLink href={user.socialLinks?.other} icon={ExternalLink} label="Custom Domain" />
                </div>
            </div>
          </div>

          {/* ────────────────────────────────────────
              CARD 2 — Roadmap Matches (center/right column)
              ──────────────────────────────────────── */}
          <div className="glass-panel border border-white/10 rounded-2xl p-8 lg:col-span-7 shadow-glass relative overflow-hidden group">
            {/* Background effects */}
            <div className="absolute bottom-0 right-0 w-full h-[200px] bg-gradient-to-t from-accent/5 to-transparent pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Map size={16} className="text-accent-blue" /> Recommended Trajectories
              </span>
            </div>
            
            <p className="font-medium text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 relative z-10">
              Generated based on active skill signatures
            </p>

            {matchedRoadmaps.length > 0 ? (
              <div className="relative z-10 flex flex-col h-full justify-between pb-6">
                <div className="space-y-3 mb-6">
                  {matchedRoadmaps.map((roadmap, i) => (
                    <a
                      key={i}
                      href={roadmap.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/[0.04] border border-white/10 hover:border-accent/50 hover:bg-white/[0.08] transition-all shadow-glass flex items-center justify-between px-5 py-4 w-full rounded-xl group/link active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover/link:bg-accent group-hover/link:text-white transition-all shadow-inner">
                            <CheckCircle2 size={14} />
                        </div>
                        <span className="font-bold text-xs uppercase tracking-widest text-white transition-colors">{roadmap.label}</span>
                      </div>
                      <ArrowRight size={14} className="text-slate-500 group-hover/link:text-white group-hover/link:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
                <div className="text-right mt-auto">
                  <button
                    onClick={() => navigate('/roadmap')}
                    className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-white transition-colors flex items-center justify-end gap-2 w-full"
                  >
                    Access Global Database <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-surface/50 border border-white/5 p-8 rounded-xl relative z-10 text-center flex flex-col items-center justify-center h-[200px]">
                <Map size={32} className="text-slate-600 mb-4" />
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">
                  Insufficient data for path generation.
                </p>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="bg-accent/20 border border-accent/50 text-accent font-bold uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-lg shadow-glow-purple hover:bg-accent hover:text-white transition-all outline-none"
                >
                  Analyze Capabilities
                </button>
              </div>
            )}
          </div>
          </>
          )}

          {/* ────────────────────────────────────────
              CARD 3 — Guidance Hub (bottom left)
              ──────────────────────────────────────── */}
          <div className="bg-surface border border-white/10 rounded-2xl p-8 lg:col-span-8 shadow-glass relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-glow-accent rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors"></div>

            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Sparkles size={16} className="text-accent-magenta" /> Knowledge Base
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 relative z-10">
              {[
                { icon: Code2, title: 'DSA & CP', desc: 'Algorithm Patterns' },
                { icon: Globe, title: 'Web Dev', desc: 'Full-Stack Guides' },
                { icon: Sparkles, title: 'AI / ML', desc: 'Neural Networks' },
                { icon: Pencil, title: 'UI/UX', desc: 'Design Systems' },
                { icon: Shield, title: 'Open Source', desc: 'Contribution Logs' },
              ].map((domain, i) => {
                const Icon = domain.icon;
                return (
                  <div
                    key={i}
                    className="bg-surface/50 border border-white/5 hover:border-accent hover:bg-white/5 transition-all p-4 rounded-xl cursor-default group/card"
                  >
                    <Icon size={18} className="text-slate-400 group-hover/card:text-accent mb-3 transition-colors" />
                    <p className="font-bold text-xs uppercase tracking-widest text-white mb-1">
                      {domain.title}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      {domain.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="relative z-10">
                <button
                onClick={() => navigate('/roadmap')}
                className="btn-neo w-full py-4 text-xs tracking-[0.3em]"
                >
                Query Global Roadmaps <ArrowRight size={14} />
                </button>
            </div>
          </div>

          {/* ────────────────────────────────────────
              CARD 4 — Quick Actions (bottom right)
              ──────────────────────────────────────── */}
          <div className="glass-panel border border-white/10 rounded-2xl p-8 lg:col-span-4 shadow-glass relative overflow-hidden group">
            {/* abstract accent */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-glow-blue rounded-full rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <ExternalLink size={16} className="text-accent-cyan" /> Quick Links
              </span>
            </div>

            <div className="space-y-3 relative z-10">
              {[
                { label: 'Event Logs', path: '/events', icon: Calendar },
                { label: 'Project Matrix', path: '/projects', icon: FolderGit2 },
                { label: 'Active Roster', path: '/team', icon: Users },
                { label: 'System Overview', path: '/about', icon: Lightbulb },
                { label: 'Submit Protocol', path: '/projects', icon: Plus },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="w-full bg-surface/50 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-between px-5 py-3.5 font-bold text-[11px] uppercase tracking-widest text-slate-300 hover:text-white rounded-xl group/btn"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={14} className="text-slate-500 group-hover/btn:text-accent transition-colors" />
                      <span>{action.label}</span>
                    </div>
                    <ArrowRight size={12} className="text-slate-600 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
