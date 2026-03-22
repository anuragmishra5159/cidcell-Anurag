import React, { useState, useEffect, useContext, useRef } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
    Menu,
    X,
    LogOut,
    Users,
    Upload,
    Calendar,
    TrendingUp,
    Bell,
    LayoutDashboard,
    UserCheck,
    UserX,
    GraduationCap,
    Home,
    ChevronRight,
    Briefcase,
    Handshake,
    FileText,
    Trash2,
    Pencil,
    UserCog,
    Mail,
    ChevronDown,
    Globe,
    Info,
    ShieldCheck,
    MessageCircle,
    MessageSquare,
    Activity,
    Shield,
    Folder
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

const AdminLayout = () => {
    const isDarkMode = false; 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useContext(AuthContext);

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const [showNotificationInput, setShowNotificationInput] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [editNotificationId, setEditNotificationId] = useState(null);
    const [isRightNavOpen, setIsRightNavOpen] = useState(false);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

    // Navigation Dropdown States
    const [showUsersDropdown, setShowUsersDropdown] = useState(false);
    const [showEventsDropdown, setShowEventsDropdown] = useState(false);
    const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
    const [showTeamDropdown, setShowTeamDropdown] = useState(false);

    // Refs and timeouts for dropdowns
    const usersDropdownRef = useRef(null);
    const eventsDropdownRef = useRef(null);
    const projectsDropdownRef = useRef(null);
    const teamDropdownRef = useRef(null);
    const dropdownTimeouts = useRef({});

    const handleMouseEnter = (category) => {
        if (dropdownTimeouts.current[category]) {
            clearTimeout(dropdownTimeouts.current[category]);
            delete dropdownTimeouts.current[category];
        }
        if (category === "users") setShowUsersDropdown(true);
        if (category === "events") setShowEventsDropdown(true);
        if (category === "projects") setShowProjectsDropdown(true);
        if (category === "team") setShowTeamDropdown(true);
    };

    const handleMouseLeave = (category) => {
        dropdownTimeouts.current[category] = setTimeout(() => {
            if (category === "users") setShowUsersDropdown(false);
            if (category === "events") setShowEventsDropdown(false);
            if (category === "projects") setShowProjectsDropdown(false);
            if (category === "team") setShowTeamDropdown(false);
        }, 300); // 300ms delay to prevent flickering
    };

    // Navigation options
    const usersOptions = [
        { label: "All Users", path: "/admin/users" },
    ];

    const eventsOptions = [
        { label: "All Events", path: "/admin/events" },
    ];

    const projectsOptions = [
        { label: "All Projects", path: "/admin/projects" },
    ];

    const teamOptions = [
        { label: "Team Members", path: "/admin/members" },
    ];

    const handleDropdownItemClick = (path) => {
        navigate(path);
        setShowUsersDropdown(false);
        setShowEventsDropdown(false);
        setShowProjectsDropdown(false);
        setShowTeamDropdown(false);
        setIsRightNavOpen(false);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (usersDropdownRef.current && !usersDropdownRef.current.contains(event.target)) setShowUsersDropdown(false);
            if (eventsDropdownRef.current && !eventsDropdownRef.current.contains(event.target)) setShowEventsDropdown(false);
            if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(event.target)) setShowProjectsDropdown(false);
            if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target)) setShowTeamDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userType = user?.userType || "Admin";

    const fetchNotifications = async () => {
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSendNotification = async () => {
        if (!notificationMessage.trim()) return;
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setNotificationMessage("");
            setShowNotificationInput(false);
        }, 500);
    };

    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this notification?")) return;
    };

    const startEditNotification = (notif, e) => {
        e.stopPropagation();
        setNotificationMessage(notif.message);
        setEditNotificationId(notif.id);
        setShowNotificationInput(true);
    };

    const handleCancelInput = () => {
        setShowNotificationInput(false);
        setNotificationMessage("");
        setEditNotificationId(null);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobile && isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobile, isSidebarOpen]);

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { id: "users", label: "User Management", icon: Users, path: "/admin/users" },
        { id: "projects", label: "Projects", icon: Folder, path: "/admin/projects" },
        { id: "events", label: "Events", icon: Calendar, path: "/admin/events" },
        { id: "members", label: "Team Management", icon: Shield, path: "/admin/members" },
    ];

    return (
        <div className="admin-panel min-h-screen flex flex-col font-sans transition-colors duration-300 bg-bg">
            {/* Header */}
            <header className="h-20 border-b-4 border-primary fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-8 bg-white overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-4 flex-none">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 border-2 border-primary rounded-lg transition-all flex items-center justify-center w-10 h-10 text-primary hover:bg-highlight-yellow shadow-neo-mini"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-black text-primary uppercase tracking-widest leading-none">CID CELL</h1>
                            <div className="inline-block bg-highlight-purple border border-primary px-1 transform -rotate-1 mt-0.5">
                                <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Admin Panel</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                    <Link
                        to="/"
                        className="px-4 py-2 border-2 border-transparent rounded-xl text-xs font-black uppercase transition-all text-primary hover:bg-highlight-blue hover:border-primary hover:shadow-neo-mini"
                    >
                        Home
                    </Link>

                    <div className="relative" ref={usersDropdownRef} onMouseEnter={() => handleMouseEnter("users")} onMouseLeave={() => handleMouseLeave("users")}>
                        <button className={`flex items-center gap-1 px-4 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all ${showUsersDropdown ? "bg-highlight-teal border-primary shadow-neo-mini" : "border-transparent text-primary hover:bg-highlight-yellow hover:border-primary hover:shadow-neo-mini"}`}>
                            Users <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showUsersDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showUsersDropdown && (
                            <div className="absolute top-full left-0 w-52 bg-white border-3 border-primary shadow-neo rounded-xl overflow-hidden z-[60] mt-2">
                                <div className="py-1">
                                    {usersOptions.map((opt, i) => (
                                        <button key={i} onClick={() => handleDropdownItemClick(opt.path)} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase transition-colors text-primary border-b-2 border-slate-100 last:border-0 hover:bg-highlight-teal">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={eventsDropdownRef} onMouseEnter={() => handleMouseEnter("events")} onMouseLeave={() => handleMouseLeave("events")}>
                        <button className={`flex items-center gap-1 px-4 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all ${showEventsDropdown ? "bg-highlight-yellow border-primary shadow-neo-mini" : "border-transparent text-primary hover:bg-highlight-yellow hover:border-primary hover:shadow-neo-mini"}`}>
                            Events <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showEventsDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showEventsDropdown && (
                            <div className="absolute top-full left-0 w-52 bg-white border-3 border-primary shadow-neo rounded-xl overflow-hidden z-[60] mt-2">
                                <div className="py-1">
                                    {eventsOptions.map((opt, i) => (
                                        <button key={i} onClick={() => handleDropdownItemClick(opt.path)} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase transition-colors text-primary border-b-2 border-slate-100 last:border-0 hover:bg-highlight-yellow">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={projectsDropdownRef} onMouseEnter={() => handleMouseEnter("projects")} onMouseLeave={() => handleMouseLeave("projects")}>
                        <button className={`flex items-center gap-1 px-4 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all ${showProjectsDropdown ? "bg-highlight-blue border-primary shadow-neo-mini" : "border-transparent text-primary hover:bg-highlight-yellow hover:border-primary hover:shadow-neo-mini"}`}>
                            Projects <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showProjectsDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showProjectsDropdown && (
                            <div className="absolute top-full left-0 w-52 bg-white border-3 border-primary shadow-neo rounded-xl overflow-hidden z-[60] mt-2">
                                <div className="py-1">
                                    {projectsOptions.map((opt, i) => (
                                        <button key={i} onClick={() => handleDropdownItemClick(opt.path)} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase transition-colors text-primary border-b-2 border-slate-100 last:border-0 hover:bg-highlight-blue">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={teamDropdownRef} onMouseEnter={() => handleMouseEnter("team")} onMouseLeave={() => handleMouseLeave("team")}>
                        <button className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${showTeamDropdown ? "bg-slate-100 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"}`}>
                            Team <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showTeamDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showTeamDropdown && (
                            <div className="absolute top-full left-0 w-52 rounded-xl shadow-xl border overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200 mt-1 bg-white border-slate-200">
                                <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent" />
                                <div className="py-1">
                                    {teamOptions.map((opt, i) => (
                                        <button key={i} onClick={() => handleDropdownItemClick(opt.path)} className="w-full text-left px-4 py-2.5 text-sm transition-colors text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => setIsRightNavOpen(!isRightNavOpen)}
                        className="lg:hidden p-2 rounded-lg transition-all flex items-center justify-center w-10 h-10 text-slate-600 hover:bg-slate-100"
                        title="Main Site Navigation"
                    >
                        {isRightNavOpen ? <X className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                    </button>

                    <button
                        onClick={() => {}}
                        className="p-2 rounded-lg transition text-slate-600 hover:bg-slate-100"
                        title="Messages"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-lg transition relative text-slate-600 hover:bg-slate-100"
                        >
                            <Bell className="w-5 h-5" />
                        </button>

                        {showNotifications && (
                            <div className="fixed right-2 left-2 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-4 w-auto sm:w-96 bg-white border-4 border-primary shadow-neo animate-in slide-in-from-top-4 fade-in-0 z-50 overflow-hidden rounded-3xl">
                                <div className="p-5 border-b-4 border-primary flex justify-between items-center bg-highlight-blue">
                                    <h3 className="font-black text-xs text-primary uppercase tracking-widest">
                                        Neural Alerts
                                    </h3>
                                    <button
                                        onClick={() => showNotificationInput ? handleCancelInput() : setShowNotificationInput(true)}
                                        className="text-[10px] px-3 py-1.5 border-2 border-primary rounded-xl font-black uppercase transition-all bg-white hover:bg-highlight-yellow shadow-neo-mini"
                                    >
                                        {showNotificationInput ? "Abort" : "+ Push"}
                                    </button>
                                </div>

                                {showNotificationInput && (
                                    <div className="p-4 border-b bg-slate-50 border-slate-100">
                                        <textarea
                                            value={notificationMessage}
                                            onChange={(e) => setNotificationMessage(e.target.value)}
                                            placeholder="Type message to push..."
                                            className="w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                                            rows="2"
                                        />
                                        <button
                                            onClick={handleSendNotification}
                                            disabled={!notificationMessage.trim() || isSending}
                                            className={`mt-3 w-full py-2 text-xs font-semibold uppercase tracking-wide text-white rounded-lg transition flex items-center justify-center gap-2 ${!notificationMessage.trim() || isSending
                                                ? "bg-slate-400 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                                                }`}
                                        >
                                            {isSending ? "Processing..." : (editNotificationId ? "Update Alert" : "Push Alert")}
                                        </button>
                                    </div>
                                )}

                                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border-b last:border-0 hover:bg-slate-50 transition group/item border-slate-100"
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="text-sm flex-1 text-slate-700">
                                                        {notif.message}
                                                    </p>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => startEditNotification(notif, e)}
                                                            className="p-1 rounded text-blue-500"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                            className="p-1 rounded text-red-500"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs mt-1.5 text-slate-400">
                                                    {notif.time}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400">
                                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">No notifications yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-primary bg-white text-primary hover:bg-highlight-pink rounded-xl shadow-neo-mini transition-all font-black text-xs uppercase"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col pt-16 min-h-screen relative bg-slate-50">
                <div className="flex flex-1">
                    <aside
                        className={`
                            fixed lg:sticky top-16 left-0 z-40 
                            h-[calc(100vh-64px)] transition-all duration-300 ease-in-out
                            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                            ${isMobile ? "w-72 shadow-2xl" : isSidebarOpen ? "w-72 border-r" : "w-0 overflow-hidden"}
                            bg-white border-slate-200
                        `}
                    >
                        <div className="h-full flex flex-col">
                            <nav className="overflow-y-auto space-y-2 px-4 pt-6">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path || (item.path === "/admin/dashboard" && location.pathname === "/admin");
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                navigate(item.path);
                                                if (isMobile) setIsSidebarOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all border-2 group ${isActive
                                                ? "bg-white border-primary text-primary font-black shadow-neo-mini translate-x-[1px] translate-y-[1px]"
                                                : "border-transparent text-primary/60 hover:bg-highlight-blue hover:text-primary hover:border-primary font-black animate-none"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "group-hover:text-primary"}`} />
                                                <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                                            </div>
                                            {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
                                        </button>
                                    );
                                })}
                            </nav>

                            <div className="mt-auto mb-8 mx-4 p-5 rounded-2xl border-3 bg-white border-primary shadow-neo-mini">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-highlight-blue flex items-center justify-center border-2 border-primary shadow-neo-mini overflow-hidden flex-none">
                                        <UserCog size={24} className="text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-black uppercase truncate text-primary leading-tight">{user?.username || "Admin User"}</p>
                                        <div className="inline-block bg-highlight-yellow border border-primary px-1 mt-1">
                                            <p className="text-[8px] font-black uppercase tracking-tighter text-primary">Super Admin</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 w-full min-w-0">
                        <div className="p-4 lg:p-6 xl:p-8 2xl:p-10">
                            <Outlet />
                        </div>
                    </main>
                </div>
                
                <footer className="relative z-10 border-t py-6 bg-white border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-2">
                    <p className="text-slate-500 text-xs font-medium text-center">
                      © {new Date().getFullYear()} Collaboration and Innovation Development Cell (CID). All rights reserved.
                    </p>
                  </div>
                </footer>
            </div>

            <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isRightNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRightNavOpen(false)} />
                <div className={`absolute right-0 top-0 h-full w-80 shadow-2xl transition-transform duration-300 ease-in-out transform ${isRightNavOpen ? "translate-x-0" : "translate-x-full"} bg-white`}>
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-800">Site Navigation</h2>
                        <button onClick={() => setIsRightNavOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
                        <Link to="/" onClick={() => setIsRightNavOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">
                            <Home className="w-5 h-5" /> Home
                        </Link>

                        {[
                            { label: "Users", options: usersOptions, icon: Users },
                            { label: "Events", options: eventsOptions, icon: Calendar },
                            { label: "Projects", options: projectsOptions, icon: Folder },
                            { label: "Team", options: teamOptions, icon: Shield },
                        ].map((group, idx) => {
                            const isExpanded = expandedMobileCategory === group.label;
                            return (
                                <div key={idx} className="space-y-1">
                                    <button
                                        onClick={() => setExpandedMobileCategory(isExpanded ? null : group.label)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isExpanded
                                            ? "bg-indigo-50 text-indigo-600 font-semibold"
                                            : "text-slate-600 hover:bg-slate-50 font-medium"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <group.icon className="w-5 h-5" />
                                            {group.label}
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                    </button>

                                    {isExpanded && (
                                        <div className="pl-11 pr-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                            {group.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleDropdownItemClick(opt.path)}
                                                    className="w-full text-left py-2.5 text-sm font-medium transition-colors text-slate-500 hover:text-indigo-600"
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
