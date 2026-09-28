import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl w-full max-w-md border border-[#e0e3eb] shadow-2xl overflow-hidden p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#787b86] hover:text-[#131722] hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-[#089981] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#131722]">Welcome to TradingView!</h3>
            <p className="text-xs text-[#787b86]">
              Your account is active. You can now save watchlists, alerts, and custom Supercharts layouts.
            </p>
          </div>
        ) : (
          <div>
            {/* TV Logo */}
            <div className="mb-4">
              <svg className="w-8 h-8 fill-black" viewBox="0 0 36 28" fill="none">
                <path d="M14 22H7V10H14V22Z" fill="currentColor" />
                <path d="M0 6V0H36V6H23V28H16V6H0Z" fill="currentColor" />
                <path d="M29 28H36V14H29V28Z" fill="currentColor" />
              </svg>
            </div>

            <h2 className="text-2xl font-extrabold text-[#131722] tracking-tight mb-1">
              {mode === 'signup' ? 'Love every chart' : 'Welcome back'}
            </h2>
            <p className="text-xs text-[#787b86] mb-6">
              {mode === 'signup'
                ? 'Join 60+ million traders and investors making smarter moves.'
                : 'Sign in to access your custom layouts and watchlists.'}
            </p>

            {/* Social Logins */}
            <div className="space-y-2.5 mb-5">
              <button
                onClick={() => setSubmitted(true)}
                className="w-full py-2.5 px-4 border border-[#e0e3eb] hover:bg-[#f0f3fa] rounded-xl text-xs font-bold text-[#131722] flex items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => setSubmitted(true)}
                className="w-full py-2.5 px-4 border border-[#e0e3eb] hover:bg-[#f0f3fa] rounded-xl text-xs font-bold text-[#131722] flex items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                <span className="text-base leading-none"></span>
                Continue with Apple
              </button>
            </div>

            <div className="relative my-4 text-center">
              <hr className="border-[#e0e3eb]" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-2 text-[10px] text-[#787b86] uppercase font-bold tracking-wider">
                Or with email
              </span>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f0f3fa] border border-transparent focus:border-[#2962ff] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#131722] font-medium focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full tv-get-started-btn text-white text-xs font-bold py-2.5 rounded-xl shadow-sm cursor-pointer"
              >
                {mode === 'signup' ? 'Create free account' : 'Sign in'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-[#787b86]">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-[#2962ff] font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-[#2962ff] font-semibold hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
