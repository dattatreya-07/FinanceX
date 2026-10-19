import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Calendar, 
  Sparkles, 
  Flame, 
  Share2, 
  UserPlus, 
  UserCheck, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';
import { User, AppNavView } from '../../types/schema';

export interface PublicProfileData {
  user_id: string | number;
  full_name: string;
  headline?: string;
  organization?: string;
  location?: string;
  avatar_url?: string;
  bio?: string;
  role?: string;
  current_streak?: number;
  xp_points?: number;
  accuracy?: string;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    isVerified: boolean;
  }>;
  skills?: string[];
}

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PublicProfileData | null;
  onNavigate?: (view: AppNavView, payload?: any) => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onNavigate
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !profile) return null;

  const defaultSkills = [
    'NISM Series XV Valuation',
    'Financial Modeling (DCF)',
    'SEBI RA Regulations 2014',
    '3-Stage DuPont ROE',
    'Option Greeks (Delta/Gamma)',
    'Financial Statement Analysis',
    'Macroeconomic Forecasting',
    'Equity Research Writing'
  ];

  const skillsList = profile.skills && profile.skills.length > 0 ? profile.skills : defaultSkills;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `?profile=${profile.user_id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col theme-transition"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition cursor-pointer"
          aria-label="Close Profile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* LinkedIn-Style Banner Cover Photo */}
          <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00E599_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md">
                FINANCEX VERIFIED SCHOLAR
              </span>
            </div>
          </div>

          {/* Profile Header Block */}
          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
              <div className="relative inline-block">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={profile.full_name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover ring-4 ring-white dark:ring-[#0B0F19] shadow-xl bg-slate-100"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B0F19]" title="Active Today" />
              </div>

              {/* Action Buttons: Connect, Message, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsConnected(!isConnected)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                    isConnected
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      : 'bg-[#FF5722] hover:bg-[#F4511E] text-white shadow-[#FF5722]/20'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>

                {onNavigate && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate('community');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span>Message</span>
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Share Profile Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {copiedLink && (
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-[#00E599] text-xs font-mono">
                ✓ Public profile link copied to clipboard!
              </div>
            )}

            {/* User Title & Headline */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white">
                  {profile.full_name}
                </h2>
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" title="SEBI RA Track Participant" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                {profile.headline || 'Equity Research Analyst Candidate | NISM Series XV Certification Track'}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.organization || 'Independent FinanceX Scholar'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.location || 'Mumbai, Maharashtra, India'}</span>
                </span>
              </div>
            </div>

            {/* Telemetry Stats Card */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 my-5 font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Knowledge XP</span>
                <span className="text-base sm:text-lg font-black text-[#FF5722] flex items-center justify-center gap-1 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{(profile.xp_points || 0).toLocaleString()}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Active Streak</span>
                <span className="text-base sm:text-lg font-black text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  <span>{profile.current_streak || 0}d</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Exam Accuracy</span>
                <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-[#00E599] flex items-center justify-center gap-1 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{profile.accuracy || '92%'}</span>
                </span>
              </div>
            </div>

            {/* About / Bio Section */}
            <div className="space-y-2 mb-6">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                About & Research Objective
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                {profile.bio || 'Passionate about Indian securities markets, discounted cash flow (DCF) intrinsic modeling, corporate governance standards, and SEBI (Research Analysts) Regulations, 2014. Preparing for full institutional clearance on NISM Series XV and building quantitative valuation models.'}
              </p>
            </div>

            {/* Certifications & Badges */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Licenses & Regulatory Credentials
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#00E599]/15 text-[#00E599]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        NISM-Series-XV: Research Analyst Certification
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        National Institute of Securities Markets (NISM) • Issued Feb 2026
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-[#00E599] shrink-0">
                    VERIFIED
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        NISM-Series-VIII: Equity Derivatives Certification
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        National Institute of Securities Markets (NISM) • Active Credential
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 shrink-0">
                    ACCREDITED
                  </span>
                </div>
              </div>
            </div>

            {/* Skills & Endorsements */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Skills & Endorsements
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
