import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  CheckCircle2
} from 'lucide-react';
import { User, Certificate, Certification, UserSocialLink, KnowledgeLevel, AppNavView } from '../../types/schema';

interface ProfileViewProps {
  user: User;
  certificates: Certificate[];
  certifications: Certification[];
  socialLinks: UserSocialLink[];
  knowledgeLevel: KnowledgeLevel;
  onNavigate: (view: AppNavView) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  certificates,
  certifications,
  socialLinks,
  knowledgeLevel,
  onNavigate
}) => {
  const platformIcons: Record<string, React.ReactNode> = {
    LINKEDIN: <Linkedin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
    TWITTER: <Twitter className="w-4 h-4 text-sky-500 dark:text-sky-400" />,
    GITHUB: <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
    WEBSITE: <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
  };

  return (
    <div className="space-y-6" id="profile-view">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden theme-transition">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/5 dark:bg-[#00E599]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-pink-500 dark:border-[#00E599] shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-500 dark:border-[#00E599] text-pink-600 dark:text-[#00E599] shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
                {user.full_name}
              </h1>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40 self-center md:self-auto">
                {knowledgeLevel.level_name}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {user.phone_number}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
              {socialLinks.map((sl) => (
                <a
                  key={sl.social_link_id}
                  href={sl.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs"
                  title={sl.platform}
                >
                  {platformIcons[sl.platform] || <Globe className="w-4 h-4" />}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-left">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 font-mono shadow-xs">
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                <Flame className="w-3 h-3 text-amber-500" />
                ACTIVE STREAK
              </div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {user.current_streak} Days
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 font-mono shadow-xs">
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                <Sparkles className="w-4 h-4 text-pink-600 dark:text-[#00E599]" />
                TOTAL XP
              </div>
              <div className="text-lg font-bold text-pink-600 dark:text-[#00E599] mt-0.5">
                {user.xp_points || 840} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Regulatory Credentials & Certificates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
              Verified Certificates & Digital Credentials
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Verifiable proof of regulatory exam completion and simulated trading mastery.
            </p>
          </div>

          <button
            onClick={() => onNavigate('certifications')}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shadow-xs"
          >
            Explore More Certifications
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map((cert) => {
            const certification = certifications.find(c => c.certification_id === cert.certification_id);

            return (
              <div
                key={cert.certificate_id}
                className="p-6 rounded-3xl bg-white border-pink-200 dark:bg-gradient-to-br dark:from-[#0F1826] dark:to-[#0A101C] dark:border-[#00E599]/40 border shadow-xs relative space-y-4 theme-transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    VERIFIED & ISSUED
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Issued: {cert.issued_at}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                    FINANCEX ACADEMY • {certification?.governing_body || 'NISM'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {certification?.certification_name || 'Certified Financial Strategist'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Awarded to <strong className="text-slate-900 dark:text-white">{cert.recipient_name}</strong> for scoring <strong className="text-pink-600 dark:text-[#00E599]">{cert.score_achieved}%</strong> in simulated regulatory assessment.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold">CERTIFICATE HASH ID</div>
                  <div className="text-cyan-700 dark:text-cyan-400 font-bold break-all">
                    {cert.certificate_number}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-pink-600 dark:text-[#00E599] hover:underline flex items-center gap-1 font-mono font-semibold"
                  >
                    <span>Public Verification Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => alert(`Certificate ${cert.certificate_number} download initiated (PDF with cryptographic signature).`)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-pink-600 dark:text-[#00E599]" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
