import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const SLIDES = [
  '/slideshow/1.webp',
  '/slideshow/3.webp',
  '/slideshow/5.webp',
  '/slideshow/6.webp',
  '/slideshow/7.webp',
  '/slideshow/2.webp',
  '/slideshow/4.png',
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
  };

  const resetAutoPlay = () => {
    clearInterval(intervalRef.current);
    startAutoPlay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    resetAutoPlay();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    resetAutoPlay();
  };

  useEffect(() => {
    setIsVisible(true);
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center pt-24 md:pt-28 lg:pt-32 pb-12 lg:pb-16 overflow-hidden bg-bg text-primary">
      {/* Abstract Background Shapes */}
      <div className={`absolute top-[25%] -right-8 w-28 h-28 md:w-36 md:h-36 bg-highlight-yellow border-4 border-primary shadow-neo hidden lg:block transition-all duration-1000 ${isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-12 opacity-0'}`}></div>
      <div className={`absolute bottom-8 left-5 w-24 h-24 sm:w-28 sm:h-28 bg-[#c0b4f8] border-4 border-primary shadow-[8px_8px_0_0_#1a1a1a] hidden md:block transition-all duration-1000 delay-200 ${isVisible ? 'transform translate-y-0 -rotate-12 opacity-100' : 'transform translate-y-12 -rotate-12 opacity-0'}`}></div>

      <div className={`w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12 xl:gap-16 pt-0 lg:pt-4">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10 relative">
            <div className="relative inline-block mb-4 md:mb-5">
              <div className="absolute top-2 left-2 md:top-3 md:left-3 w-full h-full bg-highlight-teal border-3 border-primary"></div>
              <div className="relative px-4 py-2 md:px-5 md:py-2 bg-white border-3 border-primary transform -rotate-2">
                <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                  Collaborative Innovation & Development
                </span>
              </div>
            </div>
            
            <h1 className="font-heading text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[4rem] xl:text-[5.5rem] mb-4 md:mb-5 uppercase tracking-tighter leading-[0.85] text-black">
              <span className="block mb-1 md:mb-2">Bridging</span>
              <span className="bg-highlight-yellow px-3 py-0 md:px-4 md:py-1 border-3 border-primary shadow-[6px_6px_0_0_#1a1a1a] transform -skew-x-6 inline-block mb-1 md:mb-2 mt-1 md:mt-2 text-black">ACADEMICS</span> <br />
              <span className="block mt-2 md:mt-3 text-black">WITH INDUSTRY</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg font-bold mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed border-l-4 border-primary pl-4 text-black">
              A structured platform for hands-on learning, real-world projects, and innovation-driven growth in the Department of CSE.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/contact" className="bg-highlight-yellow text-primary font-heading font-black uppercase tracking-wider text-sm md:text-base py-3 px-6 md:px-8 border-3 border-primary shadow-[4px_4px_0_0_#1a1a1a] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center">
                JOIN CID NOW <span className="font-sans font-normal mx-3 opacity-50">|</span> <ArrowRight size={20} className="ml-1" strokeWidth={3} />
              </Link>
              <Link to="/projects" className="bg-white text-primary font-heading font-black uppercase tracking-wider text-sm md:text-base py-3 px-6 md:px-8 border-3 border-primary shadow-[4px_4px_0_0_#1a1a1a] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center">
                EXPLORE PROJECTS
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-8 md:mt-10 flex items-center justify-center lg:justify-start gap-6 md:gap-8">
              {[
                { count: '50+', label: 'Projects', color: 'bg-highlight-pink' },
                { count: '20+', label: 'Events', color: 'bg-highlight-yellow' },
                { count: '100+', label: 'Members', color: 'bg-highlight-teal' },
              ].map((stat) => (
                <div key={stat.label} className="text-center flex flex-col items-center">
                  <span className="block font-heading text-4xl lg:text-5xl font-black mb-1 text-black hover:scale-110 transition-transform cursor-default">{stat.count}</span>
                  <span className={`${stat.color} px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-black border-2 border-primary shadow-[2px_2px_0_0_#1a1a1a] uppercase block tracking-wider transform -skew-x-3`}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual/Image */}
          <div className="flex-[1.2] relative w-full max-w-xl lg:max-w-none z-10 hidden md:block">
            {/* Background Offset Shadow */}
            <div className="absolute top-4 -right-4 md:top-6 md:-right-6 w-full h-full bg-[#1a1a1a] -z-10"></div>
            
            {/* Main Carousel Container */}
            <div className="relative bg-white border-4 border-primary p-3 md:p-4 transform rotate-2 hover:rotate-1 transition-transform duration-500">
              <div className="relative overflow-hidden aspect-[16/10] bg-gray-100 border-[3px] border-primary">
                {/* Slides */}
                {SLIDES.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Slide ${i + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  />
                ))}

                {/* Prev Button */}
                <button
                  onClick={(e) => { e.preventDefault(); prevSlide(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-40 bg-white border-2 border-primary rounded-full shadow-[2px_2px_0_0_#1a1a1a] p-2 hover:bg-highlight-yellow transition-colors duration-500 ease-in-out cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Next Button */}
                <button
                  onClick={(e) => { e.preventDefault(); nextSlide(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-40 bg-white border-2 border-primary rounded-full shadow-[2px_2px_0_0_#1a1a1a] p-2 hover:bg-highlight-yellow transition-colors duration-500 ease-in-out cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentSlide(i); resetAutoPlay(); }}
                      className={`h-2 border border-primary transition-all ${i === currentSlide ? 'bg-highlight-yellow w-5' : 'bg-white w-2'}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Background decoration behind image */}
            <div className="absolute -z-10 top-6 -right-4 w-full h-full bg-primary hidden"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
