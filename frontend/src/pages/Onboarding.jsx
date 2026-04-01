import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, ChevronDown, LogOut, ChevronRight, UploadCloud, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { compressImage } from '../utils/compressImage';

export const branches = [
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence and Machine Learning",
    "Automobile Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science and Design",
    "Computer Science and Engineering",
    "Computer Science and Bussiness Studies",
    "Electrical Engineering",
    "Electrical Engineering (IOT)",
    "Electronics and Telecommunication Engineering",
    "Electronics Engineering",
    "Information Technology",
    "Information Technology (AIR)",
    "Information Technology (IOT)",
    "Mathematics and Computing",
    "Mechanical Engineering"
];

const predefinedSkills = [
    "React", "Node.js", "Python", "Java", "C++", "Machine Learning",
    "Data Analysis", "UI/UX Design", "Figma", "Docker", "AWS", "SQL", "MongoDB"
];

const predefinedDomains = [
    "Web Development",
    "App Development",
    "Artificial Intelligence",
    "Data Science",
    "Cloud & DevOps",
    "Cybersecurity",
    "UI/UX Design",
    "Hardware & IoT",
    "Blockchain"
];

const predefinedExpertise = [
    "Frontend (React/Next)", "Backend (Node/Express)", "Full Stack", 
    "Machine Learning", "Deep Learning", "Data Analytics", 
    "Cloud Architecture (AWS/Azure)", "DevOps (Docker/K8s)", 
    "Cybersecurity", "UI/UX Design", "Mobile App Dev", "Embedded Systems",
    "System Design", "Agile & Product Management"
];

const generateBatches = () => {
    const currentYear = new Date().getFullYear();
    const batches = [];
    for (let year = currentYear - 5; year <= currentYear + 1; year++) {
        batches.push(`${year}-${year + 4}`);
    }
    return batches;
};

const ENROLLMENT_PATTERN = /^[A-Z0-9]{8,12}$/;

function parseUserIdentity(user) {
    if (!user) return { enrollmentNo: '', displayName: '' };
    const rawUsername = (user.username || '').trim();
    const parts = rawUsername.split(/\s+/);
    const firstPart = parts[0].toUpperCase();
    if (ENROLLMENT_PATTERN.test(firstPart) && /[0-9]/.test(firstPart)) {
        return { enrollmentNo: firstPart, displayName: parts.slice(1).join(' ') || rawUsername };
    }
    return { enrollmentNo: user.enrollmentNo || '', displayName: rawUsername };
}

export default function Onboarding() {
    const { user, setUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const { enrollmentNo: resolvedEnrollment, displayName: resolvedName } = parseUserIdentity(user);

    const [formData, setFormData] = useState({
        branch: user?.branch || '',
        batch: user?.batch || '',
        skills: user?.skills || [],
        socialLinks: {
            linkedin: user?.socialLinks?.linkedin || '',
            github: user?.socialLinks?.github || '',
            leetcode: user?.socialLinks?.leetcode || '',
            other: user?.socialLinks?.other || ''
        },
        domainOfExpertise: user?.domainOfExpertise || '',
        department: user?.department || '',
        aboutMentor: user?.aboutMentor || '',
        expertise: user?.expertise?.join(', ') || '',
        profilePicture: user?.profilePicture || ''
    });

    const [customSkill, setCustomSkill] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [saving, setSaving] = useState(false);
    const availableBatches = generateBatches();

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            // Compress avatar to a small 800x800 square
            const compressedFile = await compressImage(file, 800, 800, 0.7);
            const uploadData = new FormData();
            uploadData.append('image', compressedFile);
            const token = localStorage.getItem('token');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, uploadData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            setFormData(prev => ({ ...prev, profilePicture: res.data.url }));
        } catch (err) {
            toast.error('Failed to upload profile picture.');
        } finally {
            setUploadingImage(false);
        }
    };

    if (!user) return <Navigate to="/auth" />;

    const isEditing = user?.userType === 'mentor' ? !!user?.domainOfExpertise : !!user?.branch;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['linkedin', 'github', 'leetcode', 'other'].includes(name)) {
            setFormData({ ...formData, socialLinks: { ...formData.socialLinks, [name]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddSkill = (skillToAdd) => {
        const skill = skillToAdd.trim();
        if (skill && !formData.skills.includes(skill)) {
            setFormData({ ...formData, skills: [...formData.skills, skill] });
        }
        setCustomSkill('');
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user?.userType !== 'mentor' && formData.skills.length === 0) {
            toast.error('Please add at least one capability before synchronization.');
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user);
            if (res.data.user?.userType === 'mentor') {
                navigate('/mentor/dashboard');
            } else {
                navigate('/profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to synchronize profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    /* ── shared input / select class ── */
    const inputCls = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-accent/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all placeholder:text-slate-500 backdrop-blur-md font-body";

    return (
        <div className="min-h-screen bg-bg relative overflow-hidden font-body pt-32 pb-20">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-glow-accent rounded-full pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-glow-blue rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">

                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6 relative">
                    <div className="absolute -left-10 top-0 w-20 h-20 bg-glow-accent rounded-full rounded-full"></div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2 block relative z-10">
                            Initialization Sequence
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-widest font-heading leading-none drop-shadow-xl relative z-10">
                            {isEditing ? 'Configure Profile' : 'Node Calibration'}
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-3 font-body relative z-10">
                            {isEditing
                                ? 'Update your professional telemetry data.'
                                : `Welcome, ${resolvedName}. Please set your parameters to integrate with the network.`}
                        </p>
                    </div>

                    {/* Sign out & go back button */}
                    <button
                        type="button"
                        onClick={() => { logout(); navigate('/auth'); }}
                        className="btn-glass-danger px-5 py-2.5"
                        title="Disconnect"
                    >
                        <LogOut size={12} />
                        Disconnect
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Profile Picture ── */}
                    <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 shadow-glass relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-glow-accent rounded-full rounded-full pointer-events-none group-hover:bg-accent/20 transition-colors"></div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                             Visual Identification Log
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                            <div className="relative group/avatar cursor-pointer shrink-0">
                                <div className="absolute inset-0 bg-accent/20 rounded-full blur flex-1 -z-10 group-hover/avatar:bg-accent/40 transition-colors"></div>
                                <img 
                                    src={formData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}&background=050505&color=fff&size=128`} 
                                    alt="Profile" 
                                    className="w-28 h-28 rounded-full border-2 border-white/20 shadow-glass object-cover bg-bg transition-transform duration-500 group-hover/avatar:scale-105"
                                />
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center rounded-full border-2 border-accent">
                                        <Loader2 className="animate-spin w-8 h-8 text-accent" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-surface rounded-full border border-white/10 shadow-glass flex items-center justify-center text-slate-300 group-hover/avatar:text-accent group-hover/avatar:border-accent/50 transition-colors">
                                    <UploadCloud size={14} />
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleProfilePictureUpload}
                                    disabled={uploadingImage}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                    id="profile-picture-upload"
                                />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="font-bold text-white uppercase tracking-widest text-sm mb-1">{resolvedName || 'Unknown Node'}</p>
                                <p className="text-xs text-slate-400 font-medium mb-4">Update your visual signature. Max file size: 2MB.</p>
                                <label 
                                    htmlFor="profile-picture-upload" 
                                    className={`btn-neo-secondary px-6 py-2 h-auto text-[9px] ${uploadingImage ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                                >
                                    Upload Signature
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ── Identity (read-only) ── */}
                    <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 shadow-glass relative">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Authentication Metadata
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'Node ID (Enrollment)', value: resolvedEnrollment || 'Pending', color: 'text-accent-magenta border-accent-magenta/30 bg-accent-magenta/5' },
                                { label: 'Signature (Name)', value: resolvedName || 'Pending', color: 'text-accent-blue border-accent-blue/30 bg-accent-blue/5' },
                                { label: 'Contact (Email)', value: user.email, color: 'text-accent border-accent/30 bg-accent/5', className: "md:col-span-2" },
                            ].map(({ label, value, color, className }) => (
                                <div key={label} className={`flex flex-col gap-1.5 p-4 rounded-xl border border-white/5 bg-surface/30 ${className}`}>
                                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">{label}</span>
                                    <span className={`text-sm font-bold uppercase tracking-wider min-w-0 truncate px-3 py-2 rounded-lg border flex items-center shadow-inner ${color}`}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {user?.userType === 'mentor' ? (
                        <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 shadow-glass relative">
                            <h3 className="text-[10px] font-bold text-accent-cyan uppercase tracking-widest mb-6 relative z-10 flex items-center gap-3">
                                Mentor Clearance Parameters <span className="text-red-500">*</span>
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">
                                        Professional Overview <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="aboutMentor"
                                        value={formData.aboutMentor}
                                        onChange={handleChange}
                                        placeholder="Outline your professional experience and mentorship capability..."
                                        required
                                        rows="3"
                                        className={inputCls + " resize-none"}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">
                                        Primary Domain <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="domainOfExpertise"
                                            value={formData.domainOfExpertise}
                                            onChange={handleChange}
                                            required
                                            className={inputCls + " appearance-none"}
                                        >
                                            <option value="" disabled className="bg-bg text-white">Select Domain</option>
                                            {predefinedDomains.map(d => (
                                                <option key={d} value={d} className="bg-bg text-white">{d}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">
                                        Specialized Array <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="expertise"
                                            value={formData.expertise}
                                            onChange={handleChange}
                                            required
                                            className={inputCls + " appearance-none"}
                                        >
                                            <option value="" disabled className="bg-bg text-white">Select Primary Expertise</option>
                                            {predefinedExpertise.map(e => (
                                                <option key={e} value={e} className="bg-bg text-white">{e}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">
                                        Department Link <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                            className={inputCls + " appearance-none pr-8"}
                                        >
                                            <option value="" className="bg-bg text-white">Select operational department</option>
                                            {branches.map(b => <option key={b} value={b} className="bg-bg text-white">{b}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                    {/* ── Academic ── */}
                    <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 shadow-glass relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-blue opacity-50"></div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
                             Academic Parameters <span className="text-red-500">*</span>
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                            {/* Branch */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">
                                    Branch Specification <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                        className={inputCls + " appearance-none cursor-pointer"}
                                    >
                                        <option value="" className="bg-bg text-slate-400">Select branch specification...</option>
                                        {branches.map(b => <option key={b} value={b} className="bg-bg text-white">{b}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            {/* Batch */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">
                                    Temporal Batch <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="batch"
                                        value={formData.batch}
                                        onChange={handleChange}
                                        required
                                        className={inputCls + " appearance-none cursor-pointer"}
                                    >
                                        <option value="" className="bg-bg text-slate-400">Select batch cycle...</option>
                                        {availableBatches.map(b => <option key={b} value={b} className="bg-bg text-white">{b}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Skills ── */}
                    <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 shadow-glass relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
                             Technical Architecture <span className="text-red-500">*</span>
                        </h3>
                        
                        <div className="relative z-10">
                            <div className="flex flex-wrap gap-2 min-h-[56px] p-4 rounded-xl border border-white/10 bg-surface/30 mb-6 shadow-inner">
                                {formData.skills.length === 0
                                    ? <span className="text-slate-500 text-xs font-medium italic self-center uppercase tracking-widest w-full text-center">No capabilities registered</span>
                                    : formData.skills.map(skill => (
                                        <span key={skill} className="inline-flex items-center gap-2 bg-accent/10 border border-accent/40 px-3 py-1.5 text-[10px] font-bold text-accent uppercase tracking-widest rounded-lg shadow-glow-purple">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="w-4 h-4 rounded-full bg-accent/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors flex items-center justify-center -mr-1"
                                            >
                                                <X size={10} strokeWidth={3} />
                                            </button>
                                        </span>
                                    ))}
                            </div>

                            {/* Add skill */}
                            <div className="flex gap-3 mb-6">
                                <input
                                    type="text"
                                    value={customSkill}
                                    onChange={(e) => setCustomSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(customSkill))}
                                    placeholder="Input custom protocol..."
                                    className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-accent/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all placeholder:text-slate-500 backdrop-blur-md font-body"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddSkill(customSkill)}
                                    className="btn-neo-secondary px-6 py-3 h-auto"
                                >
                                    <Plus size={14} /> Inject
                                </button>
                            </div>

                            {/* Quick add */}
                            <div className="pt-4 border-t border-white/10">
                                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em] mb-3 block">Preset Architectures:</span>
                                <div className="flex flex-wrap gap-2">
                                    {predefinedSkills.map(s => (
                                        <button key={s} type="button" onClick={() => handleAddSkill(s)}
                                            className="text-[10px] border border-white/10 bg-surface/50 px-3 py-1.5 rounded-lg hover:border-accent hover:text-accent transition-colors font-bold text-slate-300 uppercase tracking-wider backdrop-blur-sm">
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Social Links ── */}
                    <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 shadow-glass relative">
                         <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
                             External Uplinks
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                            {[
                                { name: 'linkedin', label: 'LinkedIn Comms', placeholder: 'https://linkedin.com/in/...', required: true },
                                { name: 'github', label: 'GitHub Repository', placeholder: 'https://github.com/...', required: true },
                                { name: 'leetcode', label: 'LeetCode Matrix', placeholder: 'https://leetcode.com/u/...', required: false },
                                { name: 'other', label: 'Personal Domain', placeholder: 'https://...', required: false },
                            ].map(({ name, label, placeholder, required }) => (
                                <div key={name}>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">
                                        {label}{' '}
                                        {required
                                            ? <span className="text-red-500">*</span>
                                            : <span className="text-slate-600 font-normal">/ Optional</span>}
                                    </label>
                                    <input
                                        type="url"
                                        name={name}
                                        value={formData.socialLinks[name]}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        required={required}
                                        className={inputCls}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                        </>
                    )}

                    {/* ── Submit ── */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-neo w-full py-5 text-sm tracking-[0.3em]"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                        
                        <div className="relative z-10 flex items-center gap-3">
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Synchronizing Arrays...
                                </>
                            ) : (
                                <>
                                    {isEditing ? 'Compile Changes' : 'Finalize Calibration'}
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </div>
                    </button>
                    
                    {!isEditing && (
                        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-4">
                            You can modify these parameters later in your profile matrix.
                        </p>
                    )}
                </form>
            </div >
        </div >
    );
}
