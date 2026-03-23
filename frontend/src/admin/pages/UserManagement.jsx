import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Modal from '../components/Modal';
import { 
  Edit2, 
  Trash2, 
  Eye, 
  Search, 
  X,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Mail,
  Calendar,
  Building,
  Briefcase,
  Globe,
  Award,
  PlusCircle,
  Loader
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, userId: null });
  const [toast, setToast] = useState({ message: '', type: null });

  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    enrollmentNo: '',
    branch: '',
    batch: '',
    userType: '',
    skills: '',
    socialLinks: {
      linkedin: '',
      github: '',
      leetcode: '',
      other: ''
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { 
        console.error(err); 
        showToast('Failed to fetch users', 'error');
    } finally {
        setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      enrollmentNo: user.enrollmentNo || '',
      branch: user.branch || '',
      batch: user.batch || '',
      userType: user.userType || 'student',
      skills: user.skills ? user.skills.join(', ') : '',
      socialLinks: {
        linkedin: user.socialLinks?.linkedin || '',
        github: user.socialLinks?.github || '',
        leetcode: user.socialLinks?.leetcode || '',
        other: user.socialLinks?.other || ''
      }
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/users/${selectedUser._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === selectedUser._id ? res.data : u));
      setIsEditModalOpen(false);
      showToast('User updated successfully');
    } catch (err) { showToast('Failed to update user', 'error'); }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${deleteConfirm.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== deleteConfirm.userId));
      showToast('User deleted successfully');
    } catch (err) { showToast('Delete failed', 'error'); }
    finally { setDeleteConfirm({ isOpen: false, userId: null }); }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl lg:text-3xl font-black text-primary uppercase tracking-tight">User Directory</h2>
          <div className="inline-block bg-highlight-blue border-2 border-primary px-3 py-0.5 mt-2 transform -rotate-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Global Identity Hub</p>
          </div>
        </div>
        
        <div className="relative w-full lg:w-[400px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            placeholder="SEARCH USERS BY IDENTITY..."
            className="w-full bg-white border-2 border-primary rounded-xl py-3.5 pl-12 pr-6 outline-none shadow-neo-mini focus:shadow-neo transition-all font-black text-[10px] uppercase placeholder:text-primary/20"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 gap-6 bg-white border-4 border-primary shadow-neo rounded-3xl">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary rounded-full animate-ping opacity-20"></div>
                <Loader className="w-16 h-16 animate-spin absolute top-0 left-0 text-primary stroke-[3]" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/40">Fetching Directory Data...</p>
        </div>
      ) : (
        <div className="bg-white border-4 border-primary shadow-neo rounded-3xl overflow-hidden mb-12 font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-highlight-blue border-b-4 border-primary text-primary">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10">Member Profile</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-primary/10">Academic Info</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center border-r-2 border-primary/10">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-primary/10">
                {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-highlight-teal/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border-2 border-primary bg-white flex items-center justify-center shadow-neo-mini overflow-hidden group-hover:rotate-3 transition-transform flex-none">
                          {user.profilePic ? (
                            <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-black text-primary/40 uppercase">{user.username.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-sm text-primary uppercase leading-tight truncate mb-1">{user.username}</p>
                          <p className="text-[9px] font-black text-primary/40 uppercase truncate flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-primary" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black uppercase text-primary/70 flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-primary" /> {user.branch || "NOT ASSIGNED"}
                        </p>
                        <p className="text-[10px] font-black uppercase text-primary/40 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary/60" /> BATCH: {user.batch || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block border-2 border-primary px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-neo-mini ${
                        user.userType === 'admin' ? 'bg-highlight-pink' :
                        user.userType === 'faculty' ? 'bg-highlight-yellow' :
                        'bg-highlight-blue'
                      }`}>
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedUser(user); setIsViewModalOpen(true); }}
                          className="w-10 h-10 border-2 border-primary rounded-xl bg-white flex items-center justify-center text-primary shadow-neo-mini hover:bg-highlight-blue hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                          title="Detailed View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditOpen(user)}
                          className="w-10 h-10 border-2 border-primary rounded-xl bg-white flex items-center justify-center text-primary shadow-neo-mini hover:bg-highlight-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                          title="Modify Entry"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ isOpen: true, userId: user._id })}
                          className="w-10 h-10 border-2 border-primary rounded-xl bg-white flex items-center justify-center text-rose-500 shadow-neo-mini hover:bg-rose-500 hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                          title="System Purge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-primary/20">
                      <Search className="w-14 h-14 mx-auto mb-6 opacity-10" />
                      <p className="text-sm font-black uppercase tracking-[0.2em]">Zero Records Found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-8 py-8 border-t-4 border-primary flex flex-col sm:flex-row items-center justify-between bg-white gap-6">
            <p className="text-[11px] font-black text-primary/40 uppercase tracking-widest bg-slate-50 border-2 border-primary px-4 py-2 rounded-xl shadow-neo-mini">
              SHOWING {(currentPage - 1) * usersPerPage + 1} TO {Math.min(currentPage * usersPerPage, filteredUsers.length)} OF {filteredUsers.length} MEMBERS
            </p>
            <div className="flex gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-6 py-3 border-2 border-primary rounded-2xl text-xs font-black uppercase bg-white shadow-neo-mini hover:bg-highlight-teal transition-all disabled:opacity-20 disabled:shadow-none"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-6 py-3 border-2 border-primary rounded-2xl text-xs font-black uppercase bg-primary text-white shadow-neo-mini hover:shadow-none transition-all disabled:opacity-20 disabled:shadow-none"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        title="User Profile Detail"
        maxWidth="max-w-2xl"
      >
          {selectedUser && (
              <div className="p-4 sm:p-6 space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                      <div className="w-24 h-24 rounded-2xl bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                          {selectedUser.profilePic ? <img src={selectedUser.profilePic} alt="" className="w-full h-full object-cover" /> : <p className="text-3xl font-black text-slate-300 uppercase">{selectedUser.username.charAt(0)}</p>}
                      </div>
                      <div className="text-center sm:text-left">
                          <h2 className="text-2xl font-bold text-slate-900">{selectedUser.username}</h2>
                          <p className="text-slate-500 font-medium">{selectedUser.email}</p>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">{selectedUser.userType}</span>
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider">{selectedUser.branch || 'No Branch'}</span>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700">
                      <section className="space-y-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-2">Academic Info</h3>
                          <div className="space-y-3">
                              <div className="flex items-center gap-3 text-sm">
                                  <Briefcase className="w-4 h-4 text-slate-400" />
                                  <span className="font-semibold text-slate-500">Enrollment:</span>
                                  <span className="font-bold">{selectedUser.enrollmentNo || 'Not Added'}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  <span className="font-semibold text-slate-500">Batch Year:</span>
                                  <span className="font-bold">{selectedUser.batch || 'Not Added'}</span>
                              </div>
                          </div>
                      </section>

                      <section className="space-y-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-2">Social Proof</h3>
                          <div className="grid grid-cols-2 gap-3">
                              {selectedUser.socialLinks ? Object.entries(selectedUser.socialLinks).map(([platform, link]) => (
                                  link && (
                                      <a key={platform} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors capitalize border border-slate-200">
                                          <Globe className="w-3 h-3" /> {platform}
                                      </a>
                                  )
                              )) : <p className="text-xs italic text-slate-400">No social links added yet.</p>}
                          </div>
                      </section>

                      <section className="col-span-1 md:col-span-2 space-y-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                          <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-2">Technical Arsenal</h3>
                          <div className="flex flex-wrap gap-2">
                              {selectedUser.skills && selectedUser.skills.length > 0 ? selectedUser.skills.map(skill => (
                                  <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm lowercase">
                                      {skill}
                                  </span>
                              )) : <p className="text-xs italic text-slate-400">No skills listed yet.</p>}
                          </div>
                      </section>
                  </div>
              </div>
          )}
      </Modal>

      {/* Edit User Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Modify User Credentials"
        footer={
          <>
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">Dismiss</button>
            <button form="editUserForm" type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-all active:scale-95 text-sm">Update Account</button>
          </>
        }
      >
          <form id="editUserForm" onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Account Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Username</label>
                        <input type="text" required value={editFormData.username} onChange={e => setEditFormData({...editFormData, username: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Identity Class</label>
                        <select value={editFormData.userType} onChange={e => setEditFormData({...editFormData, userType: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
                            <option value="student">Student</option>
                            <option value="member">Member</option>
                            <option value="faculty">Faculty</option>
                            <option value="HOD">HOD</option>
                            <option value="admin">Administrator</option>
                            <option value="mentor">Mentor</option>
                        </select>
                    </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Academic Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Enrollment No</label>
                        <input type="text" value={editFormData.enrollmentNo} onChange={e => setEditFormData({...editFormData, enrollmentNo: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Department/Branch</label>
                        <input type="text" value={editFormData.branch} onChange={e => setEditFormData({...editFormData, branch: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Batch Year</label>
                        <input type="text" value={editFormData.batch} onChange={e => setEditFormData({...editFormData, batch: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1 flex flex-col justify-end">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 line-clamp-1">Expertise Tags (comma separated)</label>
                        <input type="text" value={editFormData.skills} onChange={e => setEditFormData({...editFormData, skills: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="React, Node, etc." />
                    </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider border-b pb-2">Navigation Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Object.keys(editFormData.socialLinks).map(platform => (
                        <div key={platform} className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 capitalize">{platform} Link</label>
                            <input type="text" value={editFormData.socialLinks[platform]} onChange={e => setEditFormData({...editFormData, socialLinks: {...editFormData.socialLinks, [platform]: e.target.value}})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                        </div>
                    ))}
                </div>
              </div>
          </form>
      </Modal>

      {/* Delete User via Portal */}
      {deleteConfirm.isOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center border border-slate-200 animate-fade-in">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-500 w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800 uppercase tracking-tight">System Termination</h3>
              <p className="text-slate-500 my-4 text-sm font-medium leading-relaxed">You are about to permanently erase this user's entire account footprint. This operation is irreversible. Continue?</p>
              <div className="flex gap-3 mt-6">
                  <button onClick={() => setDeleteConfirm({ isOpen: false, userId: null })} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors text-sm">Abort</button>
                  <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition-all active:scale-95 text-sm">Execute</button>
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
                <button onClick={() => setToast({message: '', type: null})} className="ml-2 text-white/70 hover:text-white transition-colors">
                    <X size={14} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
