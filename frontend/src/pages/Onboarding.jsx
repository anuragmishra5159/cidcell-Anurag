import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, ChevronDown, LogOut } from 'lucide-react';

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
        aboutMentor: user?.aboutMentor || ''
    });

    const [customSkill, setCustomSkill] = useState('');
    const [saving, setSaving] = useState(false);
    const availableBatches = generateBatches();

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
            alert('Please add at least one skill before saving.');
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
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    /* ── shared input / select class ── */
    const inputCls = "w-full border-2 border-primary rounded-lg px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary bg-white font-body";

    return (
        <div className="min-h-screen bg-bg font-body" style={{ paddingTop: '72px' }}>
            <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

                {/* Page header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="relative">
                        <div className="absolute -top-1 -right-2 w-full h-full bg-highlight-yellow border-2 border-primary -z-10 transform skew-x-6"></div>
                        <span className="text-xl sm:text-2xl font-black uppercase text-primary border-b-4 border-primary inline-block pb-0.5 font-heading leading-tight bg-white px-2">
                            {isEditing ? 'Edit Profile' : 'Complete Profile'}
                        </span>
                        <p className="text-gray-500 text-sm font-semibold mt-3 normal-case pl-1">
                            {isEditing
                                ? 'Update your professional details.'
                                : `Welcome, ${resolvedName}! Set up your cell profile.`}
                        </p>
                    </div>
                    {/* Sign out & go back button */}
                    <button
                        type="button"
                        onClick={() => { logout(); navigate('/auth'); }}
                        className="shrink-0 flex items-center gap-1.5 border-2 border-primary bg-highlight-pink rounded-none px-4 py-2 text-xs font-black hover:bg-white transition-all shadow-neo-sm font-heading uppercase"
                        title="Sign out and go back"
                    >
                        <LogOut style={{ width: 14, height: 14 }} strokeWidth={3} />
                        Exit
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Identity (read-only) ── */}
                    <div className="bg-white border-4 border-primary rounded-none p-5 shadow-neo relative">
                        <div className="absolute -top-3 -left-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 transform -rotate-1">Google Identity</div>
                        <div className="grid grid-cols-1 gap-3 pt-2">
                            {[
                                { label: 'Enrollment', value: resolvedEnrollment || 'N/A', color: 'bg-highlight-blue/20' },
                                { label: 'Full Name', value: resolvedName || 'N/A', color: 'bg-highlight-purple/20' },
                                { label: 'Email', value: user.email, color: 'bg-highlight-yellow/20' },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider w-24 shrink-0">{label}</span>
                                    <span className={`text-sm font-bold text-primary ${color} border-2 border-primary px-3 py-2 flex-1 min-w-0 truncate shadow-neo-sm transform hover:translate-x-[1px] transition-transform`}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {user?.userType === 'mentor' ? (
                        <div className="bg-white border-4 border-primary rounded-none p-6 shadow-neo relative">
                            <div className="absolute -top-3 right-4 bg-highlight-teal border-2 border-primary px-3 py-1 font-heading uppercase text-xs shadow-neo-sm transform rotate-1">
                                Mentor Profile <span className="text-primary">*</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 normal-case">
                                        About You <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="aboutMentor"
                                        value={formData.aboutMentor}
                                        onChange={handleChange}
                                        placeholder="Write a brief bio about your experience..."
                                        required
                                        rows="3"
                                        className={inputCls + " resize-none"}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 normal-case">
                                        Domain of Interest <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="domainOfExpertise"
                                        value={formData.domainOfExpertise}
                                        onChange={handleChange}
                                        placeholder="e.g. Web Dev, Machine Learning"
                                        required
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 normal-case">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                            className={inputCls + " appearance-none pr-8"}
                                        >
                                            <option value="">Select your department</option>
                                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                    {/* ── Academic ── */}
                    <div className="bg-white border-4 border-primary rounded-none p-6 shadow-neo relative">
                        <div className="absolute -top-3 right-4 bg-highlight-teal border-2 border-primary px-3 py-1 font-heading uppercase text-xs shadow-neo-sm transform rotate-1">
                            Academic Info <span className="text-primary">*</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                            {/* Branch */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 normal-case">
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                        className={inputCls + " appearance-none pr-8"}
                                    >
                                        <option value="">Select your branch</option>
                                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            {/* Batch */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 normal-case">
                                    Batch <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="batch"
                                        value={formData.batch}
                                        onChange={handleChange}
                                        required
                                        className={inputCls + " appearance-none pr-8"}
                                    >
                                        <option value="">Select your batch</option>
                                        {availableBatches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Skills ── */}
                    <div className="bg-white border-4 border-primary rounded-none p-6 shadow-neo relative">
                        <div className="absolute -top-3 left-4 bg-highlight-pink border-2 border-primary px-3 py-1 font-heading uppercase text-xs shadow-neo-sm transform -rotate-1">
                            Technical Stack <span className="text-primary">*</span>
                        </div>
                        <div className="mt-2">
                            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-xl border-2 border-dashed border-primary bg-gray-50 mb-4">
                                {formData.skills.length === 0
                                    ? <span className="text-gray-400 text-xs italic self-center">No skills added yet</span>
                                    : formData.skills.map(skill => (
                                        <span key={skill} className="inline-flex items-center gap-1 bg-highlight-teal border-2 border-primary px-2.5 py-1 text-xs font-bold rounded-full shadow-neo-sm">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center hover:bg-red-500 transition-colors text-[10px] leading-none"
                                            >×</button>
                                        </span>
                                    ))}
                            </div>

                            {/* Add skill */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={customSkill}
                                    onChange={(e) => setCustomSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(customSkill))}
                                    placeholder="Type a skill & press Enter…"
                                    className="flex-1 min-w-0 border-2 border-primary rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddSkill(customSkill)}
                                    className="shrink-0 bg-highlight-pink border-2 border-primary font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-highlight-purple transition-colors"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Quick add */}
                            <div>
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Quick add:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {predefinedSkills.map(s => (
                                        <button key={s} type="button" onClick={() => handleAddSkill(s)}
                                            className="text-[11px] border border-primary/30 bg-white px-3 py-1.5 rounded-full hover:bg-highlight-teal hover:border-primary transition-colors font-semibold text-gray-600 normal-case">
                                            + {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Social Links ── */}
                    <div className="bg-white border-4 border-primary rounded-none p-6 shadow-neo relative">
                        <div className="absolute -top-3 right-4 bg-highlight-yellow border-2 border-primary px-3 py-1 font-heading uppercase text-xs shadow-neo-sm transform rotate-2">
                            Public Profiles
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                            {[
                                { name: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...', required: true },
                                { name: 'github', label: 'GitHub', placeholder: 'https://github.com/...', required: true },
                                { name: 'leetcode', label: 'LeetCode', placeholder: 'https://leetcode.com/u/...', required: false },
                                { name: 'other', label: 'Portfolio / Website', placeholder: 'https://...', required: false },
                            ].map(({ name, label, placeholder, required }) => (
                                <div key={name}>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 normal-case">
                                        {label}{' '}
                                        {required
                                            ? <span className="text-red-500">*</span>
                                            : <span className="text-gray-300 font-normal">(optional)</span>}
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
                        className="w-full flex items-center justify-center gap-2 bg-highlight-yellow border-2 border-primary font-black uppercase text-sm py-4 rounded-2xl shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 font-heading"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Saving…
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                {isEditing ? 'Save Changes' : 'Complete Profile & Save'}
                            </>
                        )}
                    </button>
                </form>
            </div >
        </div >
    );
}
