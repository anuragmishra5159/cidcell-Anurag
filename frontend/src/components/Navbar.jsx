import { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Events', path: '/events' },
  { name: 'Team', path: '/team' },
  { name: 'Developers', path: '/developers' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b-3 ${scrolled
          ? 'bg-white border-primary shadow-neo'
          : 'bg-bg border-transparent'
        }`}
    >
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 border-3 border-primary bg-highlight-yellow flex items-center justify-center shadow-neo group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <span className="text-primary font-heading font-black text-xl">CID</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-primary font-heading text-2xl uppercase tracking-tighter leading-none block">
                CID-Cell
              </span>
              <span className="text-primary font-bold text-xs uppercase tracking-widest bg-highlight-teal inline-block px-1 border border-primary -mt-1 transform -rotate-2">
                CSE DEPT
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 font-bold uppercase text-sm border-2 border-transparent hover:border-primary hover:bg-highlight-blue hover:shadow-neo-sm transition-all rounded-lg ${isActive
                    ? 'bg-highlight-purple border-primary shadow-neo-sm'
                    : 'text-primary'
                  } ${link.name === 'Developers' && !isActive ? 'animate-pulse bg-highlight-pink border-primary text-black' : ''}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="ml-4 btn-neo py-2 text-sm"
            >
              Join CID
            </Link>

            {user ? (
              <Link to="/profile" className="ml-2 group">
                <img
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-primary shadow-neo-sm group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all"
                />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="ml-2 px-4 py-2 font-bold uppercase text-sm border-2 border-primary bg-highlight-yellow hover:bg-highlight-blue shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-[4px]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 border-2 border-primary bg-white shadow-neo active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full md:hidden px-4 pb-4 animate-fade-in-up bg-bg/95 backdrop-blur-sm border-b-2 border-primary shadow-neo h-screen sm:h-auto z-40">
            <div className="bg-white border-3 border-primary shadow-neo rounded-xl p-4 space-y-2 mt-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 font-bold uppercase border-2 transition-all rounded-lg ${isActive
                      ? 'bg-highlight-purple border-primary shadow-neo-sm'
                      : 'border-transparent hover:bg-highlight-blue hover:border-primary'
                    } ${link.name === 'Developers' && !isActive ? 'animate-pulse bg-highlight-pink border-primary text-black' : ''}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block text-center mt-4 w-full btn-neo justify-center"
              >
                Join CID
              </Link>

              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block text-center mt-2 w-full px-4 py-3 font-bold uppercase text-primary border-2 border-primary bg-highlight-yellow rounded-lg"
                >
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block text-center mt-2 w-full px-4 py-3 font-bold uppercase text-primary border-2 border-primary bg-highlight-yellow rounded-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
