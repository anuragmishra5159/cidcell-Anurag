import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Users,
  LayoutDashboard,
  Settings,
  LogOut,
  Folder,
  Calendar,
  Shield,
  X,
  User as UserIcon,
  MessageSquare
} from 'lucide-react';

const AdminSidebar = ({ onClose }) => {
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Ecosystem', icon: Users, path: '/admin/users' },
    { name: 'Projects', icon: Folder, path: '/admin/projects' },
    { name: 'Events', icon: Calendar, path: '/admin/events' },
    { name: 'Team Hub', icon: Shield, path: '/admin/members' },
    { name: 'Communication', icon: MessageSquare, path: '/chat' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white h-full flex flex-col font-sans transition-all duration-300">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white italic">C</div>
           <h2 className="text-lg font-black tracking-tighter uppercase italic">CID Cell</h2>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-md"><X size={18} /></button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 mt-2">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Management</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold tracking-tight">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Profile Section */}
      <div className="mt-auto p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
        {/* User Badge */}
        <div className="mb-4 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all cursor-default">
           <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              {user?.profilePicture ? (
                 <img src={user.profilePicture} className="w-full h-full object-cover" alt="" />
              ) : (
                 <UserIcon size={18} className="text-slate-400" />
              )}
           </div>
           <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate uppercase tracking-tight leading-none mb-1">
                 {user?.username || 'Admin'}
              </p>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
                 <Shield size={10} className="fill-blue-500/20" /> Super Admin
              </p>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
           <button 
             className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
           >
              <Settings size={14} className="group-hover:rotate-45 transition-transform duration-500" />
              <span>Settings</span>
           </button>
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-900/0 hover:shadow-rose-900/10"
           >
              <LogOut size={14} />
              <span className="uppercase tracking-widest">Terminate Session</span>
           </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
