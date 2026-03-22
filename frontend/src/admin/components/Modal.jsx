import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, footer, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white border-4 border-primary shadow-neo rounded-3xl w-full ${maxWidth} flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`} style={{ maxHeight: '90vh' }}>
        <div className="flex-none p-5 border-b-4 border-primary bg-highlight-blue flex items-center justify-between z-10">
          <h2 className="text-lg font-black text-primary uppercase tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} className="p-2 border-2 border-primary rounded-xl bg-white hover:bg-highlight-yellow transition-all shadow-neo-mini hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar min-h-0 text-primary p-2">
          {children}
        </div>
        {footer && (
          <div className="flex-none p-5 border-t-4 border-primary bg-slate-50 flex justify-end gap-4 z-10 font-black uppercase text-xs">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
