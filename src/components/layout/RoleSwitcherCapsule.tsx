import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Shield, 
  ChevronDown, 
  Sparkles,
  Check
} from 'lucide-react';
import { User, AppNavView } from '../../types/schema';
import { authService } from '../../services/authService';

interface RoleSwitcherCapsuleProps {
  currentUser: User;
  onRoleChanged: (updatedUser: User) => void;
  onNavigate: (view: AppNavView) => void;
}

export const RoleSwitcherCapsule: React.FC<RoleSwitcherCapsuleProps> = ({
  currentUser,
  onRoleChanged,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentRole = currentUser.role?.toUpperCase() || 'USER';
  const isInstructor = currentRole === 'INSTRUCTOR';
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'INSTITUTION_ADMIN'].includes(currentRole);
  const isDemo = Boolean(currentUser.isDemoUser);
  const canSwitchRole = isDemo || isAdmin;

  const handleSelectRole = (targetRole: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN') => {
    if (!canSwitchRole) return;
    setIsOpen(false);
    const updatedUser = authService.switchDemoRole(targetRole);
    onRoleChanged(updatedUser);

    if (targetRole === 'INSTRUCTOR') {
      onNavigate('instructor');
    } else if (targetRole === 'ADMIN') {
      onNavigate('admin');
    } else {
      onNavigate('dashboard');
    }
  };

  // If a standard production learner (not demo and not admin), display verified role badge without switcher dropdown
  if (!canSwitchRole) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs font-bold backdrop-blur-md">
        <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
        <span className="hidden sm:inline">Role:</span>
        <span className="text-emerald-200">Learner</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-mono text-xs font-bold transition shadow-xs cursor-pointer backdrop-blur-md"
        aria-label="Switch Demo User Role"
      >
        {isAdmin ? (
          <Shield className="w-3.5 h-3.5 text-amber-300" />
        ) : isInstructor ? (
          <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
        ) : (
          <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
        )}
        <span className="hidden sm:inline">Role:</span>
        <span className="text-amber-200">
          {isAdmin ? 'Admin' : isInstructor ? 'Instructor' : 'Learner'}
        </span>
        <ChevronDown className="w-3 h-3 text-white/80" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-[#0E1320] border border-slate-200 dark:border-slate-700 shadow-2xl z-50 text-xs theme-transition animate-fade-in">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Switch Institutional Persona
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Simulates authentic multi-role workflows in sample demo mode.
            </div>
          </div>

          {/* Option 1: Learner */}
          <button
            onClick={() => handleSelectRole('LEARNER')}
            className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
              !isInstructor && !isAdmin
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                🎓
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Learner</div>
                <div className="text-[10px] text-slate-500">Alex Rivera (Student)</div>
              </div>
            </div>
            {!isInstructor && !isAdmin && <Check className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Option 2: Instructor */}
          <button
            onClick={() => handleSelectRole('INSTRUCTOR')}
            className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
              isInstructor
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
                👨‍🏫
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Instructor</div>
                <div className="text-[10px] text-slate-500">Dr. R. Subramanian (Faculty)</div>
              </div>
            </div>
            {isInstructor && <Check className="w-4 h-4 text-cyan-600" />}
          </button>

          {/* Option 3: Administrator */}
          <button
            onClick={() => handleSelectRole('ADMIN')}
            className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
              isAdmin
                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                🛡️
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Administrator</div>
                <div className="text-[10px] text-slate-500">Lead System Admin (Super Admin)</div>
              </div>
            </div>
            {isAdmin && <Check className="w-4 h-4 text-purple-600" />}
          </button>
        </div>
      )}
    </div>
  );
};

