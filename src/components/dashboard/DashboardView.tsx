import React from 'react';
import { 
  Play, 
  ArrowRight, 
  BrainCircuit, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import { 
  User, 
  Course, 
  Lesson, 
  AIRecommendation, 
  Goal, 
  DemoAccount,
  AppNavView,
  ConceptMastery
} from '../../types/schema';
import { spacedReviewService } from '../../services/spacedReviewService';
import { GamifiedGoalMap } from './GamifiedGoalMap';

interface DashboardViewProps {
  user: User;
  onNavigate: (view: AppNavView, payload?: any) => void;
  recommendations: AIRecommendation[];
  goals: Goal[];
  courses: Course[];
  activeLesson: Lesson;
  demoAccount: DemoAccount;
  conceptMastery?: ConceptMastery[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  recommendations,
  goals,
  courses,
  activeLesson,
  demoAccount,
  conceptMastery = []
}) => {
  const dueReviews = spacedReviewService.getDueReviews(user.user_id, conceptMastery);

  // Dynamic Level & XP Calculation
  const userXp = Number(user.xp_points || 0);
  let userLevel = 'Level 1 (Novice)';
  if (userXp >= 3000) userLevel = 'Level 5 (Master)';
  else if (userXp >= 1500) userLevel = 'Level 4 (Specialist)';
  else if (userXp >= 500) userLevel = 'Level 3 (Practitioner)';
  else if (userXp >= 100) userLevel = 'Level 2 (Apprentice)';

  const currentCourse = courses.find((c) => c.course_id === activeLesson.course_id) || courses.find((c) => c.course_id === 3) || courses[0];
  const currentCourseLessonsCount = currentCourse?.estimated_hours ? Math.round(currentCourse.estimated_hours * 2) : 10;
  const completedLessonsInCourse = activeLesson.is_completed ? 1 : 0;
  const courseProgressPercent = Math.min(100, Math.round((completedLessonsInCourse / currentCourseLessonsCount) * 100));

  // Virtual Cash Display
  const formattedBalance = demoAccount.currency === 'INR'
    ? `₹${(demoAccount.virtual_balance || 1000000).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : `$${(demoAccount.virtual_balance || 100000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const topRec = recommendations[0] || {
    recommandation_type: 'REVIEW_WEAK_CONCEPT',
    reason: 'Continue your learning track to build mastery in financial markets & derivatives.',
    action_label: 'Resume Module',
    target_url: 'learn'
  };

  const activeGoal = goals.find((g) => g.status === 'IN_PROGRESS') || goals[0];

  return (
    <div className="space-y-6 w-full max-w-full" id="dashboard-view">
      {/* 1. TOP HEADER BANNER (EMERALD & WEALTH GOLD TONE) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0B0F19] p-5 rounded-3xl border border-emerald-200/80 dark:border-slate-800 shadow-[0_10px_30px_rgba(4,120,87,0.06)] theme-transition">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#047857] to-[#10B981] text-white flex items-center justify-center font-bold font-display text-xl shadow-md shadow-emerald-600/25 shrink-0">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-display font-black text-slate-900 dark:text-white leading-tight">
                Welcome back, {user.full_name.split(' ')[0]}
              </h1>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {userLevel}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex-wrap">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <Flame className="w-4 h-4 fill-current animate-pulse text-amber-500" /> {user.current_streak || 0} Day Streak
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> {user.xp_points || 0} Total XP
              </span>
              <span>•</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-xs sm:max-w-md">
                {currentCourse?.course_title || 'NISM Series XV: Research Analyst'}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => onNavigate('practice-lab')}
            className="px-4 py-2 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 transition flex items-center gap-2 cursor-pointer shadow-xs"
            title="Open Paper Trading Terminal"
          >
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-mono">{formattedBalance}</span>
          </button>

          <button
            onClick={() => onNavigate('ai-tutor')}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#047857] via-[#059669] to-[#0D9488] hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer hover:scale-[1.02]"
          >
            <BrainCircuit className="w-4 h-4 text-amber-300" />
            <span>AI Teacher</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CENTERPIECE: GAMIFIED GOAL ROADMAP MAP (Item 5) */}
      <GamifiedGoalMap user={user} onNavigate={onNavigate} />

      {/* 3. WORKSPACE ACTION CARDS GRID (Item 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN (7 COLS): RESUME LEARNING HERO & TOP AI REC */}
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
          
          {/* Hero Action Banner: Resume Learning */}
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0B0F19] border border-emerald-200/80 dark:border-slate-800 p-6 shadow-[0_10px_30px_rgba(4,120,87,0.06)] flex-1 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-400/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                  CURRENT LESSON
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {courseProgressPercent}% Complete
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white leading-tight">
                {activeLesson.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {activeLesson.description || 'Master quantitative valuation principles, risk sensitivities, and market mechanisms.'}
              </p>
            </div>

            {/* Progress Bar & Actions */}
            <div className="space-y-4 pt-6">
              <div className="w-full h-2.5 bg-emerald-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#059669] via-[#10B981] to-[#F59E0B] rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(8, courseProgressPercent)}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => onNavigate('learn')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#047857] via-[#059669] to-[#10B981] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Lesson ({activeLesson.estimated_mins || 20}m)</span>
                </button>

                <button
                  onClick={() => onNavigate('quizzes')}
                  className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Practice Quiz</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Recommended Next Action (Compact Card) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">AI Recommendation</span>
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {topRec.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (topRec.target_url?.includes('practice-lab')) onNavigate('practice-lab');
                else if (topRec.target_url?.includes('mock-exams')) onNavigate('mock-exams');
                else onNavigate('learn');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-bold text-emerald-700 dark:text-emerald-400 transition shrink-0 flex items-center gap-1 cursor-pointer border border-emerald-200/80 dark:border-slate-800"
            >
              <span>{topRec.action_label}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* RIGHT SIDEBAR COLUMN (5 COLS): FEATURE LAUNCHPAD TILES */}
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
          
          {/* Tile 1: Spaced Review / Active Practice Quick Launch */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-emerald-200/80 dark:border-slate-800 space-y-2.5 shadow-[0_10px_30px_rgba(4,120,87,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Spaced Practice Drill
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                {dueReviews.length} Due Today
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {dueReviews.length > 0 
                ? `Due: ${dueReviews[0].topic_name}`
                : 'All concept review stages up to date.'}
            </p>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onNavigate('quizzes')}
                className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Question Bank</span>
              </button>

              <button
                onClick={() => onNavigate('quizzes', dueReviews.length > 0 ? { topicId: dueReviews[0].topic_id, isSpacedReview: true } : undefined)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#047857] to-[#059669] hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <RotateCcw className="w-3 h-3 text-amber-300" />
                <span>{dueReviews.length > 0 ? 'Start Review' : 'Practice Quiz'}</span>
              </button>
            </div>
          </div>

          {/* Tile 2: Simulated Trading Sandbox Summary */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-emerald-200/80 dark:border-slate-800 space-y-2.5 shadow-[0_10px_30px_rgba(4,120,87,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#00E599]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Simulated Paper Trading
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                INR SANDBOX
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                {formattedBalance}
              </div>
              <span className="text-[10px] text-slate-400">0 Real Risk</span>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Live order matching</span>
              <button
                onClick={() => onNavigate('practice-lab')}
                className="text-xs font-bold text-emerald-600 dark:text-[#00E599] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Open Terminal</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Tile 3: Goal Tracking Launcher */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-emerald-200/80 dark:border-slate-800 space-y-2.5 shadow-[0_10px_30px_rgba(4,120,87,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Active Goal
                </h3>
              </div>
              <button
                onClick={() => onNavigate('goals')}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                View All ({goals.length})
              </button>
            </div>

            {activeGoal ? (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[180px]">{activeGoal.goal_title}</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{activeGoal.current_progress_percent}%</span>
                </div>
                <div className="w-full h-2 bg-emerald-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#059669] via-[#10B981] to-[#F59E0B] rounded-full transition-all"
                    style={{ width: `${activeGoal.current_progress_percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active goal configured.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
