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
            memberOrders: reorderedList.map(m => ({ id: m._id, order: m.order }))
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
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Team Management</h1>
          <p className="text-slate-500 text-sm mt-1">Drag and drop cards to reorder the team structure.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
        >
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      <div className="p-3 sm:p-4 rounded-2xl border shadow-sm bg-white border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, role or team..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 bg-slate-50/50"
            />
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
           <Filter size={16} className="text-indigo-600" />
           <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Drag sorting enabled</span>
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
                        className="space-y-4"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, teamName)}
                    >
                        <div className="flex items-center gap-3 px-1">
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">{teamName}</h3>
                            <div className="flex-1 h-[1px] bg-slate-200"></div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{teamMembers.length} Members</span>
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
                                        className={`group relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 p-5 cursor-move ${draggedMember?._id === m._id ? 'opacity-30 border-dashed border-indigo-500 bg-slate-50' : ''}`}
                                    >
                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleOpenModal(m)}
                                                className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
                                                title="Edit Member"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteConfirm({ isOpen: true, id: m._id })}
                                                className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                                                title="Remove Member"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100 shrink-0">
                                                <img 
                                                    src={m.user?.profilePicture || 'https://via.placeholder.com/60'} 
                                                    className="w-full h-full object-cover" 
                                                    alt={m.user?.username}
                                                />
                                            </div>
                                            <div className="overflow-hidden pr-6">
                                                <h4 className="font-bold text-slate-800 truncate mb-0.5">{m.user?.username}</h4>
                                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-tight line-clamp-1">{m.designation}</p>
                                                <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">{m.domain || 'General'}</p>
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
