import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function CTASection() {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, []);

  return (
    <section ref={elementRef} className={`w-full min-h-screen py-24 flex items-center bg-transparent relative overflow-hidden transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none -z-10" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

      <div className={`container-max mx-auto text-center w-full relative z-10 px-4 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        <div className="inline-block mb-10">
          <div className="glass-panel px-6 py-2 rounded-full border border-accent/30 shadow-glow-purple group hover:bg-white/5 transition-all cursor-default">
             <span className="font-semibold text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3 text-white">
               <Sparkles size={16} className="text-accent group-hover:scale-110 transition-transform" /> 
               Join The Network
             </span>
          </div>
        </div>
        
        <h2 className="font-heading text-4xl md:text-6xl lg:text-[7rem] font-black text-white mb-10 tracking-tight relative leading-[1.1]">
          Ready to <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-cyan to-white filter drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Innovate?</span>
        </h2>
        
        <div className="max-w-2xl mx-auto mb-16 relative">
          <p className="relative z-10 text-secondary font-medium text-base md:text-lg leading-relaxed">
            Initialize your connection today and be part of a decentralized community that transforms ideas into reality.
            Collaborate, innovate, and build the future of technology in the Matrix.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            to={user ? "/profile" : "/auth"} 
            className="btn-neo min-w-[240px] shadow-glow-purple"
          >
            INITIALIZE CONNECTION <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link 
            to="/projects" 
            className="btn-neo-secondary min-w-[240px]"
          >
            VIEW PROJECTS
          </Link>
        </div>
      </div>
    </section>
  );
}
