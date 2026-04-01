import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Loader2, ShieldAlert } from 'lucide-react';

const Auth = () => {
    const { loginWithGoogle, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/profile';

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await loginWithGoogle(credentialResponse.credential);
            if (res.isNewUser || !res.user?.branch || !res.user?.batch) {
                navigate('/onboarding', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleError = () => {
        alert('Google Auth Node offline. Please attempt reconnection.');
    };

    return (
        <div className="min-h-screen pt-20 bg-bg flex items-center justify-center px-4 py-12 relative overflow-hidden text-white">

            {/* Abstract Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            {/* Full-screen loading overlay */}
            {authLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/80 backdrop-blur-md">
                    <Loader2 className="w-16 h-16 animate-spin text-accent mb-6" strokeWidth={2} />
                    <p className="font-heading text-lg uppercase tracking-[0.3em] text-white animate-pulse">
                        Establishing Secure Link...
                    </p>
                </div>
            )}

            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

                {/* Left Side */}
                <div className="hidden lg:flex flex-col items-start justify-center relative z-10">
                    <div className="mb-10 p-4 bg-white/[0.03] border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] inline-block backdrop-blur-md">
                        <img src="/logo.png" alt="CID-Cell Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                    </div>

                    <h1 className="font-heading text-5xl xl:text-7xl uppercase text-white leading-[1.1] tracking-widest mb-8 drop-shadow-2xl">
                        Intelligent <br className="hidden xl:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-blue">
                            Innovators
                        </span> <br className="hidden xl:block" />
                        Network
                    </h1>

                    <p className="font-medium text-lg text-slate-300 max-w-lg border-l-2 border-accent pl-6 mb-10 leading-relaxed font-body">
                        The official nexus of MITS Gwalior. Authenticate to sync roadmaps, collaborate on deep-tech projects, and sequence the future.
                    </p>

                    <div className="flex gap-4">
                        <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-accent/50 hover:bg-white/5 transition-all">
                            <span className="font-bold uppercase tracking-widest text-slate-300 text-xs">Ideate</span>
                        </div>
                        <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-accent-blue/50 hover:bg-white/5 transition-all">
                            <span className="font-bold uppercase tracking-widest text-slate-300 text-xs">Deploy</span>
                        </div>
                        <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-accent-magenta/50 hover:bg-white/5 transition-all">
                            <span className="font-bold uppercase tracking-widest text-slate-300 text-xs">Scale</span>
                        </div>
                    </div>
                </div>

                {/* Right Side / Auth Card */}
                <div className="w-full max-w-md mx-auto lg:ml-auto relative">
                    
                    {/* Mobile Branding */}
                    <div className="lg:hidden text-center mb-10 flex flex-col items-center">
                        <div className="mb-6 p-4 bg-white/[0.03] border border-white/10 rounded-2xl shadow-glass inline-block backdrop-blur-md">
                            <img src="/logo.png" alt="CID-Cell Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                        </div>
                        <h1 className="font-heading text-4xl sm:text-5xl uppercase tracking-widest text-white leading-none drop-shadow-lg mb-4">
                            CID-Cell
                        </h1>
                        <span className="font-bold text-[10px] uppercase tracking-widest bg-accent/20 text-accent px-4 py-1.5 rounded-full border border-accent/30">
                            MITS Gwalior . CSE Dept
                        </span>
                    </div>

                    {/* Glassmorphism Auth Container */}
                    <div className="bg-[#050505]/60 border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden group backdrop-blur-2xl">
                        
                        {/* Top Gradient Bar */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent-blue to-accent-magenta" />

                        <div className="p-8 md:p-10 space-y-8 relative z-10">
                            
                            <div className="space-y-4">
                                <span className="inline-block px-3 py-1 bg-black/40 border border-white/10 rounded-md shadow-sm">
                                    <span className="font-bold uppercase text-[10px] tracking-widest text-accent">Member Portal</span>
                                </span>
                                <h2 className="font-black text-3xl md:text-4xl uppercase tracking-widest text-white leading-none">
                                    Authenticate<br />Identity
                                </h2>
                                <p className="font-medium text-sm text-slate-400 font-body">
                                    Use your official institutional matrix credentials to continue.
                                </p>
                            </div>

                            {/* Warning Banner */}
                            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 shadow-inner backdrop-blur-sm">
                                <p className="font-bold text-xs text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                    <ShieldAlert size={16} /> Security Notice
                                </p>
                                <p className="font-medium text-xs text-slate-300 leading-relaxed">
                                    Only <span className="text-white bg-white/10 px-1 py-0.5 rounded font-bold">@mitsgwalior.in</span> or <span className="text-white bg-white/10 px-1 py-0.5 rounded font-bold">@mitsgwl.ac.in</span> subdomains are granted access to this layer.
                                </p>
                            </div>

                            {/* Login Mechanism */}
                            <div className="flex flex-col items-center gap-4 bg-black/40 border border-white/5 rounded-2xl p-6 shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                {/* Subtle inner glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-3xl pointer-events-none"></div>

                                <div className="w-full flex justify-center relative z-10 transition-transform hover:scale-[1.02] duration-300">
                                    {authLoading ? (
                                        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/10">
                                            <Loader2 className="w-5 h-5 animate-spin text-accent" />
                                            <span className="font-bold text-xs text-slate-300 uppercase tracking-widest">
                                                Authenticating...
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={handleGoogleError}
                                                useOneTap
                                                use_fedcm_for_prompt={false}
                                                theme="filled_black"
                                                size="large"
                                                width="280"
                                                text="continue_with"
                                                shape="rectangular"
                                            />
                                        </div>
                                    )}
                                </div>

                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mt-2 relative z-10">
                                    <span className={`w-1.5 h-1.5 rounded-full ${authLoading ? 'bg-orange-400 animate-pulse' : 'bg-green-400 animate-pulse'}`}></span>
                                    {authLoading ? 'Handshake in progress' : 'Waiting for User Action'}
                                </p>
                            </div>

                            {/* Footer links */}
                            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">Unregistered Node?</p>
                                <span className="inline-flex items-center justify-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 border border-white/10 px-4 py-2.5 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:bg-white/5 hover:border-white/20 transition-all cursor-default w-full sm:w-auto">
                                    Login to Create Profile <ArrowRight className="w-3 h-3 text-accent" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="mt-8 text-center text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">
                        Student Innovation Platform
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
