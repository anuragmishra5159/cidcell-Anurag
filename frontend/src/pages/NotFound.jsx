import { Link } from 'react-router-dom';
import { Terminal, Home, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404');

  // Simple glitch effect on mount
  useEffect(() => {
    const chars = '01#@%&*';
    let interval = setInterval(() => {
      setGlitchText(prev => {
        if (Math.random() > 0.8) {
          return '4' + chars[Math.floor(Math.random() * chars.length)] + '4';
        }
        return '404';
      });
    }, 150);
    
    setTimeout(() => {
      clearInterval(interval);
      setGlitchText('404');
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-glow-magenta rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-xl w-full text-center relative z-10">
        
        <div className="glass-panel p-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_#ef4444]"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertCircle size={32} />
            </div>
          </div>

          <h1 className="font-heading text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2 tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {glitchText}
          </h1>
          
          <div className="inline-flex items-center gap-2 bg-[#050505] border border-white/5 rounded-full px-4 py-2 mt-4 mb-8 font-mono">
            <Terminal size={14} className="text-accent" />
            <span className="text-xs text-red-400">Error: Node Out of Bounds</span>
          </div>
          
          <p className="text-slate-300 font-medium text-lg lg:text-xl mb-10 leading-relaxed max-w-md mx-auto">
            The database cluster or interface you are trying to reach has been disconnected from the primary network.
          </p>

          <Link 
            to="/" 
            className="btn-neo inline-flex mx-auto"
          >
            <Home size={18} /> Return To Hub
          </Link>
        </div>
        
      </div>
    </div>
  );
}
