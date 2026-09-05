import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { FinanceXLogo } from '../brand/FinanceXLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { email: string; name: string; isNewUser?: boolean }) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('mkannankannanmkannan@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Kannan M');
  const [phoneNumber, setPhoneNumber] = useState('+91 98401 23456');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      email,
      name: mode === 'register' ? fullName : 'Kannan M',
      isNewUser: mode === 'register'
    });
  };

  const handleDemoLogin = (role: 'NISM_ASPIRANT' | 'BEGINNER' | 'QUANT') => {
    if (role === 'NISM_ASPIRANT') {
      onSuccess({ email: 'mkannankannanmkannan@gmail.com', name: 'Kannan M', isNewUser: false });
    } else if (role === 'BEGINNER') {
      onSuccess({ email: 'aditi.investor@gmail.com', name: 'Aditi Rao', isNewUser: true });
    } else {
      onSuccess({ email: 'vikram.quant@gmail.com', name: 'Vikram Sen', isNewUser: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md" id="auth-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden theme-transition"
      >
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-[#00E599]/10 rounded-full filter blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 dark:bg-[#FF2E7E]/10 rounded-full filter blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <FinanceXLogo size="md" variant="full" />
          <h3 className="text-xl font-display font-black text-slate-900 dark:text-white mt-4">
            {mode === 'login' && 'Welcome Back to FinanceX'}
            {mode === 'register' && 'Create Your FinanceX Account'}
            {mode === 'forgot' && 'Reset Security Credentials'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {mode === 'login' && 'Access your simulated portfolio, NISM study plans & AI tutor.'}
            {mode === 'register' && 'Join thousands preparing for finance certifications & simulated trading.'}
            {mode === 'forgot' && 'Enter your registered email to receive a secure recovery code.'}
          </p>
        </div>

        {/* Form */}
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
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kannan M"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">PHONE NUMBER</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="tel"
                    required
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
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@financex.com"
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
                    onClick={() => setMode('forgot')}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599] transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {mode === 'login' && 'Sign In to Dashboard'}
              {mode === 'register' && 'Create Free Account & Start'}
              {mode === 'forgot' && 'Send Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              ⚡ Quick Demo Profiles
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-[#00E599] font-bold">One-Click Test</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('NISM_ASPIRANT')}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-400 dark:hover:border-[#00E599]/60 text-left transition group cursor-pointer"
            >
              <div className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-[#FF2E7E] dark:group-hover:text-[#00E599]">Kannan M</div>
              <div className="text-[9px] text-slate-500">NISM Aspirant</div>
            </button>
            <button
              onClick={() => handleDemoLogin('BEGINNER')}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-400 dark:hover:border-[#FF2E7E]/60 text-left transition group cursor-pointer"
            >
              <div className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-[#FF2E7E]">Aditi Rao</div>
              <div className="text-[9px] text-slate-500">New Learner</div>
            </button>
            <button
              onClick={() => handleDemoLogin('QUANT')}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-400/60 text-left transition group cursor-pointer"
            >
              <div className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">Vikram Sen</div>
              <div className="text-[9px] text-slate-500">Quant Trader</div>
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
          {mode === 'login' ? (
            <span>
              New to FinanceX?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-pink-600 dark:text-[#00E599] font-bold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-pink-600 dark:text-[#00E599] font-bold hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};
