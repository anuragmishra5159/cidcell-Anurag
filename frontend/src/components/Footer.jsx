import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg text-white border-t border-border relative overflow-hidden mt-20">
      {/* Decorative Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 shadow-glow-purple"></div>

      {/* Decorative Orbs */}
      <div className="glowing-orb w-[500px] h-[500px] bg-accent/10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex gap-4 mb-6 shrink-0 justify-center lg:justify-start">
              <div className="w-14 h-14 relative group">
                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <img src="/logo.png" alt="CID-Cell Logo" className="w-full h-full object-contain relative z-10 drop-shadow-md" />
              </div>
              <div className="w-14 h-14 relative group">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <img src="/sdc.png" alt="SDC Club Logo" className="w-full h-full object-contain relative z-10 drop-shadow-md" />
              </div>
            </div>
            <div className="mb-6">
              <span className="font-heading font-semibold text-2xl block text-white tracking-wide">CID-Cell</span>
              <span className="text-accent text-xs uppercase font-medium tracking-widest mt-1 block">CSE Dept · SDC Club</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 text-secondary max-w-sm">
              Bridging academic learning with industry requirements through hands-on projects, immersive technology, and expert mentorship.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              {[
                { icon: Github, href: 'https://github.com/CID-CELL' },
                { icon: Linkedin, href: 'https://www.linkedin.com/company/cidcellmits/' },
                { icon: Instagram, href: 'https://www.instagram.com/cidc_mitsgwalior' },
                { icon: Mail, href: 'mailto:cidc@college.edu' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-secondary hover:text-white hover:border-accent hover:shadow-glow-purple transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h4 className="font-heading font-medium text-lg mb-6 text-white tracking-wide">Navigation</h4>
            <ul className="space-y-3 text-sm text-secondary">
              {['Home', 'About', 'Projects', 'Events', 'Team', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="hover:text-accent transition-colors duration-300 flex items-center lg:justify-start justify-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow-purple"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="text-center lg:text-left">
            <h4 className="font-heading font-medium text-lg mb-6 text-white tracking-wide">Resources</h4>
            <ul className="space-y-3 text-sm text-secondary">
              {[
                { name: 'Start a Project', path: '/projects/submit' },
                { name: 'My Projects', path: '/projects/mine' },
                { name: 'Mentorship Hub', path: '/mentors' },
                { name: 'Development Roadmap', path: '/roadmap' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-accent transition-colors duration-300 flex items-center lg:justify-start justify-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow-purple"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center lg:text-left">
            <h4 className="font-heading font-medium text-lg mb-6 text-white tracking-wide">Contact Us</h4>
            <ul className="space-y-4 text-sm text-secondary inline-block text-left">
              <li className="flex items-start gap-3">
                <MapPin className="text-accent shrink-0 mt-0.5" size={18} />
                <span>
                  CSE Dept, MITS Gwalior <br />
                  Madhya Pradesh, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-accent shrink-0" size={18} />
                <a href="mailto:cidcellmits@gmail.com" className="hover:text-white transition-colors">cidcellmits@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} The Intelligent Sphere | CID-Cell. All rights reserved.
          </p>
          <div className="flex gap-6 tracking-wide">
            <Link to="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
