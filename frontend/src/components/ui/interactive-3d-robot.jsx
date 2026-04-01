import { Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

export function InteractiveRobotSpline({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex flex-col items-center justify-center bg-transparent text-white relative ${className || ''}`}>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-glow-accent rounded-full animate-pulse-slow"></div>
           <div className="relative z-10 flex flex-col items-center gap-4">
               <div className="relative flex items-center justify-center w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-t-2 border-accent border-opacity-50 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-l-2 border-accent-magenta border-opacity-70 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-4 rounded-full border-b-2 border-blue-400 border-opacity-60 animate-[spin_2s_linear_infinite]"></div>
                  <span className="font-heading font-black text-[10px] text-accent tracking-[0.3em] uppercase absolute animate-pulse">Init</span>
               </div>
               <p className="font-heading font-bold text-[10px] uppercase tracking-[0.4em] text-slate-300 animate-pulse">Initializing Matrix...</p>
           </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className} 
        style={{ contain: 'layout style paint' }}
      />
    </Suspense>
  );
}
