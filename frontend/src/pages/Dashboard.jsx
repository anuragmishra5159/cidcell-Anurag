import React, { useState, useEffect, useContext } from "react";
import {
    Users,
    Folder,
    Calendar,
    MessageSquare,
    Activity,
    ArrowRight,
    Target,
    Clock,
    Trophy,
    Star,
    Zap,
    Loader,
    Image as ImageIcon,
    Globe,
    User as UserIcon,
    ShieldCheck,
    Briefcase,
    Pencil,
    Code2,
    Linkedin,
    Github,
    ExternalLink,
    Map
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { skillBasedRoadmaps, roleBasedRoadmaps } from '../data/roadmapData';

// Roadmap Matching Logic from Profile
function getMatchedRoadmaps(userSkills) {
  if (!userSkills || userSkills.length === 0) return [];
  const matched = [];
  const matchedLabels = new Set();

  skillBasedRoadmaps.forEach((roadmap) => {
    const lowerLabel = roadmap.label.toLowerCase();
    const isMatched = userSkills.some(skill => skill.toLowerCase() === lowerLabel);
    if (isMatched && !matchedLabels.has(roadmap.label)) {
      matched.push(roadmap);
      matchedLabels.add(roadmap.label);
    }
  });

  if (matched.length < 3) {
    const skillLower = userSkills.map(s => s.toLowerCase());
    const roleMap = {
      'React': 'Full Stack', 'Node.js': 'Full Stack', 'JavaScript': 'Full Stack',
      'Python': 'AI and Data Scientist', 'Machine Learning': 'AI and Data Scientist',
      'Figma': 'UX Design', 'Docker': 'DevOps', 'Java': 'Backend'
    };
    const roleSet = new Set();
    skillLower.forEach(skill => {
      Object.entries(roleMap).forEach(([skillKey, roleLabel]) => {
        if (skill.includes(skillKey.toLowerCase())) roleSet.add(roleLabel);
      });
    });
    roleBasedRoadmaps.forEach((roadmap) => {
      if (roleSet.has(roadmap.label) && !matchedLabels.has(roadmap.label)) {
        matched.push(roadmap);
        matchedLabels.add(roadmap.label);
      }
    });
  }
  return matched.slice(0, 3);
}

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ totalProjects: 0, activeEvents: 0, totalMembers: 0, messages: 0 });
    const [loading, setLoading] = useState(true);
    const [recentProjects, setRecentProjects] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const matchedRoadmaps = getMatchedRoadmaps(user?.skills || []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [projectsRes, eventsRes, membersRes] = await Promise.all([
                    axios.get(`${API_URL}/projects`),
                    axios.get(`${API_URL}/events`),
                    axios.get(`${API_URL}/members`)
                ]);
                setStats({
                    totalProjects: projectsRes.data.length,
                    activeEvents: eventsRes.data.length,
                    totalMembers: membersRes.data.length,
                    messages: 0
                });
                setRecentProjects(projectsRes.data.slice(0, 2));
                setUpcomingEvents(eventsRes.data.slice(0, 3));
            } catch (err) { console.error("Dashboard fetch error:", err); }
            finally { setLoading(false); }
        };
        if (user) fetchDashboardData();
    }, [user, API_URL]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg">
                <Loader className="w-16 h-16 animate-spin text-primary" />
                <p className="mt-6 text-primary font-black uppercase tracking-widest text-sm">Building Hub...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg pt-28 pb-16 px-4 md:px-8 font-body">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* 1. TOP PROFILE BANNER - Balanced Layout */}
                <div className="bg-white border-3 md:border-4 border-primary shadow-neo p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-highlight-yellow/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="relative shrink-0">
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=128`}
                                alt="Profile"
                                className="w-16 h-16 md:w-28 md:h-28 rounded-2xl md:rounded-3xl border-3 md:border-4 border-primary shadow-neo-sm md:shadow-neo object-cover"
                            />
                        </div>

                        <div className="text-left space-y-1 md:space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                <h1 className="text-xl md:text-5xl font-black text-primary uppercase leading-none tracking-widest">
                                    {user?.username}
                                </h1>
                                <span className="w-fit bg-highlight-purple text-primary border-2 border-primary px-2 py-0.5 font-black uppercase text-[8px] md:text-[10px] shadow-neo-sm">
                                    {user?.userType || 'Student'}
                                </span>
                            </div>
                            <p className="text-primary/60 font-black uppercase text-[9px] md:text-[11px] tracking-widest leading-none">
                                {user?.branch || 'Information Technology'} • Batch {user?.batch || '2024-2028'}
                            </p>
                            <div className="inline-flex mt-1">
                                <span className="bg-bg border-2 border-primary/10 px-2.5 py-1 rounded-lg text-[9px] md:text-xs font-bold text-primary/40 lowercase leading-none">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action & Skills Section */}
                    <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3 md:gap-4 shrink-0">
                        {/* Mobile Action Button */}
                        <div className="md:hidden w-full">
                           <button onClick={() => navigate('/onboarding')} className="w-full h-12 bg-highlight-yellow border-3 border-primary rounded-xl flex items-center justify-center gap-2 font-black uppercase text-xs shadow-neo-sm">
                                <Pencil size={18} /> Edit Profile
                           </button>
                        </div>

                        {/* Desktop Skills */}
                        <div className="hidden md:flex flex-wrap justify-end gap-2">
                             {user?.skills?.slice(0, 4).map((skill, i) => (
                                <span key={i} className="bg-highlight-teal/20 border-2 border-primary/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-primary/60 shadow-neo-mini">
                                    #{skill}
                                </span>
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-3 w-full">
                            <button 
                                onClick={() => navigate('/onboarding')}
                                className="bg-highlight-yellow border-3 border-primary px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <Pencil size={14} /> Edit profile
                            </button>
                            <div className="flex gap-2">
                                <a href={user?.socialLinks?.github} target="_blank" className="bg-white border-3 border-primary p-3 rounded-xl shadow-neo-sm hover:bg-highlight-blue transition-all"><Github size={18} /></a>
                                <a href={user?.socialLinks?.linkedin} target="_blank" className="bg-white border-3 border-primary p-3 rounded-xl shadow-neo-sm hover:bg-highlight-blue transition-all"><Linkedin size={18} /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. STATS GRID - Condensed */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: "Our Projects", value: stats.totalProjects, icon: Folder, color: "bg-highlight-blue" },
                        { label: "Active Events", value: stats.activeEvents, icon: Calendar, color: "bg-highlight-yellow" },
                        { label: "Community", value: stats.totalMembers, icon: Users, color: "bg-highlight-green" },
                        { label: "Personal Score", value: "92", icon: Target, color: "bg-highlight-purple" }
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} border-3 border-primary p-4 md:p-5 rounded-2xl md:rounded-neo shadow-neo-sm flex flex-col gap-2 md:gap-3 group hover:-translate-y-1 transition-transform`}>
                            <stat.icon className="text-primary w-4 h-4 md:w-5 md:h-5" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-primary leading-none">{stat.value}</h3>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-primary/60 mt-0.5">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. CORE CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Roadmaps - Skills Based */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between px-2">
                             <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                                <span className="w-10 h-10 bg-highlight-purple border-3 border-primary rounded-xl flex items-center justify-center shadow-neo-sm">
                                    <Map size={20} />
                                </span>
                                Your Roadmap
                            </h2>
                        </div>
                        <div className="bg-white border-4 border-primary p-6 rounded-neo shadow-neo space-y-4">
                            <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest px-1">Curated based on your skills</p>
                            {matchedRoadmaps.length > 0 ? matchedRoadmaps.map((roadmap, i) => (
                                <a 
                                    key={i} 
                                    href={roadmap.url} 
                                    target="_blank" 
                                    className="block p-4 bg-bg border-3 border-primary rounded-2xl hover:bg-highlight-yellow transition-all shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Code2 size={16} className="text-primary/40 group-hover:text-primary transition-colors" />
                                            <span className="font-black uppercase text-xs">{roadmap.label}</span>
                                        </div>
                                        <ExternalLink size={14} className="text-primary/20 group-hover:text-primary transition-colors" />
                                    </div>
                                </a>
                            )) : (
                                <div className="p-8 text-center bg-bg rounded-2xl border-2 border-dashed border-primary/20">
                                    <p className="text-[10px] font-black uppercase text-primary/40 leading-loose">Add skills to your profile to unlock personalized career roadmaps.</p>
                                </div>
                            )}
                            <button onClick={() => navigate('/roadmap')} className="w-full py-4 border-3 border-primary rounded-2xl font-black uppercase text-[10px] hover:bg-primary hover:text-white transition-all">Explore All Guides</button>
                        </div>
                    </div>

                    {/* Ongoing Projects & Events */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Projects */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-black uppercase tracking-widest">Active Projects</h2>
                                <Link to="/projects" className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary flex items-center gap-2">View Full Directory <ArrowRight size={14} /></Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recentProjects.map(project => (
                                    <div key={project._id} className="bg-white border-4 border-primary p-6 rounded-neo shadow-neo group hover:bg-highlight-blue/5 transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-14 h-14 bg-white border-2 border-primary rounded-2xl overflow-hidden shadow-neo-sm group-hover:-rotate-3 transition-transform">
                                                {project.image ? <img src={project.image} className="w-full h-full object-cover" alt="" /> : <Zap size={24} className="p-3" />}
                                            </div>
                                            <button onClick={() => navigate(`/projects/${project._id}`)} className="p-2 border-2 border-primary rounded-xl hover:bg-highlight-blue shadow-neo-sm transition-all"><ArrowRight size={18} /></button>
                                        </div>
                                        <h3 className="text-xl font-black uppercase truncate mb-2">{project.title}</h3>
                                        <p className="text-xs font-bold text-primary/60 uppercase tracking-tighter line-clamp-2 leading-relaxed h-10">{project.description}</p>
                                        <div className="mt-6 pt-4 border-t-2 border-primary/10 flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-highlight-teal border-2 border-primary px-3 py-1 rounded-full shadow-neo-sm">{project.category || 'Core'}</span>
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => <div key={i} className="w-6 h-6 bg-white border-2 border-primary rounded-full shadow-neo-sm overflow-hidden"><UserIcon size={12} className="p-1 opacity-20" /></div>)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Events Lineup */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black uppercase tracking-widest px-2">Upcoming Events</h2>
                            <div className="space-y-4">
                                {upcomingEvents.map(event => (
                                    <div key={event._id} className="bg-white border-3 border-primary p-4 rounded-2xl shadow-neo group hover:translate-x-2 transition-all flex items-center gap-6">
                                        <div className="w-16 h-16 bg-highlight-yellow border-3 border-primary rounded-2xl flex flex-col items-center justify-center shadow-neo-sm shrink-0">
                                            <span className="text-[10px] font-black uppercase leading-none">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-2xl font-black leading-none">{new Date(event.date).getDate()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-black uppercase truncate group-hover:text-primary transition-colors">{event.title}</h3>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <span className="text-[10px] font-black uppercase text-primary/40 flex items-center gap-1.5"><Clock size={12} /> {event.time || '10:00 AM'}</span>
                                                <span className="text-[10px] font-black uppercase text-primary/40 flex items-center gap-1.5"><Globe size={12} /> {event.location || 'Seminer Hall'}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => navigate(`/events/${event._id}`)} className="p-3 border-2 border-primary rounded-xl hover:bg-highlight-yellow shadow-neo-sm transition-all"><ArrowRight size={20} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
