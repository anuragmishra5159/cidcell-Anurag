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
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <section ref={elementRef} className={`w-full min-h-screen py-20 flex items-center bg-transparent relative overflow-hidden transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-highlight-orange mix-blend-multiply blur-[80px] opacity-70 animate-blob"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-highlight-purple mix-blend-multiply blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-10 left-10 w-24 h-24 bg-white border-4 border-primary shadow-neo transform rotate-12 -z-0 hidden md:block"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-highlight-teal border-4 border-primary rounded-full shadow-neo transform -rotate-12 -z-0 hidden lg:block"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #000 2px, transparent 2px), linear-gradient(to bottom, #000 2px, transparent 2px)', backgroundSize: '64px 64px' }}></div>

      <div className={`container-max mx-auto text-center w-full relative z-10 px-4 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="inline-block mb-8 xl:mb-12">
          <div className="bg-white border-4 border-black px-6 py-2 rounded-full shadow-neo transform -rotate-3 hover:rotate-0 transition-transform">
             <span className="font-bold text-base md:text-lg uppercase tracking-[0.2em] flex items-center gap-3">
               <Sparkles size={24} className="fill-highlight-yellow stroke-[2px]" /> 
               Join the Revolution
             </span>
          </div>
        </div>
        
        <h2 className="font-heading text-5xl md:text-7xl lg:text-9xl font-black text-black mb-10 uppercase leading-[0.85] tracking-wider relative">
          Ready to <br/><span className="text-white text-shadow-[4px_4px_0_#000] md:text-shadow-[8px_8px_0_#000] z-10 relative">Innovate?</span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-highlight-pink -z-10 transform -rotate-2 mix-blend-screen opacity-50"></div>
        </h2>
        
        <div className="max-w-3xl mx-auto mb-12 relative">
          <div className="absolute -inset-1 bg-black transform translate-x-3 translate-y-3 z-0"></div>
          <p className="relative z-10 bg-white text-black font-bold text-lg md:text-2xl p-8 border-4 border-black leading-relaxed font-body">
            Join CID-Cell today and be part of a community that transforms ideas into reality.
            Collaborate, innovate, and build the future of technology.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            to={user ? "/profile" : "/auth"} 
            className="group relative px-10 py-5 bg-black text-white font-heading font-black text-2xl uppercase tracking-wider border-4 border-black shadow-neo-white hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3"
          >
            Get Started <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform stroke-[4px]" />
          </Link>
          <Link 
            to="/projects" 
            className="group relative px-10 py-5 bg-white text-black font-heading font-black text-2xl uppercase tracking-wider border-4 border-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            View Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
