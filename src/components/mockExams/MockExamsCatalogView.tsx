import React from 'react';
import { 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  Percent
} from 'lucide-react';
import { MockExam, Course, MockExamAttempt, AppNavView } from '../../types/schema';

interface MockExamsCatalogViewProps {
  exams: MockExam[];
  courses: Course[];
  attempts: MockExamAttempt[];
  onStartExam: (exam: MockExam) => void;
  onNavigate: (view: AppNavView) => void;
}

export const MockExamsCatalogView: React.FC<MockExamsCatalogViewProps> = ({
  exams,
  courses,
  attempts,
  onStartExam,
  onNavigate
}) => {
  return (
    <div className="space-y-6" id="mock-exams-catalog-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              NISM & NCFM Full-Length Mock Exams
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40">
              SIMULATED TEST-CENTER ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Exact time limits, real SEBI negative marking (0.25 marks penalty), question flagging, and detailed post-exam analytics.
          </p>
        </div>

        <button
          onClick={() => onNavigate('certifications')}
          className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-slate-900 border border-amber-300 dark:border-yellow-500/30 hover:border-amber-400 dark:hover:border-yellow-500/60 text-amber-800 dark:text-yellow-400 text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Award className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
          <span>Certifications Hub</span>
        </button>
      </div>

      {/* Warning Notice Banner */}
      <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-start gap-3 shadow-xs theme-transition">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
          <strong className="text-amber-950 dark:text-amber-300 font-bold">Real Exam Rules Emulated:</strong> Unanswered questions carry 0 penalty. Incorrect answers incur a 25% negative marking deduction. Ensure you have an uninterrupted 120-minute window for full mock attempts.
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exams.map((exam) => {
          const course = courses.find(c => c.course_id === exam.course_id);
          const pastAttempt = attempts.find(a => a.exam_id === exam.exam_id);

          return (
            <div
              key={exam.exam_id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-5 group shadow-xs theme-transition"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700">
                    {exam.exam_code || 'NISM-SIM-2026'}
                  </span>
                  {pastAttempt && (
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                      pastAttempt.passed === 'YES'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-[#FF2E7E] border border-rose-200 dark:border-rose-500/40'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Score: {pastAttempt.score}% ({pastAttempt.passed === 'YES' ? 'PASSED' : 'RETRY'})
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-[#00E599] transition-colors leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Course: <span className="text-slate-800 dark:text-slate-300 font-semibold">{course?.course_title || 'Equity Derivatives'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono">
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold">DURATION</div>
                    <div className="text-slate-900 dark:text-white font-bold mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      {exam.duration_minutes || 120} Mins
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold">TOTAL MARKS</div>
                    <div className="text-slate-900 dark:text-white font-bold mt-0.5 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600 dark:text-yellow-400" />
                      {exam.total_marks || 100} Marks
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] font-bold">NEGATIVE MARK</div>
                    <div className="text-rose-600 dark:text-rose-400 font-bold mt-0.5 flex items-center gap-1">
                      <Percent className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      -{exam.negative_marking || 0.25}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Passing threshold: <strong className="text-slate-900 dark:text-white">{exam.passing_percentage || 60}%</strong>
                </span>
                <button
                  onClick={() => onStartExam(exam)}
                  className="px-5 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <span>{pastAttempt ? 'Retake Full Exam' : 'Launch Mock Exam'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
