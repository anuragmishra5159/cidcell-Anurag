import React, { useState, useEffect, useContext } from 'react';
import { Users, Folder, Shield, Calendar, Loader, ArrowRight, Activity, LayoutDashboard, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
    const isDarkMode = false;
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        users: 0,
        projects: 0,
        members: 0,
        events: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const [usersRes, projectsRes, membersRes, eventsRes] = await Promise.all([
                axios.get(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/projects`),
                axios.get(`${BASE_URL}/members`),
                axios.get(`${BASE_URL}/events`)
            ]);

            setStats({
                users: usersRes.data.length || 0,
                projects: projectsRes.data.length || 0,
                members: membersRes.data.length || 0,
                events: eventsRes.data.length || 0
            });
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Registered Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', path: '/admin/users' },
        { label: 'Projects', value: stats.projects, icon: Folder, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/admin/projects' },
        { label: 'Team Members', value: stats.members, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50', path: '/admin/members' },
        { label: 'Live Events', value: stats.events, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', path: '/admin/events' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-50 rounded-full animate-ping"></div>
                    <Loader className={`w-16 h-16 animate-spin absolute top-0 left-0 text-indigo-500`} />
                </div>
                <p className="text-slate-500 font-medium font-sans">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-4 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-100">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 capitalize">Hello, {user?.username || 'Admin'}</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the CID Cell ecosystem from your dashboard.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {statCards.map((stat, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(stat.path)}
                        className="p-3 sm:p-5 lg:p-6 rounded-xl border transition-all text-left flex flex-col gap-3 sm:gap-4 group relative overflow-hidden bg-white border-slate-100 hover:border-indigo-100 hover:shadow-lg shadow-sm"
                    >
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
                            <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-3xl font-semibold leading-tight text-slate-900">{stat.value}</h3>
                            <p className="text-[11px] sm:text-sm font-medium mt-0.5 sm:mt-1 text-gray-500">{stat.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="w-full p-6 lg:p-8 rounded-xl border shadow-sm transition-colors bg-white border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-lg lg:text-xl flex items-center gap-2 text-slate-800">
                        <Activity className="w-5 h-5 text-indigo-500" /> Quick Actions
                    </h4>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                    <button onClick={() => navigate('/admin/users')} className="p-3 sm:p-5 border rounded-lg transition-all text-left flex flex-col gap-2 sm:gap-3 bg-gray-50 border-gray-100 hover:bg-white hover:border-blue-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <Users className="w-6 h-6 text-blue-500" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-medium text-sm sm:text-base text-gray-900">User Directory</h5>
                            <p className="hidden sm:block text-xs leading-relaxed text-gray-500">View all registered users.</p>
                        </div>
                    </button>
                    
                    <button onClick={() => navigate('/admin/projects')} className="p-3 sm:p-5 border rounded-lg transition-all text-left flex flex-col gap-2 sm:gap-3 bg-gray-50 border-gray-100 hover:bg-white hover:border-emerald-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <Folder className="w-6 h-6 text-emerald-500" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-medium text-sm sm:text-base text-gray-900">Manage Projects</h5>
                            <p className="hidden sm:block text-xs leading-relaxed text-gray-500">Oversee ongoing projects.</p>
                        </div>
                    </button>

                    <button onClick={() => navigate('/admin/events')} className="p-3 sm:p-5 border rounded-lg transition-all text-left flex flex-col gap-2 sm:gap-3 bg-gray-50 border-gray-100 hover:bg-white hover:border-purple-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <Calendar className="w-6 h-6 text-purple-500" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-medium text-sm sm:text-base text-gray-900">Manage Events</h5>
                            <p className="hidden sm:block text-xs leading-relaxed text-gray-500">Create and edit events.</p>
                        </div>
                    </button>

                    <button onClick={() => navigate('/admin/members')} className="p-3 sm:p-5 border rounded-lg transition-all text-left flex flex-col gap-2 sm:gap-3 bg-gray-50 border-gray-100 hover:bg-white hover:border-indigo-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <Shield className="w-6 h-6 text-indigo-600" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-medium text-sm sm:text-base text-gray-900">Team Management</h5>
                            <p className="hidden sm:block text-xs leading-relaxed text-gray-500">Manage CID team members.</p>
                        </div>
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
