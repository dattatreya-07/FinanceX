import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Phone, ArrowRight, Loader2, ShieldCheck, CheckCircle2, RotateCcw, KeyRound } from 'lucide-react';
import { FinanceXLogo } from '../brand/FinanceXLogo';
import { authService, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../../services/authService';
import { adminService } from '../../services/adminService';
import { UserRole } from '../../types/schema';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { email: string; name: string; isNewUser?: boolean; isDemoUser?: boolean; role?: UserRole }) => void;
  initialMode?: 'login' | 'register' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify' | 'admin'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFillAdminDefaults = () => {
    setEmail(DEFAULT_ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setResendStatus(null);

    if (mode === 'login' || mode === 'admin') {
      const { user, error } = await authService.signIn(email, password);
      setIsLoading(false);
      
      if (error === 'EMAIL_NOT_CONFIRMED') {
        setMode('verify');
        return;
      }

      if (error) {
        setErrorMessage(error);
        return;
      }

      // Check Administrative privileges if in Admin mode
      if (mode === 'admin') {
        if (!adminService.hasAdminPrivileges(user)) {
          setErrorMessage('Access Denied: This account lacks administrative credentials. Please sign in as a standard learner or contact a platform Super Admin.');
          return;
        }
      }

      onSuccess({
        email: user?.email || email,
        name: user?.full_name || email.split('@')[0],
        isNewUser: false,
        isDemoUser: false,
        role: user?.role
      });
    } else if (mode === 'register') {
      const { user, error } = await authService.signUp(email, password, fullName, phoneNumber);
      setIsLoading(false);
      if (error) {
        setErrorMessage(error);
        return;
      }
      onSuccess({
        email: user?.email || email,
        name: user?.full_name || fullName,
        isNewUser: true,
        isDemoUser: false
      });
    } else {
      setIsLoading(false);
      setErrorMessage('Password reset instructions have been dispatched to your email address.');
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setErrorMessage('Please enter your registered email address first.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    const { success, error } = await authService.resendVerificationEmail(email);
    setIsLoading(false);
    if (success) {
      setResendStatus('Verification link re-sent! Please check your inbox and spam folder.');
    } else {
      setErrorMessage(error || 'Failed to resend confirmation email.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { user, error, redirected } = await authService.signInWithGoogle();
      setIsLoading(false);
      if (redirected) return;
      if (error) {
        setErrorMessage(error);
        return;
      }
      if (user) {
        onSuccess({
          email: user.email,
          name: user.full_name,
          isNewUser: false,
          isDemoUser: false,
          role: user.role
        });
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md" id="auth-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden theme-transition"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/10 dark:bg-[#FF2E7E]/10 rounded-full filter blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 dark:bg-[#00E599]/10 rounded-full filter blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <FinanceXLogo size="md" variant="full" />
          <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mt-4 flex items-center justify-center gap-2">
            {mode === 'login' && 'Sign In to FinanceX'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Security Credentials'}
            {mode === 'verify' && 'Verify Your Email Address'}
            {mode === 'admin' && (
              <>
                <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Admin Portal Login</span>
              </>
            )}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
            {mode === 'login' && 'Access your simulated trading terminal, NISM courses & personalized portfolio.'}
            {mode === 'register' && 'Join FinanceX to access market simulators, TradingView charts & masterclasses.'}
            {mode === 'forgot' && 'Enter your registered email to receive account recovery instructions.'}
            {mode === 'verify' && 'Please confirm your email address to unlock private workspace access.'}
            {mode === 'admin' && 'Restricted portal for LMS managers, curriculum faculty, and super administrators.'}
          </p>

          {/* Clean Segmented Mode Switcher */}
          {mode !== 'verify' && (
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full mt-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('admin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* Email Verification Screen */}
        {mode === 'verify' ? (
          <div className="space-y-4 text-center py-2 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Confirmation Link Sent
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                We sent a secure verification email to <strong className="text-slate-900 dark:text-white font-mono">{email || 'your registered address'}</strong>. Please open the link in your inbox to verify your identity.
              </p>
            </div>

            {resendStatus && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-[#00E599] text-xs font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resendStatus}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                <span>Resend Verification Email</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setResendStatus(null);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* Form for Login / Register / Forgot / Admin */
          <div className="space-y-3.5">
            {/* Google Sign In Option */}
            {(mode === 'login' || mode === 'register') && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}</span>
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-[#0B0F19] px-2.5 text-[10px] font-mono uppercase text-slate-400">
                    or continue with email
                  </span>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">FULL NAME</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="e.g. Dattatreya V"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">PHONE NUMBER (OPTIONAL)</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599] transition"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                {mode === 'admin' ? 'ADMINISTRATOR EMAIL' : 'EMAIL OR USERNAME'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder={mode === 'admin' ? 'admin@financex.com' : 'user@example.com or username'}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599] transition"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">PASSWORD</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                      }}
                      className="text-[11px] text-pink-600 dark:text-[#00E599] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="Enter password"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599] transition"
                  />
                </div>
              </div>
            )}

            {/* Admin Auto-Fill Helper */}
            {mode === 'admin' && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-purple-950 dark:text-purple-300">
                  <KeyRound className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="font-mono text-[11px]">Default: admin@financex.com</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillAdminDefaults}
                  className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  Quick Fill
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 py-3.5 rounded-xl text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                mode === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-[#FF2E7E] hover:bg-[#E61E6D] dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In to Terminal'}
                    {mode === 'register' && 'Create Account & Begin'}
                    {mode === 'forgot' && 'Send Reset Link'}
                    {mode === 'admin' && 'Authenticate as Administrator'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Back to Sign In
              </button>
            )}

            {mode === 'login' && (
              <div className="text-center pt-2 text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#FF2E7E] dark:text-[#00E599] hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            )}

            {mode === 'register' && (
              <div className="text-center pt-2 text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#FF2E7E] dark:text-[#00E599] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            )}
          </form>
        </div>
        )}
      </motion.div>
    </div>
  );
};
