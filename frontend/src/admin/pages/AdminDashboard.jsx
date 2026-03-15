import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Users, FileText, Folder } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    users: 0,
    projects: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [usersRes, projectsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL}/projects`)
        ]);
        setStats({
          users: usersRes.data.length,
          projects: projectsRes.data.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 border border-slate-200 rounded shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Hello, <span className="capitalize">{user?.username || 'Admin'}</span>
        </h1>
        <p className="text-slate-500 mt-1">Manage the CID Cell ecosystem from your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-slate-200 rounded shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded text-blue-600"><Users size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">Registered Users</p>
            <p className="text-2xl font-bold text-slate-900">{stats.users}</p>
          </div>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded text-green-600"><Folder size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">Projects</p>
            <p className="text-2xl font-bold text-slate-900">{stats.projects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
