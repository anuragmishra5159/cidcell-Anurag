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
  X
} from 'lucide-react';

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

  const handleJoin = async () => {
    setJoining(true);
    try {
      await axios.post(`${API}/projects/${id}/join`, {}, authHeaders());
      showToast('Successfully joined the project!');
      // Refresh project data
      const res = await axios.get(`${API}/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to join.', 'error');
    } finally {
      setJoining(false);
    }
  };

  const handlePickTask = async (taskId) => {
    try {
      await axios.patch(`${API}/tasks/${taskId}/pick`, {}, authHeaders());
      showToast('Task picked! Start working on it.');
      // Refresh tasks
      const res = await axios.get(`${API}/tasks/project/${id}`, authHeaders());
      setTasks(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to pick task.', 'error');
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

  const isContributor = user && project?.contributors?.some(c => c.userId?._id === user._id || c.userId === user._id);
  const isCreator = user && project?.createdBy?._id === user._id;
  const canJoin = user && project?.status === 'active' && project?.type === 'collaborative' && !isContributor && !isCreator && user.userType === 'student';

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

            {/* Tech Stack + Contributors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b-2 border-slate-50 pb-2">Contributors</h3>
                <div className="space-y-3">
                  {project.contributors?.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                      <div className="w-2 h-2 rounded-full bg-highlight-teal"></div>
                      {c.userId?.username || 'Unknown'}
                    </div>
                  ))}
                  {(!project.contributors || project.contributors.length === 0) && (
                    <p className="text-slate-300 italic text-sm">No contributors yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Join Button */}
            {canJoin && (
              <button onClick={handleJoin} disabled={joining}
                className="w-full py-4 bg-highlight-green border-3 border-primary font-black uppercase text-sm shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50">
                {joining ? 'Joining...' : 'Join This Project as Contributor'}
              </button>
            )}

            {/* Task Section (visible if logged in and project is active) */}
            {project.status === 'active' && user && tasks.length > 0 && (
              <div className="bg-white p-8 border-3 border-primary shadow-neo rounded-2xl">
                <h3 className="text-xl font-black text-primary uppercase mb-6 flex items-center gap-3">
                  <Clock size={20} /> Project Tasks
                </h3>
                {loadingTasks ? (
                  <Loader className="animate-spin text-primary" size={24} />
                ) : (
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        user={user}
                        onPick={handlePickTask}
                        onSubmitPR={handleSubmitPR}
                      />
                    ))}
                  </div>
                )}
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
function TaskCard({ task, user, onPick, onSubmitPR }) {
  const [prLink, setPrLink] = useState('');
  const isAssigned = task.assignedTo?._id === user._id;

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
      {task.status === 'todo' && user.userType === 'student' && (
        <button onClick={() => onPick(task._id)} className="mt-2 px-4 py-2 bg-highlight-blue border-2 border-primary text-[10px] font-black uppercase shadow-neo-sm hover:shadow-none transition-all">
          Pick This Task
        </button>
      )}

      {/* Submit PR */}
      {task.status === 'in_progress' && isAssigned && (
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
