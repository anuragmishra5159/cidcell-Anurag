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
  Trello
} from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const taskStatusBadge = (status) => {
  const map = {
    todo: 'bg-slate-200 text-slate-600',
    in_progress: 'bg-highlight-yellow text-primary',
    review: 'bg-highlight-purple text-primary',
    done: 'bg-green-300 text-green-900',
  };
  return map[status] || 'bg-slate-100';
};

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
    <div className="min-h-screen pt-40 flex items-center justify-center font-bold text-primary animate-pulse">
      Requesting Asset Details...
    </div>
  );

  if (!project) return (
    <div className="min-h-screen pt-40 text-center">
      <h2 className="text-2xl font-black text-primary mb-4">Project Not Found</h2>
      <Link to="/projects" className="text-blue-600 font-bold hover:underline italic">Return to Projects</Link>
    </div>
  );

  return (
    <div className="bg-bg min-h-screen pb-20">
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b-3 border-primary relative overflow-hidden">
        <div className="container-max mx-auto px-4 relative z-10">
          <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-8 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-highlight-yellow border-2 border-primary text-[10px] font-black uppercase shadow-neo-sm">
                  {project.type}
                </span>
                <span className="px-3 py-1 bg-white border-2 border-primary text-[10px] font-black uppercase shadow-neo-sm">
                  {project.status?.replace(/_/g, ' ')}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-primary tracking-tight uppercase leading-none">
                {project.title}
              </h1>
            </div>

            <div className="flex gap-4">
              {project.githubRepo && (
                <a href={project.githubRepo} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white border-2 border-black font-bold uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  Source <Github size={16} />
                </a>
              )}
              {project.deployedLink && (
                <a href={project.deployedLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white border-2 border-primary font-bold uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  Live Demo <ExternalLink size={16} />
                </a>
              )}
              {(isCreator || isContributor) && (
                <Link to={`/projects/${id}/chat`}
                  className="flex items-center gap-2 px-6 py-3 bg-highlight-purple text-primary border-2 border-primary font-black uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  Project Chat <MessageSquare size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-max mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image */}
            {project.images && project.images.length > 0 ? (
              <div className="aspect-video w-full rounded-2xl border-3 border-primary shadow-neo overflow-hidden bg-slate-50">
                <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl border-3 border-primary shadow-neo overflow-hidden bg-slate-50 flex flex-col items-center justify-center text-slate-200">
                <Layers size={80} strokeWidth={1} />
                <p className="font-black uppercase tracking-tighter mt-4 text-sm">Visual Documentation Unavailable</p>
              </div>
            )}

            {/* Description */}
            <div className="bg-white p-8 md:p-12 border-3 border-primary shadow-neo rounded-2xl">
              <h2 className="flex items-center gap-3 text-2xl font-black text-primary uppercase mb-6 italic">
                <Info size={24} className="text-blue-600" /> Description
              </h2>
              <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                {project.description}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b-2 border-slate-50 pb-2">Technical Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 border-2 border-slate-200 text-slate-600 text-[11px] font-bold uppercase rounded">
                    {skill}
                  </span>
                ))}
                {(!project.techStack || project.techStack.length === 0) && <p className="text-slate-300 italic text-sm">Not specified</p>}
              </div>
            </div>

            {/* Team Leaderboard */}
            <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b-2 border-slate-50 pb-4">
                <h3 className="text-xl font-black text-primary uppercase flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-highlight-green border-2 border-primary flex items-center justify-center -rotate-3"><Users size={16} className="text-green-900" /></span>
                  Team Leaderboard
                </h3>
              </div>
              
              <div className="space-y-4">
                {project.contributors?.map((c, i) => {
                  const daysSinceActive = Math.floor((new Date() - new Date(c.lastActive || c.joinedAt)) / (1000 * 60 * 60 * 24));
                  const isActive = daysSinceActive < 7;
                  
                  return (
                    <div key={i} className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${isActive ? 'border-primary shadow-neo-sm bg-white' : 'border-slate-100 bg-slate-50 opacity-80'}`}>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={c.userId?.profilePicture || `https://ui-avatars.com/api/?name=${c.userId?.username}`} className="w-10 h-10 rounded-full border-2 border-primary object-cover" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${isActive ? 'bg-green-500' : 'bg-red-400'}`} title={isActive ? 'Active recently' : 'Inactive'}></div>
                        </div>
                        <div>
                          <p className="font-black text-sm text-primary uppercase">{c.userId?.username || 'Unknown'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {isCreator ? (
                              <div className="flex flex-col gap-1">
                                <select 
                                  value={c.role || 'developer'}
                                  onChange={(e) => handleRoleChange(c.userId?._id || c.userId, e.target.value)}
                                  className="text-[9px] font-black uppercase tracking-widest bg-highlight-blue border border-primary px-1 py-0.5 text-primary outline-none cursor-pointer hover:bg-white transition-colors"
                                >
                                  <option value="developer">Developer</option>
                                  <option value="tester">Tester</option>
                                  <option value="designer">Designer</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                                <select 
                                  value={c.level || 'new_contributor'}
                                  onChange={(e) => handleLevelChange(c.userId?._id || c.userId, e.target.value)}
                                  className="text-[9px] font-black uppercase tracking-widest bg-highlight-purple border border-primary px-1 py-0.5 text-white outline-none cursor-pointer hover:bg-white hover:text-primary transition-colors"
                                >
                                  <option value="new_contributor">New Contributor</option>
                                  <option value="active_contributor">Active Contributor</option>
                                  <option value="core_member">Core Member</option>
                                </select>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black uppercase tracking-widest bg-highlight-blue border border-primary px-2 py-0.5 text-primary text-center">
                                  {c.role || 'Developer'}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest bg-highlight-purple border border-primary px-2 py-0.5 text-white text-center">
                                  {(c.level || 'new_contributor').replace('_', ' ')}
                                </span>
                              </div>
                            )}
                            <span className="text-[9px] font-bold text-slate-400 italic">
                              {isActive ? 'Active' : `Inactive (${daysSinceActive}d)`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-2xl text-primary leading-none">{c.score || 0}</p>
                        <p className="text-[9px] font-bold text-highlight-purple uppercase tracking-widest">Points</p>
                      </div>
                    </div>
                  );
                })}
                {(!project.contributors || project.contributors.length === 0) && (
                  <p className="text-sm font-bold text-slate-400 italic text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">No contributors yet. Be the first!</p>
                )}
              </div>
            </div>

            {/* ── Join Request Section ── */}
            {canRequestJoin && (
              <div>
                {/* Never requested OR rejected + can re-apply */}
                {(joinStatus === null || canReapply) && (
                  <button onClick={() => setShowJoinModal(true)}
                    className="w-full py-4 bg-highlight-green border-3 border-primary font-black uppercase text-sm shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2">
                    <Send size={16} /> Request to Join This Project
                  </button>
                )}

                {/* Pending */}
                {joinStatus === 'pending' && (
                  <div className="w-full py-4 bg-highlight-yellow border-3 border-primary font-black uppercase text-sm text-center opacity-80 cursor-not-allowed"
                    title="The project creator is reviewing your request">
                    ⏳ Request Pending — Awaiting Creator Review
                  </div>
                )}

                {/* Rejected + cooldown active */}
                {joinStatus === 'rejected' && !canReapply && (
                  <div className="w-full py-4 bg-red-100 border-3 border-red-300 font-bold text-sm text-red-700 text-center">
                    ❌ Request Rejected — Re-apply in {daysUntilReapply} day{daysUntilReapply !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}

            {/* Accepted badge */}
            {joinStatus === 'accepted' && isContributor && (
              <div className="w-full py-4 bg-green-100 border-3 border-green-400 font-black uppercase text-sm text-green-800 text-center flex items-center justify-center gap-2 mb-6">
                <CheckCircle size={16} /> You are a Contributor
              </div>
            )}

            {/* ── Manage Requests Section (Visible only to Creator) ── */}
            {isCreator && project.type === 'collaborative' && (
              <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl">
                <h3 className="text-xl font-black text-primary uppercase mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-highlight-purple border-2 border-primary flex items-center justify-center -rotate-3"><Users size={16} className="text-white" /></span>
                  Manage Join Requests
                </h3>

                {loadingRequests ? (
                  <Loader className="animate-spin text-primary" size={24} />
                ) : (
                  <div className="space-y-4">
                    {projectRequests.pending.length === 0 && projectRequests.reviewed.length === 0 ? (
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 italic">No join requests yet.</p>
                    ) : (
                      <>
                        {projectRequests.pending.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3 border-b-2 border-slate-50 pb-2">Pending Review ({projectRequests.pending.length})</h4>
                            <div className="space-y-4">
                              {projectRequests.pending.map(request => {
                                const projectSkills = project.techStack?.map(s => s.toLowerCase()) || [];
                                const applicantSkills = [...(request.skills || []), ...(request.userId?.skills || [])].map(s => s.toLowerCase());
                                const uniqueApplicantSkills = [...new Set(applicantSkills)];
                                const matchedSkills = uniqueApplicantSkills.filter(s => projectSkills.includes(s));
                                const matchPercentage = projectSkills.length > 0 ? Math.round((matchedSkills.length / projectSkills.length) * 100) : null;
                                
                                return (
                                <div key={request._id} className="p-5 border-3 border-primary bg-highlight-yellow/10 rounded-xl relative overflow-hidden shadow-neo-sm transform hover:-translate-y-1 transition-transform">
                                  <div className="absolute top-0 left-0 w-2 h-full bg-highlight-yellow border-r-2 border-primary"></div>
                                  <div className="flex flex-col md:flex-row justify-between gap-6 pl-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-3">
                                        <img src={request.userId?.profilePicture || `https://ui-avatars.com/api/?name=${request.userId?.username}`} className="w-8 h-8 rounded-full border-2 border-primary object-cover shadow-neo-sm" />
                                        <span className="font-black text-base text-primary uppercase">{request.userId?.username}</span>
                                        {matchPercentage !== null && (
                                          <span className={`text-[9px] font-black uppercase text-white px-2 py-0.5 shadow-neo-sm border-2 border-primary ${matchPercentage >= 70 ? 'bg-green-500' : matchPercentage >= 40 ? 'bg-orange-400' : 'bg-red-400'}`}>
                                            {matchPercentage}% Skill Match
                                          </span>
                                        )}
                                      </div>
                                      <div className="bg-white p-3 border-2 border-primary shadow-neo-sm rounded-lg relative">
                                        <div className="absolute -left-2 top-4 w-3 h-3 bg-white border-l-2 border-b-2 border-primary rotate-45 transform"></div>
                                        <p className="text-xs text-slate-700 font-bold italic relative z-10 leading-relaxed">"{request.message}"</p>
                                      </div>
                                      {request.skills && request.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                          {request.skills.map((s, i) => <span key={i} className="text-[10px] font-black uppercase bg-highlight-blue border-2 border-primary px-2 py-1 text-primary shadow-neo-sm">{s}</span>)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-3 shrink-0 justify-center">
                                      <button onClick={() => handleAcceptRequest(request._id)} className="px-4 py-3 bg-highlight-green text-green-900 border-2 border-primary text-[10px] font-black uppercase shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 w-full">
                                        <CheckCircle size={14} /> Accept
                                      </button>
                                      <button onClick={() => handleRejectRequest(request._id)} className="px-4 py-3 bg-red-100 text-red-700 border-2 border-primary text-[10px] font-black uppercase shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 w-full">
                                        <X size={14} /> Reject
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
                            <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-3 border-b-2 border-slate-50 pb-2">Previously Reviewed ({projectRequests.reviewed.length})</h4>
                            <div className="space-y-2">
                              {projectRequests.reviewed.map(req => (
                                <div key={req._id} className={`p-3 border-2 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 opacity-60 hover:opacity-100 transition-opacity ${req.status === 'accepted' ? 'border-highlight-green bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                  <div className="flex items-center gap-3">
                                    <img src={req.userId?.profilePicture || `https://ui-avatars.com/api/?name=${req.userId?.username}`} className="w-6 h-6 rounded-full border border-primary object-cover grayscale" />
                                    <span className="font-bold text-xs text-slate-700">{req.userId?.username}</span>
                                    <span className="hidden md:inline-block text-[10px] text-slate-500 italic max-w-[200px] truncate">"{req.message}"</span>
                                  </div>
                                  <span className={`text-[9px] font-black uppercase px-2 py-1 border-2 self-start sm:self-auto ${req.status === 'accepted' ? 'bg-highlight-green text-green-900 border-primary' : 'bg-red-200 text-red-800 border-red-300'}`}>
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
              <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-primary uppercase flex items-center gap-3">
                        <Trello size={24} className="text-highlight-purple" /> Interactive Kanban
                    </h3>
                    <div className="flex items-center gap-2">
                        {loadingTasks && <Loader className="animate-spin text-slate-300" size={16} />}
                        {(isCreator || isContributor) && (
                            <button 
                                onClick={() => setShowTaskModal(true)}
                                className="px-4 py-2 bg-primary text-white border-2 border-primary text-[10px] font-black uppercase shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                            >
                                <Plus size={14} /> New Task
                            </button>
                        )}
                    </div>
                </div>
                
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
            )}

            {/* Rejection Feedback */}
            {project.status === 'rejected' && (
              <div className="bg-red-50 p-6 border-3 border-red-300 rounded-2xl">
                <h3 className="font-black text-red-700 uppercase mb-3 flex items-center gap-2"><AlertTriangle size={18} /> Project Rejected</h3>
                {project.mentorFeedback && <p className="text-sm text-red-700"><strong>Mentor:</strong> {project.mentorFeedback}</p>}
                {project.facultyFeedback && <p className="text-sm text-red-700"><strong>Faculty:</strong> {project.facultyFeedback}</p>}
                {project.adminFeedback && <p className="text-sm text-red-700"><strong>Admin:</strong> {project.adminFeedback}</p>}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-8 border-3 border-primary shadow-neo rounded-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white/50 italic">Project Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400"><User size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Created By</p>
                    <p className="font-bold text-sm">{project.createdBy?.username || 'Unknown'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-highlight-yellow"><Tag size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Project Type</p>
                    <p className="font-bold text-sm uppercase">{project.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-highlight-teal"><Clock size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Status</p>
                    <p className="font-bold text-sm">{project.status?.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                {project.mentors && project.mentors.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-highlight-purple"><Users size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-white/40 leading-none mb-1">Mentors</p>
                      {project.mentors.map((m, i) => (
                        <p key={i} className="font-bold text-sm">{m.userId?.username || 'Unknown'}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Want to collaborate?</p>
              <p className="text-sm font-bold text-primary mb-6">Contact CID Cell to get in touch with this project's development team.</p>
              <Link to="/contact" className="block w-full py-3 bg-slate-50 border-2 border-primary text-primary font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-colors">
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Join Request Modal ── */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border-3 border-primary shadow-neo rounded-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setShowJoinModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-primary">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-primary uppercase mb-6">Request to Join</h3>

            {/* Message */}
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Why do you want to join? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={joinMessage}
              onChange={e => setJoinMessage(e.target.value)}
              placeholder="Explain your motivation, relevant experience, and what you can contribute... (min 30 characters)"
              className="w-full h-28 border-2 border-primary p-3 text-sm font-medium outline-none resize-none mb-1 shadow-neo-mini"
            />
            <p className="text-[10px] text-slate-400 mb-4">{joinMessage.length}/30 min characters</p>

            {/* Skills */}
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Skills you bring
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g. React, Python..."
                className="flex-1 border-2 border-primary px-3 py-2 text-sm outline-none shadow-neo-mini"
              />
              <button onClick={handleAddSkill} className="px-3 py-2 bg-primary text-white border-2 border-primary shadow-neo-mini">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {joinSkills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-highlight-blue border border-primary text-[11px] font-bold uppercase shadow-neo-mini">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="text-slate-500 hover:text-red-500">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitJoinRequest}
              disabled={joining || joinMessage.length < 30}
              className="w-full py-3 bg-highlight-green border-3 border-primary font-black uppercase text-sm shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {joining ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              {joining ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      )}

      {/* ── New Task Modal ── */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white border-3 border-primary shadow-neo rounded-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setShowTaskModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-primary">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-primary uppercase mb-6">Create New Project Task</h3>

            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Task Title*</label>
                  <input 
                    type="text" 
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Briefly describe the objective..."
                    className="w-full border-2 border-primary px-3 py-2 text-sm font-bold outline-none shadow-neo-mini"
                  />
               </div>

               <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={newTask.description}
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Detail the technical requirements..."
                    className="w-full h-24 border-2 border-primary p-3 text-sm font-medium outline-none shadow-neo-mini resize-none"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Difficulty</label>
                    <select 
                        value={newTask.difficulty}
                        onChange={e => setNewTask({...newTask, difficulty: e.target.value})}
                        className="w-full border-2 border-primary px-3 py-2 text-xs font-black uppercase outline-none shadow-neo-mini bg-white"
                    >
                        <option value="small">Low - Quick Fix</option>
                        <option value="medium">Medium - Feature</option>
                        <option value="large">High - Refactor</option>
                        <option value="critical">Critical - Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Assign To</label>
                    <select 
                        value={newTask.assignedTo}
                        onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                        className="w-full border-2 border-primary px-3 py-2 text-xs font-black uppercase outline-none shadow-neo-mini bg-white"
                    >
                        <option value="">Unassigned</option>
                        {project.contributors?.map(c => (
                            <option key={c.userId?._id} value={c.userId?._id}>{c.userId?.username}</option>
                        ))}
                    </select>
                  </div>
               </div>

               <button
                  onClick={handleCreateTask}
                  disabled={creatingTask || !newTask.title}
                  className="w-full py-4 mt-4 bg-highlight-yellow border-3 border-primary font-black uppercase text-sm shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                  {creatingTask ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                  {creatingTask ? 'Saving Output...' : 'Add Task to Board'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className={`px-4 py-3 border-2 border-primary shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-3 text-sm font-bold ${toast.type === 'error' ? 'bg-red-400 text-white' : 'bg-highlight-green text-primary'}`}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <p>{toast.message}</p>
            <button onClick={() => setToast({ message: '', type: null })}><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-component for task cards on the detail page ──
function TaskCard({ task, user, isCreator, userRole, onPick, onSubmitPR }) {
  const [prLink, setPrLink] = useState('');
  const isAssigned = task.assignedTo?._id === user._id;
  
  const canInteract = isCreator || (userRole && userRole !== 'viewer');

  return (
    <div className="border-2 border-primary p-4 rounded-xl bg-slate-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-primary text-sm">{task.title}</h4>
        <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-primary ${taskStatusBadge(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      {task.description && <p className="text-xs text-slate-500 mb-2">{task.description}</p>}
      {task.assignedTo && <p className="text-[10px] font-bold text-slate-400 mb-1">Assigned to: <span className="text-primary">{task.assignedTo.username}</span></p>}

      {/* Pick button */}
      {task.status === 'todo' && user.userType === 'student' && canInteract && (
        <button onClick={() => onPick(task._id)} className="mt-2 px-4 py-2 bg-highlight-blue border-2 border-primary text-[10px] font-black uppercase shadow-neo-sm hover:shadow-none transition-all">
          Pick This Task
        </button>
      )}

      {/* Submit PR */}
      {task.status === 'in_progress' && isAssigned && canInteract && (
        <div className="mt-2 flex gap-2">
          <input type="text" placeholder="PR Link..." value={prLink} onChange={e => setPrLink(e.target.value)} className="flex-1 px-2 py-1 border border-primary text-xs outline-none" />
          <button onClick={() => { onSubmitPR(task._id, prLink); setPrLink(''); }} className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase border border-primary">
            Submit PR
          </button>
        </div>
      )}

      {/* PR link display */}
      {task.prLink && (
        <a href={task.prLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline mt-2">
          <ExternalLink size={12} /> View PR
        </a>
      )}

      {/* Mentor feedback */}
      {task.mentorFeedback && (
        <p className="text-[10px] text-slate-500 italic mt-1">Feedback: {task.mentorFeedback}</p>
      )}
    </div>
  );
}
