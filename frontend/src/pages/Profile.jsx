import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Pencil, LogOut, AlertTriangle,
  Linkedin, Github, Globe, Code2, CalendarDays,
  ExternalLink, ArrowRight, Plus, Users, Sparkles,
  Shield, FolderGit2, Lightbulb, Calendar, Map
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
      className="w-full flex items-center gap-3 border-2 border-primary bg-white hover:bg-highlight-yellow transition-all shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none px-4 py-2 rounded-xl"
    >
      <Icon size={16} className="flex-shrink-0 text-primary" />
      <span className="font-bold text-xs uppercase text-primary">{label}</span>
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
      <div className="min-h-screen flex items-center justify-center bg-bg" style={{ paddingTop: '72px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <svg className="animate-spin" style={{ width: 32, height: 32 }} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm font-bold text-gray-500 font-body normal-case">Loading…</p>
        </div>
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
    <div className="bg-bg min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── INCOMPLETE PROFILE BANNER ── */}
        {profileIncomplete && (
          <div className="flex items-center gap-3 bg-highlight-orange border-2 border-primary shadow-neo-sm animate-pulse p-4 mb-6 rounded-lg">
            <AlertTriangle size={20} className="flex-shrink-0 text-primary" />
            <span className="flex-1 text-sm font-bold text-primary font-body">
              Profile incomplete! Add your branch, batch and skills.
            </span>
            <button
              onClick={() => navigate('/onboarding')}
              className="flex-shrink-0 bg-primary text-white border-2 border-white font-heading uppercase text-xs px-3 py-1 shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              Complete Now
            </button>
          </div>
        )}

        {/* ──────────────────────────────────────────────────
            SECTION A — TOP PROFILE CARD
            ────────────────────────────────────────────────── */}
        <div className="bg-white border-4 border-primary shadow-neo p-6 mb-6 lg:flex lg:items-center lg:gap-8">
          {/* LEFT — Avatar + User Type */}
          <div className="flex flex-col items-center mb-6 lg:mb-0 lg:flex-shrink-0">
            <img
              src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=128`}
              alt={displayName}
              className="w-24 h-24 rounded-full border-4 border-primary shadow-neo object-cover"
            />
            <span className="mt-3 bg-highlight-purple text-primary border-2 border-primary shadow-neo-sm px-3 py-1 font-heading uppercase text-xs font-black">
              {user.userType || 'Student'}
            </span>
          </div>

          {/* MIDDLE — Identity */}
          <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
            <h1 className="font-heading text-3xl uppercase text-primary mb-1">
              {displayName}
            </h1>
            <p className="text-gray-500 font-body text-sm mb-3">
              {user.email}
            </p>
            {enrollmentNo && (
              <span className="inline-block bg-highlight-yellow border-2 border-primary font-heading text-xs font-black px-3 py-1 shadow-neo-sm mb-3 mr-2">
                {enrollmentNo}
              </span>
            )}
            {/* Branch + Batch pills */}
            {user.userType !== 'mentor' && (
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="bg-highlight-blue/30 border border-primary/30 font-body text-xs px-2 py-1 rounded-full">
                {user.branch || 'No branch'}
              </span>
              <span className="bg-highlight-blue/30 border border-primary/30 font-body text-xs px-2 py-1 rounded-full">
                {user.batch || 'No batch'}
              </span>
            </div>
            )}
          </div>

          {/* RIGHT — Action buttons */}
          <div className="flex flex-col gap-2 lg:flex-shrink-0">
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-highlight-yellow border-2 border-primary font-heading uppercase text-xs font-black px-4 py-2 shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-highlight-pink border-2 border-primary font-heading uppercase text-xs font-black px-4 py-2 shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────
            SECTION B — DASHBOARD GRID (2 columns on lg)
            ────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6">

          {user.userType === 'mentor' ? (
              <div className="bg-white border-3 border-primary shadow-neo p-6 lg:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Mentor Details
                  </span>
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="text-[10px] font-bold text-primary underline hover:text-gray-600"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">About You</span>
                    <p className="font-body text-sm font-bold text-slate-700 leading-relaxed max-w-3xl bg-bg border-3 border-primary shadow-neo-sm p-5 rounded-2xl">
                        {user.aboutMentor || 'No bio provided.'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Domain of Interest</span>
                    <span className="bg-highlight-teal border-2 border-primary font-bold font-body text-xs px-3 py-1 shadow-[2px_2px_0_#1A1A1A] rounded-full inline-block">
                       {user.domainOfExpertise || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Department</span>
                    <span className="bg-highlight-yellow border-2 border-primary font-bold font-body text-xs px-3 py-1 shadow-[2px_2px_0_#1A1A1A] rounded-full inline-block">
                       {user.department || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
          ) : (
            <>
          {/* ────────────────────────────────────────
              CARD 1 — Skills & Expertise (left column)
              ──────────────────────────────────────── */}
          <div className="bg-white border-3 border-primary shadow-neo p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Skills & Expertise
              </span>
              <button
                onClick={() => navigate('/onboarding')}
                className="text-[10px] font-bold text-primary underline hover:text-gray-600"
              >
                Edit
              </button>
            </div>

            {/* Skills */}
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-highlight-teal border-2 border-primary font-bold font-body text-xs px-3 py-1 shadow-[2px_2px_0_#1A1A1A] rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-400 font-body text-sm mb-4">
                No skills added yet. Edit profile to add.
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-primary/10 my-4" />

            {/* Social Links */}
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">
              Connect
            </span>
            <div className="space-y-2">
              <SocialLink href={user.socialLinks?.linkedin} icon={Linkedin} label="LinkedIn" />
              <SocialLink href={user.socialLinks?.github} icon={Github} label="GitHub" />
              <SocialLink href={user.socialLinks?.leetcode} icon={Code2} label="LeetCode" />
              <SocialLink href={user.socialLinks?.other} icon={Globe} label="Portfolio" />
            </div>
          </div>

          {/* ────────────────────────────────────────
              CARD 2 — Roadmap Matches (right column)
              ──────────────────────────────────────── */}
          <div className="bg-white border-3 border-primary shadow-neo p-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
              Your Roadmap
            </span>
            <p className="font-body text-xs text-gray-400 normal-case mb-4">
              Matched from your skills
            </p>

            {matchedRoadmaps.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {matchedRoadmaps.map((roadmap, i) => (
                    <a
                      key={i}
                      href={roadmap.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border-2 border-primary hover:bg-highlight-yellow transition-all shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-between px-4 py-3 w-full rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink size={16} className="text-primary" />
                        <span className="font-bold text-sm uppercase text-primary">{roadmap.label}</span>
                      </div>
                      <ArrowRight size={14} className="text-gray-300" />
                    </a>
                  ))}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => navigate('/roadmap')}
                    className="text-[10px] font-bold uppercase text-primary hover:underline"
                  >
                    View all roadmaps →
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-highlight-orange/20 border-2 border-primary p-4 rounded-lg mb-4">
                <p className="text-sm font-bold font-body">
                  Add skills to your profile to get personalized roadmap suggestions.
                </p>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="mt-3 bg-highlight-yellow border-2 border-primary font-heading uppercase text-xs font-black px-3 py-1 shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  Add Skills
                </button>
              </div>
            )}
          </div>
          </>
          )}

          {/* ────────────────────────────────────────
              CARD 3 — Guidance Hub (left column, row 2)
              ──────────────────────────────────────── */}
          <div className="bg-primary text-white border-3 border-primary shadow-neo p-6">
            <h2 className="font-heading text-xl uppercase text-white mb-4">
              Guidance Hub
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: Code2, title: 'DSA & CP', desc: 'LeetCode, Codeforces patterns' },
                { icon: Globe, title: 'Web Dev', desc: 'MERN, full-stack guides' },
                { icon: Sparkles, title: 'AI / ML', desc: 'Kaggle, fast.ai, HuggingFace' },
                { icon: Pencil, title: 'UI/UX', desc: 'Figma, design systems' },
                { icon: Shield, title: 'Open Source', desc: 'GitHub, contributions, PRs' },
              ].map((domain, i) => {
                const Icon = domain.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/10 border border-white/20 hover:bg-white/20 transition-all p-3 rounded-lg cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    <Icon size={20} className="text-highlight-yellow mb-2" />
                    <p className="font-heading text-sm uppercase text-white">
                      {domain.title}
                    </p>
                    <p className="font-body text-xs text-white/60 mt-1 normal-case">
                      {domain.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/roadmap')}
              className="border-2 border-white text-white font-heading uppercase text-xs px-4 py-2 hover:bg-white hover:text-primary transition-all inline-block"
            >
              Explore Roadmaps
            </button>
          </div>

          {/* ────────────────────────────────────────
              CARD 4 — Quick Actions (right column, row 2)
              ──────────────────────────────────────── */}
          <div className="bg-highlight-yellow border-3 border-primary shadow-neo p-6">
            <h2 className="font-heading text-xl uppercase text-primary mb-4">
              Quick Actions
            </h2>

            <div className="space-y-2">
              {[
                { label: 'Browse Events', path: '/events', icon: Calendar },
                { label: 'View Projects', path: '/projects', icon: FolderGit2 },
                { label: 'Full Roadmap', path: '/roadmap', icon: Map },
                { label: 'Team Members', path: '/team', icon: Users },
                { label: 'About CID-Cell', path: '/about', icon: Lightbulb },
                { label: 'Submit a Project', path: '/projects', icon: Plus },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="w-full bg-white border-2 border-primary shadow-neo-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-between px-4 py-3 font-bold text-sm uppercase text-primary rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{action.label}</span>
                    </div>
                    <ArrowRight size={14} className="text-gray-300" />
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
