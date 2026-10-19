import React, { useState, useRef } from 'react';
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
  CheckCircle2,
  UserCheck, 
  Edit3,
  UploadCloud,
  FileText,
  Award,
  Building2,
  Trash2,
  Plus,
  Clock,
  Check,
  Camera,
  AlertCircle
} from 'lucide-react';
import { User, Certificate, Certification, UserSocialLink, KnowledgeLevel, AppNavView, UploadedUserCertificate } from '../../types/schema';
import { mediaService } from '../../services/mediaService';

interface ProfileViewProps {
  user: User;
  certificates: Certificate[];
  certifications: Certification[];
  socialLinks: UserSocialLink[];
  knowledgeLevel: KnowledgeLevel;
  onNavigate: (view: AppNavView) => void;
  onUpdateUser?: (updated: Partial<User>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  certificates,
  certifications,
  socialLinks,
  knowledgeLevel,
  onNavigate,
  onUpdateUser
}) => {
  // Profile Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.full_name || '');
  const [editEmail, setEditEmail] = useState(user.email || '');
  const [editPhone, setEditPhone] = useState(user.phone_number || '');
  const [editHeadline, setEditHeadline] = useState(user.headline || 'Quantitative Finance Aspirant & Algorithmic Trader');
  const [editBio, setEditBio] = useState(user.bio || 'Passionate about Indian capital markets, derivatives margining models, and regulatory compliance. Preparing for NISM Series VIII & Research Analyst roles.');
  const [editOrganization, setEditOrganization] = useState(user.organization || 'Department of Management Studies / Quant Desk');
  const [editAvatarUrl, setEditAvatarUrl] = useState(user.avatar_url || '');

  // Certificate Upload Modal State
  const [isUploadCertModalOpen, setIsUploadCertModalOpen] = useState(false);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('NISM (National Institute of Securities Markets)');
  const [certIssueDate, setCertIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [certExpiryDate, setCertExpiryDate] = useState('');
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certCredentialUrl, setCertCredentialUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const uploadedCerts: UploadedUserCertificate[] = user.uploaded_certificates || [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        full_name: editName,
        email: editEmail,
        phone_number: editPhone,
        headline: editHeadline,
        bio: editBio,
        organization: editOrganization,
        avatar_url: editAvatarUrl
      });
    }
    setIsEditModalOpen(false);
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await mediaService.uploadFile(file, {
        bucket: 'educational-assets',
        folder: 'avatars',
        maxSizeBytes: 5 * 1024 * 1024,
        allowedMimeTypes: ['image/*']
      });
      setEditAvatarUrl(res.url);
      if (onUpdateUser) {
        onUpdateUser({ avatar_url: res.url });
      }
    } catch (err: any) {
      alert(`Avatar upload failed: ${err.message}`);
    }
  };

  const handleUploadCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certIssuer.trim()) {
      setUploadError('Please specify the Certificate Name and Issuing Body.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(15);

    try {
      let fileUrl = '';
      let fileName = '';
      let fileSizeBytes = 0;

      if (uploadedFile) {
        setUploadProgress(40);
        const res = await mediaService.uploadFile(uploadedFile, {
          bucket: 'user-certificates',
          folder: `user_${user.user_id}`,
          maxSizeBytes: 25 * 1024 * 1024,
          onProgress: (p) => setUploadProgress(40 + Math.round(p * 0.5))
        });
        fileUrl = res.url;
        fileName = res.fileName;
        fileSizeBytes = res.sizeBytes;
      }

      setUploadProgress(95);

      const newCert: UploadedUserCertificate = {
        id: `ucert-${Date.now()}`,
        certificate_name: certName.trim(),
        issuing_organization: certIssuer.trim(),
        issue_date: certIssueDate,
        expiry_date: certExpiryDate || undefined,
        credential_id: certCredentialId.trim() || `FX-CRED-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        credential_url: certCredentialUrl.trim() || undefined,
        file_url: fileUrl || undefined,
        file_name: fileName || undefined,
        file_size_bytes: fileSizeBytes || undefined,
        verification_status: 'SELF_ATTESTED'
      };

      const updatedList = [newCert, ...uploadedCerts];

      if (onUpdateUser) {
        onUpdateUser({ uploaded_certificates: updatedList });
      }

      // Reset modal
      setCertName('');
      setCertCredentialId('');
      setCertCredentialUrl('');
      setUploadedFile(null);
      setUploadProgress(100);
      setIsUploadCertModalOpen(false);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload certificate.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUploadedCert = (certId: string) => {
    if (!confirm('Are you sure you want to remove this uploaded certificate?')) return;
    const filtered = uploadedCerts.filter(c => c.id !== certId);
    if (onUpdateUser) {
      onUpdateUser({ uploaded_certificates: filtered });
    }
  };

  const platformIcons: Record<string, React.ReactNode> = {
    LINKEDIN: <Linkedin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
    TWITTER: <Twitter className="w-4 h-4 text-sky-500 dark:text-sky-400" />,
    GITHUB: <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
    WEBSITE: <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
  };

  return (
    <div className="space-y-8" id="profile-view">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden theme-transition">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 dark:bg-[#00E599]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar with Upload button */}
          <div className="relative group">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
              alt={user.full_name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-pink-500 dark:border-[#00E599] shadow-md"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold transition cursor-pointer"
              title="Change Profile Photo"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span>Change Photo</span>
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileSelect}
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-pink-500 dark:border-[#00E599] text-pink-600 dark:text-[#00E599] shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
                {user.full_name}
              </h1>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40 self-center md:self-auto">
                {knowledgeLevel.level_name}
              </span>
              {user.role && user.role !== 'USER' && (
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 self-center md:self-auto">
                  {user.role}
                </span>
              )}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition text-xs font-semibold flex items-center gap-1.5 self-center md:self-auto cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
                title="Edit Profile"
              >
                <Edit3 className="w-3.5 h-3.5 text-pink-600 dark:text-[#00E599]" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Headline & Organization */}
            <p className="text-sm font-semibold text-pink-600 dark:text-[#00E599]">
              {user.headline || 'Quantitative Finance Aspirant & Algorithmic Trader'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {user.organization || 'IIT Madras / Quant Desk'}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
              {user.phone_number && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone_number}
                </span>
              )}
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
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
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 font-mono shadow-xs">
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                ACTIVE STREAK
              </div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {user.current_streak} Days
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 font-mono shadow-xs">
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-[#00E599]" />
                TOTAL XP
              </div>
              <div className="text-lg font-bold text-pink-600 dark:text-[#00E599] mt-0.5">
                {user.xp_points ?? 0} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded User Certificates & External Credentials */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-600 dark:text-[#00E599]" />
              My Uploaded Credentials & NISM/NPTEL Certificates
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Upload and showcase external certificates from NISM, NPTEL, SEBI, CFA, and Unstop.
            </p>
          </div>

          <button
            onClick={() => setIsUploadCertModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Certificate</span>
          </button>
        </div>

        {uploadedCerts.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-[#00E599]/10 text-pink-600 dark:text-[#00E599] flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No External Certificates Uploaded Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Showcase your achievements by uploading your official NISM Series VIII/XV, NPTEL, CFA, or university certificates (PDF / Images).
            </p>
            <button
              onClick={() => setIsUploadCertModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white transition cursor-pointer"
            >
              Upload Your First Certificate
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedCerts.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs relative space-y-3 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    {cert.verification_status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500">
                      Issued: {cert.issue_date}
                    </span>
                    <button
                      onClick={() => handleDeleteUploadedCert(cert.id)}
                      className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500 transition cursor-pointer"
                      title="Remove Certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-pink-600 dark:text-[#00E599] font-bold uppercase tracking-wider">
                    {cert.issuing_organization}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {cert.certificate_name}
                  </h3>
                  {cert.credential_id && (
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                      ID: <span className="text-slate-700 dark:text-slate-300 font-semibold">{cert.credential_id}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-pink-600 dark:text-[#00E599] hover:underline flex items-center gap-1 font-mono font-semibold"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">Attested on FinanceX</span>
                  )}

                  {cert.file_url && (
                    <a
                      href={cert.file_url}
                      target="_blank"
                      download={cert.file_name || 'certificate.pdf'}
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-pink-600 dark:text-[#00E599]" />
                      <span>View File</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Academy Certificates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
              FinanceX Institutional Digital Credentials
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Verifiable cryptographic proof of NISM regulatory mock exam mastery.
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

      {/* Edit Profile Details Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="w-full max-w-xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Edit Professional Profile
                </h3>
                <p className="text-xs text-slate-500">Update your public identity, bio, and organizational affiliations.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  placeholder="e.g. NISM Series VIII Candidate | Algorithmic Trader"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Institution / Organization
                  </label>
                  <input
                    type="text"
                    value={editOrganization}
                    onChange={(e) => setEditOrganization(e.target.value)}
                    placeholder="e.g. IIT Madras, IIM-A, Quant Desk"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Biography / Summary
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share your background, learning trajectory, and trading goals..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload External Certificate Modal */}
      {isUploadCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-pink-600 dark:text-[#00E599]" />
                  Upload External Certificate
                </h3>
                <p className="text-xs text-slate-500">Attach NISM, NPTEL, SEBI, CFA, or University certificates.</p>
              </div>
              <button
                onClick={() => setIsUploadCertModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadCertificateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Certificate Name *
                </label>
                <input
                  type="text"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="e.g. NISM Series VIII: Equity Derivatives Certification"
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Issuing Organization *
                </label>
                <select
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                >
                  <option value="NISM (National Institute of Securities Markets)">NISM (National Institute of Securities Markets)</option>
                  <option value="NPTEL / IIT Madras">NPTEL / IIT Madras</option>
                  <option value="SEBI (Securities and Exchange Board of India)">SEBI</option>
                  <option value="CFA Institute">CFA Institute</option>
                  <option value="NSE Academy">NSE Academy</option>
                  <option value="BSE Institute">BSE Institute</option>
                  <option value="AMFI (Association of Mutual Funds in India)">AMFI</option>
                  <option value="Unstop National Competitions">Unstop Competitions</option>
                  <option value="University / Professional Body">University / Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Date of Issue *
                  </label>
                  <input
                    type="date"
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={certExpiryDate}
                    onChange={(e) => setCertExpiryDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Credential ID / Roll No.
                  </label>
                  <input
                    type="text"
                    value={certCredentialId}
                    onChange={(e) => setCertCredentialId(e.target.value)}
                    placeholder="e.g. NISM-2026-ED-8849"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Public Verification Link
                  </label>
                  <input
                    type="url"
                    value={certCredentialUrl}
                    onChange={(e) => setCertCredentialUrl(e.target.value)}
                    placeholder="https://nism.ac.in/verify?id=..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                  />
                </div>
              </div>

              {/* File Attachment Dropzone */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Certificate Document (PDF or Image, max 25MB)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-pink-500 dark:hover:border-[#00E599] text-center cursor-pointer transition bg-slate-50 dark:bg-slate-950/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  />
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-[#00E599]">
                      <FileText className="w-5 h-5" />
                      <span>{uploadedFile.name} ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <UploadCloud className="w-6 h-6 mx-auto text-slate-400" />
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Click to select PDF or image file
                      </div>
                      <div className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25MB</div>
                    </div>
                  )}
                </div>
              </div>

              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>Uploading to secure vault...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-pink-600 dark:bg-[#00E599] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsUploadCertModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Save & Publish Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
