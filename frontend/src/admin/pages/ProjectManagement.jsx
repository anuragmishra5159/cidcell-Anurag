import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Github,
  ExternalLink,
  PlusCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const statusColors = {
  draft: 'bg-gray-100 text-gray-600',
  pending_mentor_review: 'bg-yellow-100 text-yellow-700',
  pending_faculty_review: 'bg-yellow-100 text-yellow-700',
  pending_admin_approval: 'bg-orange-100 text-orange-700',
  active: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
  inactive: 'bg-gray-100 text-gray-600',
};

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [allProjects, setAllProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allRes, pendingRes] = await Promise.all([
        axios.get(`${API}/projects/all`, authHeaders()),
        axios.get(`${API}/projects/review/admin`, authHeaders()),
      ]);
      setAllProjects(allRes.data);
      setPendingProjects(pendingRes.data);
    } catch (err) {
      showToast('Failed to fetch project data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminReview = async (projectId, action) => {
    try {
      await axios.patch(`${API}/projects/${projectId}/admin-review`, {
        action,
        feedback: feedback[projectId] || '',
      }, authHeaders());
      showToast(`Project ${action === 'approve' ? 'approved' : 'rejected'}!`);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Review failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/projects/${id}`, authHeaders());
      showToast('Project deleted');
      fetchData();
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const filteredAll = allProjects.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.createdBy?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-4 border-primary pb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary uppercase tracking-tight">Project Registry</h1>
          <div className="inline-block bg-highlight-green border-2 border-primary px-3 py-0.5 mt-3 transform -rotate-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Ecosystem Oversight Hub</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/projects/submit')}
          className="flex items-center gap-3 px-8 py-4 bg-highlight-blue border-3 border-primary rounded-2xl text-primary font-black uppercase text-xs shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all w-fit"
        >
          <PlusCircle size={20} /> Add New Entry
        </button>
      </div>

      {/* Tabs Segment */}
      <div className="flex flex-wrap gap-6 pt-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-8 py-4 text-xs font-black uppercase border-3 rounded-2xl transition-all shadow-neo-mini flex items-center gap-3 ${
            activeTab === 'pending'
              ? 'bg-highlight-yellow border-primary text-primary translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-white border-primary text-primary/40 hover:bg-highlight-yellow/10'
          }`}
        >
          <Clock size={18} />
          Review Queue ({pendingProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-8 py-4 text-xs font-black uppercase border-3 rounded-2xl transition-all shadow-neo-mini flex items-center gap-3 ${
            activeTab === 'all'
              ? 'bg-highlight-blue border-primary text-primary translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-white border-primary text-primary/40 hover:bg-highlight-blue/10'
          }`}
        >
          <PlusCircle size={18} />
          Registry Master ({allProjects.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-indigo-600" size={28} />
        </div>
      ) : activeTab === 'pending' ? (
        /* ── Pending Admin Approvals ── */
        <div className="space-y-8 bg-white border-4 border-primary shadow-neo rounded-3xl p-8 lg:p-12">
          {pendingProjects.length === 0 ? (
            <div className="text-center py-20 text-primary/20">
              <CheckCircle size={60} className="mx-auto mb-6 opacity-20" />
              <p className="text-sm font-black uppercase tracking-[0.2em]">Queue Fully Purged</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10">
              {pendingProjects.map(project => (
                <div key={project._id} className="bg-slate-50 border-3 border-primary rounded-3xl p-8 shadow-neo-mini hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 pb-6 border-b-2 border-primary/10">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-primary uppercase leading-tight">{project.title}</h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-4 py-1.5 text-[10px] font-black uppercase text-primary bg-highlight-yellow border-2 border-primary rounded-xl tracking-widest shadow-neo-mini">
                          Awaiting Oversight
                        </span>
                        <span className="px-4 py-1.5 text-[10px] font-black uppercase text-primary bg-highlight-blue border-2 border-primary rounded-xl tracking-widest shadow-neo-mini">
                          {project.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-base text-primary/70 font-medium mb-6 leading-relaxed line-clamp-3">{project.description}</p>
                  
                  <div className="bg-white border-2 border-primary rounded-2xl p-5 mb-8">
                    <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.15em] mb-2">Architect Identity</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-highlight-teal border-2 border-primary flex items-center justify-center font-black text-primary text-xs uppercase shadow-neo-mini">
                        {project.createdBy?.username?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-xs font-black text-primary uppercase leading-none">{project.createdBy?.username}</p>
                        <p className="text-[10px] font-black text-primary/40 uppercase mt-1.5">{project.createdBy?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 mb-10">
                    {project.githubRepo && (
                      <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[11px] font-black uppercase text-primary bg-white border-2 border-primary px-5 py-2.5 rounded-xl shadow-neo-mini hover:shadow-none hover:bg-highlight-blue/10 transition-all">
                        <Github size={16} /> Codebase
                      </a>
                    )}
                    {project.deployedLink && (
                      <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[11px] font-black uppercase text-primary bg-white border-2 border-primary px-5 py-2.5 rounded-xl shadow-neo-mini hover:shadow-none hover:bg-highlight-teal/10 transition-all">
                        <ExternalLink size={16} /> Launch Demo
                      </a>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <textarea
                        className="w-full p-6 bg-white border-3 border-primary rounded-3xl text-sm font-medium outline-none shadow-neo-mini focus:shadow-neo transition-all min-h-[120px]"
                        placeholder="ADMIN FEEDBACK / MODIFICATION NOTES..."
                        value={feedback[project._id] || ''}
                        onChange={e => setFeedback({ ...feedback, [project._id]: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-wrap gap-5 pt-4">
                      <button 
                        onClick={() => handleAdminReview(project._id, 'approve')} 
                        className="flex-1 min-w-[160px] flex items-center justify-center gap-3 px-8 py-5 bg-highlight-green border-3 border-primary rounded-2xl text-primary font-black uppercase text-xs shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      >
                        <CheckCircle size={20} /> Authorize Entry
                      </button>
                      <button 
                        onClick={() => handleAdminReview(project._id, 'reject')} 
                        className="flex-1 min-w-[160px] flex items-center justify-center gap-3 px-8 py-5 bg-rose-500 border-3 border-primary rounded-2xl text-white font-black uppercase text-xs shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      >
                        <XCircle size={20} /> Reject Entry
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── All Projects ── */
        <div className="space-y-10">
          {/* Registry Search */}
          <div className="relative group max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="text"
              placeholder="SEARCH PROJECT REPOSITORY..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border-3 border-primary rounded-2xl py-5 pl-16 pr-8 outline-none shadow-neo-mini focus:shadow-neo transition-all font-black text-[11px] uppercase placeholder:text-primary/20"
            />
          </div>

          {/* Master Registry Table */}
          <div className="bg-white border-4 border-primary shadow-neo rounded-3xl overflow-hidden font-sans">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-highlight-blue border-b-4 border-primary text-primary">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10">Project Identity</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10">Architecture</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10">Lead Developer</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10">Operational Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Sanction</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-primary/10">
                  {filteredAll.map(project => (
                    <tr key={project._id} className="hover:bg-highlight-blue/5 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-black text-sm text-primary uppercase leading-tight group-hover:translate-x-1 transition-transform">{project.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 text-[9px] font-black uppercase bg-white border-2 border-primary rounded-lg tracking-widest shadow-neo-mini">
                          {project.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-highlight-teal border border-primary flex items-center justify-center text-[8px] font-black text-primary uppercase">
                            {project.createdBy?.username?.charAt(0) || "U"}
                          </div>
                          <span className="text-[10px] font-black text-primary/60 uppercase">{project.createdBy?.username || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-xl border-2 border-primary shadow-neo-mini text-[9px] font-black uppercase ${
                          project.status === 'approved' ? 'bg-highlight-green' :
                          project.status === 'pending' ? 'bg-highlight-yellow' :
                          'bg-highlight-pink'
                        }`}>
                          {project.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: project._id })}
                          className="w-9 h-9 inline-flex items-center justify-center border-2 border-primary rounded-xl bg-white text-rose-500 shadow-neo-mini hover:bg-rose-500 hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                          title="Purge Entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAll.length === 0 && (
              <div className="text-center py-20 bg-slate-50/50">
                <Search className="w-14 h-14 mx-auto mb-6 opacity-10 text-primary" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/20">Registry Is Empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Delete Project?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast.message && ReactDOM.createPortal(
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <p>{toast.message}</p>
            <button onClick={() => setToast({ message: '', type: null })}><X size={14} /></button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectManagement;
