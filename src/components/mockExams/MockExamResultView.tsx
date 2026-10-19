import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { MockExam, AppNavView } from '../../types/schema';
import { TopicPerformanceStat } from './MockExamRunner';
import { learningLoopService } from '../../services/learningLoopService';
import { cohortAnalyticsService } from '../../services/cohortAnalyticsService';

interface MockExamResultViewProps {
  exam: MockExam;
  stats: {
    score: number;
    totalMarks: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    timeSpentMins: number;
    topicBreakdown?: TopicPerformanceStat[];
    isInvalidated?: boolean;
  };
  onRetry: () => void;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const MockExamResultView: React.FC<MockExamResultViewProps> = ({
  exam,
  stats,
  onRetry,
  onNavigate
}) => {
  const percentage = stats.totalMarks > 0 ? (stats.score / stats.totalMarks) * 100 : 0;
  const isPassed = stats.passed && !stats.isInvalidated;

  const defaultTopicBreakdown: TopicPerformanceStat[] = [
    { topic: 'Option Greeks & Volatility Sensitivity', topicId: 3, total: 10, correct: 8, accuracy: 80, status: 'MASTERED' },
    { topic: 'Futures Pricing & Cash-and-Carry Model', topicId: 2, total: 8, correct: 6, accuracy: 75, status: 'PROFICIENT' },
    { topic: 'Fixed Income & Bond Macaulay Duration', topicId: 4, total: 6, correct: 4, accuracy: 66, status: 'PROFICIENT' },
    { topic: 'SEBI Regulations & Insider Trading Window', topicId: 5, total: 5, correct: 2, accuracy: 40, status: 'NEEDS REVISION' }
  ];

  const breakdown = stats.topicBreakdown && stats.topicBreakdown.length > 0
    ? stats.topicBreakdown
    : defaultTopicBreakdown;

  const weakestTopic = [...breakdown].sort((a, b) => a.accuracy - b.accuracy)[0] || breakdown[0];
  const overallRemediation = learningLoopService.buildMockExamRemediation(
    exam.title,
    weakestTopic.topic,
    weakestTopic.accuracy
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="mock-exam-result-view">
      {/* Top Banner */}
      <div className={`p-8 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 theme-transition ${
        stats.isInvalidated
          ? 'bg-gradient-to-r from-rose-100 via-rose-50 to-pink-50 border-rose-400 dark:from-[#200A14] dark:via-[#1A0E1A] dark:to-[#180C14] dark:border-rose-500/60'
          : isPassed
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-300 dark:from-[#0C1523] dark:via-[#0F1E2E] dark:to-[#0A261D] dark:border-[#00E599]/40 glow-mint'
          : 'bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border-rose-300 dark:from-[#180C14] dark:via-[#1A0E1A] dark:to-[#200A14] dark:border-[#FF2E7E]/40'
      }`}>
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shrink-0 ${
            stats.isInvalidated
              ? 'bg-rose-200 text-rose-800 border border-rose-400 dark:bg-rose-500/30 dark:text-rose-400 dark:border-rose-500'
              : isPassed 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]' 
              : 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-[#FF2E7E]/20 dark:text-[#FF2E7E] dark:border-[#FF2E7E]'
          }`}>
            {stats.isInvalidated ? <ShieldAlert className="w-10 h-10" /> : isPassed ? <Award className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                stats.isInvalidated
                  ? 'bg-rose-200 text-rose-900 dark:bg-rose-500/30 dark:text-rose-300'
                  : isPassed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599]' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-[#FF2E7E]'
              }`}>
                {stats.isInvalidated ? 'ATTEMPT INVALIDATED (SECURITY LIMIT)' : isPassed ? 'CERTIFICATION PASS' : 'DID NOT MEET 60% BENCHMARK'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mt-1">
              {exam.title}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {stats.isInvalidated
                ? 'Session invalidated due to exceeding 3 window focus exits during exam mode.'
                : 'Official scoring standard with 0.25 negative marking applied.'}
            </p>
          </div>
        </div>

        {/* Big Score Box */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center min-w-[140px] shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 block font-bold">NET SCORE</span>
          <span className={`text-3xl font-mono font-black ${isPassed ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
            {stats.score.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 block">/ {stats.totalMarks} Marks ({percentage.toFixed(1)}%)</span>
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-1 font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" /> Correct
          </div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">{stats.correctCount}</div>
          <span className="text-[10px] text-slate-500 font-mono">+{stats.correctCount * 1.0} Marks</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 dark:text-[#FF2E7E] mb-1 font-mono font-bold">
            <XCircle className="w-4 h-4" /> Wrong
          </div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">{stats.wrongCount}</div>
          <span className="text-[10px] text-slate-500 font-mono">-{stats.wrongCount * 0.25} Penalty</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-mono font-bold">
            <Clock className="w-4 h-4" /> Time Spent
          </div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">{stats.timeSpentMins}m</div>
          <span className="text-[10px] text-slate-500 font-mono">Allocated: {exam.duration_minutes}m</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
          <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 mb-1 font-mono font-bold">
            <Sparkles className="w-4 h-4" /> XP Earned
          </div>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-[#00E599]">+{isPassed ? 350 : 120}</div>
          <span className="text-[10px] text-slate-500 font-mono">Mock Multiplier</span>
        </div>
      </div>

      {/* Phase 29: Privacy-Preserving Cohort Benchmark Standing */}
      {(() => {
        const cohortStanding = cohortAnalyticsService.getLearnerPercentileStanding(
          Math.round(percentage),
          exam.certification_id || 1
        );
        return (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-600 dark:text-[#00E599]" />
                <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                  Institutional Cohort Benchmark Standing
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                PRIVACY-PRESERVED BENCHMARK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">YOUR PERCENTILE RANK</span>
                <div className="text-2xl font-mono font-black text-emerald-600 dark:text-[#00E599] mt-0.5">
                  p{cohortStanding.percentileRank}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Top {cohortStanding.topPercentile}% of candidates</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">COHORT MEAN ACCURACY</span>
                <div className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-0.5">
                  {cohortStanding.cohortMean}%
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Median: {cohortStanding.cohortMedian}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">PERFORMANCE TIER</span>
                <div className="text-lg font-mono font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                  {cohortStanding.performanceTier.replace(/_/g, ' ')}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Standardized Scale</span>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              💡 {cohortStanding.summaryMessage}
            </p>
          </div>
        );
      })()}

      {/* Topic-Wise Diagnostic Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs theme-transition">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
            Attempt Syllabus Diagnostic Breakdown
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {breakdown.length} Knowledge Domains Evaluated
          </span>
        </div>

        <div className="space-y-3">
          {breakdown.map((item) => {
            let color = 'bg-rose-500 dark:bg-[#FF2E7E]';
            let badgeBg = 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-[#FF2E7E]';
            if (item.accuracy >= 75) {
              color = 'bg-emerald-500 dark:bg-[#00E599]';
              badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599]';
            } else if (item.accuracy >= 55) {
              color = 'bg-amber-500 dark:bg-amber-400';
              badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
            }

            return (
              <div key={item.topic} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.topic}</span>
                  <div className="flex items-center gap-2">
                    {item.accuracy < 75 && (
                      <button
                        onClick={() => {
                          const topicPrompt = learningLoopService.generateAITutorInterventionPrompt(item.topic, {
                            accuracyPct: item.accuracy,
                            mistakeSummary: `Scored ${item.accuracy}% (${item.correct}/${item.total} correct) on ${item.topic} in ${exam.title}`
                          });
                          onNavigate('ai-tutor', { prompt: topicPrompt });
                        }}
                        className="text-[10px] font-bold text-pink-600 dark:text-[#00E599] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Coach on this</span>
                      </button>
                    )}
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg}`}>
                      {item.accuracy}% • {item.status} ({item.correct}/{item.total} Qs)
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${item.accuracy}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footnotes */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onRetry}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Mock Exam</span>
          </button>

          <button
            onClick={() => onNavigate('ai-tutor', { prompt: overallRemediation.ai_coaching_prompt })}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-[#FF2E7E] dark:text-[#00E599] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask AI: Coach on Weaknesses</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('certifications')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
            <span>Certification Hub</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
