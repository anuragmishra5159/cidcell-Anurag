import React, { useContext } from 'react';
import { MessageSquare, Clock, Users, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MentorDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Placeholder stats for Phase 3 before backend integration in Phase 4
    const stats = {
        activeChats: 0,
        pendingDoubts: 0,
        studentsHelped: 0,
    };

    return (
        <div className="bg-bg min-h-screen pt-24 pb-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* Header Banner */}
                <div className="bg-white border-3 md:border-4 border-primary shadow-neo p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group rounded-2xl md:rounded-neo">
                    <div className="flex items-center gap-6 w-full md:w-auto z-10">
                        <div className="relative shrink-0">
                            <img
                                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=128`}
                                alt="Profile"
                                className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl border-3 md:border-4 border-primary shadow-neo-sm md:shadow-neo object-cover"
                            />
                        </div>

                        <div className="text-left space-y-1 md:space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                <h1 className="text-xl md:text-4xl font-black text-primary uppercase leading-none tracking-tight">
                                    Hello, {user?.username}
                                </h1>
                                <span className="w-fit bg-highlight-teal text-primary border-2 border-primary px-2 py-0.5 font-black uppercase text-[8px] md:text-[10px] shadow-neo-sm">
                                    {user?.userType || 'Mentor'}
                                </span>
                            </div>
                            <p className="text-primary/60 font-black uppercase text-[9px] md:text-[11px] tracking-widest leading-none">
                                Guide students and manage peer learning sessions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid exactly matching AdminDashboard pattern */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { label: "Active Chats", value: stats.activeChats, icon: MessageSquare, color: "bg-highlight-blue" },
                        { label: "Pending Doubts", value: stats.pendingDoubts, icon: Clock, color: "bg-highlight-yellow" },
                        { label: "Students Helped", value: stats.studentsHelped, icon: Users, color: "bg-highlight-green" },
                        { label: "Domain", value: user?.department?.substring(0, 3)?.toUpperCase() || "N/A", icon: BookOpen, color: "bg-highlight-purple" }
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} border-3 border-primary p-4 md:p-5 rounded-2xl md:rounded-neo shadow-neo-sm flex flex-col gap-2 md:gap-3 group hover:-translate-y-1 transition-transform`}>
                            <stat.icon className="text-primary w-4 h-4 md:w-5 md:h-5" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-primary leading-none">{stat.value}</h3>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-primary/60 mt-0.5 truncate">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-white border-4 border-primary p-6 md:p-8 rounded-neo shadow-neo space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                Peer Learning Hub
                            </h2>
                            <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest mt-1">
                                Manage your active student sessions
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/mentor/chat')}
                            className="bg-highlight-yellow border-3 border-primary px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 whitespace-nowrap"
                        >
                            Go To Chat <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="p-8 text-center bg-bg rounded-2xl border-2 border-dashed border-primary/20">
                        <p className="text-[10px] font-black uppercase text-primary/40 leading-loose">
                            No recent activity. Head over to the chat to assist students.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MentorDashboard;
