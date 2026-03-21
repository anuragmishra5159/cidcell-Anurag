import React, { useState, useEffect, useContext } from 'react';
import { MessageSquare, Clock, Users, BookOpen, ArrowRight, Plus, X, CheckCircle, XCircle, ChevronDown, ChevronUp, ExternalLink, Loader, Github } from 'lucide-react';
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
            showToast('Task created!');
            setNewTask({ title: '', description: '' });
            fetchTasks(projectId);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to create task', 'error');
        }
    };

    const handleTaskReview = async (taskId, action, projectId) => {
        try {
            await axios.patch(`${API}/tasks/${taskId}/review`, {
                action,
                feedback: feedback[`task_${taskId}`] || '',
            }, authHeaders());
            showToast(`Task ${action === 'approve' ? 'approved' : 'sent back'}!`);
            fetchTasks(projectId);
        } catch (err) {
            showToast(err.response?.data?.message || 'Task review failed', 'error');
        }
    };

    const taskStatusBadge = (status) => {
        const map = {
            todo: 'bg-slate-200 text-slate-600',
            in_progress: 'bg-highlight-yellow text-primary',
            review: 'bg-highlight-purple text-primary',
            done: 'bg-green-300 text-green-900',
        };
        return map[status] || 'bg-slate-100';
    };

    return (
        <div className="bg-bg min-h-screen pt-24 pb-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Header Banner */}
                <div className="bg-white border-3 md:border-4 border-primary shadow-neo p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group rounded-2xl md:rounded-neo">
                    <div className="flex items-center gap-6 w-full md:w-auto z-10">
                        <div className="relative shrink-0">
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=128`}
                                alt="Profile"
                                className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl border-3 md:border-4 border-primary shadow-neo-sm md:shadow-neo object-cover"
                            />
                        </div>
                        <div className="text-left space-y-1 md:space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                <h1 className="text-xl md:text-4xl font-black text-primary uppercase leading-none tracking-tight">
                                    Hello, {user?.username}
                                </h1>
                                <span className="w-fit bg-highlight-teal text-primary border-2 border-primary px-2 py-0.5 font-black uppercase text-[8px] md:text-[10px] shadow-neo-sm">
                                    Mentor
                                </span>
                            </div>
                            <p className="text-primary/60 font-black uppercase text-[9px] md:text-[11px] tracking-widest leading-none">
                                Review projects, create tasks, and manage contributors
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: "Pending Reviews", value: pendingProjects.length, icon: Clock, color: "bg-highlight-yellow" },
                        { label: "Active Projects", value: myProjects.length, icon: BookOpen, color: "bg-highlight-green" },
                        { label: "Domain", value: user?.department?.substring(0, 8)?.toUpperCase() || "N/A", icon: Users, color: "bg-highlight-purple" },
                        { label: "Quick Action", value: "Chat", icon: MessageSquare, color: "bg-highlight-blue", onClick: () => navigate('/mentor/chat') },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            onClick={stat.onClick}
                            className={`${stat.color} border-3 border-primary p-4 md:p-5 rounded-2xl md:rounded-neo shadow-neo-sm flex flex-col gap-2 md:gap-3 group hover:-translate-y-1 transition-transform ${stat.onClick ? 'cursor-pointer' : ''}`}
                        >
                            <stat.icon className="text-primary w-4 h-4 md:w-5 md:h-5" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-primary leading-none">{stat.value}</h3>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-primary/60 mt-0.5 truncate">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Section 1: Pending Reviews ── */}
                <div className="bg-white border-4 border-primary p-6 md:p-8 rounded-neo shadow-neo space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Clock size={24} className="text-yellow-500" /> Pending Project Reviews
                    </h2>
                    <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest -mt-4">
                        Collaborative projects awaiting your approval before going to Faculty
                    </p>

                    {loadingPending ? (
                        <div className="text-center py-8"><Loader className="animate-spin text-primary mx-auto" size={28} /></div>
                    ) : pendingProjects.length === 0 ? (
                        <div className="p-8 text-center bg-bg rounded-2xl border-2 border-dashed border-primary/20">
                            <p className="text-[10px] font-black uppercase text-primary/40">No projects waiting for your review.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingProjects.map(project => (
                                <div key={project._id} className="border-3 border-primary p-5 rounded-xl bg-highlight-yellow/10">
                                    <h3 className="font-black text-lg text-primary uppercase">{project.title}</h3>
                                    <p className="text-sm text-slate-600 my-2 line-clamp-2">{project.description}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mb-3">
                                        Submitted by: <span className="text-primary">{project.createdBy?.username}</span> ({project.createdBy?.email})
                                    </p>
                                    
                                    <div className="flex gap-4 mb-4">
                                        {project.githubRepo && (
                                            <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:underline">
                                                <Github size={14} /> GitHub Repo
                                            </a>
                                        )}
                                        {project.deployedLink && (
                                            <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 hover:underline">
                                                <ExternalLink size={14} /> Live Demo
                                            </a>
                                        )}
                                    </div>

                                    <textarea
                                        className="w-full p-2 border-2 border-primary text-sm mb-3 outline-none focus:bg-slate-50"
                                        rows="2"
                                        placeholder="Optional feedback..."
                                        value={feedback[project._id] || ''}
                                        onChange={e => setFeedback({ ...feedback, [project._id]: e.target.value })}
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={() => handleReview(project._id, 'approve')} className="flex items-center gap-2 px-5 py-2 bg-green-400 border-2 border-primary font-black uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-y-0.5 transition-all">
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button onClick={() => handleReview(project._id, 'reject')} className="flex items-center gap-2 px-5 py-2 bg-red-400 border-2 border-primary font-black uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-y-0.5 transition-all text-white">
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Section 2: My Active Projects + Task Management ── */}
                <div className="bg-white border-4 border-primary p-6 md:p-8 rounded-neo shadow-neo space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                        <BookOpen size={24} className="text-green-600" /> My Active Projects
                    </h2>
                    <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest -mt-4">
                        Manage tasks and review student PR submissions
                    </p>

                    {loadingMine ? (
                        <div className="text-center py-8"><Loader className="animate-spin text-primary mx-auto" size={28} /></div>
                    ) : myProjects.length === 0 ? (
                        <div className="p-8 text-center bg-bg rounded-2xl border-2 border-dashed border-primary/20">
                            <p className="text-[10px] font-black uppercase text-primary/40">No active projects yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myProjects.map(project => (
                                <div key={project._id} className="border-3 border-primary rounded-xl overflow-hidden">
                                    {/* Project Header */}
                                    <button
                                        onClick={() => toggleProject(project._id)}
                                        className="w-full flex items-center justify-between p-4 bg-highlight-green/20 hover:bg-highlight-green/30 transition-colors text-left"
                                    >
                                        <div>
                                            <h3 className="font-black text-primary uppercase">{project.title}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{project.type} project</p>
                                        </div>
                                        {expandedProject === project._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>

                                    {/* Expanded Task Panel */}
                                    {expandedProject === project._id && (
                                        <div className="p-5 border-t-3 border-primary bg-white space-y-5">

                                            {/* Create Task */}
                                            <div className="p-4 bg-bg border-2 border-dashed border-primary/30 rounded-xl space-y-3">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Create New Task</p>
                                                <input
                                                    type="text" placeholder="Task title..."
                                                    value={newTask.title}
                                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                                    className="w-full px-3 py-2 border-2 border-primary text-sm outline-none focus:bg-slate-50"
                                                />
                                                <textarea
                                                    placeholder="Description (optional)..."
                                                    value={newTask.description}
                                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                                    className="w-full px-3 py-2 border-2 border-primary text-sm outline-none focus:bg-slate-50"
                                                    rows="2"
                                                />
                                                <button
                                                    onClick={() => handleCreateTask(project._id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-black uppercase text-xs border-2 border-primary shadow-neo-sm hover:shadow-none hover:translate-y-0.5 transition-all"
                                                >
                                                    <Plus size={16} /> Create Task
                                                </button>
                                            </div>

                                            {/* Task List */}
                                            {loadingTasks[project._id] ? (
                                                <div className="text-center py-4"><Loader className="animate-spin text-primary mx-auto" size={24} /></div>
                                            ) : (tasks[project._id] || []).length === 0 ? (
                                                <p className="text-center text-sm font-bold text-slate-300 italic py-4">No tasks yet. Create one above!</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {(tasks[project._id] || []).map(task => (
                                                        <div key={task._id} className="border-2 border-primary p-4 rounded-lg bg-white">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-bold text-primary text-sm">{task.title}</h4>
                                                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-primary ${taskStatusBadge(task.status)}`}>
                                                                    {task.status.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                            {task.description && <p className="text-xs text-slate-500 mb-2">{task.description}</p>}
                                                            {task.assignedTo && (
                                                                <p className="text-[10px] font-bold text-slate-400">
                                                                    Assigned: <span className="text-primary">{task.assignedTo.username}</span>
                                                                </p>
                                                            )}
                                                            {task.prLink && (
                                                                <a href={task.prLink} target="_blank" rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline mt-1"
                                                                >
                                                                    <ExternalLink size={12} /> View PR
                                                                </a>
                                                            )}

                                                            {/* Review controls for tasks in 'review' status */}
                                                            {task.status === 'review' && (
                                                                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                                                                    <input
                                                                        type="text" placeholder="Feedback (optional)..."
                                                                        value={feedback[`task_${task._id}`] || ''}
                                                                        onChange={e => setFeedback({ ...feedback, [`task_${task._id}`]: e.target.value })}
                                                                        className="w-full px-2 py-1 border border-primary text-xs outline-none"
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button onClick={() => handleTaskReview(task._id, 'approve', project._id)} className="flex items-center gap-1 px-3 py-1 bg-green-400 border border-primary text-[10px] font-black uppercase">
                                                                            <CheckCircle size={12} /> Approve PR
                                                                        </button>
                                                                        <button onClick={() => handleTaskReview(task._id, 'reject', project._id)} className="flex items-center gap-1 px-3 py-1 bg-red-400 text-white border border-primary text-[10px] font-black uppercase">
                                                                            <XCircle size={12} /> Request Changes
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Chat Link */}
                <div className="bg-white border-4 border-primary p-6 md:p-8 rounded-neo shadow-neo">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                Peer Learning Hub
                            </h2>
                            <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest mt-1">
                                Manage your active student sessions
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/mentor/chat')}
                            className="bg-highlight-yellow border-3 border-primary px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 whitespace-nowrap"
                        >
                            Go To Chat <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast.message && (
                <div className="fixed bottom-6 right-6 z-[9999]">
                    <div className={`px-4 py-3 border-2 border-primary shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3 text-sm font-bold ${toast.type === 'error' ? 'bg-red-400 text-white' : 'bg-highlight-green text-primary'}`}>
                        {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        <p>{toast.message}</p>
                        <button onClick={() => setToast({ message: '', type: null })}><X size={14} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorDashboard;
