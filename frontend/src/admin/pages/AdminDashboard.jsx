import React, { useState, useEffect, useContext } from 'react';
import { Users, Folder, Shield, Calendar, Loader, ArrowRight, Activity, LayoutDashboard, Settings, PlusCircle } from 'lucide-react';
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
        events: 0,
        myProjects: 0
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
                events: eventsRes.data.length || 0,
                myProjects: projectsRes.data.filter(p => p.createdBy?._id === user?._id || p.createdBy === user?._id).length || 0
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
        { label: 'Ecosystem Events', value: stats.events, icon: Calendar, color: 'text-primary', bg: 'bg-highlight-yellow', shadow: 'shadow-neo', path: '/admin/events' },
        { label: 'Network Projects', value: stats.projects, icon: Folder, color: 'text-primary', bg: 'bg-highlight-green', shadow: 'shadow-neo', path: '/admin/projects' },
        { label: 'Mentors & Staff', value: stats.members, icon: Shield, color: 'text-primary', bg: 'bg-highlight-purple', shadow: 'shadow-neo', path: '/admin/members' },
        { label: 'My Projects', value: stats.myProjects, icon: Users, color: 'text-primary', bg: 'bg-highlight-pink', shadow: 'shadow-neo', path: '/admin/projects' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
                <div className="relative">
                    <div className="w-20 h-20 border-6 border-primary rounded-full animate-ping opacity-20"></div>
                    <Loader className="w-20 h-20 animate-spin absolute top-0 left-0 text-primary stroke-[3]" />
                </div>
                <div className="bg-highlight-yellow border-2 border-primary px-4 py-1 transform -rotate-2 shadow-neo-mini">
                    <p className="text-sm font-black text-primary uppercase tracking-[0.2em]">Syncing Neural Hub...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-8 font-sans px-4 lg:px-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-4 pb-8 border-primary">
                <div>
                    <h2 className="text-3xl lg:text-5xl font-black text-primary uppercase tracking-tighter leading-tight">
                        HELLO, {user?.username || 'ADMIN'}
                    </h2>
                    <div className="inline-block bg-highlight-blue border-2 border-primary px-4 py-1 mt-4 transform -rotate-1 shadow-neo-mini">
                        <p className="text-[10px] lg:text-xs font-black text-primary uppercase tracking-[0.2em] leading-none">Architect Command Center</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-3 border-primary bg-highlight-yellow shadow-neo animate-bounce"></div>
                    <div className="w-6 h-6 rounded-full border-3 border-primary bg-highlight-pink shadow-neo"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 pt-2">
                {statCards.map((stat, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(stat.path)}
                        className={`p-6 rounded-2xl border-3 border-primary transition-all text-left flex flex-col gap-4 group relative overflow-hidden bg-white shadow-neo-mini hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`}
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} border-2 border-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-neo-mini`}>
                            <stat.icon className="w-6 h-6" strokeWidth={3} />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black leading-tight text-primary uppercase tracking-tighter">{stat.value}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.1em] mt-1 text-primary/60">{stat.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="w-full p-8 lg:p-10 rounded-[32px] border-4 border-primary shadow-neo transition-colors bg-white">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="font-black text-2xl lg:text-3xl uppercase tracking-tighter flex items-center gap-4 text-primary">
                        <Activity className="w-8 h-8 text-primary stroke-[3]" /> Global Protocols
                    </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button onClick={() => navigate('/admin/users')} className="p-6 border-3 border-primary rounded-2xl transition-all text-left flex flex-col gap-4 bg-highlight-blue shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        <div className="flex items-center justify-between">
                            <Users className="w-8 h-8 text-primary stroke-[3]" />
                            <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center shadow-neo-mini">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-lg uppercase tracking-tight text-primary leading-none">Member Forge</h5>
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 mt-2">Identity Database</p>
                        </div>
                    </button>
                    
                    <button onClick={() => navigate('/admin/projects')} className="p-6 border-3 border-primary rounded-2xl transition-all text-left flex flex-col gap-4 bg-highlight-green shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        <div className="flex items-center justify-between">
                            <Folder className="w-8 h-8 text-primary stroke-[3]" />
                            <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center shadow-neo-mini">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-lg uppercase tracking-tight text-primary leading-none">Project Hub</h5>
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 mt-2">Active Repositories</p>
                        </div>
                    </button>

                    <button onClick={() => navigate('/admin/events')} className="p-6 border-3 border-primary rounded-2xl transition-all text-left flex flex-col gap-4 bg-highlight-yellow shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        <div className="flex items-center justify-between">
                            <Calendar className="w-8 h-8 text-primary stroke-[3]" />
                            <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center shadow-neo-mini">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-lg uppercase tracking-tight text-primary leading-none">Activity Stream</h5>
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 mt-2">Events Deployment</p>
                        </div>
                    </button>

                    <button onClick={() => navigate('/admin/members')} className="p-6 border-3 border-primary rounded-2xl transition-all text-left flex flex-col gap-4 bg-highlight-purple shadow-neo-mini hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        <div className="flex items-center justify-between">
                            <Shield className="w-8 h-8 text-primary stroke-[3]" />
                            <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center shadow-neo-mini">
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-lg uppercase tracking-tight text-primary leading-none">Architects Hub</h5>
                            <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 mt-2">Team Configuration</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
