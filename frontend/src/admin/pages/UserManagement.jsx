import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Edit2, 
  Trash2, 
  Eye, 
  Search, 
  X,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
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

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) { console.error(err); }
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
    } catch (err) { showToast('Failed to update', 'error'); }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm">Manage all system users.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Search users..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded text-sm w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Username</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 font-medium">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.userType}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => { setSelectedUser(user); setIsViewModalOpen(true); }} className="p-1 text-slate-400 hover:text-blue-600"><Eye size={18} /></button>
                    <button onClick={() => handleEditOpen(user)} className="p-1 text-slate-400 hover:text-blue-600"><Edit2 size={18} /></button>
                    <button onClick={() => setDeleteConfirm({ isOpen: true, userId: user._id })} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded shadow-lg w-full max-w-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">User Details</h3>
              <button onClick={() => setIsViewModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-400 font-bold uppercase">Username</p><p>{selectedUser.username}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Email</p><p>{selectedUser.email}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Enrollment</p><p>{selectedUser.enrollmentNo || '-'}</p></div>
              <div><p className="text-xs text-slate-400 font-bold uppercase">Branch</p><p>{selectedUser.branch || '-'}</p></div>
            </div>
            <div className="p-4 border-t text-right">
              <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-slate-800 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded shadow-lg w-full max-w-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">Edit User</h3>
              <button onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <input type="text" value={editFormData.username} onChange={e => setEditFormData({...editFormData, username: e.target.value})} className="w-full p-2 border rounded" placeholder="Username"/>
              <select value={editFormData.userType} onChange={e => setEditFormData({...editFormData, userType: e.target.value})} className="w-full p-2 border rounded">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="HOD">HOD</option>
                <option value="Admin">Admin</option>
                <option value="member">Member</option>
              </select>
              <input type="text" value={editFormData.enrollmentNo} onChange={e => setEditFormData({...editFormData, enrollmentNo: e.target.value})} className="w-full p-2 border rounded" placeholder="Enrollment No"/>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 p-2 border rounded">Cancel</button>
                <button type="submit" className="flex-1 p-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={40} />
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="text-slate-500 mb-6">Are you sure you want to delete this user?</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm({ isOpen: false, userId: null })} className="flex-1 p-2 border rounded font-bold">No</button>
              <button onClick={handleDelete} className="flex-1 p-2 bg-red-600 text-white rounded font-bold">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast.message && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2">
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <p>{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
