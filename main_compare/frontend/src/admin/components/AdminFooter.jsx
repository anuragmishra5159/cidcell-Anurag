import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="mt-8 border-t border-slate-200 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} Collaboration and Innovation Development Cell (CID). All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-slate-500 hover:text-slate-900">Documentation</a>
          <a href="#" className="text-xs text-slate-500 hover:text-slate-900">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
