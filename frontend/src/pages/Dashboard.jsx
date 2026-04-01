import React, { useState, useEffect, useContext } from "react";
import {
    Users, Folder, Calendar, Activity, ArrowRight,
    Target, Clock, Zap, Plus, Loader, ImageIcon,
    Globe, Briefcase, Pencil, Code2, Linkedin,
    Github, ExternalLink, Map
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
    const [error, setError] = useState(null);
    const [recentProjects, setRecentProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [activeTab, setActiveTab] = useState('projects');
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

    const matchedRoadmaps = getMatchedRoadmaps(user?.skills || []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [projectsRes, eventsRes, membersRes, myProjectsRes, mentorsRes, myEventsRes] = await Promise.all([
                    axios.get(`${API_URL}/projects`),
                    axios.get(`${API_URL}/events`),
                    axios.get(`${API_URL}/members`),
                    axios.get(`${API_URL}/projects/mine/all`, authHeaders()),
                    axios.get(`${API_URL}/users/mentors`),
                    axios.get(`${API_URL}/events/my-registrations`, authHeaders())
                ]);
                setStats({
                    totalProjects: projectsRes.data.length,
                    activeEvents: eventsRes.data.length,
                    totalMembers: membersRes.data.length,
                    totalMentors: mentorsRes.data.length,
                    myProjectsCount: myProjectsRes.data.length,
                    messages: 0
                });
                setRecentProjects(projectsRes.data.slice(0, 1));
                setUpcomingEvents(eventsRes.data.slice(0, 1));
                setMyProjects(myProjectsRes.data);
                setMyEvents(myEventsRes.data);
                setMentors(mentorsRes.data);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError('Telemetry Sync Failed. Please re-authenticate or refresh matrix.');
            }
            finally { setLoading(false); }
        };
        if (user) fetchDashboardData();
    }, [user?._id]); 

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-white gap-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin"></div>
                    <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
                </div>
                <p className="font-heading text-sm uppercase tracking-widest text-slate-300 animate-pulse">Initializing Hub...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg font-body p-4">
                <div className="glass-panel border-l-4 border-l-orange-500 p-8 text-center max-w-lg shadow-glass relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[40px] rounded-full group-hover:scale-150 transition-transform"></div>
                    <p className="font-bold uppercase text-orange-400 text-xs tracking-widest mb-4 flex items-center justify-center gap-2 relative z-10"><Zap size={16} /> Error Signature Detected</p>
                    <p className="font-medium text-slate-300 text-sm mb-6 leading-relaxed relative z-10">{error}</p>
                    <button
                        onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
                        className="bg-surface border border-white/10 hover:border-orange-500 hover:text-orange-400 text-white px-6 py-3 font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-glass transition-all relative z-10"
                    >
                        Retransmit Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-theme min-h-screen bg-bg pt-32 pb-20 px-4 md:px-6 font-body text-white relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            <div className="absolute top-[40%] right-[-50px] w-[400px] h-[400px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                
                {/* 1. TOP PROFILE BANNER */}
                <div className="glass-panel border border-white/10 shadow-glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative overflow-hidden group">
                    <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-accent/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-accent/20 transition-colors"></div>
                    
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full md:w-auto z-10">
                        <div className="relative shrink-0 group/avatar">
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur flex-1 -z-10 group-hover/avatar:bg-accent/40 transition-colors pointer-events-none"></div>
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.username}&background=050505&color=fff&size=128`}
                                alt="Profile"
                                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-white/20 shadow-glass object-cover bg-bg transition-transform duration-500 group-hover/avatar:scale-105"
                            />
                        </div>

                        <div className="text-center sm:text-left space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-widest drop-shadow-md">
                                    {user?.username}
                                </h1>
                                <span className="w-fit mx-auto sm:mx-0 bg-surface border border-white/10 text-accent px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] shadow-inner">
                                    {user?.userType || 'Student Node'}
                                </span>
                            </div>
                            <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">
                                {user?.branch || 'Department Unregistered'} <span className="text-white/20 mx-2">|</span> Generation {user?.batch || 'Unknown'}
                            </p>
                            <div className="inline-flex items-center gap-2 mt-2">
                                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 tracking-wider shadow-inner">
                                    <Globe size={12} className="inline mr-2 text-accent-blue" />
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* GitHub Org Spotlight */}
                    <div className="hidden lg:flex items-center gap-5 bg-surface/50 border border-white/10 hover:border-accent hover:bg-white/5 transition-all p-5 rounded-2xl shadow-glass cursor-pointer z-10 w-80 group/org" onClick={() => window.open('https://github.com/CID-CELL', '_blank')}>
                        <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-slate-300 group-hover/org:text-accent group-hover/org:border-accent/40 transition-colors shadow-inner">
                            <Github size={28} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Root Directory</h4>
                            <p className="text-xs font-black uppercase text-white tracking-widest shadow-sm">CID-CELL OSS</p>
                            <span className="text-[10px] font-bold uppercase text-slate-500 group-hover/org:text-white transition-colors flex items-center gap-1 mt-1">Fork Repositories <ArrowRight size={10} className="group-hover/org:translate-x-1 transition-transform" /></span>
                        </div>
                    </div>

                    {/* Action & Skills Section */}
                    <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-5 shrink-0 z-10">
                        {/* Mobile Action Button */}
                        <div className="md:hidden w-full px-4">
                           <button onClick={() => navigate('/onboarding')} className="btn-neo-secondary w-full py-4 rounded-2xl">
                                <Pencil size={14} className="text-accent"/> Parameters
                           </button>
                        </div>

                        {/* Desktop Skills */}
                        <div className="hidden md:flex flex-wrap justify-end gap-2 max-w-[280px]">
                             {user?.skills?.slice(0, 4).map((skill, i) => (
                                <span key={i} className="bg-accent/10 border border-accent/20 px-3 py-1 rounded-md text-[10px] font-bold uppercase text-accent tracking-widest shadow-glow-purple">
                                    {skill}
                                </span>
                            ))}
                            {user?.skills?.length > 4 && (
                                <span className="bg-surface border border-white/10 px-3 py-1 rounded-md text-[10px] font-bold text-slate-400">+{user.skills.length - 4}</span>
                            )}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-3 w-full justify-end">
                            <button 
                                onClick={() => navigate('/onboarding')}
                                className="btn-glass-accent px-8"
                            >
                                <Pencil size={14} className="text-accent" /> Configure
                            </button>
                            <div className="flex gap-2">
                                {user?.socialLinks?.github && (
                                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="bg-surface border border-white/10 p-3 rounded-xl shadow-glass hover:text-accent hover:border-accent transition-all"><Github size={16} /></a>
                                )}
                                {user?.socialLinks?.linkedin && (
                                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="bg-surface border border-white/10 p-3 rounded-xl shadow-glass hover:text-accent-blue hover:border-accent-blue transition-all"><Linkedin size={16} /></a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: "Active Nodes", value: myEvents.length, icon: Calendar, color: "text-accent", border: "border-accent/30", bg: "bg-accent/10" },
                        { label: "Global Projects", value: stats.totalProjects, icon: Folder, color: "text-accent-blue", border: "border-blue-500/30", bg: "bg-blue-500/10" },
                        { label: "Available Mentors", value: stats.totalMentors, icon: Users, color: "text-accent-cyan", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
                        { label: "My Commits", value: myProjects.length, icon: Target, color: "text-accent-magenta", border: "border-fuchsia-500/30", bg: "bg-fuchsia-500/10" }
                    ].map((stat, i) => (
                        <div key={i} className={`glass-panel border ${stat.border} p-5 md:p-6 rounded-2xl shadow-glass flex flex-col items-center justify-center text-center gap-3 group hover:-translate-y-1 transition-transform relative overflow-hidden`}>
                            <div className={`absolute -right-4 -top-4 w-16 h-16 ${stat.bg} rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform`}></div>
                            <div className={`w-10 h-10 rounded-full ${stat.bg} border ${stat.border} flex items-center justify-center shadow-inner relative z-10`}>
                                <stat.icon className={`${stat.color} w-4 h-4 md:w-5 md:h-5`} />
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <h3 className="text-2xl md:text-3xl font-black text-white tracking-widest mb-1 drop-shadow-md">{stat.value}</h3>
                                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 line-clamp-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. PREVIEWS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Project Preview Card */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-slate-300">
                                <span className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-glow-blue"></span>
                                Featured Project
                            </h2>
                            <Link to="/projects" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-accent-blue transition-colors flex items-center gap-1">Open Registry <ArrowRight size={12} /></Link>
                        </div>
                        {recentProjects.length > 0 ? recentProjects.map(project => (
                            <div key={project._id} className="glass-panel border border-white/10 rounded-2xl shadow-glass group hover:border-accent-blue/50 hover:bg-white/5 transition-all p-5 flex flex-col sm:flex-row gap-5 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/projects/${project._id}`)}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-accent-blue/10 transition-colors"></div>
                                
                                <div className="w-full sm:w-32 h-40 sm:h-32 bg-surface border border-white/10 rounded-xl overflow-hidden shrink-0 shadow-inner relative z-10">
                                    {project.images?.[0] || project.image ? (
                                        <img src={project.images?.[0] || project.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={project.title} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                                            <Code2 size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-surface border border-white/10 text-accent-blue px-2.5 py-1 rounded-md text-[8px] font-bold tracking-widest uppercase shadow-sm">{project.category || 'System Core'}</span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black uppercase text-white truncate tracking-widest">{project.title}</h3>
                                        <p className="text-xs font-medium text-slate-400 leading-relaxed line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex gap-3">
                                            {project.githubRepo && (
                                                <a href={project.githubRepo} target="_blank" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                                                    <Github size={12} /> Source
                                                </a>
                                            )}
                                        </div>
                                        <button className="text-accent-blue group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="h-40 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-xs bg-surface/30">
                                <Folder size={24} className="mb-2 opacity-50" /> Registry Empty
                            </div>
                        )}
                    </div>

                    {/* Event Preview Card */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-slate-300">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full shadow-glow-purple"></span>
                                Upcoming Transmission
                            </h2>
                            <Link to="/events" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-accent transition-colors flex items-center gap-1">View Schedule <ArrowRight size={12} /></Link>
                        </div>
                        {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                            <div key={event._id} className="glass-panel border border-white/10 rounded-2xl shadow-glass group hover:border-accent/50 hover:bg-white/5 transition-all p-5 flex flex-col sm:flex-row gap-5 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/events/${event._id}`)}>
                                <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors"></div>
                                
                                <div className="w-full sm:w-32 h-40 sm:h-32 bg-surface border border-white/10 rounded-xl overflow-hidden shrink-0 shadow-inner relative z-10">
                                    {event.image ? (
                                        <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={event.title} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                                            <Calendar size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-surface border border-white/10 text-accent px-2.5 py-1 rounded-md text-[8px] font-bold tracking-widest uppercase shadow-sm">{event.type || 'Physical Node'}</span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black uppercase text-white truncate tracking-widest">{event.title}</h3>
                                        
                                        <div className="flex flex-col gap-1.5 mt-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                <Calendar size={12} className="text-accent" /> 
                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 truncate">
                                                <Globe size={12} className="text-accent" /> 
                                                {event.location || 'Location TBD'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end mt-4">
                                        <button className="text-accent group-hover:translate-x-1 transition-transform"><ArrowRight size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="h-40 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-xs bg-surface/30">
                                <Calendar size={24} className="mb-2 opacity-50" /> No Transmissions Scheduled
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. MY ACTIVITY TABS SECTION */}
                <div className="space-y-6 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                        <div className="space-y-2">
                            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-widest text-white drop-shadow-md">Node Activity</h2>
                            <p className="text-xs font-bold uppercase text-slate-400 tracking-[0.3em]">Operational Dashboard</p>
                        </div>
                        <div className="flex bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl shadow-glass overflow-x-auto w-full md:w-auto backdrop-blur-md custom-scrollbar-dark">
                            {[
                                { id: 'projects', label: 'Projects', icon: Folder },
                                { id: 'events', label: 'Events', icon: Calendar },
                                { id: 'mentors', label: 'Mentors', icon: Users },
                                { id: 'roadmaps', label: 'Roadmaps', icon: Target }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-3 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-2 ${
                                        activeTab === tab.id 
                                        ? 'bg-accent/20 text-white border border-accent/40 shadow-glow-purple' 
                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <tab.icon size={14} className={activeTab === tab.id ? 'text-accent' : ''} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel border border-white/10 rounded-3xl p-6 md:p-10 shadow-glass relative overflow-hidden min-h-[400px]">
                         {/* Ambient Glows for tabs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-[80px] pointer-events-none"></div>
                        
                        {/* Tab Content: Projects */}
                        {activeTab === 'projects' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up relative z-10 w-full">
                                {myProjects.length > 0 ? myProjects.map(project => (
                                    <div key={project._id} className="bg-surface/50 border border-white/10 p-6 rounded-2xl shadow-glass hover:bg-white/5 hover:border-accent/50 transition-all cursor-pointer group flex flex-col h-full" onClick={() => navigate(`/projects/${project._id}`)}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-surface border border-white/10 rounded-xl flex items-center justify-center shadow-inner group-hover:text-accent transition-colors text-slate-400">
                                                <Folder size={20} />
                                            </div>
                                            <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md border border-white/10 shadow-sm ${project.status === 'active' ? 'bg-accent/20 text-accent border-accent/30' : 'bg-surface text-slate-400'}`}>
                                                {project.status === 'active' ? 'In Progress' : project.status?.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <h4 className="font-bold uppercase tracking-widest text-sm text-white mb-2 line-clamp-2">{project.title}</h4>
                                        <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-6 flex-1">
                                            {project.description}
                                        </p>
                                        
                                        {/* Status indicator */}
                                        <div className="mt-auto">
                                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                                                <span>Status</span>
                                                <span className={project.status === 'active' ? 'text-accent' : ''}>{project.status === 'active' ? 'Active' : 'Archived'}</span>
                                            </div>
                                            <div className="w-full bg-surface border border-white/5 rounded-full h-1 overflow-hidden">
                                                <div
                                                    className={`h-full ${project.status === 'active' ? 'bg-accent shadow-glow-purple' : 'bg-slate-500'}`}
                                                    style={{ width: project.status === 'active' ? '75%' : project.status === 'completed' ? '100%' : '40%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center relative z-10">
                                        <div className="w-24 h-24 bg-surface/50 border border-white/5 rounded-full flex items-center justify-center shadow-inner mb-6">
                                            <Folder className="text-slate-600" size={32} />
                                        </div>
                                        <p className="font-bold uppercase tracking-[0.2em] text-sm text-white mb-2">Registry Empty</p>
                                        <p className="text-slate-500 text-xs font-medium mb-6">Commence initialization of new project node.</p>
                                        <button onClick={() => navigate('/projects/submit')} className="btn-neo-secondary px-8 py-3.5">
                                            Initialize Protocol <ArrowRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Events */}
                        {activeTab === 'events' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up relative z-10">
                                {myEvents.length > 0 ? myEvents.map(event => (
                                    <div key={event._id} className="bg-surface/50 border border-white/10 p-6 rounded-2xl shadow-glass hover:bg-white/5 hover:border-accent-blue/50 transition-all cursor-pointer group flex flex-col h-full" onClick={() => navigate(`/events/${event._id}`)}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-surface text-slate-400 group-hover:text-accent-blue transition-colors border border-white/10 rounded-xl flex items-center justify-center shadow-inner">
                                                <Calendar size={20} />
                                            </div>
                                            <span className="text-[8px] font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 text-accent-blue shadow-sm">Verified</span>
                                        </div>
                                        <h4 className="font-bold uppercase tracking-widest text-sm text-white mb-4 line-clamp-2">{event.title}</h4>
                                        <div className="flex flex-col gap-2 mt-auto">
                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} className="text-slate-500" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})} • {event.time || 'TBD'}</span>
                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2 truncate"><Map size={12} className="text-slate-500" /> {event.location}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center relative z-10">
                                        <div className="w-24 h-24 bg-surface/50 border border-white/5 rounded-full flex items-center justify-center shadow-inner mb-6">
                                            <Calendar className="text-slate-600" size={32} />
                                        </div>
                                         <p className="font-bold uppercase tracking-[0.2em] text-sm text-white mb-2">No Transmissions Logged</p>
                                        <p className="text-slate-500 text-xs font-medium mb-6">Audit schedule for open events.</p>
                                        <button onClick={() => navigate('/events')} className="btn-neo-secondary px-8 py-3.5">
                                            View Schedule <ArrowRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Mentors */}
                        {activeTab === 'mentors' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up relative z-10">
                                {mentors.map(mentor => (
                                    <div key={mentor._id} className="bg-surface/50 border border-white/10 p-6 rounded-2xl shadow-glass flex flex-col items-center text-center group hover:bg-white/5 transition-all">
                                        <div className="relative mb-5">
                                            <div className="absolute inset-0 bg-accent-cyan/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <img src={mentor.profilePicture || `https://ui-avatars.com/api/?name=${mentor.username}&background=050505&color=fff&size=128`} className="w-20 h-20 rounded-full border-2 border-white/20 shadow-glass object-cover relative z-10 bg-bg" alt="" />
                                            <div className="absolute -bottom-2 -right-2 bg-surface text-accent-cyan border border-white/10 p-2 rounded-lg shadow-inner z-20">
                                                <Briefcase size={12} />
                                            </div>
                                        </div>
                                        <h4 className="font-bold uppercase tracking-widest text-sm text-white mb-1">{mentor.username}</h4>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
                                            {mentor.domainOfExpertise || 'Node Mentor'}
                                        </p>
                                        <button className="btn-neo-secondary w-full py-3 text-[8px] sm:text-[9px]">Initiate Link</button>
                                    </div>
                                ))}
                                <div className="border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 gap-4 group cursor-pointer hover:border-white/20 hover:bg-white/5 transition-all bg-surface/30" onClick={() => navigate('/mentors')}>
                                    <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center shadow-inner group-hover:text-accent transition-colors text-slate-500">
                                        <Users size={24} />
                                    </div>
                                    <span className="font-bold uppercase tracking-widest text-[10px] text-slate-400 group-hover:text-white transition-colors">Scan Network</span>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Roadmaps */}
                        {activeTab === 'roadmaps' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up relative z-10 w-full">
                                {matchedRoadmaps.length > 0 ? matchedRoadmaps.map((roadmap, i) => (
                                    <a href={roadmap.url} target="_blank" key={i} className="bg-surface/50 border border-white/10 p-6 rounded-3xl shadow-glass flex flex-col items-center text-center group hover:bg-white/5 hover:border-accent/50 transition-all h-full">
                                        <div className="w-16 h-16 bg-surface border border-white/10 rounded-2xl flex items-center justify-center shadow-inner mb-6 group-hover:scale-110 transition-transform text-accent">
                                            <Target size={24} />
                                        </div>
                                        <h4 className="font-bold uppercase tracking-widest text-sm text-white mb-2">{roadmap.label}</h4>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-6 line-clamp-2">Optimized trajectory sequence</p>
                                        <div className="mt-auto flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-[10px] group-hover:text-white transition-colors">
                                            Execute <ExternalLink size={12} />
                                        </div>
                                    </a>
                                )) : (
                                    <div className="col-span-full border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center py-20 bg-surface/30">
                                         <Target size={32} className="text-slate-600 mb-4" />
                                         <p className="font-bold uppercase tracking-[0.2em] text-sm text-white mb-2">Insufficient Data</p>
                                        <p className="text-slate-500 text-xs font-medium mb-6 text-center max-w-sm">Requires active capability nodes to formulate trajectories.</p>
                                        <button onClick={() => navigate('/onboarding')} className="btn-neo-secondary px-8 py-3.5">
                                            Update Parameters
                                        </button>
                                    </div>
                                )}
                                
                                {/* Contribution Guide Spotlight */}
                                <div className="bg-gradient-to-br from-accent/20 to-accent-blue/20 border border-white/10 p-6 rounded-3xl shadow-[0_0_30px_rgba(139,92,246,0.15)] group cursor-pointer hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all flex flex-col items-center text-center" onClick={() => window.open('https://github.com/CID-CELL', '_blank')}>
                                    <div className="w-16 h-16 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-inner mb-6 group-hover:rotate-12 transition-transform text-white">
                                        <Code2 size={24} />
                                    </div>
                                    <h4 className="font-bold uppercase tracking-widest text-sm text-white mb-2">Network Contribution</h4>
                                    <p className="text-[10px] font-medium text-slate-300 uppercase tracking-wider mb-6">Access open source protocols</p>
                                    <div className="mt-auto flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-white">
                                        Authenticate <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
