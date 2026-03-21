import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-highlight-pink transform translate-x-3 translate-y-3 -z-10 border-4 border-black"></div>
          <div className="bg-white border-4 border-black p-8 shadow-neo relative">
            <AlertTriangle size={64} className="text-highlight-pink mx-auto mb-4" />
            <h1 className="font-heading text-6xl font-black text-black mb-2 uppercase italic leading-none">404</h1>
            <p className="font-heading text-xl font-black text-black uppercase tracking-widest">Page Lost in Space</p>
          </div>
        </div>
        
        <p className="text-primary font-bold text-lg mb-8 leading-relaxed">
          The project or resource you are looking for doesn't exist or has been moved to a new dimension.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-heading font-black text-xl uppercase tracking-wider border-4 border-black shadow-neo-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          <Home size={24} /> Back to Base
        </Link>
      </div>
    </div>
  );
}
