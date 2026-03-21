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
      <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">User Management</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and moderate all users across the system.</p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl border shadow-sm grid grid-cols-1 md:flex md:flex-row gap-3 items-center bg-white border-slate-200">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                      type="text"
                      placeholder="Search users by name, email..."
                      className="pl-9 pr-4 py-2 border rounded-lg w-full outline-none text-sm transition-all bg-white border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500"
                      value={searchTerm}
                      onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                      }}
                  />
              </div>
          </div>
      </div>

      {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-slate-500 font-medium text-sm">Loading users...</p>
          </div>
      ) : (
          <div className="border rounded-xl flex flex-col shadow-sm bg-white border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                              <th className="px-5 py-4 w-[30%]">User Profile</th>
                              <th className="px-5 py-4">Details</th>
                              <th className="px-5 py-4 text-center">Identity</th>
                              <th className="px-5 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-5 py-4">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 uppercase font-bold text-slate-400 text-xs shrink-0 overflow-hidden">
                                              {user.profilePic ? <img src={user.profilePic} alt="" className="w-full h-full object-cover" /> : user.username.charAt(0)}
                                          </div>
                                          <div className="overflow-hidden">
                                              <p className="font-semibold text-sm text-slate-800 truncate">{user.username}</p>
                                              <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-5 py-4">
                                      <div className="space-y-1">
                                          <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                                              <Building className="w-3 h-3" /> {user.branch || "N/A"}
                                          </p>
                                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                              <Calendar className="w-3 h-3" /> Batch: {user.batch || "N/A"}
                                          </p>
                                      </div>
                                  </td>
                                  <td className="px-5 py-4 text-center">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                          user.userType === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                          user.userType === 'faculty' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                          'bg-blue-50 text-blue-700 border-blue-200'
                                      }`}>
                                          {user.userType}
                                      </span>
                                  </td>
                                  <td className="px-5 py-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                          <button 
                                              onClick={() => { setSelectedUser(user); setIsViewModalOpen(true); }}
                                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                                              title="View Profile"
                                          >
                                              <Eye className="w-4 h-4" />
                                          </button>
                                          <button 
                                              onClick={() => handleEditOpen(user)}
                                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                                              title="Edit User"
                                          >
                                              <Edit2 className="w-4 h-4" />
                                          </button>
                                          <button 
                                              onClick={() => setDeleteConfirm({ isOpen: true, userId: user._id })}
                                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                              title="Delete User"
                                          >
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          )) : (
                              <tr>
                                  <td colSpan="4" className="px-5 py-16 text-center text-slate-400">
                                      <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                      <p className="text-sm font-medium">No users found matching your search.</p>
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
              
              {/* Pagination */}
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
                  <p className="text-xs font-medium text-slate-500">
                      Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                  </p>
                  <div className="flex gap-2">
                      <button 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="px-3 py-1.5 border rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                          Previous
                      </button>
                      <button 
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
