import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
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
  ExternalLink
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 text-sm font-semibold rounded-t transition-colors ${
            activeTab === 'pending'
              ? 'bg-orange-100 text-orange-700 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock size={14} className="inline mr-1" />
          Pending Approvals ({pendingProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-semibold rounded-t transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Projects ({allProjects.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-indigo-600" size={28} />
        </div>
      ) : activeTab === 'pending' ? (
        /* ── Pending Admin Approvals ── */
        <div className="space-y-4">
          {pendingProjects.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle size={40} className="mx-auto mb-3 text-green-300" />
              <p className="text-sm font-medium">No projects waiting for your approval.</p>
            </div>
          ) : (
            pendingProjects.map(project => (
              <div key={project._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{project.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-orange-100 text-orange-600 rounded">
                        Awaiting Admin Approval
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-600 rounded">
                        {project.type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{project.description}</p>
                <p className="text-xs text-gray-400 mb-3">
                  Submitted by: <span className="text-gray-700 font-medium">{project.createdBy?.username}</span> ({project.createdBy?.email})
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
                  className="w-full p-2 border border-gray-300 rounded text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-200"
                  rows="2"
                  placeholder="Optional feedback..."
                  value={feedback[project._id] || ''}
                  onChange={e => setFeedback({ ...feedback, [project._id]: e.target.value })}
                />

                <div className="flex gap-3">
                  <button onClick={() => handleAdminReview(project._id, 'approve')} className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded hover:bg-green-600 transition-colors">
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button onClick={() => handleAdminReview(project._id, 'reject')} className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition-colors">
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* ── All Projects ── */
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or creator..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAll.map(project => (
                  <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{project.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-600 rounded">{project.type}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{project.createdBy?.username || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${statusColors[project.status] || 'bg-gray-100'}`}>
                        {project.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, id: project._id })}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
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
            <div className="text-center py-8 text-gray-400 text-sm">No projects found.</div>
          )}
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
