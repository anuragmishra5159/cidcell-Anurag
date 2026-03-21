import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-3 border-black relative overflow-hidden">
      {/* Decorative Strip */}
      <div 
        className="h-4 w-full bg-highlight-yellow opacity-100 mb-12"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)' }}
      >
      </div>

      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-6 group">
              <div className="w-12 h-12 bg-white border-3 border-white text-black flex items-center justify-center shadow-[4px_4px_0px_#FFF] group-hover:-rotate-6 transition-transform">
                <span className="font-heading font-black text-lg">CID</span>
              </div>
              <div>
                <span className="font-heading font-black text-2xl block leading-none tracking-tight group-hover:text-highlight-yellow transition-colors">CID-Cell</span>
                <span className="text-highlight-yellow text-xs uppercase font-bold tracking-widest bg-white/10 px-1">CSE Dept</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-8 font-medium text-gray-300 border-l-2 border-highlight-purple pl-4">
              Collaborative Innovation & Development Cell — bridging
              academic learning with industry requirements through hands-on
              projects, mentorship, and innovation.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Github, href: 'https://github.com/KD2303/cidcell' },
                { icon: Linkedin, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Mail, href: 'mailto:cidc@college.edu' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 bg-white border-2 border-white text-black flex items-center justify-center hover:bg-highlight-yellow hover:-translate-y-1 transition-all font-bold shadow-[2px_2px_0px_rgba(255,255,255,0.5)] hover:shadow-none"
                >
                  <Icon size={18} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-black text-xl mb-6 uppercase text-highlight-blue inline-block border-b-2 border-highlight-blue pb-1">Quick Links</h4>
            <ul className="space-y-3 text-sm font-medium">
              {['Home', 'About', 'Projects', 'Events', 'Team', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="hover:text-highlight-yellow transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-highlight-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-black text-xl mb-6 uppercase text-highlight-green inline-block border-b-2 border-highlight-green pb-1">Resources</h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { name: 'Documentation', path: '/docs' },
                { name: 'Design System', path: '/design' },
                { name: 'Start a Project', path: '/projects/submit' },
                { name: 'My Projects', path: '/projects/mine' },
                { name: 'Mentorship', path: '/mentors' },
                { name: 'Roadmap', path: '/roadmap' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-highlight-green transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-highlight-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-black text-xl mb-6 uppercase text-highlight-pink inline-block border-b-2 border-highlight-pink pb-1">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="text-highlight-pink shrink-0 mt-0.5" size={18} />
                <span className="text-gray-300">
                  Room 304, CSE Block, <br />
                  College of Engineering, <br />
                  Tech City, State - 500001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-highlight-pink shrink-0" size={18} />
                <span className="text-gray-300">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-highlight-pink shrink-0" size={18} />
                <span className="text-gray-300">cidc@college.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} CID-Cell CSE Dept. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500 font-bold uppercase tracking-wider">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
