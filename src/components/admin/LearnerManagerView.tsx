import React, { useState } from 'react';
import { Users, Search, ShieldCheck, Flame, Sparkles, Award, Mail, Building2, Eye, UserCog, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { User, Certificate, UserRole } from '../../types/schema';
import { adminService } from '../../services/adminService';

interface LearnerManagerViewProps {
  learners: User[];
  certificates: Certificate[];
  currentUser?: User;
  onUpdateLearnerRole?: (userId: string | number, newRole: UserRole) => void;
}

export const LearnerManagerView: React.FC<LearnerManagerViewProps> = ({
  learners,
  certificates,
  currentUser,
  onUpdateLearnerRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | string>('ALL');
  const [selectedLearnerForRole, setSelectedLearnerForRole] = useState<User | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('USER');
  const [roleReason, setRoleReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredLearners = learners.filter(l => {
    const matchesSearch = l.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (l.organization && l.organization.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || (l.role || 'USER') === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenRoleModal = (learner: User) => {
    setSelectedLearnerForRole(learner);
    setTargetRole(learner.role || 'USER');
    setRoleReason('');
    setFeedback(null);
  };

  const handleSaveRole = async () => {
    if (!selectedLearnerForRole || !currentUser) return;
    setIsUpdating(true);
    setFeedback(null);

    const res = await adminService.updateUserRole(
      currentUser,
      selectedLearnerForRole.user_id,
      targetRole,
      roleReason.trim() || 'Role modification via Admin LMS Panel'
    );

    setIsUpdating(false);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: `Successfully updated ${selectedLearnerForRole.full_name}'s role to ${targetRole}.`
      });
      if (onUpdateLearnerRole) {
        onUpdateLearnerRole(selectedLearnerForRole.user_id, targetRole);
      }
      setTimeout(() => {
        setSelectedLearnerForRole(null);
      }, 1500);
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to update user role.'
      });
    }
  };

  const handleQuickToggleAdmin = async (learner: User) => {
    if (!currentUser) return;
    const isCurrentlyAdmin = learner.role === 'ADMIN' || learner.role === 'SUPER_ADMIN';
    const newRole: UserRole = isCurrentlyAdmin ? 'USER' : 'ADMIN';
    const res = await adminService.updateUserRole(
      currentUser,
      learner.user_id,
      newRole,
      isCurrentlyAdmin ? 'Administrative access revoked' : 'Promoted to Administrator by Admin'
    );
    if (res.success && onUpdateLearnerRole) {
      onUpdateLearnerRole(learner.user_id, newRole);
    }
  };

  return (
    <div className="space-y-6" id="learner-manager-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Learner Directory & Admin Governance
          </h1>
          <p className="text-xs text-slate-500">
            Platform user directory, one-click admin delegation, and audit-logged permissions.
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-slate-500">
          Total Users: <strong className="text-slate-900 dark:text-white">{learners.length}</strong>
        </div>
      </div>

      {/* Admin Governance Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent border border-purple-200 dark:border-purple-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200">
              Administrator Delegation Authority
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              As an Administrator, you can promote any registered user to Admin status with full access to curriculum management, question banks, and platform settings.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search learner by name, email, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="USER">Standard Learner</option>
          <option value="ADMIN">Administrator</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="CONTENT_ADMIN">Content Admin</option>
          <option value="INSTRUCTOR">Instructor / Faculty</option>
        </select>
      </div>

      {/* Learners Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLearners.map((learner) => {
          const userCerts = (learner.uploaded_certificates?.length || 0) + 
                            certificates.filter(c => String(c.user_id) === String(learner.user_id)).length;
          const isAdmin = learner.role === 'ADMIN' || learner.role === 'SUPER_ADMIN';

          return (
            <div
              key={learner.user_id}
              className={`p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border shadow-xs space-y-3 transition group theme-transition ${
                isAdmin 
                  ? 'border-purple-300 dark:border-purple-800/80 ring-1 ring-purple-500/20' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-[#00E599]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={learner.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={learner.full_name}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {learner.full_name}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-mono truncate">
                      {learner.email}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {learner.role || 'USER'}
                </span>
              </div>

              {learner.organization && (
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{learner.organization}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div className="text-[10px] text-slate-400">STREAK</div>
                  <div className="font-bold text-amber-500">{learner.current_streak || 0}d</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div className="text-[10px] text-slate-400">TOTAL XP</div>
                  <div className="font-bold text-pink-600 dark:text-[#00E599]">{learner.xp_points || 0}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div className="text-[10px] text-slate-400">CERTS</div>
                  <div className="font-bold text-blue-500">{userCerts}</div>
                </div>
              </div>

              {/* Action Buttons: 1-Click Make Admin & Role Config */}
              <div className="pt-1 space-y-2">
                <button
                  onClick={() => handleQuickToggleAdmin(learner)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    isAdmin
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAdmin ? 'Revoke Admin Privileges' : 'Make Administrator'}</span>
                </button>

                <button
                  onClick={() => handleOpenRoleModal(learner)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span>Custom Role Permissions</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Management Modal */}
      {selectedLearnerForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl theme-transition relative">
            <button
              onClick={() => setSelectedLearnerForRole(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <UserCog className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-display font-black text-slate-900 dark:text-white">
                  Modify Role & Access Level
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedLearnerForRole.full_name} ({selectedLearnerForRole.email})
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ASSIGNED PLATFORM ROLE
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
                >
                  <option value="USER">Standard Learner (USER)</option>
                  <option value="ADMIN">Administrator (ADMIN)</option>
                  <option value="SUPER_ADMIN" disabled={currentUser?.role?.toUpperCase() !== 'SUPER_ADMIN'}>
                    Super Administrator (SUPER_ADMIN) {currentUser?.role?.toUpperCase() !== 'SUPER_ADMIN' ? '— (Requires Super Admin)' : ''}
                  </option>
                  <option value="CONTENT_ADMIN">Content Administrator (CONTENT_ADMIN)</option>
                  <option value="INSTRUCTOR">Faculty / Instructor (INSTRUCTOR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  AUDIT LOG REASON / REMARKS
                </label>
                <textarea
                  rows={2}
                  value={roleReason}
                  onChange={(e) => setRoleReason(e.target.value)}
                  placeholder="e.g. Faculty onboarding for NISM Series VIII curriculum..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {feedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-[#00E599] border border-emerald-200 dark:border-emerald-500/30'
                    : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedLearnerForRole(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSaveRole}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Recording Audit...' : 'Save & Log Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
