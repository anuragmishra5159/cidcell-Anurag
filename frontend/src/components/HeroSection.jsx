import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Activity, 
  Cpu, 
  Network, 
  Users, 
  Database,
  Terminal,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useEffect, useState, useContext, Suspense } from 'react';
import { AuthContext } from '../context/AuthContext';
import { InteractiveRobotSpline } from './ui/interactive-3d-robot';
import { developers } from '../data/developersData';

export default function HeroSection() {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);

  const [shuffledDevs, setShuffledDevs] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    // Randomize developers for the contributors widget
    setShuffledDevs([...developers].sort(() => 0.5 - Math.random()).slice(0, 4));
  }, []);

  return (
    <>
      <section className="relative w-full min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#050505] text-white z-10">
        
        {/* Deep Background Nebula / Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', willChange: 'transform' }}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] rounded-full pointer-events-none transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)', willChange: 'transform, opacity' }}></div>

        {/* 3D Robot Spline - Cropped perfectly to hide watermark */}
        <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[calc(100%+60px)]">
            <InteractiveRobotSpline
              scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
              className="w-full h-full" 
            />
          </div>
        </div>

        <div className={`w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pointer-events-none transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Dashboard Grid Container (Mosaic/Masonry Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pointer-events-none">

            {/* ====== LEFT COLUMN (3/12) - Metrics & Health ====== */}
            <div className="flex flex-col gap-6 col-span-1 lg:col-span-3 order-3 lg:order-1 self-center animate-fade-in-up delay-200 pointer-events-auto w-full pt-10 lg:pt-0">
              
              {/* Widget 1: Live Activity */}
              <div 
                className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-glass overflow-hidden relative group hover:border-accent/40 hover:-translate-y-1 hover:shadow-glow-purple transition-all duration-300"
                style={{ willChange: 'transform' }}
              >
                <div className="absolute top-0 left-0 w-1 bg-accent h-full shadow-[0_0_15px_#8b5cf6]"></div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-1">Network Node</p>
                    <h4 className="text-xl font-heading font-bold text-white leading-none">Active</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Activity size={16} />
                  </div>
                </div>
                {/* Mock Mini Chart (CSS generated) */}
                <div className="w-full h-12 flex items-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                   {[40, 70, 45, 90, 65, 85, 55, 100, 75, 40].map((h, i) => (
                     <div key={i} className="flex-1 bg-accent/40 rounded-t-sm transition-all duration-500 hover:bg-accent" style={{ height: `${h}%` }}></div>
                   ))}
                </div>
              </div>

               {/* Widget 2: Node Distribution */}
              <div 
                className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-glass relative group hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-glow-blue transition-all duration-300"
                style={{ willChange: 'transform' }}
              >
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                     <Network size={16} />
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-0.5">Active Members</p>
                     <p className="text-lg font-heading font-bold text-white leading-none">248<span className="text-blue-400 text-sm ml-1">Nodes</span></p>
                   </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-accent w-[75%] h-full rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                </div>
                <p className="text-[9px] text-slate-400 text-right mt-2 font-medium tracking-wide">Status: <span className="text-white">Active</span></p>
              </div>

               {/* Widget 3: Small Info Panel */}
              <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-glass flex items-center gap-3 hover:bg-white/5 transition-colors">
                <ShieldCheck size={20} className="text-green-400" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-300 font-semibold tracking-widest uppercase">Clearance</p>
                  <p className="text-xs text-white font-medium">Level 3 Access Active</p>
                </div>
              </div>

            </div>

            {/* ====== CENTER COLUMN (6/12) - Emptying out center for the Robot ====== */}
            <div className="col-span-1 lg:col-span-6 order-1 lg:order-2 flex flex-col items-center text-center justify-end min-h-[60vh] lg:min-h-[80vh] relative z-30 pointer-events-none pb-4 lg:pb-0">
              
              <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-accent/30 shadow-glow-purple px-4 py-2 rounded-full mb-8 pointer-events-auto">
                <Cpu size={14} className="text-accent" />
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-slate-200">CID-CELL CORE v2.0</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto pointer-events-auto">
                <Link to={user ? "/profile" : "/auth"} className="btn-neo px-10 py-4 text-xs tracking-[0.3em]">
                  INITIALIZE <ArrowRight size={16} />
                </Link>
                <Link to="/projects" className="btn-neo-secondary px-10 py-4 text-xs tracking-[0.3em]">
                  EXPLORE DB
                </Link>
              </div>

            </div>

            {/* ====== RIGHT COLUMN (3/12) - Database & Collaboration ====== */}
            <div className="flex flex-col gap-6 col-span-1 lg:col-span-3 order-2 lg:order-3 self-center animate-fade-in-up delay-300 pointer-events-auto w-full pt-6 lg:pt-0">
              
              {/* Widget 4: Database Snapshot */}
              <Link to="/projects" className="block bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-glass relative overflow-hidden group hover:border-accent/50 hover:-translate-y-1 transition-all duration-300" style={{ willChange: 'transform' }}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent-magenta/20 blur-2xl rounded-full pointer-events-none"></div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Database size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Domain Clusters</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse"></div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { label: 'AI & Data Science', val: 'PyTorch / TF', color: 'text-accent' },
                    { label: 'Web Development', val: 'React / Node', color: 'text-blue-400' },
                    { label: 'Cyber Security', val: 'Kali / OSINT', color: 'text-accent-magenta' }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-medium">
                      <span className="text-slate-400">{stat.label}</span>
                      <span className={`font-bold ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
              </Link>

              {/* Widget 5: Recent Contributors (Stacked Avatars) */}
              <div 
                className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-glass group hover:border-accent/40 transition-colors"
                style={{ willChange: 'transform' }}
              >
                 <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-3">Core Committee</p>
                 <div className="flex items-center mb-3">
                   {shuffledDevs.map((dev, i) => (
                     <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#050505] bg-surface flex items-center justify-center -ml-3 first:ml-0 relative shadow-lg`} style={{ zIndex: 10 - i }}>
                        <img src={dev.image} alt={dev.name} className="w-full h-full rounded-full object-cover" title={dev.name} />
                     </div>
                   ))}
                 </div>
                 <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <Zap size={14} className="text-yellow-400" />
                    <span>Operations Sync Active</span>
                 </div>
              </div>
              
              {/* Widget 6: Terminal Output Mock */}
              <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 p-4 font-mono text-[10px] sm:text-xs text-slate-500 leading-relaxed shadow-inner">
                <div className="flex gap-1.5 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <p><span className="text-accent">CID_USER@mits</span>:~$ connect --matrix</p>
                <p className="text-slate-400">Loading modules...</p>
                <p className="text-slate-400">Establishing handshake [OK]</p>
                <p className="text-green-400">Access Granted.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SCROLLING MARQUEE - Glass Aesthetic */}
      <div className="w-full bg-black/40 backdrop-blur-md border-y border-white/10 py-3 md:py-4 z-20 relative flex overflow-hidden">
        <div className="whitespace-nowrap flex font-heading text-sm md:text-base font-bold uppercase tracking-[0.25em] animate-marquee min-w-max text-slate-400">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4 items-center">
              <span className="hover:text-white transition-colors"><span className="text-accent mr-2">/</span> INNOVATION</span>
              <span className="hover:text-white transition-colors"><span className="text-blue-400 mr-2">/</span> DEVELOPMENT</span>
              <span className="hover:text-white transition-colors"><span className="text-accent-magenta mr-2">/</span> NEURAL NETWORKS</span>
              <span className="hover:text-white transition-colors"><span className="text-green-400 mr-2">/</span> REAL-WORLD SYSTEMS</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
