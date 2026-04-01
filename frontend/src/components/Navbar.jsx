import { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Check, MessageSquare, User, LogOut, ChevronDown, LayoutDashboard, Github } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard', authRequired: true },
  { 
    name: 'About', 
    isDropdown: true,
    children: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ]
  },
  { 
    name: 'Hub', 
    isDropdown: true,
    children: [
      { name: 'Projects', path: '/projects' },
      { name: 'Start Project', path: '/projects/submit', authRequired: true, studentOrMentor: true },
      { name: 'My Projects', path: '/projects/mine', authRequired: true, studentOrMentor: true },
      { name: 'Mentors', path: '/mentors' },
    ]
  },
  { name: 'Roadmap', path: '/roadmap' },
  { name: 'Events', path: '/events' },
  { 
    name: 'Team',
    isDropdown: true,
    children: [
      { name: 'Core Team', path: '/team' },
      { name: 'Developers', path: '/developers' }
    ]
  },
];

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, socket, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatUnread, setChatUnread] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    if (user) {
      axios.get(`${API}/chat/unread-counts`, authHeaders())
        .then(res => {
          const dmTotal = Object.values(res.data.dms || {}).reduce((a, b) => a + b, 0);
          const projTotal = Object.values(res.data.projects || {}).reduce((a, b) => a + b, 0);
          setChatUnread(dmTotal + projTotal);
        })
        .catch(() => {});
    } else {
      setChatUnread(0);
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      const handleNewNotif = (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
      };
      socket.on('new_notification', handleNewNotif);

      const handleNewDM = () => {
        if (!window.location.pathname.startsWith('/chat')) {
          setChatUnread(prev => prev + 1);
        }
      };
      socket.on('receive_message', handleNewDM);

      return () => {
        socket.off('new_notification', handleNewNotif);
        socket.off('receive_message', handleNewDM);
      };
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

  const [mobileExpanded, setMobileExpanded] = useState(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else { document.body.style.overflow = 'unset'; setMobileExpanded(null); }
    return () => document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 bg-transparent ${scrolled ? 'py-3' : 'py-5'}`}
      style={{ willChange: 'padding' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 z-10 relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-accent/10 to-accent-magenta/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
            <img
              src="/logo.png"
              alt="CID-Cell Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain relative z-10 drop-shadow-[0_0_4px_rgba(217,70,239,0.5)]"
            />
            <div className="hidden sm:flex flex-col justify-center relative z-10">
              <span className="text-white font-heading font-black text-xl md:text-2xl tracking-tighter leading-none block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent-magenta transition-all">
                CID-CELL
              </span>
            </div>
          </Link>

          {/* Desktop nav - Centered */}
          <div className="hidden xl:flex flex-1 justify-center items-center px-4">
            <div className="flex items-center bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-full p-1 shadow-glass">
              {navLinks.filter(link => {
                if (link.isDropdown) return true;
                if (link.adminRequired && user?.userType?.toLowerCase() !== 'admin') return false;
                if (link.mentorRequired && user?.userType !== 'mentor') return false;
                if (link.facultyRequired && user?.userType !== 'faculty') return false;
                if (link.studentRequired && user?.userType !== 'student') return false;
                if (link.hideForMentor && user?.userType === 'mentor') return false;
                if (link.studentOrMentor && (!user || (user.userType !== 'student' && user.userType !== 'mentor'))) return false;
                if (link.authRequired && !user) return false;
                return true;
              }).map((link) => {
                if (link.isDropdown) {
                  const visibleChildren = link.children.filter(child => {
                    if (child.adminRequired && user?.userType?.toLowerCase() !== 'admin') return false;
                    if (child.mentorRequired && user?.userType !== 'mentor') return false;
                    if (child.facultyRequired && user?.userType !== 'faculty') return false;
                    if (child.studentRequired && user?.userType !== 'student') return false;
                    if (child.hideForMentor && user?.userType === 'mentor') return false;
                    if (child.studentOrMentor && (!user || (user.userType !== 'student' && user.userType !== 'mentor'))) return false;
                    if (child.authRequired && !user) return false;
                    return true;
                  });
                  if (visibleChildren.length === 0) return null;
                  return (
                    <div key={link.name} className="relative group/navdrop px-1">
                      <button className="px-5 py-2 font-medium text-sm transition-all rounded-full text-secondary hover:text-white hover:bg-white/5 flex items-center gap-1">
                        {link.name} <ChevronDown size={14} className="group-hover/navdrop:-rotate-180 transition-transform opacity-50" />
                      </button>
                      <div className="absolute left-1/2 -translate-x-1/2 top-[120%] w-48 glass-panel opacity-0 invisible group-hover/navdrop:opacity-100 group-hover/navdrop:visible z-[9999] flex flex-col p-2 overflow-hidden transform group-hover/navdrop:translate-y-0 translate-y-2 transition-all duration-300">
                        {visibleChildren.map(child => (
                          <NavLink
                            key={child.name}
                            to={child.path}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                                isActive ? 'bg-gradient-to-r from-accent/20 to-accent-magenta/20 text-white shadow-glow-purple border border-accent/30' : 'text-secondary hover:bg-white/5 hover:text-white'
                              }`
                            }
                          >
                            {child.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                <NavLink
                  key={link.name}
                  to={link.name === 'Dashboard' && user ? (
                      user.userType?.toLowerCase() === 'admin' ? '/admin/dashboard' :
                      user.userType === 'faculty' ? '/faculty/dashboard' :
                      user.userType === 'mentor' ? '/mentor/dashboard' :
                      '/dashboard'
                  ) : link.path}
                  className={({ isActive }) =>
                    `mx-1 px-5 py-2 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-accent/20 to-accent-magenta/20 text-white shadow-glow-purple border border-accent/30 scale-105'
                      : 'text-secondary hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )})}
            </div>
          </div>

          {/* Actions - Right side */}
          <div className="hidden md:flex items-center gap-3 pl-2 z-10 shrink-0">
            <a 
              href="https://github.com/CID-CELL" 
              target="_blank" 
              className="p-2.5 rounded-full border border-border text-secondary hover:text-white hover:bg-white/5 hover:border-accent transition-all duration-300"
              title="GitHub Organization"
            >
              <Github size={18} />
            </a>

            {user ? (
              <div className="flex items-center gap-2 pr-1">
                <Link 
                  to="/chat" 
                  onClick={() => setChatUnread(0)}
                  className="relative p-2.5 rounded-full border border-border text-secondary hover:text-white hover:bg-white/5 hover:border-accent transition-all duration-300"
                  title="Messages"
                >
                  <MessageSquare size={18} />
                  {chatUnread > 0 && 
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-glow-purple">
                      {chatUnread > 9 ? '9+' : chatUnread}
                    </span>
                  }
                </Link>

                <div className="relative" ref={notificationDropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)} 
                    className={`relative p-2.5 rounded-full border border-border transition-all duration-300 ${showDropdown ? 'bg-white/10 text-white border-accent' : 'text-secondary hover:text-white hover:bg-white/5'}`}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && 
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-glow-purple">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    }
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-4 w-80 glass-panel overflow-hidden z-[9999] animate-fade-in-up">
                      <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
                        <span className="font-medium text-sm text-white flex items-center gap-2"><Bell size={14} className="text-accent" /> Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-xs text-secondary hover:text-white transition-colors">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar-dark p-2">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-secondary">You have no new notifications</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n._id} className={`p-3 rounded-lg mb-1 transition-colors ${!n.isRead ? 'bg-accent/10 border border-accent/20' : 'hover:bg-white/5'}`}>
                              <p className="text-sm text-gray-300 mb-2">{n.message}</p>
                              <div className="flex justify-between items-center">
                                {n.link && (
                                  <button onClick={() => { setShowDropdown(false); if (!n.isRead) markAsRead(n._id); navigate(n.link); }} className="text-xs text-accent hover:text-white transition-colors">View details</button>
                                )}
                                {!n.isRead ? (
                                  <button onClick={(e) => markAsRead(n._id, e)} className="text-xs text-secondary hover:text-white flex items-center gap-1 transition-colors"><Check size={12} /> Mark read</button>
                                ) : (
                                  <span className="text-xs text-zinc-600">Read</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group pl-1" onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowDropdown(false); }} ref={profileDropdownRef}>
                  <div className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border border-border cursor-pointer transition-all duration-300 ${showProfileDropdown ? 'bg-white/10 border-accent shadow-glow-purple' : 'bg-surface hover:bg-white/5'}`}>
                    <div className="relative">
                      <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}`} alt="Profile" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#050505] rounded-full"></div>
                    </div>
                    <span className="font-medium text-sm text-white truncate max-w-[80px]">
                      {user.username.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-secondary transition-transform ${showProfileDropdown ? 'rotate-180 text-white' : ''}`} />
                  </div>

                  {showProfileDropdown && (
                    <div className="absolute right-0 top-full mt-3 w-56 glass-panel overflow-hidden z-[9999] animate-fade-in-up p-2" onClick={e => e.stopPropagation()}>
                       <div className="px-3 py-2 border-b border-border/50 mb-2">
                         <p className="text-sm text-white truncate font-medium">{user.username}</p>
                         <p className="text-xs text-secondary truncate">{user.email}</p>
                       </div>
                       <Link to={user?.userType?.toLowerCase() === 'admin' ? '/admin/dashboard' : user?.userType === 'faculty' ? '/faculty/dashboard' : user?.userType === 'mentor' ? '/mentor/dashboard' : '/dashboard'} onClick={() => setShowProfileDropdown(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-secondary hover:text-white transition-colors text-sm font-medium">
                         <LayoutDashboard size={16} /> Dashboard
                       </Link>
                       <Link to="/profile" onClick={() => setShowProfileDropdown(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-secondary hover:text-white transition-colors text-sm font-medium">
                         <User size={16} /> Profile
                       </Link>
                       <button onClick={() => { setShowProfileDropdown(false); logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                         <LogOut size={16} /> Logout
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/auth" className="btn-neo ml-2">Login</Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full border border-border bg-surface text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full md:hidden px-4 pb-24 overflow-y-auto animate-fade-in-up bg-bg/95 backdrop-blur-3xl border-b border-border shadow-glass h-[calc(100vh-64px)] z-40">
            <div className="glass-panel p-4 mt-4 space-y-1">
              {navLinks.filter(link => {
                if (link.isDropdown) return true;
                if (link.adminRequired && user?.userType?.toLowerCase() !== 'admin') return false;
                if (link.mentorRequired && user?.userType !== 'mentor') return false;
                if (link.facultyRequired && user?.userType !== 'faculty') return false;
                if (link.studentRequired && user?.userType !== 'student') return false;
                if (link.hideForMentor && user?.userType === 'mentor') return false;
                if (link.studentOrMentor && (!user || (user.userType !== 'student' && user.userType !== 'mentor'))) return false;
                if (link.authRequired && !user) return false;
                return true;
              }).map((link) => {
                if (link.isDropdown) {
                  const visibleChildren = link.children.filter(child => {
                    if (child.adminRequired && user?.userType?.toLowerCase() !== 'admin') return false;
                    if (child.mentorRequired && user?.userType !== 'mentor') return false;
                    if (child.facultyRequired && user?.userType !== 'faculty') return false;
                    if (child.studentRequired && user?.userType !== 'student') return false;
                    if (child.hideForMentor && user?.userType === 'mentor') return false;
                    if (child.studentOrMentor && (!user || (user.userType !== 'student' && user.userType !== 'mentor'))) return false;
                    if (child.authRequired && !user) return false;
                    return true;
                  });
                  if (visibleChildren.length === 0) return null;
                  
                  const isExpanded = mobileExpanded === link.name;

                  return (
                    <div key={link.name} className={`space-y-1 transition-all rounded-xl p-1 ${isExpanded ? 'bg-white/5 border border-white/10' : 'border border-transparent'}`}>
                       <button 
                         onClick={() => setMobileExpanded(isExpanded ? null : link.name)}
                         className="w-full px-4 py-3 font-medium text-white text-sm flex items-center justify-between rounded-lg hover:bg-white/5 transition-colors"
                       >
                          <span>{link.name}</span>
                          <ChevronDown size={16} className={`text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                       </button>
                       {isExpanded && (
                         <div className="space-y-1 px-2 pb-2">
                           {visibleChildren.map(child => (
                               <NavLink
                                 key={child.name}
                                 to={child.path}
                                 onClick={() => setIsOpen(false)}
                                 className={({ isActive }) =>
                                   `block px-4 py-2.5 rounded-lg transition-all text-sm ${isActive
                                     ? 'bg-accent/20 text-accent font-medium'
                                     : 'text-secondary hover:bg-white/5 hover:text-white'
                                   }`
                                 }
                               >
                                 {child.name}
                               </NavLink>
                           ))}
                         </div>
                       )}
                    </div>
                  );
                }
                return (
                <NavLink
                  key={link.name}
                  to={link.name === 'Dashboard' && user ? (
                      user.userType?.toLowerCase() === 'admin' ? '/admin/dashboard' :
                      user.userType === 'faculty' ? '/faculty/dashboard' :
                      user.userType === 'mentor' ? '/mentor/dashboard' :
                      '/dashboard'
                  ) : link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-5 py-3 rounded-xl transition-all font-bold text-xs tracking-widest uppercase ${isActive
                      ? 'bg-gradient-to-r from-accent/20 to-accent-magenta/20 text-white shadow-glow-purple'
                      : 'text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )})}

              <div className="pt-4 mt-2 border-t border-border">
                {user ? (
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="btn-neo w-full text-center">My Profile</Link>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)} className="btn-neo w-full text-center">Login</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
