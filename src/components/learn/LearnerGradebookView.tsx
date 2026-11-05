import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink, 
  FileCheck, 
  GraduationCap, 
  QrCode, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  User, 
  X 
} from 'lucide-react';
import { User as UserType, CourseEnrollmentRecord, AppNavView } from '../../types/schema';
import { lmsService } from '../../services/lmsService';

interface LearnerGradebookViewProps {
  currentUser: UserType;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const LearnerGradebookView: React.FC<LearnerGradebookViewProps> = ({
  currentUser,
  onNavigate
}) => {
  const [enrollments, setEnrollments] = useState<CourseEnrollmentRecord[]>([]);
  const [activeCertificate, setActiveCertificate] = useState<{
    certificateId: string;
    courseTitle: string;
    learnerName: string;
    issueDate: string;
    grade: string;
  } | null>(null);

  // Certificate Verification Tool State
  const [verifyIdInput, setVerifyIdInput] = useState('FX-CERT-2026-0814');
  const [verificationResult, setVerificationResult] = useState<ReturnType<typeof lmsService.verifyCertificate> | null>(() => {
    return lmsService.verifyCertificate('FX-CERT-2026-0814');
  });

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyIdInput.trim()) return;
    const res = lmsService.verifyCertificate(verifyIdInput);
    setVerificationResult(res);
  };

  useEffect(() => {
    const refresh = () => {
      setEnrollments(lmsService.getLearnerEnrollments(currentUser.user_id));
    };

    refresh();
    return lmsService.subscribe(refresh);
  }, [currentUser.user_id]);

  const totalLearningHours = enrollments.reduce((sum, e) => sum + e.learning_hours, 0);
  const avgOverallProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_pct, 0) / enrollments.length)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#022C22] p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md text-xs font-mono font-bold tracking-wide ${
              currentUser.isDemoUser 
                ? 'bg-white/10 text-amber-300' 
                : 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentUser.isDemoUser 
                ? 'DEMO MODE — Sample learner records and progress' 
                : 'Accredited NISM & CFA Track • Verified Academic Record'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Academic Gradebook & Transcripts
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Consolidated academic performance records, module milestones, certified grades, and verifiable NISM credentials for {currentUser.full_name}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center sm:text-left">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Total Learning</div>
              <div className="text-xl sm:text-2xl font-black text-white">{totalLearningHours.toFixed(1)} hrs</div>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">Average Progress</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">{avgOverallProgress}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Grade Table */}
      <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>Course Enrolment & Performance Roster</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {enrollments.length} Active Enrolment{enrollments.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-mono">
                <th className="py-3 px-4">Course Title & Batch</th>
                <th className="py-3 px-4">Syllabus Progress</th>
                <th className="py-3 px-4 text-center">Lessons</th>
                <th className="py-3 px-4 text-center">Quiz Avg</th>
                <th className="py-3 px-4 text-center">Assignment Avg</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">No Active Course Enrolments</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          You are not enrolled in any courses yet. Choose a certified track from our course catalog to start earning transcripts and certificates.
                        </p>
                      </div>
                      <button
                        onClick={() => onNavigate('courses')}
                        className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                      >
                        Browse Course Catalog
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                enrollments.map((enr) => (
                <tr key={enr.enrollment_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{enr.course_title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{enr.batch_name}</div>
                  </td>
                  <td className="py-3.5 px-4 min-w-[140px]">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{enr.progress_pct}%</span>
                      <span className="text-slate-400">{enr.status}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${enr.progress_pct}%` }} 
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {enr.lessons_completed} / {enr.total_lessons}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {enr.quiz_avg_score > 0 ? `${enr.quiz_avg_score}%` : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-600 dark:text-purple-400">
                    {enr.assignment_avg_score > 0 ? `${enr.assignment_avg_score}%` : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                      {enr.final_grade || 'In Progress'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {enr.certificate_id ? (
                      <button
                        onClick={() => setActiveCertificate({
                          certificateId: enr.certificate_id!,
                          courseTitle: enr.course_title,
                          learnerName: currentUser.full_name,
                          issueDate: enr.last_active_at.substring(0, 10),
                          grade: enr.final_grade || 'A'
                        })}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-100 transition cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>View</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Unlocks at 100%</span>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verifiable Credentials Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Digital Certificate Verification</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
              SEBI Verified Registry
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Certificates issued by FinanceX Institutional Academy comply with official SEBI/NISM curriculum specifications with cryptographic integrity checksums.
          </p>

          {/* Interactive Credential Lookup Form */}
          <form onSubmit={handleVerifyLookup} className="flex gap-2">
            <input
              type="text"
              value={verifyIdInput}
              onChange={(e) => setVerifyIdInput(e.target.value)}
              placeholder="e.g. FX-CERT-2026-0814"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs transition cursor-pointer flex-shrink-0"
            >
              Verify Credential
            </button>
          </form>

          {/* Dynamic Result Card */}
          {verificationResult && (
            <div className={`p-4 rounded-2xl border transition ${
              verificationResult.isValid
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                  verificationResult.isValid ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                }`}>
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-xs space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {verificationResult.certificateId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      verificationResult.isValid
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                    }`}>
                      {verificationResult.status}
                    </span>
                  </div>

                  {verificationResult.isValid ? (
                    <>
                      <div className="text-slate-700 dark:text-slate-300">
                        Recipient: <strong className="text-slate-900 dark:text-white">{verificationResult.learnerName}</strong>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                        Course: {verificationResult.courseTitle}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                        Grade: {verificationResult.grade} • Issue Date: {verificationResult.issueDate}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate pt-1 border-t border-emerald-200/50 dark:border-emerald-900/50">
                        Digital Checksum: {verificationResult.digitalChecksum}
                      </div>
                    </>
                  ) : (
                    <div className="text-rose-600 dark:text-rose-400 text-[11px]">
                      No active institutional credential found matching ID "{verificationResult.certificateId}".
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Next Course Milestone</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Complete your pending Quantitative Bond Pricing Drill and Chapter 4 Comprehension Drill to unlock your official Research Analyst Certificate.
            </p>
          </div>
          <button
            onClick={() => onNavigate('assignments')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Proceed to Active Assignments</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {activeCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#080C14] border-4 border-amber-400/40 shadow-2xl p-6 sm:p-10 space-y-6 relative overflow-hidden">
            <button
              onClick={() => setActiveCertificate(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-400/20 text-amber-500">
                <Award className="w-10 h-10" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                FINANCEX INSTITUTIONAL ACADEMY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Certificate of Completion
              </h2>
              <p className="text-xs text-slate-500">This is to officially certify that</p>
              <div className="text-xl sm:text-2xl font-serif font-black text-emerald-600 dark:text-emerald-400 underline decoration-amber-400 decoration-2 underline-offset-8 py-1">
                {activeCertificate.learnerName}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto pt-2">
                has successfully fulfilled all institutional requirements, laboratory models, and examinations for
              </p>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {activeCertificate.courseTitle}
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold">
                Grade Awarded: {activeCertificate.grade}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
              <div>
                <div>Certificate ID: <span className="font-bold text-slate-900 dark:text-white">{activeCertificate.certificateId}</span></div>
                <div>Issue Date: {activeCertificate.issueDate}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900 dark:text-white">SEBI / NISM Compliant</div>
                <div className="text-emerald-600 font-semibold">Verified Sample Record</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

