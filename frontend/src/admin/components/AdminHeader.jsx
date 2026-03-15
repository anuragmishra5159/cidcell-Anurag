import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User as UserIcon, Menu } from 'lucide-react';

const AdminHeader = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-600"><Menu size={20} /></button>
        <h2 className="text-sm font-semibold text-slate-600">
          Collaboration and Innovation Development Cell
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900 leading-none mb-1 capitalize">
            {user?.username || 'Admin'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
          <UserIcon size={16} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
