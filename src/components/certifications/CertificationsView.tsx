import React, { useState } from 'react';
import { 
  Award, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Download,
  Share2,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  Building2,
  Info
} from 'lucide-react';
import { Certification, AppNavView, ConceptMastery, MockExamAttempt } from '../../types/schema';
import { learningLoopService } from '../../services/learningLoopService';

interface CertificationsViewProps {
  certifications: Certification[];
  onNavigate: (view: AppNavView, payload?: any) => void;
  userName?: string;
  conceptMastery?: ConceptMastery[];
  mockAttempts?: MockExamAttempt[];
}

export const CertificationsView: React.FC<CertificationsViewProps> = ({
  certifications,
  onNavigate,
  userName = 'M Kannan',
  conceptMastery = [],
  mockAttempts = []
}) => {
  const [selectedCert, setSelectedCert] = useState<Certification>(certifications[0]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const readiness = learningLoopService.computeCertificationReadiness(
    userName,
    selectedCert,
    conceptMastery,
    mockAttempts
  );

  return (
    <div className="space-y-6" id="certifications-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Regulatory Certifications Hub
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40">
              NISM CURRICULUM ALIGNED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Exam preparation masterclasses, official syllabus specs, mock test simulators, and academic certificates.
          </p>
        </div>

        <button
          onClick={() => setShowCertificateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-pink-50 border border-pink-200 hover:border-pink-300 text-pink-700 dark:bg-slate-900 dark:border-[#00E599]/40 dark:hover:border-[#00E599] dark:text-[#00E599] text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Award className="w-4 h-4" />
          <span>FinanceX Certificate Preview</span>
        </button>
      </div>

      {/* Regulatory Clarification Alert Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">Important Regulatory Notice:</span>
          <p>
            FinanceX provides comprehensive preparatory curriculum and issues <em>FinanceX Academy Certificates of Course Completion</em>. 
            Official statutory licensing is independently administered by the <strong>National Institute of Securities Markets (NISM)</strong> under SEBI regulations.
          </p>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.certification_id}
            onClick={() => setSelectedCert(cert)}
            className={`p-6 rounded-3xl border transition duration-300 cursor-pointer flex flex-col justify-between space-y-4 shadow-xs theme-transition ${
              selectedCert.certification_id === cert.certification_id
                ? 'bg-pink-50/50 border-pink-500 dark:bg-slate-900 dark:border-[#00E599] dark:glow-mint'
                : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-[#0B0F19] dark:border-slate-800 dark:hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700">
                  {cert.issuing_body}
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  Code: {cert.certification_code}
                </span>
              </div>

              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white leading-snug">
                {cert.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {cert.description}
              </p>

              {/* Exam specs */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 block text-[9px] font-bold">PASSING BENCHMARK</span>
                  <span className="font-bold text-emerald-700 dark:text-[#00E599]">{cert.passing_score_percent}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 block text-[9px] font-bold">DURATION</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cert.duration_hours} Hours</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('mock-exams');
                }}
                className="w-full py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Launch Mock Exam Simulator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Certification Detailed Syllabus & Weightage Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs theme-transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-mono text-pink-600 dark:text-[#00E599] font-bold uppercase">
              DETAILED SYLLABUS SPECIFICATION & ROADMAP
            </div>
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white mt-1">
              {selectedCert.title} ({selectedCert.certification_code})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('courses')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-pink-600 dark:text-[#FF2E7E]" />
              <span>Start Course</span>
            </button>
            <button
              onClick={() => onNavigate('study-plans')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Study Plan</span>
            </button>
            <button
              onClick={() => onNavigate('mock-exams')}
              className="px-4 py-2 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Take Full Mock Test</span>
            </button>
          </div>
        </div>

        {/* Modules breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Module 1: Basics of Derivatives & Index Mechanics', weightage: '15%', questions: 15 },
            { title: 'Module 2: Futures Pricing & Cash-Carry Arbitrage', weightage: '25%', questions: 25 },
            { title: 'Module 3: Options Strategies & Greeks Numerical Calculation', weightage: '35%', questions: 35 },
            { title: 'Module 4: Regulatory Framework, Margining & SEBI Circulars', weightage: '25%', questions: 25 },
          ].map((mod, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{mod.title}</span>
                <span className="font-mono text-pink-600 dark:text-[#00E599] font-bold">{mod.weightage}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                Covers ~{mod.questions} questions in official test. High probability of numerical problems.
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF2E7E] to-[#E61E6D] dark:from-[#00E599] dark:to-[#00B377] rounded-full"
                  style={{ width: mod.weightage }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Phase 27: Evidence-Based Certification Readiness Gauge */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-pink-600 dark:text-[#00E599] font-bold">
                DIAGNOSTIC READINESS ESTIMATE
              </span>
              <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Exam Readiness Indicator: {readiness.overall_readiness_pct}% ({readiness.readiness_band.replace(/_/g, ' ')})
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Mocks Taken: {readiness.mock_exams_taken}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px] font-bold font-mono">SYLLABUS COVERAGE</span>
              <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">{readiness.syllabus_coverage_pct}%</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px] font-bold font-mono">CONCEPT MASTERY</span>
              <span className="text-lg font-mono font-bold text-emerald-600 dark:text-[#00E599]">{readiness.mastery_score_pct}%</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px] font-bold font-mono">MOCK SCORE AVG</span>
              <span className="text-lg font-mono font-bold text-cyan-600 dark:text-cyan-400">{readiness.mock_exam_average_pct}%</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between gap-4 pt-1">
            <span><strong>Focus Recommendation:</strong> {readiness.recommended_focus}</span>
            <button
              onClick={() => onNavigate('mock-exams')}
              className="text-pink-600 dark:text-[#00E599] font-bold hover:underline shrink-0 cursor-pointer"
            >
              Take Mock Simulator →
            </button>
          </div>
        </div>

        {/* Official NISM External Registration Guidance Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-50 via-slate-50 to-emerald-50 dark:from-cyan-950/30 dark:via-slate-900 dark:to-emerald-950/30 border border-cyan-200 dark:border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="font-bold text-xs text-slate-900 dark:text-white">Official External NISM Registration</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Exam Fee: ₹1,500 + GST • Test Centers across 150+ Indian cities • Pan Card & Demat prerequisites.
            </p>
          </div>
          <a
            href="https://www.nism.ac.in/certifications/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
          >
            <span>Register at nism.ac.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Digital Certificate Preview Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-pink-300 dark:border-[#00E599]/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative theme-transition">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
                <span className="font-mono text-xs text-pink-600 dark:text-[#00E599] font-bold">ACADEMIC COMPLETION CREDENTIAL</span>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            {/* Certificate Canvas Mockup */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-amber-50/70 via-white to-slate-50 border-2 border-amber-300 text-center space-y-4 relative overflow-hidden dark:from-[#0F172A] dark:via-[#091120] dark:to-[#060D18] dark:border-yellow-500/40">
              <div className="text-amber-800 dark:text-yellow-400 font-mono text-xs tracking-widest uppercase font-bold">
                FINANCEX ACADEMY OF FINANCIAL MARKETS
              </div>
              <div className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white">
                Certificate of Course Completion
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                This is proudly awarded to
              </p>
              <div className="text-2xl font-display font-black text-pink-600 dark:text-[#00E599] tracking-wide">
                {userName}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                for successfully completing the curriculum and mock assessments for <strong>{selectedCert.title} ({selectedCert.certification_code})</strong> with an academic benchmark score of 82.5%.
              </p>
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 leading-relaxed max-w-lg mx-auto">
                <em>Disclaimer: This is an academic completion certificate issued by FinanceX. For official regulatory licensing, register for the official NISM certification exam at nism.ac.in.</em>
              </div>
              <div className="pt-4 flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-200 dark:border-slate-800">
                <span>VERIFICATION ID: FX-CERT-2026-8942</span>
                <span>DATE: MARCH 2026</span>
                <span className="text-emerald-700 dark:text-[#00E599] font-bold">FINANCEX VERIFIED</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert('FinanceX Certificate PDF downloaded!')}
                className="flex-1 py-3 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Academic Certificate (PDF)</span>
              </button>
              <button
                onClick={() => alert('Shareable verification link copied to clipboard!')}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Credential</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
