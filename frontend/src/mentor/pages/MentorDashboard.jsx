import React, { useState, useEffect, useContext } from 'react';
import { MessageSquare, Clock, Users, BookOpen, ArrowRight, Plus, X, CheckCircle, XCircle, ChevronDown, ChevronUp, ExternalLink, Loader, Github, ShieldAlert, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const MentorDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [pendingProjects, setPendingProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [loadingPending, setLoadingPending] = useState(true);
    const [loadingMine, setLoadingMine] = useState(true);

    // Task management state
    const [expandedProject, setExpandedProject] = useState(null);
    const [tasks, setTasks] = useState({});
    const [loadingTasks, setLoadingTasks] = useState({});
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [feedback, setFeedback] = useState({});
    const [toast, setToast] = useState({ message: '', type: null });

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast({ message: '', type: null }), 3000);
    };

    useEffect(() => {
        fetchPending();
        fetchMine();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await axios.get(`${API}/projects/review/mentor`, authHeaders());
            setPendingProjects(res.data);
        } catch { /* empty */ } finally { setLoadingPending(false); }
    };

    const fetchMine = async () => {
        try {
            const res = await axios.get(`${API}/projects/mine/all`, authHeaders());
            setMyProjects(res.data.filter(p => p.status === 'active'));
        } catch { /* empty */ } finally { setLoadingMine(false); }
    };

    const handleReview = async (projectId, action) => {
        try {
            await axios.patch(`${API}/projects/${projectId}/mentor-review`, {
                action,
                feedback: feedback[projectId] || '',
            }, authHeaders());
            showToast(`Project ${action === 'approve' ? 'approved' : 'rejected'}!`);
            setPendingProjects(prev => prev.filter(p => p._id !== projectId));
        } catch (err) {
            showToast(err.response?.data?.message || 'Review failed', 'error');
        }
    };

    const fetchTasks = async (projectId) => {
        setLoadingTasks(prev => ({ ...prev, [projectId]: true }));
        try {
            const res = await axios.get(`${API}/tasks/project/${projectId}`, authHeaders());
            setTasks(prev => ({ ...prev, [projectId]: res.data }));
        } catch { /* empty */ } finally {
            setLoadingTasks(prev => ({ ...prev, [projectId]: false }));
        }
    };

    const toggleProject = (projectId) => {
        if (expandedProject === projectId) {
            setExpandedProject(null);
        } else {
            setExpandedProject(projectId);
            if (!tasks[projectId]) fetchTasks(projectId);
        }
    };

    const handleCreateTask = async (projectId) => {
        if (!newTask.title.trim()) return;
        try {
            await axios.post(`${API}/tasks`, { projectId, ...newTask }, authHeaders());
            showToast('Task generated successfully!');
            setNewTask({ title: '', description: '' });
            fetchTasks(projectId);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to generate task', 'error');
        }
    };

    const handleTaskReview = async (taskId, action, projectId) => {
        try {
            await axios.patch(`${API}/tasks/${taskId}/review`, {
                action,
                feedback: feedback[`task_${taskId}`] || '',
            }, authHeaders());
            showToast(`Task ${action === 'approve' ? 'approved' : 'rejected'}!`);
            fetchTasks(projectId);
        } catch (err) {
            showToast(err.response?.data?.message || 'Task review failed', 'error');
        }
    };

    const getStatusStyle = (status) => {
        const map = {
            todo: 'bg-surface/50 border border-white/10 text-slate-400',
            in_progress: 'bg-accent-blue/10 border border-blue-500/30 text-accent-blue',
            review: 'bg-accent/10 border border-accent/30 text-accent shadow-glow-purple',
            done: 'bg-accent-cyan/10 border border-cyan-500/30 text-accent-cyan',
        };
        return map[status] || 'bg-surface border border-white/10 text-slate-500';
    };

    return (
        <div className="dashboard-theme bg-bg min-h-screen pt-32 pb-20 font-body text-white relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-glow-blue rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

                {/* Header Banner */}
                <div className="glass-panel border border-white/10 shadow-glass md:p-10 p-6 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group rounded-3xl">
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-glow-accent rounded-full pointer-events-none group-hover:bg-accent/20 transition-colors"></div>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full z-10">
                        <div className="relative shrink-0 group/avatar">
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur flex-1 -z-10 group-hover/avatar:bg-accent/40 transition-colors"></div>
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.username}&background=050505&color=fff&size=128`}
                                alt="Profile"
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/20 shadow-glass object-cover bg-bg transition-transform duration-500 group-hover/avatar:scale-105"
                            />
                        </div>
                        <div className="text-center md:text-left space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-widest drop-shadow-lg">
                                    {user?.username}
                                </h1>
                                <span className="w-fit mx-auto md:mx-0 bg-surface border border-white/10 text-accent px-4 py-1.5 rounded-md font-bold uppercase text-[10px] tracking-[0.2em] shadow-inner flex items-center gap-2">
                                     <Zap size={12}/> Mentor Node
                                </span>
                            </div>
                            <p className="text-slate-400 font-medium text-xs sm:text-sm uppercase tracking-widest line-clamp-2 max-w-2xl px-4 md:px-0">
                                Oversee technical domains, review architectural proposals, and guide junior nodes.
                            </p>
                            <div className="inline-flex items-center gap-2 mt-2 bg-surface/50 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-slate-300 shadow-glass tracking-widest">
                                Department: <span className="text-accent-blue">{user?.department?.toUpperCase() || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: "Pending Approvals", value: pendingProjects.length, icon: Clock, color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
                        { label: "Active Matrices", value: myProjects.length, icon: BookOpen, color: "text-accent-cyan", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
                        { label: "Network Sector", value: user?.department?.substring(0, 8)?.toUpperCase() || "N/A", icon: Users, color: "text-accent", border: "border-accent/30", bg: "bg-accent/10" },
                        { label: "Comms Channel", value: "Chat", icon: MessageSquare, color: "text-accent-blue", border: "border-blue-500/30", bg: "bg-blue-500/10", onClick: () => navigate('/mentor/chat') },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            onClick={stat.onClick}
                            className={`glass-panel border ${stat.border} p-5 md:p-6 rounded-2xl shadow-glass flex flex-col items-center justify-center text-center gap-3 group hover:-translate-y-1 transition-transform relative overflow-hidden ${stat.onClick ? 'cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`}
                        >
                            <div className={`absolute -right-6 -top-6 w-20 h-20 ${stat.bg} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform`}></div>
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center shadow-inner relative z-10 transition-colors group-hover:bg-transparent`}>
                                <stat.icon className={`${stat.color} w-5 h-5`} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-black text-white leading-none mb-1 drop-shadow-md">{stat.value}</h3>
                                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-0.5 truncate">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* ── Section 1: Pending Reviews ── */}
                    <div className="glass-panel border border-white/10 p-6 md:p-8 rounded-3xl shadow-glass space-y-6 relative overflow-hidden xl:col-span-5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[50px] pointer-events-none"></div>
                        
                        <div className="relative z-10 border-b border-white/10 pb-4">
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
                                <Clock size={24} className="text-orange-400" /> Pending Reviews
                            </h2>
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mt-2">
                                Proposals awaiting architectural validation
                            </p>
                        </div>

                        {loadingPending ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4 relative z-10 text-slate-400">
                                <Loader className="animate-spin text-accent" size={32} />
                                <span className="font-bold text-xs uppercase tracking-widest text-slate-300">Scanning Queue...</span>
                            </div>
                        ) : pendingProjects.length === 0 ? (
                            <div className="p-10 text-center bg-surface/30 rounded-2xl border border-dashed border-white/10 relative z-10 flex flex-col items-center justify-center">
                                <ShieldAlert className="text-slate-600 mb-3" size={32} />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Review queue empty. Diagnostics clear.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {pendingProjects.map(project => (
                                    <div key={project._id} className="border border-orange-500/30 p-5 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 transition-colors shadow-inner flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-sm md:text-base text-white uppercase tracking-wider">{project.title}</h3>
                                            <span className="px-2 py-1 text-[8px] font-bold uppercase border border-slate-600 bg-surface/50 text-slate-300 rounded shadow-sm">Protocol</span>
                                        </div>
                                        <p className="text-xs text-slate-400 my-2 line-clamp-3 leading-relaxed">{project.description}</p>
                                        <div className="mt-2 p-3 bg-surface/50 rounded-lg border border-white/5 space-y-1">
                                            <p className="text-[10px] font-bold text-slate-500 tracking-wider">
                                                Initiator: <span className="text-slate-300">{project.createdBy?.username}</span>
                                            </p>
                                            <p className="text-[9px] font-medium text-slate-600 truncate">{project.createdBy?.email}</p>
                                        </div>
                                        
                                        <div className="flex gap-4 my-4">
                                            {project.githubRepo && (
                                                <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase text-accent-blue hover:text-blue-400 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                                                    <Github size={14} /> Repository
                                                </a>
                                            )}
                                            {project.deployedLink && (
                                                <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase text-accent-cyan hover:text-cyan-400 transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                                                    <ExternalLink size={14} /> Live Env
                                                </a>
                                            )}
                                        </div>

                                        <textarea
                                            className="w-full p-3 bg-surface/50 border border-white/10 rounded-lg text-xs outline-none focus:border-accent focus:bg-white/5 transition-all text-white placeholder-slate-600 font-body mb-4 resize-none shadow-inner"
                                            rows="2"
                                            placeholder="Provide architectural feedback or validation notes..."
                                            value={feedback[project._id] || ''}
                                            onChange={e => setFeedback({ ...feedback, [project._id]: e.target.value })}
                                        />
                                        <div className="flex gap-3 mt-auto">
                                            <button onClick={() => handleReview(project._id, 'approve')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-green-500 hover:text-white transition-all shadow-glass">
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button onClick={() => handleReview(project._id, 'reject')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-glass">
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Section 2: My Active Projects + Task Management ── */}
                    <div className="glass-panel border border-white/10 p-6 md:p-8 rounded-3xl shadow-glass space-y-6 relative overflow-hidden xl:col-span-7 flex flex-col">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-cyan/5 blur-[60px] pointer-events-none"></div>

                        <div className="relative z-10 border-b border-white/10 pb-4">
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
                                <BookOpen size={24} className="text-accent-cyan" /> Monitored Projects
                            </h2>
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mt-2">
                                Issue objectives and validate PR submissions
                            </p>
                        </div>

                        {loadingMine ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4 relative z-10 text-slate-400 flex-1">
                                <Loader className="animate-spin text-accent-cyan" size={32} />
                                <span className="font-bold text-xs uppercase tracking-widest text-slate-300">Loading Matrices...</span>
                            </div>
                        ) : myProjects.length === 0 ? (
                            <div className="p-10 text-center bg-surface/30 rounded-2xl border border-dashed border-white/10 relative z-10 flex flex-col items-center justify-center flex-1">
                                <BookOpen className="text-slate-600 mb-3" size={32} />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No active projects currently monitored.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {myProjects.map(project => (
                                    <div key={project._id} className={`border border-white/10 rounded-xl overflow-hidden shadow-glass transition-colors ${expandedProject === project._id ? 'bg-surface/80 border-accent/30' : 'bg-surface/30 hover:bg-surface/50'}`}>
                                        {/* Project Header */}
                                        <button
                                            onClick={() => toggleProject(project._id)}
                                            className="w-full flex items-center justify-between p-5 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center shadow-inner text-slate-400">
                                                    <BookOpen size={16} className={expandedProject === project._id ? "text-accent" : ""} />
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold uppercase tracking-widest text-sm transition-colors ${expandedProject === project._id ? "text-white" : "text-slate-300"}`}>{project.title}</h3>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Designation Sequence</p>
                                                </div>
                                            </div>
                                            <div className={`p-2 rounded-lg border border-white/10 shadow-inner transition-colors ${expandedProject === project._id ? 'bg-accent/10 text-accent border-accent/20' : 'bg-surface text-slate-500'}`}>
                                                {expandedProject === project._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </div>
                                        </button>

                                        {/* Expanded Task Panel */}
                                        {expandedProject === project._id && (
                                            <div className="p-5 border-t border-white/10 bg-bg/50 backdrop-blur-sm space-y-6">

                                                {/* Create Task */}
                                                <div className="p-5 bg-surface/50 border border-white/5 rounded-xl space-y-4 shadow-inner">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-2"><Plus size={14}/> Define Objective</p>
                                                    <input
                                                        type="text" placeholder="Objective identifier..."
                                                        value={newTask.title}
                                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                                        className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-xs text-white font-medium outline-none focus:border-accent focus:shadow-glow-purple transition-all placeholder-slate-600"
                                                    />
                                                    <textarea
                                                        placeholder="Detailed execution parameters..."
                                                        value={newTask.description}
                                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                                        className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-xs text-white font-medium outline-none focus:border-accent focus:shadow-glow-purple transition-all placeholder-slate-600 resize-none h-24"
                                                    />
                                                    <button
                                                        onClick={() => handleCreateTask(project._id)}
                                                        className="flex items-center gap-2 px-5 py-3 bg-accent border border-accent/50 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all text-white w-full sm:w-auto justify-center"
                                                    >
                                                        Upload Objective
                                                    </button>
                                                </div>

                                                {/* Task List */}
                                                <div>
                                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Active Objectives</h4>
                                                    {loadingTasks[project._id] ? (
                                                        <div className="text-center py-6"><Loader className="animate-spin text-accent mx-auto" size={24} /></div>
                                                    ) : (tasks[project._id] || []).length === 0 ? (
                                                        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-6 border border-dashed border-white/10 rounded-xl bg-surface/30">No active parameters set.</p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {(tasks[project._id] || []).map(task => (
                                                                <div key={task._id} className="border border-white/10 p-5 rounded-xl bg-surface/50 shadow-glass">
                                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                                                        <h4 className="font-bold text-slate-200 text-sm">{task.title}</h4>
                                                                        <span className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded shadow-sm w-fit ${getStatusStyle(task.status)}`}>
                                                                            {task.status.replace('_', ' ')}
                                                                        </span>
                                                                    </div>
                                                                    {task.description && <p className="text-xs text-slate-400 mb-4 bg-bg border border-white/5 p-3 rounded-lg leading-relaxed">{task.description}</p>}
                                                                    
                                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                                                                        {task.assignedTo && (
                                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                                                <Users size={12}/> Assigned: <span className="text-accent-cyan bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{task.assignedTo.username}</span>
                                                                            </p>
                                                                        )}
                                                                        {task.prLink && (
                                                                            <a href={task.prLink} target="_blank" rel="noopener noreferrer"
                                                                                className="inline-flex items-center justify-center sm:justify-start gap-2 text-[10px] font-bold uppercase tracking-widest text-accent-blue hover:text-blue-400 border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                                                            >
                                                                                <ExternalLink size={12} /> Inspect PR
                                                                            </a>
                                                                        )}
                                                                    </div>

                                                                    {/* Review controls for tasks in 'review' status */}
                                                                    {task.status === 'review' && (
                                                                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                                                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Validation Sequence Required</p>
                                                                            <textarea
                                                                                placeholder="Diagnostic feedback..."
                                                                                value={feedback[`task_${task._id}`] || ''}
                                                                                onChange={e => setFeedback({ ...feedback, [`task_${task._id}`]: e.target.value })}
                                                                                className="w-full px-3 py-2 bg-bg border border-white/10 rounded-lg text-xs outline-none focus:border-accent font-medium text-white resize-none shadow-inner"
                                                                                rows="2"
                                                                            />
                                                                            <div className="flex flex-col sm:flex-row gap-2">
                                                                                <button onClick={() => handleTaskReview(task._id, 'approve', project._id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
                                                                                    <CheckCircle size={14} /> Validate
                                                                                </button>
                                                                                <button onClick={() => handleTaskReview(task._id, 'reject', project._id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                                                                    <XCircle size={14} /> Reject
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Chat Link */}
                <div className="glass-panel border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden group">
                    <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-glow-accent rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-3 text-white mb-2">
                                Node Communications
                            </h2>
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em]">
                                Direct channel to supervised entities
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/mentor/chat')}
                            className="bg-surface border border-white/10 hover:border-accent hover:bg-white/5 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-white shadow-glass hover:shadow-glow-purple transition-all flex items-center justify-center gap-3 w-full md:w-auto"
                        >
                            Open Comms Link <ArrowRight size={14} className="text-accent"/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast.message && (
                <div className="fixed bottom-6 right-6 z-[9999]">
                    <div className={`px-5 py-3 border rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center gap-3 text-xs font-bold uppercase tracking-widest backdrop-blur-md ${toast.type === 'error' ? 'bg-red-900/80 border-red-500/50 text-white' : 'bg-green-900/80 border-green-500/50 text-white'}`}>
                        {toast.type === 'error' ? <XCircle size={16} className="text-red-400" /> : <CheckCircle size={16} className="text-green-400" />}
                        <p>{toast.message}</p>
                        <button onClick={() => setToast({ message: '', type: null })} className="ml-2 hover:opacity-70"><X size={14} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorDashboard;
