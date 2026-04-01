import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Github,
  ExternalLink,
  ChevronLeft,
  User,
  Tag,
  Users,
  Layers,
  Info,
  Clock,
  CheckCircle,
  Loader,
  AlertTriangle,
  X,
  Send,
  Plus,
  MessageSquare,
  Trello,
  ShieldCheck,
  Star
} from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState({ message: '', type: null });

  // ── Join Request State ──
  const [joinStatus, setJoinStatus] = useState(null); // null | 'pending' | 'accepted' | 'rejected'
  const [reapplyAfter, setReapplyAfter] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [joinSkills, setJoinSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // ── Kanban / Task Modals ──
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', difficulty: 'small', assignedTo: '' });
  const [creatingTask, setCreatingTask] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 4000);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API}/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // Fetch join request status for logged-in students
  useEffect(() => {
    if (user && project?.status === 'active' && project?.type === 'collaborative') {
      axios.get(`${API}/join-requests/my-status/${id}`, authHeaders())
        .then(res => {
          setJoinStatus(res.data.status);
          setReapplyAfter(res.data.reapplyAfter);
        })
        .catch(() => {});
    }
  }, [user, project, id]);

  // Pre-fill skills from user profile
  useEffect(() => {
    if (user?.skills?.length > 0 && joinSkills.length === 0) {
      setJoinSkills([...user.skills]);
    }
  }, [user]);

  // Fetch tasks when project is active and we're logged in
  useEffect(() => {
    if (project?.status === 'active' && user) {
      setLoadingTasks(true);
      axios.get(`${API}/tasks/project/${id}`, authHeaders())
        .then(res => setTasks(res.data))
        .catch(() => {})
        .finally(() => setLoadingTasks(false));
    }
  }, [project, user, id]);

  // ── Manage Requests State (for Creator) ──
  const [projectRequests, setProjectRequests] = useState({ pending: [], reviewed: [] });
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Fetch join requests if creator
  useEffect(() => {
    if (project && user && project.createdBy?._id === user._id) {
      setLoadingRequests(true);
      axios.get(`${API}/join-requests/project/${id}`, authHeaders())
        .then(res => setProjectRequests(res.data))
        .catch(err => console.error("Error fetching project requests:", err))
        .finally(() => setLoadingRequests(false));
    }
  }, [project, user, id]);

  // ── Manage Requests Handlers ──
  const handleAcceptRequest = async (reqId) => {
    try {
      await axios.patch(`${API}/join-requests/${reqId}/accept`, {}, authHeaders());
      showToast('Request accepted successfully!');
      // Refresh requests list
      const res = await axios.get(`${API}/join-requests/project/${id}`, authHeaders());
      setProjectRequests(res.data);
      // Optionally refresh the whole project to update contributors count instantly
      const projRes = await axios.get(`${API}/projects/${id}`);
      setProject(projRes.data);
    } catch (err) { showToast(err.response?.data?.message || 'Failed to accept', 'error'); }
  };

  const handleRejectRequest = async (reqId) => {
    try {
      await axios.patch(`${API}/join-requests/${reqId}/reject`, {}, authHeaders());
      showToast('Request rejected.');
      const res = await axios.get(`${API}/join-requests/project/${id}`, authHeaders());
      setProjectRequests(res.data);
    } catch (err) { showToast(err.response?.data?.message || 'Failed to reject', 'error'); }
  };

  // ── Join Request Handlers ──
  const handleSubmitJoinRequest = async () => {
    if (joinMessage.length < 30) {
      showToast('Message must be at least 30 characters.', 'error');
      return;
    }
    setJoining(true);
    try {
      await axios.post(`${API}/join-requests`, {
        projectId: id,
        message: joinMessage,
        skills: joinSkills,
      }, authHeaders());
      setJoinStatus('pending');
      setShowJoinModal(false);
      setJoinMessage('');
      showToast('Join request sent! The project creator will review it.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request.', 'error');
    } finally {
      setJoining(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !joinSkills.includes(trimmed)) {
      setJoinSkills([...joinSkills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setJoinSkills(joinSkills.filter(s => s !== skill));
  };

  const handlePickTask = async (taskId) => {
    try {
      await axios.patch(`${API}/tasks/${taskId}/pick`, {}, authHeaders());
      showToast('Task picked! Start working on it.');
      const res = await axios.get(`${API}/tasks/project/${id}`, authHeaders());
      setTasks(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to pick task.', 'error');
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    // Optimistic Update
    const oldTasks = [...tasks];
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));

    try {
      await axios.patch(`${API}/tasks/${taskId}/status`, { status: newStatus }, authHeaders());
      showToast('Task moved successfully');
    } catch (err) {
      setTasks(oldTasks); // Rollback
      showToast(err.response?.data?.message || 'Unauthorized move', 'error');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    setCreatingTask(true);
    try {
        const res = await axios.post(`${API}/tasks`, { ...newTask, projectId: id }, authHeaders());
        setTasks([res.data, ...tasks]);
        setShowTaskModal(false);
        setNewTask({ title: '', description: '', difficulty: 'small', assignedTo: '' });
        showToast('Task created successfully');
    } catch (err) {
        showToast(err.response?.data?.message || 'Error creating task', 'error');
    } finally {
        setCreatingTask(false);
    }
  };

  const handleSubmitPR = async (taskId, prLink) => {
    try {
      await axios.patch(`${API}/tasks/${taskId}/submit-pr`, { prLink }, authHeaders());
      showToast('PR submitted for review!');
      const res = await axios.get(`${API}/tasks/project/${id}`, authHeaders());
      setTasks(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit PR.', 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`${API}/projects/${id}/contributors/${userId}/role`, { role: newRole }, authHeaders());
      setProject(prev => ({
        ...prev,
        contributors: prev.contributors.map(c => 
          (c.userId?._id === userId || c.userId === userId) ? { ...c, role: newRole } : c
        )
      }));
      showToast('Contributor role updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role.', 'error');
    }
  };

  const handleLevelChange = async (userId, newLevel) => {
    try {
      await axios.patch(`${API}/projects/${id}/contributors/${userId}/level`, { level: newLevel }, authHeaders());
      setProject(prev => ({
        ...prev,
        contributors: prev.contributors.map(c => 
          (c.userId?._id === userId || c.userId === userId) ? { ...c, level: newLevel } : c
        )
      }));
      showToast('Contributor level updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update level.', 'error');
    }
  };

  const isContributor = user && project?.contributors?.some(c => c.userId?._id === user._id || c.userId === user._id);
  const isCreator = user && project?.createdBy?._id === user._id;

  const canRequestJoin = user
    && user.userType === 'student'
    && project?.status === 'active'
    && project?.type === 'collaborative'
    && !isContributor
    && !isCreator;

  const canReapply = joinStatus === 'rejected' && reapplyAfter && new Date(reapplyAfter) <= new Date();
  const daysUntilReapply = reapplyAfter
    ? Math.max(0, Math.ceil((new Date(reapplyAfter) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (loading) return (
    <div className="min-h-screen bg-bg pt-40 flex flex-col items-center justify-center font-bold text-accent animate-pulse uppercase tracking-widest gap-4">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      Loading Project Telemetry...
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-bg pt-40 text-center">
      <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">Project Node Offline</h2>
      <Link to="/projects" className="inline-block px-8 py-3 bg-surface border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors shadow-glass rounded-full">Return to Matrix</Link>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen pb-20 text-white relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 right-[-100px] w-[600px] h-[600px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-[30%] left-[-100px] w-[500px] h-[500px] bg-glow-blue rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

      {/* Header */}
      <section className="pt-32 pb-16 relative overflow-hidden border-b border-border">
        <div className="container-max mx-auto px-4 relative z-10">
          <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors mb-10 group bg-surface/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Matrix
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-widest rounded shadow-glass">
                  {project.type}
                </span>
                <span className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-widest rounded shadow-glass ${
                  project.status === 'active' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  project.status === 'completed' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-surface border-border text-slate-300'
                }`}>
                  {project.status?.replace(/_/g, ' ')}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-tight tracking-tight mb-4 flex flex-wrap items-center gap-4 drop-shadow-2xl">
                {project.title}
                {project.githubRepo?.toLowerCase().includes('github.com/cid-cell') && (
                  <span className="bg-accent/20 text-accent border border-accent/40 px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 shadow-glow-purple">
                     <ShieldCheck size={16} /> CID-CELL OFFICAL
                  </span>
                )}
              </h1>
            </div>

            <div className="flex gap-4 flex-wrap shrink-0">
              {project.githubRepo && (
                <a href={project.githubRepo} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 bg-surface border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-glass hover:bg-white/5 hover:border-white/20 transition-all">
                  Source Code <Github size={16} />
                </a>
              )}
              {project.deployedLink && (
                <a href={project.deployedLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 bg-accent/20 border border-accent/50 text-accent font-bold uppercase tracking-widest text-xs rounded-xl shadow-glow-purple hover:bg-accent/30 hover:text-white transition-all">
                  Live Endpoint <ExternalLink size={16} />
                </a>
              )}
              {(isCreator || isContributor) && (
                <Link to={`/projects/${id}/chat`}
                  className="flex items-center gap-2 px-6 py-3.5 bg-accent text-white border border-accent/50 font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:bg-accent/90 transition-all">
                  Secure Comms <MessageSquare size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-max mx-auto px-4 mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Image */}
            {project.images && project.images.length > 0 ? (
              <div className="aspect-video w-full rounded-2xl border border-white/10 shadow-glass overflow-hidden bg-surface relative group">
                <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-60 pointer-events-none"></div>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl border border-white/10 shadow-glass overflow-hidden bg-surface flex flex-col items-center justify-center text-slate-600 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                <Layers size={60} strokeWidth={1} className="mb-4 text-slate-500 group-hover:text-accent group-hover:scale-110 transition-all duration-500" />
                <p className="font-black uppercase tracking-widest text-xs">Visual Data Unavailable</p>
              </div>
            )}

            {/* Description */}
            <div className="glass-panel p-8 md:p-12 border border-white/10 shadow-glass rounded-2xl relative overflow-hidden">
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-glow-accent rounded-full rounded-full pointer-events-none"></div>
              <h2 className="flex items-center gap-3 text-2xl font-black text-white uppercase tracking-widest mb-8 border-b border-border pb-4 relative z-10">
                <Info size={20} className="text-accent" /> System Overview
              </h2>
              <div className="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap relative z-10 text-base">
                {project.description}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="glass-panel p-8 border border-white/10 shadow-glass rounded-2xl relative overflow-hidden">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-border pb-3 relative z-10">Technical Architecture</h3>
              <div className="flex flex-wrap gap-2.5 relative z-10">
                {project.techStack?.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-surface border border-white/10 hover:border-accent hover:text-accent transition-colors cursor-default text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-glass">
                    {skill}
                  </span>
                ))}
                {(!project.techStack || project.techStack.length === 0) && <p className="text-slate-500 italic text-xs tracking-wider">Parameters Unspecified</p>}
              </div>
            </div>

            {/* Team Leaderboard */}
            <div className="glass-panel p-8 border border-white/10 shadow-glass rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-glow-accent rounded-full pointer-events-none"></div>
               
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border pb-4 relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center -rotate-3 shadow-glass text-accent"><Users size={18} /></span>
                  Active Nodes
                </h3>
              </div>
              
              <div className="space-y-4 relative z-10">
                {project.contributors?.map((c, i) => {
                  const daysSinceActive = Math.floor((new Date() - new Date(c.lastActive || c.joinedAt)) / (1000 * 60 * 60 * 24));
                  const isActive = daysSinceActive < 7;
                  
                  return (
                    <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-all ${isActive ? 'bg-surface border-white/10 shadow-glass hover:border-accent/30' : 'bg-bg/50 border-white/5 opacity-60 hover:opacity-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={c.userId?.profilePicture || `https://ui-avatars.com/api/?name=${c.userId?.username}&background=050505&color=fff`} className="w-12 h-12 rounded-full border border-white/10 object-cover shadow-glass" alt={c.userId?.username} />
                          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-bg flex items-center justify-center ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-500'}`} title={isActive ? 'Node Active' : 'Node Dormant'}></div>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white uppercase tracking-wider mb-1">{c.userId?.username || 'Unknown Node'}</p>
                          <div className="flex items-center gap-2">
                            {isCreator ? (
                              <div className="flex gap-2">
                                <select 
                                  value={c.role || 'developer'}
                                  onChange={(e) => handleRoleChange(c.userId?._id || c.userId, e.target.value)}
                                  className="text-[9px] font-bold uppercase tracking-widest bg-surface border border-white/10 rounded px-1.5 py-1 text-slate-300 outline-none cursor-pointer hover:border-white/30 transition-colors"
                                >
                                  <option value="developer">Developer</option>
                                  <option value="tester">Tester</option>
                                  <option value="designer">Designer</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                                <select 
                                  value={c.level || 'new_contributor'}
                                  onChange={(e) => handleLevelChange(c.userId?._id || c.userId, e.target.value)}
                                  className="text-[9px] font-bold uppercase tracking-widest bg-accent/20 border border-accent/50 rounded px-1.5 py-1 text-accent outline-none cursor-pointer hover:border-accent transition-colors"
                                >
                                  <option value="new_contributor">New</option>
                                  <option value="active_contributor">Active</option>
                                  <option value="core_member">Core</option>
                                </select>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest bg-surface border border-border rounded px-2 py-0.5 text-slate-300">
                                  {c.role || 'Developer'}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest bg-accent/10 border border-accent/30 rounded px-2 py-0.5 text-accent">
                                  {(c.level || 'new_contributor').replace('_', ' ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-1.5 text-yellow-400">
                           <Star size={14} className="fill-current drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
                           <p className="font-black text-xl leading-none drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]">{c.score || 0}</p>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">XP Points</p>
                      </div>
                    </div>
                  );
                })}
                {(!project.contributors || project.contributors.length === 0) && (
                  <p className="text-xs font-bold text-slate-500 tracking-widest text-center py-8 border border-white/10 border-dashed rounded-xl bg-surface/50 uppercase">No active nodes detected. Be the first to uplink.</p>
                )}
              </div>
            </div>

            {/* ── Join Request Section ── */}
            {canRequestJoin && (
              <div className="space-y-4">
                {/* Never requested OR rejected + can re-apply */}
                {(joinStatus === null || canReapply) && (
                  <>
                    {project.githubRepo && (
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-xl bg-surface border border-white/10 text-slate-300 font-bold uppercase tracking-widest text-sm shadow-glass hover:bg-white/5 hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-3"
                      >
                        <Github size={18} /> 
                        {project.githubRepo.toLowerCase().includes('github.com/cid-cell') ? 'Contribute to Official Repo' : 'Analyze Source Code'}
                      </a>
                    )}
                    <button onClick={() => setShowJoinModal(true)}
                      className="w-full py-4 rounded-xl bg-accent text-white font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:bg-accent/90 transition-all flex items-center justify-center gap-3">
                      <Send size={16} /> Request Network Access
                    </button>
                  </>
                )}

                {/* Pending */}
                {joinStatus === 'pending' && (
                  <div className="w-full py-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold uppercase tracking-widest text-sm text-center shadow-[0_0_15px_rgba(250,204,21,0.1)] flex items-center justify-center gap-3 cursor-wait">
                    <Loader size={16} className="animate-spin" /> Authorization Pending
                  </div>
                )}

                {/* Rejected + cooldown active */}
                {joinStatus === 'rejected' && !canReapply && (
                  <div className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/30 font-bold uppercase tracking-widest text-sm text-red-400 text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    ❌ Access Denied — Retry in {daysUntilReapply} cycle{daysUntilReapply !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}

            {/* Accepted badge */}
            {joinStatus === 'accepted' && isContributor && (
              <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/30 font-bold uppercase tracking-widest text-sm text-green-400 text-center flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(34,197,94,0.1)] mb-6">
                <CheckCircle size={18} /> Node Authorized
              </div>
            )}

            {/* ── Manage Requests Section (Visible only to Creator) ── */}
            {isCreator && project.type === 'collaborative' && (
              <div className="glass-panel p-8 border border-white/10 shadow-glass rounded-2xl relative overflow-hidden">
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <span className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center -rotate-3 text-accent shadow-glass"><ShieldCheck size={18} /></span>
                  Access Requests
                </h3>

                {loadingRequests ? (
                  <div className="flex justify-center py-6">
                     <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {projectRequests.pending.length === 0 && projectRequests.reviewed.length === 0 ? (
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center py-8 border border-white/10 border-dashed rounded-xl bg-surface/50">No incoming connections.</p>
                    ) : (
                      <>
                        {projectRequests.pending.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">Pending Authorization ({projectRequests.pending.length})</h4>
                            <div className="space-y-4">
                              {projectRequests.pending.map(request => {
                                const projectSkills = project.techStack?.map(s => s.toLowerCase()) || [];
                                const applicantSkills = [...(request.skills || []), ...(request.userId?.skills || [])].map(s => s.toLowerCase());
                                const uniqueApplicantSkills = [...new Set(applicantSkills)];
                                const matchedSkills = uniqueApplicantSkills.filter(s => projectSkills.includes(s));
                                const matchPercentage = projectSkills.length > 0 ? Math.round((matchedSkills.length / projectSkills.length) * 100) : null;
                                
                                return (
                                <div key={request._id} className="p-5 border border-white/10 bg-surface rounded-xl relative shadow-glass transition-all hover:border-accent/40 group">
                                  <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-4">
                                        <img src={request.userId?.profilePicture || `https://ui-avatars.com/api/?name=${request.userId?.username}&background=050505&color=fff`} className="w-10 h-10 rounded-full border border-white/10 object-cover shadow-glass" />
                                        <span className="font-bold text-sm text-white uppercase tracking-wider">{request.userId?.username}</span>
                                        {matchPercentage !== null && (
                                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-glass border ${matchPercentage >= 70 ? 'bg-green-500/20 border-green-500/40 text-green-400' : matchPercentage >= 40 ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-slate-500/20 border-slate-500/40 text-slate-300'}`}>
                                            {matchPercentage}% Compat
                                          </span>
                                        )}
                                      </div>
                                      <div className="bg-bg/50 p-4 border border-white/5 rounded-lg relative">
                                        <p className="text-xs text-slate-300 font-medium italic relative z-10 leading-relaxed">"{request.message}"</p>
                                      </div>
                                      {request.skills && request.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                          {request.skills.map((s, i) => <span key={i} className="text-[9px] font-bold uppercase tracking-widest bg-surface border border-white/10 rounded px-2 py-1 text-slate-400">{s}</span>)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-3 shrink-0 justify-center">
                                      <button onClick={() => handleAcceptRequest(request._id)} className="px-5 py-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 text-[10px] font-bold uppercase tracking-widest shadow-glass hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2 w-full">
                                        <CheckCircle size={16} /> Authorize
                                      </button>
                                      <button onClick={() => handleRejectRequest(request._id)} className="px-5 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-widest shadow-glass hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 w-full">
                                        <X size={16} /> Deny
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                )})}
                            </div>
                          </div>
                        )}

                        {projectRequests.reviewed.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-4 border-b border-white/10 pb-2">Archived Logs ({projectRequests.reviewed.length})</h4>
                            <div className="space-y-3">
                              {projectRequests.reviewed.map(req => (
                                <div key={req._id} className="p-3 border border-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/30 opacity-60 hover:opacity-100 transition-opacity">
                                  <div className="flex items-center gap-3">
                                    <img src={req.userId?.profilePicture || `https://ui-avatars.com/api/?name=${req.userId?.username}&background=050505&color=fff`} className="w-8 h-8 rounded-full border border-white/10 object-cover grayscale" />
                                    <span className="font-bold text-[11px] text-slate-400 uppercase tracking-widest">{req.userId?.username}</span>
                                    <span className="hidden md:inline-block text-[10px] text-slate-500 italic max-w-[200px] truncate">"{req.message}"</span>
                                  </div>
                                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border self-start sm:self-auto flex items-center justify-center gap-1 ${req.status === 'accepted' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                                    {req.status === 'accepted' ? <CheckCircle size={10} /> : <X size={10} />}
                                    {req.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Task Kanban Section (visible if logged in and project is active) */}
            {project.status === 'active' && user && (
              <div className="glass-panel py-8 px-4 md:px-8 border border-white/10 shadow-glass rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10 border-b border-border pb-4">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Trello size={20} className="text-accent" /> Workstream Matrix
                    </h3>
                    <div className="flex items-center gap-4">
                        {loadingTasks && <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>}
                        {(isCreator || isContributor) && (
                            <button 
                                onClick={() => setShowTaskModal(true)}
                                className="px-5 py-2.5 rounded-lg bg-accent text-white border border-accent/50 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:bg-accent/90 transition-all flex items-center gap-2"
                            >
                                <Plus size={14} /> Initialize Task
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="relative z-10">
                  <KanbanBoard 
                      tasks={tasks}
                      user={user}
                      onMoveTask={handleMoveTask}
                      onPick={handlePickTask}
                      onSubmitPR={handleSubmitPR}
                      onCreateTask={() => setShowTaskModal(true)}
                      canManage={isCreator || isContributor}
                      contributors={project.contributors}
                  />
                </div>
              </div>
            )}

            {/* Rejection Feedback */}
            {project.status === 'rejected' && (
              <div className="bg-red-500/10 p-8 border border-red-500/30 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.1)] relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[30px] rounded-full"></div>
                <h3 className="font-black text-red-400 uppercase tracking-widest mb-6 flex items-center gap-3 text-lg border-b border-red-500/20 pb-4">
                  <AlertTriangle size={20} /> System Rejected
                </h3>
                <div className="space-y-4">
                  {project.mentorFeedback && <p className="text-sm text-red-300 font-medium"><strong className="text-red-400 uppercase tracking-widest text-[10px] block mb-1">Mentor Log:</strong> {project.mentorFeedback}</p>}
                  {project.facultyFeedback && <p className="text-sm text-red-300 font-medium"><strong className="text-red-400 uppercase tracking-widest text-[10px] block mb-1">Faculty Log:</strong> {project.facultyFeedback}</p>}
                  {project.adminFeedback && <p className="text-sm text-red-300 font-medium"><strong className="text-red-400 uppercase tracking-widest text-[10px] block mb-1">Admin Log:</strong> {project.adminFeedback}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass-panel p-8 border border-white/10 shadow-glass rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-glow-accent rounded-full pointer-events-none"></div>

              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white flex items-center gap-3 border-b border-border pb-4 relative z-10">
                <Info size={16} className="text-accent" /> System Metadata
              </h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 shadow-glass text-accent-blue"><User size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Architect</p>
                    <p className="font-bold text-sm text-white uppercase tracking-wider">{project.createdBy?.username || 'Unknown'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 shadow-glass text-accent-magenta"><Tag size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Protocol Type</p>
                    <p className="font-bold text-sm text-white uppercase tracking-wider">{project.type}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 shadow-glass text-accent-cyan"><Clock size={16} /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1">Current State</p>
                    <p className="font-bold text-sm text-white uppercase tracking-wider">{project.status?.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                {project.mentors && project.mentors.length > 0 && (
                  <div className="flex items-start gap-4 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center shrink-0 shadow-glass text-accent"><Users size={16} /></div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Assigned Mentors</p>
                      <div className="flex flex-col gap-1.5">
                        {project.mentors.map((m, i) => (
                          <p key={i} className="font-bold text-sm text-white uppercase tracking-wider">{m.userId?.username || 'Unknown Node'}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel p-8 border border-white/10 shadow-glass rounded-2xl text-center relative overflow-hidden group">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-glow-accent rounded-full pointer-events-none group-hover:bg-accent/10 transition-colors"></div>
               
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 relative z-10">External Collaboration</p>
              <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed relative z-10">Ping the CID Cell coordinators to interface with this development team.</p>
              <Link to="/contact" className="block w-full py-3 bg-surface border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:border-accent hover:bg-white/5 transition-all shadow-glass rounded-xl relative z-10">
                Establish Comms
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Join Request Modal ── */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl w-full max-w-lg p-8 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-glow-accent rounded-full rounded-full pointer-events-none"></div>

            <button onClick={() => setShowJoinModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors bg-surface border border-white/10 p-1.5 rounded-lg shadow-glass">
              <X size={16} />
            </button>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-3">
               <Send size={18} className="text-accent" /> Request Access
            </h3>

            {/* Message */}
            <div className="space-y-2 mb-6">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                Authorization Payload (Motivation) <span className="text-accent">*</span>
              </label>
              <textarea
                value={joinMessage}
                onChange={e => setJoinMessage(e.target.value)}
                placeholder="Explain your motivation, relevant experience, and what you can contribute... (min 30 characters)"
                className="w-full h-32 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] p-4 text-sm font-medium outline-none resize-none text-white placeholder:text-slate-600 transition-all"
              />
              <p className="text-[10px] font-bold uppercase tracking-widest flex justify-end">
                 <span className={`${joinMessage.length < 30 ? 'text-red-400' : 'text-green-400'}`}>{joinMessage.length}/30 min char</span>
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2 mb-8">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                Declared Capabilities (Skills)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="e.g. React, Python..."
                  className="flex-1 px-4 py-3 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent focus:bg-white/5 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium"
                />
                <button onClick={handleAddSkill} className="px-4 bg-accent text-white rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-accent/90 transition-all font-bold">
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {joinSkills.map((skill, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-widest rounded shadow-glass">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:bg-accent/30 rounded-full p-0.5 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitJoinRequest}
              disabled={joining || joinMessage.length < 30}
              className="w-full py-4 rounded-xl bg-accent text-white font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {joining ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              {joining ? 'Transmitting...' : 'Transmit Request'}
            </button>
          </div>
        </div>
      )}

      {/* ── New Task Modal ── */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="glass-panel border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl w-full max-w-lg p-8 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-glow-blue rounded-full rounded-full pointer-events-none"></div>

            <button onClick={() => setShowTaskModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors bg-surface border border-white/10 p-1.5 rounded-lg shadow-glass">
              <X size={16} />
            </button>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-3">
               <Plus size={18} className="text-accent-blue" /> Initialize Task
            </h3>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Task Identifier *</label>
                  <input 
                    type="text" 
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Briefly describe the objective..."
                    className="w-full px-4 py-3 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent-blue focus:bg-white/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium"
                  />
               </div>

               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Specifications</label>
                  <textarea 
                    value={newTask.description}
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Detail the technical requirements..."
                    className="w-full h-24 px-4 py-3 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent-blue focus:bg-white/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] outline-none transition-all text-white placeholder:text-slate-600 text-sm font-medium resize-none"
                  />
               </div>

               <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Complexity</label>
                    <div className="relative">
                      <select 
                          value={newTask.difficulty}
                          onChange={e => setNewTask({...newTask, difficulty: e.target.value})}
                          className="w-full px-4 py-3 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent-blue focus:bg-white/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] outline-none transition-all text-white text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer"
                      >
                          <option value="small" className="bg-bg text-white">Low - Quick Fix</option>
                          <option value="medium" className="bg-bg text-white">Medium - Feature</option>
                          <option value="large" className="bg-bg text-white">High - Refactor</option>
                          <option value="critical" className="bg-bg text-white">Critical - Urgent</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Assign Node</label>
                    <div className="relative">
                      <select 
                          value={newTask.assignedTo}
                          onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                          className="w-full px-4 py-3 bg-surface backdrop-blur-md border border-white/10 rounded-xl focus:border-accent-blue focus:bg-white/5 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] outline-none transition-all text-white text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer"
                      >
                          <option value="" className="bg-bg text-white">Unassigned</option>
                          {project.contributors?.map(c => (
                              <option key={c.userId?._id} value={c.userId?._id} className="bg-bg text-white">{c.userId?.username}</option>
                          ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>
               </div>

               <button
                  onClick={handleCreateTask}
                  disabled={creatingTask || !newTask.title}
                  className="w-full py-4 mt-4 rounded-xl bg-accent-blue text-white font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
               >
                  {creatingTask ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                  {creatingTask ? 'Processing...' : 'Deploy to Board'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
           <div className={`px-5 py-4 rounded-xl border font-bold shadow-glass backdrop-blur-md flex items-center gap-3 text-sm ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
            <p className="tracking-wide">{toast.message}</p>
            <button onClick={() => setToast({ message: '', type: null })} className="ml-3 hover:text-white transition-colors"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
