import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import { 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Check,
  Loader
} from 'lucide-react';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    theme: 'web',
    description: '',
    techStack: [],
    github: '',
    liveLink: '',
    mentor: '',
    members: [],
    status: 'Under Development',
    year: new Date().getFullYear().toString(),
    imageUrl: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newMember, setNewMember] = useState('');

  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const themes = ['ML', 'web', 'ai', 'Cyber Security', 'hardware', 'iot'];
  const statuses = ['Under Development', 'Completed', 'Archived', 'Proposed'];

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects?all=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) { 
        console.error(err); 
        showToast('Failed to load projects', 'error');
    } finally {
        setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setIsEditMode(true);
      setSelectedId(project._id);
      setFormData({
        name: project.name,
        theme: project.theme,
        description: project.description,
        techStack: project.techStack || [],
        github: project.github || '',
        liveLink: project.liveLink || '',
        mentor: project.mentor || '',
        members: project.members || [],
        status: project.status || 'Under Development',
        year: project.year || new Date().getFullYear().toString(),
        imageUrl: project.imageUrl || ''
      });
    } else {
      setIsEditMode(false);
      setFormData({
        name: '', theme: 'web', description: '', techStack: [], github: '', liveLink: '', mentor: '', members: [], status: 'Under Development', year: new Date().getFullYear().toString(), imageUrl: ''
      });
    }
    setNewSkill('');
    setNewMember('');
    setIsModalOpen(true);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, techStack: [...formData.techStack, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, techStack: formData.techStack.filter((_, i) => i !== index) });
  };

  const addMember = () => {
    if (newMember.trim()) {
      setFormData({ ...formData, members: [...formData.members, newMember.trim()] });
      setNewMember('');
    }
  };

  const removeMember = (index) => {
    setFormData({ ...formData, members: formData.members.filter((_, i) => i !== index) });
  };

  const handleApprove = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/projects/${id}/approve`, { 
        isApproved: !currentStatus 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.map(p => p._id === id ? { ...p, isApproved: !currentStatus } : p));
      showToast(currentStatus ? 'Project set to Pending' : 'Project Approved Successfully');
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditMode) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/projects/${selectedId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(projects.map(p => p._id === selectedId ? res.data : p));
        showToast('Project updated successfully');
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/projects`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects([...projects, res.data]);
        showToast('Project created successfully');
      }
      setIsModalOpen(false);
    } catch (err) { showToast('Error saving project', 'error'); }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${deleteConfirm.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p._id !== deleteConfirm.id));
      showToast('Project deleted successfully');
    } catch (err) { showToast('Delete failed', 'error'); }
    finally { setDeleteConfirm({ isOpen: false, id: null }); }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Projects</h1>
            <p className="text-slate-500 text-sm mt-1">Review, approve, and manage cell project submissions.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">
            <Plus size={16} /> Add Project
          </button>
        </div>

        <div className="p-3 sm:p-4 rounded-xl border shadow-sm bg-white border-slate-200">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" placeholder="Search projects by name..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg w-full outline-none text-sm transition-all bg-white border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-slate-500 font-medium text-sm">Loading projects...</p>
          </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-5 py-4 w-[40%]">Project</th>
                  <th className="px-5 py-4 text-center">Approval</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.length > 0 ? filteredProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                        <div className="font-semibold text-sm text-slate-800">{p.name}</div>
                        <div className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider mt-0.5">{p.theme} &bull; {p.year}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                        <button 
                            onClick={() => handleApprove(p._id, p.isApproved)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            p.isApproved 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                            }`}
                        >
                            {p.isApproved ? <><Check size={12}/> Approved</> : <><Clock size={12}/> Pending</>}
                        </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                            {p.status}
                        </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenModal(p)} className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => setDeleteConfirm({ isOpen: true, id: p._id })} className="px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all bg-white text-rose-600 border-rose-200 hover:bg-rose-50">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                        </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-12 text-center text-slate-500">
                        No projects found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reworked Form Modal via Portal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditMode ? 'Edit Project' : 'Add New Project'}
        footer={
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">Cancel</button>
            <button form="projectForm" type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors text-sm">Save Project</button>
          </>
        }
      >
        <form id="projectForm" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Basic Information</h3>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Project Name*</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-400" placeholder="Enter project name"/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Theme</label>
                <select value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800">
                  {themes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800">
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Mentor Name</label>
                <input type="text" value={formData.mentor} onChange={e => setFormData({...formData, mentor: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Name of mentor"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Year</label>
                <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. 2024"/>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description*</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-400" placeholder="Project description..."></textarea>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Technical Details</h3>
            <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tech Stack</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newSkill} 
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                        placeholder="Add tech (React, AI, etc)"/>
                    <button type="button" onClick={addSkill} className="p-2 bg-slate-100 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                    {formData.techStack.map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg flex items-center gap-1.5 text-xs font-medium animate-fade-in transition-all">
                            {tech}
                            <button type="button" onClick={() => removeSkill(i)} className="hover:text-red-500"><X size={14}/></button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Team Members</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newMember} 
                        onChange={e => setNewMember(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMember())}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                        placeholder="Add member name"/>
                    <button type="button" onClick={addMember} className="p-2 bg-slate-100 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                    {formData.members.map((member, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1.5 text-xs font-medium animate-fade-in transition-all">
                            {member}
                            <button type="button" onClick={() => removeMember(i)} className="hover:text-red-500"><X size={14}/></button>
                        </span>
                    ))}
                </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Links & Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">GitHub Link</label>
                    <input type="text" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-400" placeholder="https://github.com/..."/>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Live Link</label>
                    <input type="text" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-400" placeholder="https://project-demo.com"/>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Image URL</label>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-400" placeholder="https://your-image-url.com"/>
                </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation via Portal */}
      {deleteConfirm.isOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center border border-slate-200 animate-fade-in">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">Confirm Delete</h3>
            <p className="text-slate-500 my-3 text-sm">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 text-sm transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow-sm transition-all text-sm active:scale-95 hover:bg-red-700">Yes, Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {toast.message && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <p>{toast.message}</p>
            <button onClick={() => setToast({ message: '', type: null })} className="ml-2 text-white/70 hover:text-white transition-colors">
                <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
