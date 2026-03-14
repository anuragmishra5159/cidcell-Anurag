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
    <div className="pt-24 min-h-screen pb-16 relative overflow-hidden bg-bg">
      {/* Background Neo-Brutalist Elements */}
      <div className="absolute top-40 left-10 w-24 h-24 bg-highlight-yellow border-3 border-primary rounded-full shadow-neo animate-float hidden lg:block opacity-60"></div>
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-highlight-pink border-3 border-primary shadow-neo transform rotate-12 hidden lg:block opacity-60"></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-highlight-teal border-3 border-primary rounded-none shadow-neo animate-float animation-delay-200 hidden lg:block opacity-60"></div>
      <div className="absolute top-60 right-1/4 w-12 h-12 bg-highlight-blue border-3 border-primary rounded-full shadow-neo hidden lg:block opacity-60"></div>

      <div className="relative z-10">
        <SectionHeading title="Site Developers" subtitle="Meet the creators of this platform" isCenter />
      </div>
      
      <div className="container-neo mx-auto mt-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {developers.map((dev, idx) => (
            <div
              key={idx}
              className={`border-4 border-primary bg-white shadow-neo rounded-xl overflow-hidden group hover:-translate-y-2 hover:shadow-neo-lg transition-all duration-300`}
            >
              <div className={`h-32 ${dev.color} border-b-4 border-primary flex items-center justify-center relative overflow-hidden`} />

              {/* Decorative dotted pattern behind the card content */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

              <div className="px-6 pb-6 relative pt-16 bg-white">
                 <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                    <img
                        src={dev.image}
                        alt={dev.name}
                        className="w-32 h-32 rounded-full border-4 border-primary shadow-neo object-cover bg-white z-10 relative"
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + dev.name + '&background=random&color=white&size=128'; }}
                    />
                </div>
                <div className="text-center mt-2">
                  <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-primary">
                    {dev.name}
                  </h3>
                  <p className="font-bold text-accent-red uppercase tracking-wide text-sm mb-4">
                    {dev.role}
                  </p>
                  <p className="text-secondary font-medium mb-6">
                    {dev.bio}
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center border-2 border-primary bg-primary text-white rounded-lg shadow-neo hover:bg-[#2ea043] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    aria-label={`${dev.name}'s GitHub`}
                  >
                    <Github className="w-6 h-6" />
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center border-2 border-primary bg-white text-primary rounded-lg shadow-neo hover:bg-[#0a66c2] hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    aria-label={`${dev.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action at the bottom */}
        <div className="mt-20 max-w-2xl mx-auto text-center bg-white border-4 border-primary p-8 shadow-neo-lg relative">
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-highlight-pink border-2 border-primary rounded-full z-10"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-highlight-yellow border-2 border-primary z-10"></div>
          
          <h4 className="font-heading text-2xl uppercase tracking-tight mb-4">Want to Contribute?</h4>
          <p className="text-secondary font-medium mb-6">
            CID-Cell is an open community. Whether you're interested in making modifications to this site, or starting a new project, we're always looking for collaborators.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neo inline-flex items-center gap-2"
          >
            <Github className="w-5 h-5" /> View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}