import React from 'react';
import { ShieldAlert, ArrowLeft, GraduationCap, Shield, User } from 'lucide-react';
import { User as UserType, AppNavView } from '../../types/schema';
import { authService } from '../../services/authService';

interface UnauthorizedRoleViewProps {
  currentUser: UserType;
  requiredRole: 'INSTRUCTOR' | 'ADMIN';
  onNavigate: (view: AppNavView) => void;
  onRoleChanged: (updatedUser: UserType) => void;
}

export const UnauthorizedRoleView: React.FC<UnauthorizedRoleViewProps> = ({
  currentUser,
  requiredRole,
  onNavigate,
  onRoleChanged
}) => {
  const currentRole = currentUser.role?.toUpperCase() || 'USER';

  const handleSwitchToRequired = () => {
    const target = requiredRole === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'ADMIN';
    const updated = authService.switchDemoRole(target);
    onRoleChanged(updated);
    onNavigate(requiredRole === 'INSTRUCTOR' ? 'instructor' : 'admin');
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
      <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 shadow-lg">
        <ShieldAlert className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Access Restricted • Role Boundary Guard
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {requiredRole === 'INSTRUCTOR' ? 'Instructor Portal Required' : 'Administrative Privileges Required'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Your current active session is signed in as <strong className="text-slate-900 dark:text-white">{currentUser.full_name}</strong> with role <span className="font-mono font-bold text-emerald-600">[{currentRole}]</span>. This workspace requires <span className="font-mono font-bold text-amber-500">[{requiredRole}]</span> authorization.
        </p>
      </div>

      {currentUser.isDemoUser ? (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1320] border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2">
          <div className="font-bold text-slate-900 dark:text-white">Demo Mode Persona Switching:</div>
          <p className="text-slate-500 text-[11px]">
            In sandbox evaluation mode, you can switch personas to inspect this authorized workspace:
          </p>
          <button
            onClick={handleSwitchToRequired}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {requiredRole === 'INSTRUCTOR' ? <GraduationCap className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            <span>Switch to {requiredRole === 'INSTRUCTOR' ? 'Instructor' : 'Administrator'} Persona</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2">
          <div className="font-bold text-slate-900 dark:text-white">Institutional Authorization Notice</div>
          <p className="text-slate-500 text-[11px]">
            This workspace is restricted to verified institutional faculty and administrators. If you require faculty access for your university cohort, contact your institutional LMS administrator.
          </p>
        </div>
      )}

      <div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Learner Dashboard</span>
        </button>
      </div>
    </div>
  );
};

