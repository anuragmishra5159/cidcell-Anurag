import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function CTASection() {
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
    <section ref={elementRef} className={`py-24 bg-highlight-yellow border-t-3 border-b-3 border-black relative overflow-hidden transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-highlight-orange rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-highlight-purple rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      
      <div className={`container-max mx-auto text-center relative z-10 px-4 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="inline-block mb-8">
          <div className="bg-white border-3 border-black px-4 py-1 rounded-full shadow-neo transform -rotate-2">
             <span className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
               <Sparkles size={16} className="fill-highlight-yellow" /> 
               Join the Revolution
             </span>
          </div>
        </div>
        
        <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl font-black text-black mb-10 uppercase leading-[0.9] tracking-tighter">
          Ready to <span className="text-white text-shadow-black">Innovate?</span>
        </h2>
        
        <div className="max-w-2xl mx-auto mb-14 relative">
          <div className="absolute -inset-1 bg-black transform translate-x-2 translate-y-2"></div>
          <p className="relative z-10 bg-white text-black font-medium text-lg md:text-xl p-6 border-3 border-black leading-relaxed">
            Join CID-Cell today and be part of a community that transforms ideas into reality.
            Collaborate, innovate, and build the future of technology.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            to="/contact" 
            className="group relative px-8 py-4 bg-black text-white font-bold uppercase tracking-wider border-3 border-black shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/projects" 
            className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-wider border-3 border-black shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            View Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
