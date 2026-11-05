import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Award, 
  TrendingUp, 
  Calculator, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  User, 
  MessageSquare,
  ShieldCheck,
  X
} from 'lucide-react';
import { User as UserType, LMSAssignment, LMSAssignmentSubmission, AppNavView } from '../../types/schema';
import { lmsService } from '../../services/lmsService';

interface LearnerAssignmentsViewProps {
  currentUser: UserType;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const LearnerAssignmentsView: React.FC<LearnerAssignmentsViewProps> = ({
  currentUser,
  onNavigate
}) => {
  const [assignments, setAssignments] = useState<LMSAssignment[]>([]);
  const [submissions, setSubmissions] = useState<LMSAssignmentSubmission[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED'>('ALL');
  const [activeModalAssignment, setActiveModalAssignment] = useState<LMSAssignment | null>(null);
  const [activeSubmissionDetail, setActiveSubmissionDetail] = useState<LMSAssignmentSubmission | null>(null);

  // Form State for Active Submission
  const [solutionText, setSolutionText] = useState('');
  const [assumptionsText, setAssumptionsText] = useState('');
  const [metricsText, setMetricsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    const refreshData = () => {
      setAssignments(lmsService.getAssignments());
      setSubmissions(lmsService.getSubmissions({ learnerId: String(currentUser.user_id) }));
    };

    refreshData();
    const unsubscribe = lmsService.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, [currentUser.user_id]);

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  const handleOpenSubmissionModal = (assignment: LMSAssignment) => {
    setActiveModalAssignment(assignment);
    const existing = getSubmissionForAssignment(assignment.assignment_id);
    if (existing) {
      setSolutionText(existing.content_text);
      setAssumptionsText(existing.quantitative_work?.financial_model_output || '');
      setMetricsText(JSON.stringify(existing.quantitative_work?.calculated_metrics || {}, null, 2));
    } else {
      setSolutionText('');
      setAssumptionsText('');
      setMetricsText('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAssignment) return;
    if (!solutionText.trim()) {
      alert('Please provide your analytical write-up before submitting.');
      return;
    }

    setIsSubmitting(true);
    let parsedMetrics = {};
    try {
      if (metricsText.trim()) {
        parsedMetrics = JSON.parse(metricsText);
      }
    } catch {
      parsedMetrics = { note: metricsText };
    }

    const courseTitle = activeModalAssignment.course_id === 3 
      ? 'NISM Series XV: Research Analyst Certification Examination'
      : activeModalAssignment.course_id === 1 
      ? 'NISM Series VIII: Equity Derivatives Masterclass' 
      : 'Corporate Financial Statement Analysis';

    const result = lmsService.submitAssignment({
      assignment_id: activeModalAssignment.assignment_id,
      assignment_title: activeModalAssignment.title,
      course_id: activeModalAssignment.course_id,
      course_title: courseTitle,
      learner_id: currentUser.user_id,
      learner_name: currentUser.full_name,
      learner_email: currentUser.email,
      batch_id: 'batch-nism-2026-q1',
      content_text: solutionText,
      quantitative_work: {
        financial_model_output: assumptionsText,
        calculated_metrics: parsedMetrics
      },
      max_score: activeModalAssignment.max_score
    });

    setIsSubmitting(false);
    if (result.success) {
      setActiveModalAssignment(null);
      setFeedbackToast('Assignment submitted successfully! Assigned faculty has been notified.');
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  const filteredAssignments = assignments.filter(asg => {
    const sub = getSubmissionForAssignment(asg.assignment_id);
    if (filter === 'PENDING') return !sub;
    if (filter === 'SUBMITTED') return sub && sub.status === 'SUBMITTED';
    if (filter === 'GRADED') return sub && sub.status === 'GRADED';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

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
                : 'NISM Practice Track • Faculty-Graded Submissions'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Quantitative Case Studies & Assignments
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Work on authentic Indian capital markets valuation drills, bond pricing scenarios, and equity research notes evaluated by certified faculty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('gradebook')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer backdrop-blur-sm"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>View Gradebook & Transcript</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === tab
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'ALL' && 'All Assignments'}
              {tab === 'PENDING' && 'Pending Submission'}
              {tab === 'SUBMITTED' && 'Awaiting Evaluation'}
              {tab === 'GRADED' && 'Evaluated & Graded'}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Showing {filteredAssignments.length} assignment{filteredAssignments.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAssignments.map((assignment) => {
          const sub = getSubmissionForAssignment(assignment.assignment_id);
          const isGraded = sub?.status === 'GRADED';
          const isSubmitted = sub && sub.status === 'SUBMITTED';

          return (
            <div
              key={assignment.assignment_id}
              className="rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                    Week {assignment.module_week} Module
                  </span>

                  {isGraded ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Graded: {sub?.score}/{assignment.max_score}
                    </span>
                  ) : isSubmitted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      Submitted (In Review)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Not Submitted
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {assignment.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {assignment.description}
                </p>

                {/* Rubric Peek */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 space-y-1.5">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Grading Rubric
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {assignment.rubric.map((r, idx) => (
                      <div key={idx} className="truncate">
                        • {r.criterion} ({r.max_points} pts)
                      </div>
                    ))}
                  </div>
                </div>

                {/* If Graded: Show Instructor Feedback Preview */}
                {isGraded && sub?.instructor_feedback && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-200">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800 dark:text-emerald-300">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Feedback from {sub.evaluator_name || 'Faculty'}:
                    </div>
                    <p className="italic text-[11px] line-clamp-2">"{sub.instructor_feedback}"</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{assignment.estimated_minutes}m
                  </span>
                  <span>•</span>
                  <span>Max: {assignment.max_score} Marks</span>
                </div>

                <div className="flex items-center gap-2">
                  {isGraded ? (
                    <button
                      onClick={() => setActiveSubmissionDetail(sub!)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Review Feedback</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmissionModal(assignment)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitted ? 'Update Submission' : 'Submit Analysis'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {activeModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Assignment Submission Terminal
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeModalAssignment.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalAssignment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Case Drill Context & Instructions
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeModalAssignment.description}
                </p>
                {activeModalAssignment.starter_financial_data && (
                  <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    Scenario: {activeModalAssignment.starter_financial_data.scenario}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Analytical Thesis & Explanation (Markdown / Text) *
                  </label>
                  <textarea
                    rows={6}
                    value={solutionText}
                    onChange={(e) => setSolutionText(e.target.value)}
                    required
                    placeholder="Provide your financial analysis, reasoning, formula steps, and final recommendation..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-hidden font-sans text-xs"
                  />
                </div>

                {/* Quantitative Modeling Tools & Presets */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Financial Model Quick-Starters:
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Click to autofill formula template</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAssumptionsText('Day Count: 30/360, Semi-Annual, Settlement: T+1, YTM: 7.25%');
                        setMetricsText(JSON.stringify({ coupon_rate: "7.50%", accrued_interest_rs: 1.48, clean_price_rs: 101.20, dirty_price_rs: 102.68, macaulay_duration_years: 4.12 }, null, 2));
                        if (!solutionText.trim()) {
                          setSolutionText('Analytical Valuation:\n1. Bond dirty price computed by discounting future coupon and principal cashflows at current market YTM of 7.25%.\n2. Accrued interest calculated for 72 elapsed days since last semi-annual coupon.\n3. Clean price reflects the benchmark market quote excluding accrued coupon interest.');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-[10px] font-mono transition cursor-pointer"
                    >
                      + Bond Pricing / Accrued Int.
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssumptionsText('Corporate Tax Rate: 25.17%, Effective Cost of Debt: 8.4%, Leverage: 1.85x');
                        setMetricsText(JSON.stringify({ tax_burden: 0.748, interest_burden: 0.825, ebit_margin: 0.184, asset_turnover: 1.25, leverage_factor: 1.85, roe_pct: 26.3 }, null, 2));
                        if (!solutionText.trim()) {
                          setSolutionText('DuPont 5-Stage Breakdown:\n1. Operating profitability (EBIT Margin) stands at 18.4% reflecting superior pricing power.\n2. Asset efficiency (Asset Turnover) drives asset productivity at 1.25x.\n3. Financial leverage is prudently balanced at 1.85x, resulting in an annualized Return on Equity of 26.3%.');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-[10px] font-mono transition cursor-pointer"
                    >
                      + DuPont 5-Stage ROE
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssumptionsText('Risk-Free Rate: 6.8%, IV: 18.5%, Days to Expiry: 24, Underlying: NIFTY 50');
                        setMetricsText(JSON.stringify({ call_delta: 0.54, put_delta: -0.46, gamma: 0.0024, theta_daily: -12.40, vega_pct: 18.6 }, null, 2));
                        if (!solutionText.trim()) {
                          setSolutionText('Quantitative Derivatives Model:\n1. At-the-money delta sensitivity confirms balanced initial directional exposure.\n2. Time decay (theta) is mitigated by structuring an offsetting short calendar spread.\n3. Dynamic delta-neutral rebalancing triggered when position delta exceeds +/- 0.15.');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-[10px] font-mono transition cursor-pointer"
                    >
                      + Options Greeks & Delta Hedge
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Model Assumptions & Day-Count Convention
                    </label>
                    <input
                      type="text"
                      value={assumptionsText}
                      onChange={(e) => setAssumptionsText(e.target.value)}
                      placeholder="e.g. 30/360, Semi-annual, WACC=10.4%"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Calculated Key Metrics (JSON / Values)
                    </label>
                    <input
                      type="text"
                      value={metricsText}
                      onChange={(e) => setMetricsText(e.target.value)}
                      placeholder='{"accrued_interest": 14.92, "dirty_price": 102.34}'
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModalAssignment(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit to Faculty'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Graded Feedback Detail Modal */}
      {activeSubmissionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Evaluation Report & Feedback
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeSubmissionDetail.assignment_title}
                </h2>
              </div>
              <button
                onClick={() => setActiveSubmissionDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div>
                  <div className="text-slate-500 font-mono text-[11px]">Final Score Awarded</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {activeSubmissionDetail.score} / {activeSubmissionDetail.max_score} Marks
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500 font-mono text-[11px]">Evaluator</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {activeSubmissionDetail.evaluator_name || 'Dr. R. Subramanian'}
                  </div>
                </div>
              </div>

              {activeSubmissionDetail.rubric_scores && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white">Rubric Breakdown:</div>
                  {Object.entries(activeSubmissionDetail.rubric_scores).map(([crit, pts]) => (
                    <div key={crit} className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>{crit}</span>
                      <span className="font-mono font-bold text-emerald-600">{pts} pts</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Detailed Qualitative Feedback
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{activeSubmissionDetail.instructor_feedback}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="font-mono text-slate-400 text-[10px]">Your Submitted Response:</div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {activeSubmissionDetail.content_text}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveSubmissionDetail(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
