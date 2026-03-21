import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Clock, CheckCircle, XCircle, Loader, AlertTriangle, BookOpen, X, Github, ExternalLink } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const eventStatusConfig = {
  proposal: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
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
      } catch { setErrorProposals('Failed to load proposals.'); } finally { setLoadingProposals(false); }
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
      showToast(`Project ${action === 'approve' ? 'approved' : 'rejected'}!`);
      setPendingProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err) {
      showToast(err.response?.data?.message || 'Review failed', 'error');
    }
  };

  const pending = proposals.filter(p => p.status === 'proposal').length;
  const approved = proposals.filter(p => p.status === 'approved').length;
  const rejected = proposals.filter(p => p.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-max mx-auto section-padding">

        <h1 className="mb-2">Faculty Portal</h1>
        <p className="font-body normal-case tracking-normal text-primary/70 mb-10">
          Manage event proposals and review student/mentor project submissions.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="neo-card p-6 text-center">
            <p className="text-3xl font-bold">{pending}</p>
            <p className="text-sm uppercase tracking-widest mt-1">Event Pending</p>
          </div>
          <div className="neo-card p-6 text-center">
            <p className="text-3xl font-bold">{approved}</p>
            <p className="text-sm uppercase tracking-widest mt-1">Events Approved</p>
          </div>
          <div className="neo-card p-6 text-center">
            <p className="text-3xl font-bold">{rejected}</p>
            <p className="text-sm uppercase tracking-widest mt-1">Events Rejected</p>
          </div>
          <div className="neo-card p-6 text-center bg-highlight-yellow">
            <p className="text-3xl font-bold">{pendingProjects.length}</p>
            <p className="text-sm uppercase tracking-widest mt-1">Projects to Review</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-10">
          <Link to="/faculty/propose-event" className="btn-neo">
            + Propose New Event
          </Link>
        </div>

        {/* ── Project Reviews Section ── */}
        <div className="neo-card p-6 md:p-8 mb-10">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-1">
            <BookOpen size={22} className="text-blue-600" /> Pending Project Reviews
          </h2>
          <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest mb-6">
            Projects awaiting your faculty approval
          </p>

          {loadingProjects ? (
            <div className="flex items-center justify-center py-8 gap-3 text-slate-500">
              <Loader size={20} className="animate-spin" /><span className="text-sm">Loading...</span>
            </div>
          ) : pendingProjects.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm font-bold">No projects awaiting your review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProjects.map(project => (
                <div key={project._id} className="border-3 border-primary p-5 rounded-xl bg-highlight-yellow/10">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-black text-lg text-primary uppercase">{project.title}</h3>
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase border border-slate-300 text-slate-500">{project.type}</span>
                  </div>
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
                    <button onClick={() => handleProjectReview(project._id, 'approve')} className="flex items-center gap-2 px-5 py-2 bg-green-400 border-2 border-primary font-black uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-y-0.5 transition-all">
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button onClick={() => handleProjectReview(project._id, 'reject')} className="flex items-center gap-2 px-5 py-2 bg-red-400 border-2 border-primary font-black uppercase text-xs shadow-neo-sm hover:shadow-none hover:translate-y-0.5 transition-all text-white">
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Event Proposals Section ── */}
        <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-6">
          <Clock size={22} className="text-amber-500" /> My Event Proposals
        </h2>

        {loadingProposals ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
            <Loader size={20} className="animate-spin text-indigo-600" />
            <span className="text-sm">Loading proposals...</span>
          </div>
        ) : errorProposals ? (
          <div className="flex items-center justify-center py-16 gap-3 text-red-500">
            <AlertTriangle size={20} />
            <span className="text-sm">{errorProposals}</span>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">You haven't submitted any proposals yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map(p => {
              const cfg = eventStatusConfig[p.status] || eventStatusConfig.proposal;
              return (
                <div
                  key={p._id}
                  className="neo-card flex flex-col group relative h-full bg-white border-3 border-primary shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <span className={`neo-badge absolute top-3 right-3 text-[10px] font-bold px-2 py-1 border-2 border-primary uppercase z-10 ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                      {p.date}
                    </div>
                    <h3 className="font-heading text-xl font-black text-primary mb-6 leading-tight group-hover:text-blue-600 transition-colors uppercase">
                      {p.title}
                    </h3>
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center gap-3 text-sm font-medium border-l-3 border-primary pl-3">
                        <span className="truncate text-red-500 font-bold">{p.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium border-l-3 border-primary pl-3">
                        <span className="text-blue-600 font-bold uppercase">{p.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

export default FacultyDashboard;
