import React, { useState } from 'react';
import { 
  Award, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Download,
  Share2 
} from 'lucide-react';
import { Certification, AppNavView } from '../../types/schema';

interface CertificationsViewProps {
  certifications: Certification[];
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const CertificationsView: React.FC<CertificationsViewProps> = ({
  certifications,
  onNavigate
}) => {
  const [selectedCert, setSelectedCert] = useState<Certification>(certifications[0]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  return (
    <div className="space-y-6" id="certifications-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Regulatory Certifications Hub
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-yellow-500/20 dark:text-yellow-300 border border-amber-200 dark:border-yellow-500/40">
              SEBI & NISM COMPLIANT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Official certification syllabi, mock test simulators, and verifiable digital credentials.
          </p>
        </div>

        <button
          onClick={() => setShowCertificateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-pink-50 border border-pink-200 hover:border-pink-300 text-pink-700 dark:bg-slate-900 dark:border-[#00E599]/40 dark:hover:border-[#00E599] dark:text-[#00E599] text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Award className="w-4 h-4" />
          <span>View Earned Certificate Preview</span>
        </button>
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
                  <span className="text-slate-500 block text-[9px] font-bold">PASSING SCORE</span>
                  <span className="font-bold text-emerald-700 dark:text-[#00E599]">{cert.passing_score_percent}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 block text-[9px] font-bold">EXAM DURATION</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cert.duration_hours} Hours</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('mock-exams');
                }}
                className="w-full py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Launch Mock Exam</span>
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
              DETAILED SYLLABUS SPECIFICATION
            </div>
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white mt-1">
              {selectedCert.title} ({selectedCert.certification_code})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('study-plans')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>30-Day Study Plan</span>
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
      </div>

      {/* Digital Certificate Preview Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-pink-300 dark:border-[#00E599]/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative theme-transition">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
                <span className="font-mono text-xs text-pink-600 dark:text-[#00E599] font-bold">VERIFIABLE DIGITAL CREDENTIAL</span>
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
                Certificate of Regulatory Proficiency
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                This is proudly awarded to
              </p>
              <div className="text-2xl font-display font-black text-pink-600 dark:text-[#00E599] tracking-wide">
                M Kannan
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                for demonstrating proficiency in <strong>NISM Series VIII: Equity Derivatives</strong> with a passing score of 82.5%.
              </p>
              <div className="pt-4 flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-200 dark:border-slate-800">
                <span>CERT HASH: 0x8f9c...4a2b</span>
                <span>DATE: MARCH 2026</span>
                <span className="text-emerald-700 dark:text-[#00E599] font-bold">VERIFIED ON-CHAIN</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert('Certificate PDF downloaded!')}
                className="flex-1 py-3 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Certificate (PDF)</span>
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
