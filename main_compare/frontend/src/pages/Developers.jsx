import { Github, Linkedin, ExternalLink } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const developers = [
  {
    name: 'Anurag Mishra',
    role: 'Full Stack Developer',
    github: 'https://github.com/anuragmishra5159',
    linkedin: 'https://www.linkedin.com/in/anuragmishra5159/',
    image: 'https://github.com/anuragmishra5159.png', 
    bio: 'Passionate full-stack developer focusing on React and modern web technologies.',
    color: 'bg-highlight-blue',
  },
  {
    name: 'Krish Dargar',
    role: 'Full Stack Developer',
    github: 'https://github.com/KD2303',
    linkedin: 'https://www.linkedin.com/in/krish-dargar-101774324/',
    image: 'https://github.com/KD2303.png',
    bio: 'Software engineer who loves solving complex problems and building scalable apps.',
    color: 'bg-highlight-teal',
  },
];

export default function Developers() {
  return (
    <div className="pt-32 min-h-screen pb-24 relative overflow-hidden bg-bg">
      {/* Background Neo-Brutalist Elements */}
      <div className="absolute top-40 left-10 w-24 h-24 bg-highlight-yellow border-4 border-primary shadow-neo hidden lg:block transform -rotate-12"></div>
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-highlight-pink border-4 border-primary shadow-neo transform rotate-12 hidden lg:block"></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-highlight-teal border-4 border-primary shadow-neo hidden lg:block transform rotate-45"></div>
      <div className="absolute top-60 right-1/4 w-20 h-20 bg-highlight-blue border-4 border-primary rounded-full shadow-neo hidden lg:block"></div>

      <div className="relative z-10 container-max mx-auto px-4">
        <SectionHeading title="Site Developers" subtitle="Meet the creators of this platform" isCenter />
      </div>
      
      <div className="container-max mx-auto mt-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {developers.map((dev, idx) => (
            <div
              key={idx}
              className={`border-4 border-primary bg-white shadow-neo group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo relative z-10`}
            >
              {/* Header Box */}
              <div className={`h-32 ${dev.color} border-b-4 border-primary flex items-center justify-center relative overflow-hidden`}>
                 <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#000_2px,transparent_2px),linear-gradient(90deg,#000_2px,transparent_2px)] bg-[size:20px_20px]"></div>
              </div>

              {/* Adjusted Content Box: increased top padding, converted to centered flex layout */}
              <div className="px-6 pb-10 relative bg-white pt-20 flex flex-col items-center text-center">
                 {/* Image wrapped in an inset to perfectly center horizontally without conflicting transforms */}
                 <div className="absolute -top-16 inset-x-0 w-full flex justify-center pointer-events-none">
                    <img
                        src={dev.image}
                        alt={dev.name}
                        className="w-32 h-32 border-4 border-primary shadow-neo object-cover bg-white z-10 relative transform -rotate-3 group-hover:rotate-0 transition-neo pointer-events-auto"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + dev.name + '&background=random&color=white&size=128&bold=true'; }}
                    />
                </div>
                
                <div className="mt-4">
                  <h3 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-wider text-primary mb-3">
                    {dev.name}
                  </h3>
                  <div className="inline-block bg-highlight-yellow border-4 border-primary px-4 py-1.5 mb-4 shadow-neo-sm transform rotate-1">
                    <p className="font-bold text-primary uppercase tracking-widest text-xs">
                      {dev.role}
                    </p>
                  </div>
                  <p className="text-primary font-bold text-lg leading-relaxed mt-2 max-w-sm mx-auto">
                    {dev.bio}
                  </p>
                </div>

                <div className="flex gap-5 mt-8 justify-center">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 flex items-center justify-center border-4 border-primary bg-black text-white shadow-neo hover:bg-[#2ea043] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo transform rotate-2 hover:rotate-0"
                    aria-label={`${dev.name}'s GitHub`}
                  >
                    <Github className="w-7 h-7" />
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 flex items-center justify-center border-4 border-primary bg-highlight-blue text-primary shadow-neo hover:bg-[#0a66c2] hover:text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo transform -rotate-2 hover:rotate-0"
                    aria-label={`${dev.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-7 h-7 stroke-[2.5]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action at the bottom */}
        <div className="mt-32 max-w-3xl mx-auto bg-highlight-green border-4 border-primary p-8 md:p-12 shadow-neo relative transform -rotate-1 hover:rotate-0 transition-neo">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-highlight-pink border-4 border-primary shadow-neo rounded-full z-10 transform translate-x-2 -translate-y-2"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-highlight-yellow border-4 border-primary shadow-neo z-10 transform rotate-12"></div>
          
          <h4 className="font-heading text-4xl md:text-5xl uppercase tracking-tighter text-primary mb-4 leading-none">Want to <br/> Contribute?</h4>
          <p className="text-primary font-bold text-lg mb-8 max-w-xl">
            CID-Cell is an open community. Whether you're interested in making modifications to this site, or starting a new project, we're always looking for collaborators.
          </p>
          <a
            href="https://github.com/anuragmishra5159/cidcell-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-primary font-heading uppercase tracking-widest text-xl px-8 py-4 border-4 border-primary shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo transform rotate-1"
          >
            <Github className="w-6 h-6" /> View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}