import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Check
} from 'lucide-react';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
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
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects?all=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) { console.error(err); }
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm">Review, approve, and manage cell project submissions.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-black transition-all">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <input 
            type="text" placeholder="Search projects by name..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full max-w-sm text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr className="text-xs font-bold text-slate-500 uppercase">
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3 text-center">Approval</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredProjects.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{p.theme} &bull; {p.year}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => handleApprove(p._id, p.isApproved)}
                        className={`group flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 transition-all ${
                          p.isApproved 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-green-600 hover:text-white hover:border-green-600'
                        }`}
                      >
                        {p.isApproved ? <><Check size={12}/> Approved</> : <><Clock size={12}/> Pending Approval</>}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(p)} className="p-1.5 text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-100 hover:bg-blue-50 rounded" title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteConfirm({ isOpen: true, id: p._id })} className="p-1.5 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded shadow-lg w-full max-w-2xl my-8 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">{isEditMode ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">Project Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter project name"/>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">Theme</label>
                    <select value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500">
                      {themes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">Mentor Name</label>
                    <input type="text" value={formData.mentor} onChange={e => setFormData({...formData, mentor: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="Name of mentor"/>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">Year</label>
                    <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. 2024"/>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Description</label>
                  <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="Project description..."></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Tech Stack</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newSkill} 
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" 
                      placeholder="Add tech (e.g. React)"/>
                    <button type="button" onClick={addSkill} className="p-2 bg-slate-100 rounded border hover:bg-slate-200 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 text-sm">
                    {formData.techStack.map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded flex items-center gap-1">
                        {tech}
                        <button type="button" onClick={() => removeSkill(i)}><X size={14}/></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Team Members</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newMember} 
                      onChange={e => setNewMember(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMember())}
                      className="flex-1 p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" 
                      placeholder="Add member name"/>
                    <button type="button" onClick={addMember} className="p-2 bg-slate-100 rounded border hover:bg-slate-200 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 text-sm">
                    {formData.members.map((member, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded flex items-center gap-1">
                        {member}
                        <button type="button" onClick={() => removeMember(i)}><X size={14}/></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">GitHub Link</label>
                    <input type="text" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="https://github.com/..."/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">Live Link</label>
                    <input type="text" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="https://project.com"/>
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase">Image URL</label>
                    <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" placeholder="https://image-url.com"/>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 transition-colors">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={40} />
            <h3 className="font-bold text-lg text-slate-900">Confirm Delete</h3>
            <p className="text-slate-500 mb-6 text-sm">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 p-2 border rounded font-bold text-slate-600 hover:bg-slate-50">No</button>
              <button onClick={handleDelete} className="flex-1 p-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast.message && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 rounded shadow-lg z-[60] text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800'}`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
