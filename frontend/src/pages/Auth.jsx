import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

const Auth = () => {
    const { loginWithGoogle } = useContext(AuthContext);
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
        alert('Google Login failed. Please try again.');
    };

    return (
        <div className="min-h-screen bg-bg font-body flex items-center justify-center px-4 pt-24 pb-12 overflow-hidden relative">

            {/* ── Decorative background blobs (matching HeroSection style) ── */}
            <div className="absolute top-28 right-8 w-20 h-20 bg-highlight-yellow border-3 border-primary rounded-full shadow-neo hidden sm:block animate-[float_4s_ease-in-out_infinite]" />
            <div className="absolute bottom-24 left-6 w-14 h-14 bg-highlight-purple border-3 border-primary shadow-neo hidden sm:block rotate-12" />
            <div className="absolute top-1/2 left-8 w-10 h-10 bg-highlight-teal border-3 border-primary shadow-neo hidden lg:block" />
            <div className="absolute bottom-32 right-16 w-12 h-12 bg-highlight-pink border-2 border-primary shadow-neo hidden md:block -rotate-6" />

            <div className="w-full max-w-sm relative z-10">

                {/* ── Brand stamp ── */}
                <div className="text-center mb-8">
                    {/* CID logo box — matches navbar style exactly */}
                    <div className="inline-flex flex-col items-center gap-2 mb-4">
                        <div className="w-16 h-16 border-4 border-primary bg-highlight-yellow flex items-center justify-center shadow-neo transform -rotate-2">
                            <span className="font-heading font-black text-2xl text-primary">CID</span>
                        </div>
                        <div className="text-center">
                            <span className="font-heading text-3xl uppercase tracking-tighter text-primary block leading-none">
                                CID-Cell
                            </span>
                            <span className="font-bold text-[10px] uppercase tracking-widest bg-highlight-teal inline-block px-2 py-0.5 border-2 border-primary transform -rotate-1 mt-1 shadow-neo-sm">
                                MITS Gwalior · CSE Dept
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Main auth card ── */}
                <div className="bg-white border-4 border-primary shadow-neo rounded-none relative">

                    {/* Coloured top stripe */}
                    <div className="h-2 bg-highlight-yellow border-b-2 border-primary w-full" />

                    <div className="p-7 space-y-6">

                        {/* Heading */}
                        <div>
                            <div className="inline-block bg-highlight-purple border-2 border-primary px-3 py-1 shadow-neo-sm transform -skew-x-3 mb-3">
                                <span className="font-heading uppercase text-xs tracking-widest">Member Portal</span>
                            </div>
                            <p className="font-heading text-2xl uppercase tracking-tight text-primary leading-none">
                                Sign In to<br />Your Account
                            </p>
                            <p className="font-body text-sm text-gray-500 mt-2 normal-case font-medium">
                                Use your official college Google account to continue.
                            </p>
                        </div>

                        {/* Domain restriction notice */}
                        <div className="border-l-4 border-primary bg-highlight-yellow/50 pl-4 py-3 pr-3">
                            <p className="font-body text-xs font-bold text-primary normal-case leading-relaxed">
                                ⚠️ Only{' '}
                                <span className="bg-primary text-white px-1 font-mono text-[10px] rounded-sm">@mitsgwalior.in</span>{' '}
                                or{' '}
                                <span className="bg-primary text-white px-1 font-mono text-[10px] rounded-sm">@mitsgwl.ac.in</span>{' '}
                                email accounts are allowed.
                            </p>
                        </div>

                        {/* Google login button */}
                        <div className="flex flex-col items-center gap-3">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                theme="outline"
                                size="large"
                                width="260"
                                shape="rectangular"
                                text="continue_with"
                            />
                            <p className="text-[11px] text-gray-400 font-body normal-case text-center">
                                Make sure pop-ups are allowed for this site.
                            </p>
                        </div>

                        {/* Divider + extra CTA */}
                        <div className="border-t-2 border-dashed border-primary/30 pt-4 flex items-center justify-between gap-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider font-body">New here?</p>
                            <span className="inline-flex items-center gap-1 text-xs font-black text-primary uppercase border-2 border-primary px-3 py-1.5 bg-highlight-teal shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-default select-none">
                                Sign in to register <ArrowRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Bottom caption ── */}
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">
                    Collaborative Innovation &amp; Development Cell
                </p>
            </div>
        </div>
    );
};

export default Auth;
