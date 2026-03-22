import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard', authRequired: true },
  { name: 'Admin', path: '/admin/dashboard', authRequired: true, adminRequired: true },
  { name: 'Mentor', path: '/mentor/dashboard', authRequired: true, mentorRequired: true },
  { name: 'Faculty Portal', path: '/faculty/dashboard', authRequired: true, facultyRequired: true },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Submit Project', path: '/projects/submit', authRequired: true, studentOrMentor: true },
  { name: 'My Projects', path: '/projects/mine', authRequired: true, studentOrMentor: true },
  { name: 'Mentors', path: '/mentors' },
  { name: 'Roadmap', path: '/roadmap' },
  { name: 'Events', path: '/events' },
  { name: 'Team', path: '/team' },
  { name: 'Developers', path: '/developers' },
];

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, socket } = useContext(AuthContext);
  const navigate = useNavigate();

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    if (user) {
      axios.get(`${API}/notifications`, authHeaders())
        .then(res => {
          setNotifications(res.data);
          setUnreadCount(res.data.filter(n => !n.isRead).length);
        })
        .catch(err => console.error("Error fetching notifications:", err));
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Listen for real-time notifications
  useEffect(() => {
    if (socket) {
      const handleNewNotif = (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
      };
      socket.on('new_notification', handleNewNotif);
      return () => socket.off('new_notification', handleNewNotif);
    }
  }, [socket]);

  const markAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await axios.patch(`${API}/notifications/${id}/read`, {}, authHeaders());
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async (e) => {
    if (e) e.stopPropagation();
    try {
      await axios.patch(`${API}/notifications/read-all`, {}, authHeaders());
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-white border-b-4 border-primary shadow-sm py-1'
        : 'bg-transparent border-b-4 border-transparent shadow-none py-3'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 z-10">
            <img
              src="/logo.png"
              alt="CID-Cell Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain shadow-neo group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all"
            />
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-primary font-heading text-xl md:text-2xl uppercase tracking-widest leading-none block">
                CID-Cell
              </span>
              <span className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest bg-highlight-teal inline-block px-1 border border-primary mt-0.5 transform -rotate-1 self-start">
                CSE DEPT
              </span>
            </div>
          </Link>

          {/* Desktop nav - Centered */}
          <div className="hidden xl:flex flex-1 justify-center items-center px-4">
            <div className="flex items-center bg-white border-4 border-primary shadow-neo px-1 py-1">
              {navLinks.filter(link => {
                if (link.adminRequired && user?.userType?.toLowerCase() !== 'admin') return false;
                if (link.mentorRequired && user?.userType !== 'mentor') return false;
                if (link.facultyRequired && user?.userType !== 'faculty') return false;
                if (link.studentRequired && user?.userType !== 'student') return false;
                if (link.hideForMentor && user?.userType === 'mentor') return false;
                if (link.studentOrMentor && (!user || (user.userType !== 'student' && user.userType !== 'mentor'))) return false;
                if (link.authRequired && !user) return false;
                return true;
              }).map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 lg:px-4 py-2 font-bold uppercase text-[12px] lg:text-sm transition-all border-2 ${isActive
                      ? 'bg-highlight-purple border-primary shadow-neo-sm -translate-y-[2px]'
                      : 'border-transparent text-primary hover:bg-highlight-yellow hover:border-primary hover:shadow-neo-sm hover:-translate-y-[2px]'
                    } ${link.name === 'Developers' && !isActive ? 'animate-pulse bg-highlight-pink border-primary text-black shadow-neo-sm' : ''}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Actions - Right side */}
          <div className="hidden md:flex items-center gap-2 pl-2 z-10 shrink-0">
            <Link
              to="/contact"
              className="btn-neo py-2 px-4 text-xs lg:text-sm whitespace-nowrap bg-highlight-orange"
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)} 
                    className="relative p-2 text-primary hover:text-black transition-colors rounded-full hover:bg-highlight-yellow active:scale-95"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && 
                      <span className="absolute top-1 right-1 w-4 h-4 bg-highlight-pink text-primary text-[9px] font-black flex items-center justify-center rounded-full border-2 border-primary">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    }
                  </button>

                  {/* Dropdown menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-4 w-80 bg-white border-3 border-primary shadow-neo rounded-xl overflow-hidden z-[9999]">
                      <div className="p-3 border-b-3 border-primary bg-highlight-blue flex justify-between items-center">
                        <span className="font-black text-xs text-primary uppercase tracking-widest">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-[9px] font-black uppercase text-primary/70 hover:text-primary transition-colors">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">You have no notifications</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n._id} className={`p-4 border-b-2 border-slate-100 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                              <p className="text-xs text-slate-700 mb-2 font-medium">{n.message}</p>
                              <div className="flex justify-between items-center">
                                {n.link && (
                                  <button onClick={() => { setShowDropdown(false); if (!n.isRead) markAsRead(n._id); navigate(n.link); }} className="text-[9px] font-black text-highlight-purple hover:underline uppercase tracking-widest">View details</button>
                                )}
                                {!n.isRead ? (
                                  <button onClick={(e) => markAsRead(n._id, e)} className="text-[10px] font-black text-slate-300 hover:text-highlight-green uppercase flex items-center gap-1 transition-colors"><Check size={12} strokeWidth={3} /> Mark read</button>
                                ) : (
                                  <span className="text-[9px] font-bold text-slate-300 uppercase">Read</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Picture */}
                <Link to="/profile" className="group relative">
                <div className="relative">
                  <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}`}
                    alt="Profile"
                    className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-primary shadow-neo-sm group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </Link>
             </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 font-bold uppercase text-xs lg:text-sm border-2 border-primary bg-white hover:bg-highlight-blue shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all rounded-lg"
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
              {navLinks.filter(link => {
                if (link.adminRequired && user?.userType?.toLowerCase() !== 'admin') return false;
                if (link.mentorRequired && user?.userType !== 'mentor') return false;
                if (link.facultyRequired && user?.userType !== 'faculty') return false;
                if (link.studentRequired && user?.userType !== 'student') return false;
                if (link.hideForMentor && user?.userType === 'mentor') return false;
                if (link.studentOrMentor && (!user || (user.userType !== 'student' && user.userType !== 'mentor'))) return false;
                if (link.authRequired && !user) return false;
                return true;
              }).map((link) => (
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
                className="block text-center mt-4 w-full btn-neo justify-center bg-highlight-orange"
              >
                Contact
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
