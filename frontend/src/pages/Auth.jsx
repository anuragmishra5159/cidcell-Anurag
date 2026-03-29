```jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';

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
        alert('Google Login failed. Please try again.');
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] mt-16 md:mt-20 bg-bg flex items-center justify-center px-4 py-6 relative overflow-hidden">

            {/* Full-screen loading overlay */}
            {authLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" strokeWidth={3} />
                    <p className="font-heading text-sm uppercase tracking-widest text-primary animate-pulse">
                        Authenticating…
                    </p>
                </div>
            )}

            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center relative z-10">

                {/* Left Side */}
                <div className="hidden lg:flex flex-col items-start justify-center relative lg:-mt-16 xl:-mt-20">
                    <div className="absolute -top-6 -left-8 w-24 h-24 bg-highlight-yellow border-4 border-primary shadow-neo transform rotate-12 -z-10" />
                    <div className="absolute bottom-4 right-12 w-20 h-20 bg-highlight-pink border-4 border-primary shadow-neo rounded-full -rotate-6 -z-10" />

                    <div className="bg-white border-4 border-primary p-3 shadow-neo transform -rotate-2 hover:rotate-0 transition-neo mb-5">
                        <img src="/logo.png" alt="CID-Cell Logo" className="w-16 h-16 object-contain" />
                    </div>

                    <h1 className="font-heading text-[36px] xl:text-[48px] uppercase text-primary leading-tight tracking-widest mb-4 relative">
                        Collaborative <br />
                        <span className="bg-highlight-teal inline-block px-3 py-0.5 transform -skew-x-3 my-1 border-4 border-primary shadow-neo">
                            Innovation
                        </span> <br />
                        &amp; Development
                    </h1>

                    <p className="font-bold text-base text-primary/80 normal-case max-w-md border-l-4 border-primary pl-5 mb-6">
                        The official student hub of MITS Gwalior. Sign in to collaborate on projects, track roadmaps, and build the future.
                    </p>

                    <div className="flex gap-4">
                        <div className="bg-highlight-purple border-4 border-primary px-6 py-2 shadow-neo transform rotate-2">
                            <span className="font-black uppercase tracking-widest text-primary text-sm">Design</span>
                        </div>
                        <div className="bg-highlight-orange border-4 border-primary px-6 py-2 shadow-neo transform -rotate-2">
                            <span className="font-black uppercase tracking-widest text-primary text-sm">Develop</span>
                        </div>
                        <div className="bg-highlight-blue border-4 border-primary px-6 py-2 shadow-neo transform rotate-1">
                            <span className="font-black uppercase tracking-widest text-primary text-sm">Deploy</span>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full max-w-md mx-auto lg:ml-auto relative">

                    <div className="absolute -top-12 -right-4 w-16 h-16 bg-highlight-yellow border-4 border-primary shadow-neo lg:hidden transform rotate-12" />
                    <div className="absolute top-1/2 -left-6 w-12 h-12 bg-highlight-purple border-4 border-primary shadow-neo lg:hidden transform -rotate-6" />

                    {/* Mobile Branding */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex flex-col items-center gap-3">
                            <div className="bg-white border-4 border-primary p-2 shadow-neo transform -rotate-2">
                                <img src="/logo.png" alt="CID-Cell Logo" className="w-16 h-16 object-contain" />
                            </div>
                            <div className="text-center mt-2">
                                <span className="font-heading text-4xl sm:text-5xl uppercase tracking-widest text-primary block leading-none drop-shadow-sm">
                                    CID-Cell
                                </span>
                                <span className="font-black text-xs uppercase tracking-widest bg-highlight-teal inline-block px-3 py-1 border-2 border-primary transform rotate-1 mt-2 shadow-neo-sm">
                                    MITS Gwalior · CSE Dept
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-white border-4 border-primary shadow-neo-lg relative overflow-hidden group">
                        <div className="h-4 bg-highlight-yellow border-b-4 border-primary w-full" />

                        <div className="p-5 md:p-6 space-y-4 md:space-y-5">
                            <div className="space-y-3">
                                <div className="inline-block bg-highlight-purple border-4 border-primary px-4 py-1 shadow-neo transform -skew-x-3 -rotate-1">
                                    <span className="font-heading uppercase text-sm tracking-widest text-primary">Member Portal</span>
                                </div>
                                <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-widest text-primary leading-none">
                                    Sign In To<br />Your Account
                                </h2>
                                <p className="font-bold text-sm text-primary/80 uppercase tracking-wide">
                                    Use your official college Google account to continue.
                                </p>
                            </div>

                            {/* Domain Warning */}
                            <div className="border-4 border-primary bg-highlight-orange p-4 shadow-neo-sm transform -rotate-1 hover:rotate-0 transition-neo">
                                <p className="font-bold text-sm text-primary uppercase leading-snug">
                                    Authorization Notice:
                                </p>
                                <p className="font-semibold text-xs mt-1 text-primary">
                                    Only <span className="bg-white border-2 border-primary px-1.5 py-0.5 font-black inline-block transform rotate-1 shadow-neo-sm">@mitsgwalior.in</span> or <span className="bg-white border-2 border-primary px-1.5 py-0.5 font-black inline-block transform -rotate-1 shadow-neo-sm">@mitsgwl.ac.in</span> domains allowed.
                                </p>
                            </div>

                            {/* Login Area */}
                            <div className="flex flex-col items-center gap-3 bg-bg border-4 border-primary p-4 shadow-neo-sm transform rotate-1">
                                <div className="w-full flex justify-center bg-white border-4 border-primary p-2 shadow-neo hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all">

                                    {authLoading ? (
                                        <div className="flex items-center gap-3 px-4 py-2 opacity-60">
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            <span className="font-bold text-sm text-primary uppercase tracking-widest">
                                                Verifying…
                                            </span>
                                        </div>
                                    ) : (
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            useOneTap
                                            use_fedcm_for_prompt={false}
                                            theme="outline"
                                            size="large"
                                            width="280"
                                            text="continue_with"
                                        />
                                    )}
                                </div>

                                <p className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full border-2 border-primary ${authLoading ? 'bg-highlight-orange animate-pulse' : 'bg-highlight-teal animate-pulse'}`}></span>
                                    {authLoading ? 'Authentication in progress' : 'Awaiting Authentication'}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="border-t-4 border-solid border-primary pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm font-black text-primary uppercase tracking-wider">New here?</p>
                                <span className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase border-4 border-primary px-4 py-2 bg-highlight-teal shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-neo cursor-default select-none">
                                    Sign in to register <ArrowRight className="w-4 h-4 stroke-[3px]" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="mt-8 text-center bg-white border-4 border-primary px-4 py-2 shadow-neo inline-block mx-auto transform rotate-1 w-full max-w-max lg:max-w-none">
                        <p className="font-black text-xs uppercase tracking-widest text-primary">
                            Student Innovation Platform
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
```
