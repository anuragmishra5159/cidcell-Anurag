import { DatabaseZap } from 'lucide-react';

export default function EmptyState({ title = "No Data Found", message = "This data link is currently unpopulated.", icon: Icon = DatabaseZap }) {
  return (
    <div className="w-full py-16 px-6 glass-panel flex flex-col items-center justify-center text-center shadow-glow-purple border border-accent/20 relative overflow-hidden group">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-glow-accent rounded-full pointer-events-none opacity-50 group-hover:scale-150 transition-transform duration-1000 delay-100"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-glow-blue rounded-full pointer-events-none opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>

      {/* Floating Icon Hexagon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
        <div className="w-20 h-20 rounded-2xl bg-black/60 border border-white/5 shadow-glass flex items-center justify-center relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
           <Icon size={32} className="text-accent drop-shadow-[0_0_10px_rgba(139,92,246,0.6)] animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-3 tracking-wider">{title}</h3>
      <p className="text-slate-400 font-medium max-w-sm mb-0">
        {message}
      </p>

    </div>
  );
}
