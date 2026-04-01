import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Clock, CheckCircle, XCircle, Loader, AlertTriangle, BookOpen, X, Github, ExternalLink, Zap, Target, Activity } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const eventStatusConfig = {
  proposal: { label: 'Pending', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  approved: { label: 'Verified', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  rejected: { label: 'Blocked', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);

  // Event proposals state
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [errorProposals, setErrorProposals] = useState(null);

  // Project reviews state
  const [pendingProjects, setPendingProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [toast, setToast] = useState({ message: '', type: null });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  useEffect(() => {
    // Fetch event proposals
    const fetchProposals = async () => {
      try {
        const res = await axios.get(`${API}/events/my-proposals`, authHeaders());
        setProposals(res.data);
      } catch { setErrorProposals('Failed to synchronize tracking logs.'); } finally { setLoadingProposals(false); }
    };

    // Fetch pending project reviews
    const fetchPendingProjects = async () => {
      try {
        const res = await axios.get(`${API}/projects/review/faculty`, authHeaders());
        setPendingProjects(res.data);
      } catch { /* empty */ } finally { setLoadingProjects(false); }
    };

    fetchProposals();
    fetchPendingProjects();
  }, []);

  const handleProjectReview = async (projectId, action) => {
    try {
      await axios.patch(`${API}/projects/${projectId}/faculty-review`, {
        action,
        feedback: feedback[projectId] || '',
      }, authHeaders());
      showToast(`Protocol ${action === 'approve' ? 'validated' : 'rejected'}!`);
      setPendingProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification sequence failed', 'error');
    }
  };

  const pending = proposals.filter(p => p.status === 'proposal').length;
  const approved = proposals.filter(p => p.status === 'approved').length;
  const rejected = proposals.filter(p => p.status === 'rejected').length;

  return (
    <div className="dashboard-theme min-h-screen bg-bg pt-32 pb-20 px-4 md:px-6 font-body text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[10%] left-[-100px] w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[-100px] w-[400px] h-[400px] bg-glow-blue rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        {/* Header Profile Section */}
        <div className="glass-panel border border-white/10 shadow-glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative overflow-hidden group">
            <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-glow-accent rounded-full pointer-events-none group-hover:bg-accent/20 transition-colors"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full z-10">
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
                        <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest drop-shadow-md">
                            Faculty Auth
                        </h1>
                        <span className="w-fit mx-auto sm:mx-0 bg-surface border border-white/10 text-orange-400 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] shadow-inner flex items-center gap-2">
                             <Zap size={10} className="text-orange-400"/> Access Level 3
                        </span>
                    </div>
                    <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">
                        System Operations • Project Authorization Pipeline
                    </p>
                </div>
            </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="glass-panel border border-white/10 p-5 md:p-6 rounded-2xl shadow-glass flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className={`absolute -right-4 -top-4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform`}></div>
            <div className={`w-10 h-10 rounded-full bg-orange-500/5 text-orange-400 border border-orange-500/20 flex items-center justify-center shadow-inner relative z-10`}>
                <Clock className="w-4 h-4" />
            </div>
            <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-black text-white tracking-widest leading-none drop-shadow-md mb-1">{pending}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">Proposals Awaiting</p>
            </div>
          </div>
          <div className="glass-panel border border-white/10 p-5 md:p-6 rounded-2xl shadow-glass flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform">
             <div className={`absolute -right-4 -top-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform`}></div>
            <div className={`w-10 h-10 rounded-full bg-green-500/5 text-green-400 border border-green-500/20 flex items-center justify-center shadow-inner relative z-10`}>
                <CheckCircle className="w-4 h-4" />
            </div>
            <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-black text-white tracking-widest leading-none drop-shadow-md mb-1">{approved}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">Proposals Logged</p>
            </div>
          </div>
          <div className="glass-panel border border-white/10 p-5 md:p-6 rounded-2xl shadow-glass flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform">
             <div className={`absolute -right-4 -top-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform`}></div>
            <div className={`w-10 h-10 rounded-full bg-red-500/5 text-red-500 border border-red-500/20 flex items-center justify-center shadow-inner relative z-10`}>
                <XCircle className="w-4 h-4" />
            </div>
            <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-black text-white tracking-widest leading-none drop-shadow-md mb-1">{rejected}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">Discharged Nodes</p>
            </div>
          </div>
          <div className="glass-panel border border-accent/30 p-5 md:p-6 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.1)] flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform bg-accent/5">
             <div className={`absolute -right-4 -top-4 w-20 h-20 bg-accent/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform`}></div>
            <div className={`w-12 h-12 rounded-full bg-surface text-accent border border-accent/50 flex items-center justify-center shadow-inner relative z-10`}>
                <Activity className="w-5 h-5" />
            </div>
            <div className="relative z-10">
                <p className="text-2xl md:text-4xl font-black text-white tracking-widest leading-none drop-shadow-md mb-1">{pendingProjects.length}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Action Required</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-12">
          <Link to="/faculty/propose-event" className="bg-surface border border-white/10 hover:border-accent hover:bg-white/5 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-glass transition-all inline-flex items-center gap-3 hover:shadow-glow-purple">
            <Plus size={16} className="text-accent" /> Initiate Event Request
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* ── Project Reviews Section ── */}
            <div className="glass-panel border border-white/10 p-6 md:p-8 rounded-3xl shadow-glass mb-10 xl:col-span-7 relative overflow-hidden flex flex-col min-h-[500px]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-glow-blue rounded-full pointer-events-none -z-10"></div>
                
                <div className="relative z-10 border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
                        <BookOpen size={24} className="text-accent-blue" /> Final Validation Queue
                    </h2>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mt-2">
                        System matrices awaiting admin approval
                    </p>
                </div>

                {loadingProjects ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 relative z-10 flex-1">
                        <Loader size={32} className="animate-spin text-accent-blue" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Scanning Pipeline...</span>
                    </div>
                ) : pendingProjects.length === 0 ? (
                    <div className="relative z-10 text-center flex flex-col items-center justify-center py-20 bg-surface/30 rounded-2xl border border-dashed border-white/10 flex-1">
                        <CheckCircle className="text-slate-600 mb-4" size={40} />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">All Nodes Authenticated. Queue Clear.</p>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {pendingProjects.map(project => (
                            <div key={project._id} className="border border-white/10 p-6 rounded-2xl bg-surface/50 hover:bg-surface/80 transition-colors shadow-inner flex flex-col group">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div>
                                        <h3 className="font-bold text-base md:text-lg text-white uppercase tracking-wider">{project.title}</h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                            Payload Auth: <span className="text-slate-300">{project.createdBy?.username}</span> <span className="text-slate-600">[{project.createdBy?.email}]</span>
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-white/10 text-accent-blue bg-blue-500/10 rounded whitespace-nowrap">{project.type}</span>
                                </div>
                                
                                <p className="text-xs text-slate-400 my-4 line-clamp-3 leading-relaxed border-l-2 border-white/10 pl-4">{project.description}</p>
                                
                                <div className="flex gap-4 mb-6 pt-2">
                                    {project.githubRepo && (
                                        <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-300 hover:text-white transition-colors bg-surface border border-white/10 px-3 py-2 rounded-lg shadow-sm">
                                            <Github size={14} className="text-slate-500" /> Source Map
                                        </a>
                                    )}
                                    {project.deployedLink && (
                                        <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-300 hover:text-white transition-colors bg-surface border border-white/10 px-3 py-2 rounded-lg shadow-sm">
                                            <ExternalLink size={14} className="text-accent-cyan" /> Output Feed
                                        </a>
                                    )}
                                </div>

                                <textarea
                                    className="w-full p-3 bg-bg border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-accent transition-colors resize-none mb-4 shadow-inner"
                                    rows="2"
                                    placeholder="Enter administrative decrees or rejection logs..."
                                    value={feedback[project._id] || ''}
                                    onChange={e => setFeedback({ ...feedback, [project._id]: e.target.value })}
                                />
                                <div className="flex gap-3 mt-auto">
                                    <button onClick={() => handleProjectReview(project._id, 'approve')} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 border border-green-500/30 font-bold uppercase text-[10px] tracking-widest shadow-glass hover:bg-green-500 hover:text-white transition-all rounded-xl">
                                        <CheckCircle size={16} /> Authenticate
                                    </button>
                                    <button onClick={() => handleProjectReview(project._id, 'reject')} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/30 font-bold uppercase text-[10px] tracking-widest shadow-glass hover:bg-red-500 hover:text-white transition-all rounded-xl">
                                        <XCircle size={16} /> Block Access
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Event Proposals Section ── */}
            <div className="glass-panel border border-white/10 p-6 md:p-8 rounded-3xl shadow-glass xl:col-span-5 relative overflow-hidden flex flex-col min-h-[500px]">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-glow-accent rounded-full pointer-events-none -z-10"></div>
                
                <div className="relative z-10 border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
                        <Target size={24} className="text-accent" /> Transmission Logs
                    </h2>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mt-2">
                        Status of requested protocols
                    </p>
                </div>

                {loadingProposals ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 relative z-10 flex-1">
                        <Loader size={32} className="animate-spin text-accent" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">Accessing Databanks...</span>
                    </div>
                ) : errorProposals ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400 relative z-10 bg-red-500/5 rounded-2xl border border-dashed border-red-500/20 flex-1">
                        <AlertTriangle size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest">{errorProposals}</span>
                    </div>
                ) : proposals.length === 0 ? (
                    <div className="text-center flex flex-col items-center justify-center py-20 text-slate-400 bg-surface/30 rounded-2xl border border-dashed border-white/10 relative z-10 flex-1">
                        <Clock size={32} className="text-slate-600 mb-4"/>
                        <p className="text-[10px] font-bold uppercase tracking-widest">No Logs Found in Matrix.</p>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {proposals.map(p => {
                            const cfg = eventStatusConfig[p.status] || eventStatusConfig.proposal;
                            return (
                                <div
                                key={p._id}
                                className="border border-white/10 p-5 rounded-xl bg-surface/50 hover:bg-surface flex flex-col group relative transition-colors shadow-glass"
                                >
                                <span className={`absolute top-4 right-4 text-[8px] font-bold tracking-[0.2em] px-2.5 py-1 border uppercase rounded-md shadow-sm z-10 ${cfg.color}`}>
                                    {cfg.label}
                                </span>
                                
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest pt-2">
                                        Log Date: <span className="text-slate-300">{p.date}</span>
                                    </div>
                                    <h3 className="text-sm md:text-base font-bold text-white mb-4 leading-tight uppercase tracking-wider pr-16 line-clamp-2">
                                        {p.title}
                                    </h3>
                                    
                                    <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-slate-500">Vector:</span>
                                            <span className="truncate text-slate-300">{p.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-slate-500">Class:</span>
                                            <span className="text-accent-cyan">{p.category}</span>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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

export default FacultyDashboard;
