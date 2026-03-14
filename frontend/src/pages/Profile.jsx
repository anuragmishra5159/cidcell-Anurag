import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import {
    GraduationCap, Pencil, LogOut, AlertTriangle,
    Linkedin, Github, Globe, Code2, CalendarDays
} from 'lucide-react';

// Reuse same parser as Onboarding
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

function SocialLink({ href, icon: Icon, label }) {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-primary bg-white rounded-xl px-3 py-2 text-xs font-bold hover:bg-highlight-yellow transition-colors shadow-neo-sm"
            style={{ maxWidth: '100%', overflow: 'hidden' }}
        >
            <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        </a>
    );
}

export default function Profile() {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg" style={{ paddingTop: '72px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <svg className="animate-spin" style={{ width: 32, height: 32 }} viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <p className="text-sm font-bold text-gray-500 font-body normal-case">Loading…</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/auth" />;

    const { enrollmentNo, displayName } = parseUserIdentity(user);
    const profileIncomplete = !user.branch;
    const hasSocialLinks = user.socialLinks && Object.values(user.socialLinks).some(Boolean);

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="bg-bg font-body" style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '3rem' }}>
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '1.25rem 1rem' }}>

                {/* ── Incomplete Banner ── */}
                {profileIncomplete && (
                    <div className="flex items-start gap-3 bg-highlight-orange border-2 border-primary rounded-2xl shadow-neo-sm animate-pulse"
                        style={{ padding: '14px 16px', marginBottom: 20 }}>
                        <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2 }} />
                        <p className="text-xs font-black text-primary normal-case font-body" style={{ lineHeight: 1.4 }}>
                            Your profile is incomplete! Tap "Edit Profile" to finish.
                        </p>
                    </div>
                )}

                {/* ── Hero card ── */}
                <div className="bg-white border-4 border-primary rounded-2xl shadow-neo" style={{ padding: 24, marginBottom: 20 }}>

                    {/* Avatar + Info row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                        <img
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=128`}
                            alt={displayName}
                            className="border-4 border-primary shadow-neo-sm object-cover"
                            style={{ width: 80, height: 80, borderRadius: '50%', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p className="font-black uppercase text-primary font-heading"
                                style={{ fontSize: 18, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {displayName}
                            </p>
                            <p className="font-body text-gray-500 normal-case"
                                style={{ fontSize: 11, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.email}
                            </p>
                            {enrollmentNo && (
                                <span className="bg-highlight-yellow border-2 border-primary font-bold font-body"
                                    style={{
                                        display: 'inline-block', marginTop: 6, fontSize: 10,
                                        padding: '3px 10px', borderRadius: 4,
                                        boxShadow: '2px 2px 0 #1A1A1A', transform: 'rotate(-1deg)'
                                    }}>
                                    {enrollmentNo}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <button
                            id="edit-profile-btn"
                            onClick={() => navigate('/onboarding')}
                            className={`flex items-center justify-center gap-2 border-2 border-primary font-black font-heading uppercase shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${profileIncomplete ? 'bg-highlight-teal' : 'bg-highlight-yellow'}`}
                            style={{ padding: '10px 8px', borderRadius: 12, fontSize: 11 }}
                        >
                            <Pencil style={{ width: 13, height: 13 }} />
                            {profileIncomplete ? 'Complete Profile' : 'Edit Profile'}
                        </button>
                        <button
                            id="logout-btn"
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 bg-highlight-pink border-2 border-primary font-black font-heading uppercase shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            style={{ padding: '10px 8px', borderRadius: 12, fontSize: 11 }}
                        >
                            <LogOut style={{ width: 13, height: 13 }} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* ── Academic card ── */}
                <div className="bg-white border-2 border-primary rounded-2xl shadow-neo-sm" style={{ padding: 20, marginBottom: 20 }}>
                    <p className="text-gray-400 font-black font-body" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Academic Details</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="bg-highlight-blue/20 border-2 border-primary/20 rounded-xl" style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                <GraduationCap style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
                                <div style={{ minWidth: 0 }}>
                                    <p className="font-body text-gray-400" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Branch</p>
                                    <p className="font-body font-semibold text-gray-800" style={{ fontSize: 12, marginTop: 3, lineHeight: 1.3 }}>
                                        {user.branch || <span className="text-gray-400 italic font-normal">Not set</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-highlight-purple/20 border-2 border-primary/20 rounded-xl" style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                <CalendarDays style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <p className="font-body text-gray-400" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Batch</p>
                                    <p className="font-body font-semibold text-gray-800" style={{ fontSize: 12, marginTop: 3 }}>
                                        {user.batch || <span className="text-gray-400 italic font-normal">Not set</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Skills card ── */}
                <div className="bg-white border-2 border-primary rounded-2xl shadow-neo-sm" style={{ padding: 20, marginBottom: 20 }}>
                    <p className="text-gray-400 font-black font-body" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Skills & Expertise</p>
                    {user.skills && user.skills.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {user.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="bg-highlight-teal border-2 border-primary font-bold font-body"
                                    style={{ fontSize: 11, padding: '4px 12px', borderRadius: 9999, boxShadow: '2px 2px 0 #1A1A1A' }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 font-body italic normal-case" style={{ fontSize: 13 }}>No skills added yet.</p>
                    )}
                </div>

                {/* ── Social links card ── */}
                {hasSocialLinks && (
                    <div className="bg-white border-2 border-primary rounded-2xl shadow-neo-sm" style={{ padding: 20 }}>
                        <p className="text-gray-400 font-black font-body" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Social Profiles</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <SocialLink href={user.socialLinks?.linkedin} icon={Linkedin} label="LinkedIn" />
                            <SocialLink href={user.socialLinks?.github} icon={Github} label="GitHub" />
                            <SocialLink href={user.socialLinks?.leetcode} icon={Code2} label="LeetCode" />
                            <SocialLink href={user.socialLinks?.other} icon={Globe} label="Portfolio" />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
