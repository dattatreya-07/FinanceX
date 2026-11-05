import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  BarChart3, 
  Users, 
  GraduationCap, 
  Award, 
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { lmsService } from '../../services/lmsService';

export const LMSReportsView: React.FC = () => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [maskPII, setMaskPII] = useState<boolean>(true);

  const stats = lmsService.getInstitutionStats();
  const enrollments = lmsService.getEnrollments();
  const instructors = lmsService.getInstructors();

  const handleDownload = (reportType: 'ENROLLMENT' | 'PERFORMANCE' | 'INSTRUCTOR' | 'EVALUATIONS') => {
    const csvData = lmsService.exportReportCSV(reportType, { maskPII });
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const privacySuffix = maskPII ? '_Masked' : '_Full';
    link.setAttribute('download', `FinanceX_${reportType}_Audit${privacySuffix}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`Exported ${reportType} CSV report (${maskPII ? 'PII Masked' : 'Standard'}).`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-amber-500" />
            <span>Institution Reports & Compliance Exports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export deterministic CSV records of student learning journeys, assessment grades, and faculty metrics.
          </p>
        </div>

        {/* PII Privacy Mode Toggle */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs">
          <ShieldCheck className={`w-5 h-5 ${maskPII ? 'text-emerald-500' : 'text-slate-400'}`} />
          <div className="text-xs">
            <label className="font-bold text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={maskPII}
                onChange={(e) => setMaskPII(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Mask Student PII (DPDP / GDPR)</span>
            </label>
            <div className="text-[10px] text-slate-400">Protects student emails in exported files</div>
          </div>
        </div>
      </div>

      {/* Reports Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Learner Enrollment Audit</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Full registry of {enrollments.length} active and completed enrollments with cohort IDs.
            </p>
          </div>
          <button
            onClick={() => handleDownload('ENROLLMENT')}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Course Completion Roster</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Final awarded grades, certificate verification IDs, and syllabus coverage rates.
            </p>
          </div>
          <button
            onClick={() => handleDownload('PERFORMANCE')}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Faculty Workload & Ratings</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Instructor performance benchmarks, assigned cohorts, and student satisfaction.
            </p>
          </div>
          <button
            onClick={() => handleDownload('INSTRUCTOR')}
            className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Assessment & Submissions</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Drill evaluation logs, rubric breakdowns, and faculty turnaround times.
            </p>
          </div>
          <button
            onClick={() => handleDownload('EVALUATIONS')}
            className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Snapshot Preview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>Real-Time Institutional Audit Snapshot</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400">Total Enrolments</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalEnrollments}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400">Average Completion</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{stats.avgCompletionPct}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400">Certificates Issued</div>
            <div className="text-2xl font-black text-amber-500 mt-1">{stats.certificatesIssued}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400">Pending Reviews</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{stats.pendingEvaluations}</div>
          </div>
        </div>
      </div>

      {/* Disaster Recovery & Cryptographic Snapshot Backup */}
      <div className="p-6 rounded-3xl bg-slate-900 dark:bg-[#070A12] text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              <ShieldCheck className="w-3 h-3" />
              Disaster Recovery & Point-In-Time Integrity
            </div>
            <h3 className="text-lg font-bold">Institutional State Snapshot & Backup</h3>
            <p className="text-xs text-slate-400">
              Export an encrypted, SHA-256 signed JSON snapshot containing all faculty allocations, student rosters, grades, and audit ledgers.
            </p>
          </div>

          <button
            onClick={() => {
              const snapshot = lmsService.generateSystemBackupSnapshot();
              const blob = new Blob([snapshot.jsonString], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `FinanceX_Full_System_Backup_${snapshot.checksum}_${snapshot.exportedAt.substring(0, 10)}.json`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              setDownloadToast(`Exported full institutional snapshot [${snapshot.checksum}].`);
              setTimeout(() => setDownloadToast(null), 3500);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-sm flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Generate Encrypted Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};

