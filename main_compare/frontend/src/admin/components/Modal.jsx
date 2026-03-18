import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, footer, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} flex flex-col overflow-hidden border border-slate-200 animate-fade-in`} style={{ maxHeight: '90vh' }}>
        <div className="flex-none p-4 sm:p-5 border-b bg-white flex items-center justify-between z-10 transition-colors">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar min-h-0 text-slate-700">
          {children}
        </div>
        {footer && (
          <div className="flex-none p-4 sm:p-5 border-t bg-white flex justify-end gap-3 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
