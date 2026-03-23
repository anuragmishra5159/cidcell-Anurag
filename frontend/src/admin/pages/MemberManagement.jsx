import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  UserPlus, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Shield,
  Layout,
  Layers,
  ExternalLink,
  SearchIcon,
  Filter,
  GripVertical,
  Mail,
  Linkedin,
  Github,
  Award,
  Loader
} from 'lucide-react';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]); // All registered users
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [formData, setFormData] = useState({
    userId: '',
    team: 'Student Board',
    designation: '',
    domain: '',
  });

  const [toast, setToast] = useState({ message: '', type: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [draggedMember, setDraggedMember] = useState(null);

  const teams = ['Student Board', 'Core Team', 'Sub-Teams'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [membersRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/members`),
        axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setMembers(membersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      showToast('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setIsEditMode(true);
      setSelectedId(member._id);
      setFormData({
        userId: member.user?._id || '',
        team: member.team,
        designation: member.designation,
        domain: member.domain || '',
      });
    } else {
      setIsEditMode(false);
      setFormData({
        userId: '',
        team: 'Student Board',
        designation: '',
        domain: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditMode) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/members/${selectedId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMembers(members.map(m => m._id === selectedId ? res.data : m));
        showToast('Member updated successfully');
      } else {
        if (!formData.userId) return showToast('Please select a user', 'error');
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/members`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMembers([...members, res.data]);
        showToast('Member added successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleRemove = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/members/${deleteConfirm.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(members.filter(m => m._id !== deleteConfirm.id));
      showToast('Member removed from team');
    } catch (err) {
      showToast('Removal failed', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e, member) => {
    setDraggedMember(member);
    e.dataTransfer.effectAllowed = 'move';
    // Add a ghost image or effect if needed
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetTeam, targetMemberId = null) => {
    e.preventDefault();
    if (!draggedMember) return;

    // 1. Create a copy of members
    let newMembers = [...members];
    
    // 2. Remove dragged member from current list
    newMembers = newMembers.filter(m => m._id !== draggedMember._id);

    // 3. Update the dragged member's team
    const updatedDraggedMember = { ...draggedMember, team: targetTeam };

    // 4. Find target insertion index
    if (targetMemberId) {
        const targetIndex = newMembers.findIndex(m => m._id === targetMemberId);
        newMembers.splice(targetIndex, 0, updatedDraggedMember);
    } else {
        // Drop at the end of the team section
        newMembers.push(updatedDraggedMember);
    }

    // 5. Re-group and re-calculate the 'order' for the backend
    // This is tricky because we have global order. We should sort according to team sections first.
    const reorderedList = [];
    teams.forEach(team => {
        const teamMembers = newMembers.filter(m => m.team === team);
        teamMembers.forEach((m, index) => {
            reorderedList.push({ ...m, order: index });
        });
    });

    // 6. Update local state immediately for smooth UI
    setMembers(reorderedList);
    setDraggedMember(null);

    // 7. Update backend
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${import.meta.env.VITE_API_URL}/members/reorder`, {
            memberOrders: reorderedList.map(m => ({ id: m._id, order: m.order, team: m.team }))
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Order saved');
    } catch (err) {
        showToast('Failed to save order', 'error');
        fetchData(); // Rollback
    }
  };

  const filteredMembers = members.filter(m => 
    m.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableUsers = users.filter(u => 
    !members.some(m => m.user?._id === u._id) &&
    (u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto font-sans pb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-4 border-primary pb-8">
        <div>
          <h1 className="text-3xl lg:text-3xl font-black text-primary uppercase tracking-tight">Team Management</h1>
          <div className="inline-block bg-highlight-blue border-2 border-primary px-3 py-0.5 mt-2 transform -rotate-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Internal Ecosystem Oversight</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="px-6 py-3 bg-highlight-blue border-3 border-primary rounded-xl text-primary font-black uppercase text-[10px] shadow-neo-mini hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-2"
        >
          <UserPlus size={18} /> Assign New Member
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center pt-2">
        <div className="relative group flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <input 
              type="text" 
              placeholder="SEARCH BY IDENTITY..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-primary rounded-xl py-3.5 pl-12 pr-6 outline-none shadow-neo-mini focus:shadow-neo transition-all font-black text-[10px] uppercase placeholder:text-primary/20"
            />
        </div>
        <div className="flex items-center gap-3 bg-highlight-yellow border-2 border-primary px-4 py-3 rounded-xl shadow-neo-mini">
           <Filter size={16} className="text-primary" />
           <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">Interactive Reordering Enabled</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse">
            <Loader className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-slate-500 font-medium">Syncing team records...</p>
        </div>
      ) : (
        <div className="space-y-12">
            {teams.map(teamName => {
                const teamMembers = filteredMembers.filter(m => m.team === teamName);
                return (
                    <section 
                        key={teamName} 
                        className="space-y-10"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, teamName)}
                    >
                        <div className="flex items-center gap-6">
                            <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">{teamName}</h3>
                            <div className="flex-1 h-1 bg-primary/10 rounded-full"></div>
                            <span className="text-[10px] font-black text-primary bg-highlight-teal border-2 border-primary px-5 py-2 rounded-xl shadow-neo-mini uppercase tracking-widest">{teamMembers.length} ARCHITECTS</span>
                        </div>

                        {teamMembers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {teamMembers.map((m) => (
                                    <div 
                                        key={m._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, m)}
                                        onDrop={(e) => {
                                            e.stopPropagation(); // Avoid triggering team-level drop
                                            handleDrop(e, teamName, m._id);
                                        }}
                                        className={`group relative bg-white border-2 border-primary rounded-2xl shadow-neo-mini transition-all duration-300 p-5 cursor-move hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none ${draggedMember?._id === m._id ? 'opacity-30 border-dashed border-primary/40 bg-slate-50' : ''}`}
                                    >
                                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button 
                                                onClick={() => handleOpenModal(m)}
                                                className="w-10 h-10 border-2 border-primary rounded-xl bg-white text-primary shadow-neo-mini hover:bg-highlight-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                                                title="Edit Member"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteConfirm({ isOpen: true, id: m._id })}
                                                className="w-10 h-10 border-2 border-primary rounded-xl bg-white text-rose-500 shadow-neo-mini hover:bg-rose-500 hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                                                title="Remove Member"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-center text-center gap-4 mb-6 pt-4">
                                            <div className="w-20 h-20 rounded-3xl overflow-hidden border-3 border-primary shadow-neo-mini bg-white shrink-0 group-hover:rotate-2 transition-transform">
                                                <img 
                                                    src={m.user?.profilePicture || 'https://via.placeholder.com/100'} 
                                                    className="w-full h-full object-cover" 
                                                    alt={m.user?.username}
                                                />
                                            </div>
                                            <div className="min-w-0 px-2">
                                                <h4 className="font-black text-lg text-primary uppercase leading-tight truncate mb-1">{m.user?.username}</h4>
                                                <div className="inline-block bg-highlight-pink border-2 border-primary px-3 py-0.5 rounded-lg mb-2">
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">{m.designation}</p>
                                                </div>
                                                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{m.domain || 'SYSTEMS'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                                <Mail size={12} className="text-slate-400" />
                                                <span className="truncate">{m.user?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium lowercase">
                                                <Award size={12} className="text-slate-400 font-bold" />
                                                <span>Batch of {m.user?.batch || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-auto">
                                            <div className="flex gap-2">
                                                {m.user?.socialLinks?.linkedin && (
                                                    <a href={m.user.socialLinks.linkedin} target="_blank" className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                        <Linkedin size={14} />
                                                    </a>
                                                )}
                                                {m.user?.socialLinks?.github && (
                                                    <a href={m.user.socialLinks.github} target="_blank" className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                                        <Github size={14} />
                                                    </a>
                                                )}
                                            </div>
                                            <GripVertical size={16} className="text-slate-300 group-hover:text-indigo-400 cursor-grab" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center bg-slate-50/30">
                                <Users size={32} className="text-slate-200 mb-2" />
                                <p className="text-slate-400 text-sm font-medium">No members listed in this team.</p>
                                <button onClick={() => handleOpenModal()} className="mt-3 text-xs font-bold text-indigo-600 hover:underline">Add member here</button>
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
      )}

      {/* Reusable robust Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditMode ? 'Update Member Role' : 'Assign New Member'}
        footer={
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest">Cancel</button>
            <button form="memberForm" type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 uppercase tracking-widest">
              {isEditMode ? 'Save Changes' : 'Confirm Assignment'}
            </button>
          </>
        }
      >
        <form id="memberForm" onSubmit={handleSubmit} className="p-6 space-y-6">
            {!isEditMode && (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <SearchIcon size={14} /> Select Registered User
                    </label>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                        <div className="p-3 bg-slate-50 border-b">
                            <input 
                                type="text" 
                                placeholder="Filter users by name or email..." 
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                className="bg-transparent text-sm outline-none w-full text-slate-700"
                            />
                        </div>
                        <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
                            {availableUsers.length > 0 ? availableUsers.map(u => (
                                <div 
                                    key={u._id}
                                    onClick={() => setFormData({...formData, userId: u._id})}
                                    className={`p-4 text-sm flex items-center justify-between cursor-pointer transition-all ${formData.userId === u._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-200">
                                            {u.profilePicture ? <img src={u.profilePicture} className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-slate-400">{u.username[0]}</span>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{u.username}</p>
                                            <p className="text-[10px] text-slate-500">{u.email}</p>
                                        </div>
                                    </div>
                                    {formData.userId === u._id && <CheckCircle size={18} className="text-indigo-600" />}
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-400 italic text-sm">No available users found matching your search.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assign Team</label>
                    <select 
                        value={formData.team} 
                        onChange={e => setFormData({...formData, team: e.target.value})} 
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
                    >
                        {teams.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Designation (e.g. Technical Lead)</label>
                    <input 
                        type="text" 
                        required 
                        value={formData.designation} 
                        onChange={e => setFormData({...formData, designation: e.target.value})} 
                        placeholder="e.g. Lead Developer"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Domain Group (e.g. UI/UX, AI/ML)</label>
                    <input 
                        type="text" 
                        value={formData.domain} 
                        onChange={e => setFormData({...formData, domain: e.target.value})} 
                        placeholder="e.g. Frontend Architecture"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
                    />
                </div>
            </div>
        </form>
      </Modal>

      {/* Delete Confirmation via Portal */}
      {deleteConfirm.isOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-slate-200 animate-fade-in">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertTriangle size={36} />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-3">Remove Team Member</h3>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">Are you sure you want to remove <span className="font-bold text-slate-800">this member</span> from the organization records?</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className="flex-1 p-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">Back</button>
              <button onClick={handleRemove} className="flex-1 p-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 active:scale-95 uppercase text-xs tracking-widest">Confirm</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {toast.message && (
        <div className="fixed bottom-10 right-10 animate-fade-in z-[9999]">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white ${toast.type === 'error' ? 'bg-rose-500' : 'bg-slate-900'}`}>
                {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} className="text-emerald-400" />}
                <p className="text-xs font-bold uppercase tracking-widest">{toast.message}</p>
                <button onClick={() => setToast({message: '', type: null})} className="ml-2 hover:opacity-70"><X size={14} /></button>
            </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
