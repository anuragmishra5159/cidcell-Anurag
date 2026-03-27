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
        <div className="min-h-screen bg-transparent pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-8 font-sans relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex flex-wrap justify-around items-center gap-20 p-20 z-0">
                <Plus size={120} strokeWidth={1} />
                <Zap size={100} strokeWidth={1} />
                <Target size={140} strokeWidth={1} />
                <Users size={110} strokeWidth={1} />
                <Code2 size={130} strokeWidth={1} />
                <Activity size={90} strokeWidth={1} />
            </div>

            <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10">
                
                {/* 1. TOP PROFILE BANNER - Balanced Layout */}
                <div className="bg-white border-2 md:border-4 border-primary shadow-neo p-3 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-highlight-yellow/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                        <div className="relative shrink-0">
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=128`}
                                alt="Profile"
                                className="w-14 h-14 md:w-28 md:h-28 rounded-xl md:rounded-3xl border-2 md:border-4 border-primary shadow-neo-mini md:shadow-neo object-cover"
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
                           <button onClick={() => navigate('/onboarding')} className="w-full h-10 bg-highlight-yellow border-2 border-primary rounded-lg flex items-center justify-center gap-2 font-black uppercase text-[10px] shadow-neo-mini">
                                <Pencil size={12} /> Edit Profile
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
                        <div className="hidden md:flex items-center gap-2 w-full">
                            <button 
                                onClick={() => navigate('/onboarding')}
                                className="bg-highlight-yellow border-2 border-primary px-6 py-2.5 rounded-xl font-black uppercase text-[10px] shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                <Pencil size={12} /> Edit profile
                            </button>
                            <div className="flex gap-1.5 font-sans">
                                <a href={user?.socialLinks?.github} target="_blank" className="bg-white border-2 border-primary p-2 rounded-lg shadow-neo-mini hover:bg-highlight-blue transition-all"><Github size={14} /></a>
                                <a href={user?.socialLinks?.linkedin} target="_blank" className="bg-white border-2 border-primary p-2 rounded-lg shadow-neo-mini hover:bg-highlight-blue transition-all"><Linkedin size={14} /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. STATS GRID - Condensed */}
                {/* 2. STATS GRID - Functional Counts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {[
                        { label: "RSVP'd Events", value: myEvents.length, icon: Calendar, color: "bg-highlight-yellow" },
                        { label: "Community Projects", value: stats.totalProjects, icon: Folder, color: "bg-highlight-blue" },
                        { label: "Available Mentors", value: stats.totalMentors, icon: Users, color: "bg-highlight-green" },
                        { label: "My Projects", value: myProjects.length, icon: Target, color: "bg-highlight-purple" }
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} border-2 border-primary p-3 md:p-3.5 rounded-xl shadow-neo-mini md:shadow-neo-sm flex flex-col items-center justify-center text-center gap-2 md:gap-2 group hover:-translate-y-1 transition-transform`}>
                            <stat.icon className="text-primary w-4 h-4 md:w-5 md:h-5" />
                            <div className="flex flex-col items-center">
                                <h3 className="text-xl md:text-3xl font-black text-primary leading-none">{stat.value}</h3>
                                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-tight md:tracking-wider text-primary/60 mt-0.5 line-clamp-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* 2. PREVIEWS SECTION (1 PROJECT / 1 EVENT) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Project Preview Card */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                <span className="w-8 h-8 bg-highlight-blue border-3 border-primary rounded-xl flex items-center justify-center shadow-neo-sm"><Folder size={16} /></span>
                                Featured Project
                            </h2>
                            <Link to="/projects" className="text-[10px] font-black uppercase text-primary/40 hover:text-primary transition-colors flex items-center gap-2">Explore All <ArrowRight size={14} /></Link>
                        </div>
                        {recentProjects.length > 0 ? recentProjects.map(project => (
                            <div key={project._id} className="bg-white border-2 md:border-3 border-primary rounded-xl shadow-neo group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all p-3 md:p-4 flex flex-row gap-4 sm:gap-5">
                                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-slate-100 border-2 border-primary rounded-lg overflow-hidden shrink-0 shadow-neo-mini md:shadow-neo-sm">
                                    {project.images?.[0] || project.image ? (
                                        <img src={project.images?.[0] || project.image} className="w-full h-full object-cover" alt={project.title} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-highlight-blue/5">
                                            <Zap size={24} className="text-primary/20" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-row items-end justify-between gap-2">
                                    <div className="space-y-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-highlight-teal border-2 border-primary px-2 py-0.5 rounded-md text-[7px] font-black uppercase">{project.category || 'Core'}</span>
                                        </div>
                                        <h3 className="text-sm md:text-lg font-black uppercase text-primary truncate tracking-tight">{project.title}</h3>
                                        <p className="text-[9px] md:text-[10px] font-bold text-primary/60 uppercase leading-relaxed line-clamp-2 h-7 md:h-8 mb-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {project.githubRepo && (
                                                <a href={project.githubRepo} target="_blank" className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-black uppercase text-primary/40 hover:text-primary transition-colors">
                                                    <Github size={12} /> Repo
                                                </a>
                                            )}
                                            {project.deployedLink && (
                                                <a href={project.deployedLink} target="_blank" className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-black uppercase text-primary/40 hover:text-primary transition-colors">
                                                    <Globe size={12} /> Live
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/projects/${project._id}`)} 
                                        className="bg-primary text-white p-2 md:p-3 rounded-lg shadow-neo-mini hover:scale-105 transition-transform shrink-0"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="h-32 border-3 border-dashed border-primary/20 rounded-xl flex items-center justify-center text-primary/30 font-black uppercase text-xs">No active projects</div>
                        )}
                    </div>

                    {/* Event Preview Card */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                <span className="w-8 h-8 bg-highlight-yellow border-3 border-primary rounded-lg flex items-center justify-center shadow-neo-sm"><Calendar size={16} /></span>
                                Next Lineup
                            </h2>
                            <Link to="/events" className="text-[10px] font-black uppercase text-primary/40 hover:text-primary transition-colors flex items-center gap-2">Calendar <ArrowRight size={14} /></Link>
                        </div>
                        {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                            <div key={event._id} className="bg-white border-2 md:border-3 border-primary rounded-xl shadow-neo group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all p-3 md:p-4 flex flex-row gap-4 sm:gap-5">
                                <div className="w-16 h-16 sm:w-28 sm:h-28 bg-slate-100 border-2 border-primary rounded-lg overflow-hidden shrink-0 shadow-neo-mini md:shadow-neo-sm">
                                    {event.image ? (
                                        <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-row items-end justify-between gap-2">
                                    <div className="space-y-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-highlight-green border-2 border-primary px-2 py-0.5 rounded-md text-[7px] font-black uppercase">{event.type || 'In-Person'}</span>
                                        </div>
                                        <h3 className="text-sm md:text-lg font-black uppercase text-primary truncate tracking-tight">{event.title}</h3>
                                        <div className="flex flex-col gap-0.5 mt-1 border-l-2 border-highlight-yellow pl-2">
                                            <span className="text-[8px] md:text-[10px] font-bold uppercase text-primary/60 flex items-center gap-2">
                                                <Calendar size={10} className="text-highlight-yellow" /> 
                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="text-[8px] md:text-[10px] font-bold uppercase text-primary/60 flex items-center gap-2">
                                                <Clock size={10} className="text-highlight-purple" /> 
                                                {event.time || '10:00 AM'}
                                            </span>
                                            <span className="text-[8px] md:text-[10px] font-bold uppercase text-primary/60 flex items-center gap-2">
                                                <Globe size={10} className="text-highlight-blue" /> 
                                                {event.location || 'Hall'}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/events/${event._id}`)} 
                                        className="bg-highlight-yellow border-2 border-primary p-2 md:p-3 rounded-lg shadow-neo-mini hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shrink-0"
                                    >
                                        <ArrowRight size={16} className="text-primary" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="h-32 border-3 border-dashed border-primary/20 rounded-xl flex items-center justify-center text-primary/30 font-black uppercase text-xs">No upcoming sessions</div>
                        )}
                    </div>
                </div>

                {/* 3. MY ACTIVITY TABS SECTION */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3"><Activity size={28} className="text-highlight-purple" /> My Activity</h2>
                            <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest pl-1">Everything you're building & exploring</p>
                        </div>
                        {/* Tab Switcher */}
                        <div className="flex bg-white border-3 border-primary p-1.5 rounded-2xl shadow-neo-sm overflow-x-auto">
                            {[
                                { id: 'projects', label: 'Projects', icon: Folder },
                                { id: 'events', label: 'Events', icon: Calendar },
                                { id: 'mentors', label: 'Mentors', icon: Users },
                                { id: 'roadmaps', label: 'Roadmaps', icon: Target }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 md:px-6 py-2.5 rounded-xl font-black uppercase text-[10px] transition-all flex items-center gap-2 ${
                                        activeTab === tab.id 
                                        ? 'bg-highlight-purple text-primary shadow-neo-mini' 
                                        : 'text-primary/40 hover:text-primary hover:bg-slate-50'
                                    }`}
                                >
                                    <tab.icon size={14} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border-4 border-primary rounded-3xl p-6 md:p-10 shadow-neo relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-highlight-purple/5 -mr-12 -mb-12 rounded-full blur-2xl"></div>
                        
                        {/* Tab Content: Projects */}
                        {activeTab === 'projects' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                                {myProjects.length > 0 ? myProjects.map(project => (
                                    <div key={project._id} className="bg-bg border-3 border-primary p-5 rounded-2xl shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer" onClick={() => navigate(`/projects/${project._id}`)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-white border-2 border-primary rounded-xl flex items-center justify-center shadow-neo-mini">
                                                <Folder size={18} />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded border-2 border-primary ${project.status === 'active' ? 'bg-highlight-green' : 'bg-highlight-yellow'}`}>{project.status}</span>
                                        </div>
                                        <h4 className="font-black uppercase text-xs truncate mb-1">{project.title}</h4>
                                        <p className="text-[9px] font-bold text-primary/40 uppercase mb-4">Last Modified {(new Date()).toLocaleDateString()}</p>
                                        <div className="w-full bg-white border-2 border-primary rounded-full h-2 overflow-hidden">
                                            <div className="bg-highlight-purple h-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-20 h-20 bg-slate-50 border-3 border-dashed border-primary/20 rounded-full flex items-center justify-center">
                                            <Folder className="opacity-10" size={40} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-black uppercase text-sm text-primary/40">No projects started yet</p>
                                            <button onClick={() => navigate('/projects/submit')} className="text-primary font-black uppercase text-[10px] hover:underline">Start your first project →</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Events */}
                        {activeTab === 'events' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                                {myEvents.length > 0 ? myEvents.map(event => (
                                    <div key={event._id} className="bg-white border-3 border-primary p-5 rounded-2xl shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer flex flex-col" onClick={() => navigate(`/events/${event._id}`)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-highlight-yellow border-2 border-primary rounded-xl flex items-center justify-center shadow-neo-mini">
                                                <Calendar size={18} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase px-2 py-1 rounded border-2 border-primary bg-highlight-green shadow-[2px_2px_0_#1A1A1A]">Registered</span>
                                        </div>
                                        <h4 className="font-black uppercase text-sm mb-2 leading-tight">{event.title}</h4>
                                        <div className="flex flex-col gap-1 mt-auto border-l-2 border-highlight-yellow pl-3">
                                            <span className="text-[10px] font-bold text-primary/60 uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                            <span className="text-[10px] font-bold text-primary/60 uppercase">{event.time || 'TBD'}</span>
                                            <span className="text-[10px] font-bold text-primary/60 uppercase truncate">{event.location}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-20 h-20 bg-slate-50 border-3 border-dashed border-primary/20 rounded-full flex items-center justify-center">
                                            <Calendar className="opacity-10" size={40} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-black uppercase text-sm text-primary/40">Not attending any events yet</p>
                                            <button onClick={() => navigate('/events')} className="text-primary font-black uppercase text-[10px] hover:underline">Explore upcoming events →</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Mentors */}
                        {activeTab === 'mentors' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                                {mentors.map(mentor => (
                                    <div key={mentor._id} className="bg-white border-3 border-primary p-4 rounded-2xl shadow-neo-sm flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                                        <div className="relative mb-3">
                                            <img src={mentor.profilePicture || `https://ui-avatars.com/api/?name=${mentor.username}`} className="w-16 h-16 rounded-full border-2 border-primary shadow-neo-mini object-cover" alt="" />
                                            <div className="absolute -bottom-1 -right-1 bg-highlight-blue border-2 border-primary p-1 rounded-lg">
                                                <Briefcase size={10} />
                                            </div>
                                        </div>
                                        <h4 className="font-black uppercase text-[10px] mb-1">{mentor.username}</h4>
                                        <p className="text-[8px] font-bold text-primary/40 uppercase tracking-widest mb-3">Core Development</p>
                                        <button className="w-full py-2 bg-bg border-2 border-primary rounded-xl font-black uppercase text-[9px] hover:bg-highlight-blue transition-colors">Chat Now</button>
                                    </div>
                                ))}
                                <div className="border-3 border-dashed border-primary/10 rounded-2xl flex flex-col items-center justify-center p-6 gap-3 group cursor-pointer hover:border-primary/30 transition-colors" onClick={() => navigate('/mentors')}>
                                    <Users className="text-primary/10 group-hover:text-primary/30 transition-colors" size={32} />
                                    <span className="font-black uppercase text-[9px] text-primary/30 group-hover:text-primary transition-colors">Find more mentors</span>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Roadmaps */}
                        {activeTab === 'roadmaps' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                                {matchedRoadmaps.length > 0 ? matchedRoadmaps.map((roadmap, i) => (
                                    <a href={roadmap.url} target="_blank" key={i} className="bg-bg border-3 border-primary p-6 rounded-3xl shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col items-center text-center group">
                                        <div className="w-14 h-14 bg-white border-3 border-primary rounded-2xl flex items-center justify-center shadow-neo mb-4 group-hover:scale-110 transition-transform">
                                            <Code2 size={24} className="text-highlight-purple" />
                                        </div>
                                        <h4 className="font-black uppercase text-sm mb-2">{roadmap.label}</h4>
                                        <p className="text-[10px] font-black uppercase text-primary/40 mb-4 h-8 overflow-hidden">Curated guide to master this field</p>
                                        <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] border-b-2 border-primary pb-0.5">
                                            Start Learning <ExternalLink size={12} />
                                        </div>
                                    </a>
                                )) : (
                                    <div className="col-span-full text-center py-10 opacity-30 font-black uppercase text-xs">Skills needed to match roadmaps</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
