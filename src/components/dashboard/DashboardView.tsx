import React from 'react';
import { 
  Play, 
  ArrowRight, 
  BrainCircuit, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  User, 
  Course, 
  Lesson, 
  AIRecommendation, 
  Goal, 
  DemoAccount,
  AppNavView 
} from '../../types/schema';

interface DashboardViewProps {
  user: User;
  onNavigate: (view: AppNavView, payload?: any) => void;
  recommendations: AIRecommendation[];
  goals: Goal[];
  courses: Course[];
  activeLesson: Lesson;
  demoAccount: DemoAccount;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  recommendations,
  goals,
  courses,
  activeLesson,
  demoAccount
}) => {
  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Top Welcome & Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Welcome back, {user.full_name.split(' ')[0]}
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40">
              Level 3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Targeting: <strong className="text-slate-900 dark:text-slate-200">NISM-Series-VIII Equity Derivatives</strong> • 29 Days to Exam
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('practice-lab')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-[#00E599]/40 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" />
            <span>Virtual Market: ₹7.42L</span>
          </button>
          <button
            onClick={() => onNavigate('ai-tutor')}
            className="px-3.5 py-2 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#FF2E7E]/20 dark:to-[#00E599]/20 dark:border dark:border-[#FF2E7E]/40 text-xs font-bold transition flex items-center gap-1.5 shadow-xs dark:shadow-[0_0_15px_rgba(255,46,126,0.15)] hover:brightness-110"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-white dark:text-[#FF2E7E]" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Hero Primary Card: "CONTINUE LEARNING" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-teal-50 dark:from-[#0F172A] dark:via-[#0E1B2C] dark:to-[#0A1A2F] border border-pink-200/80 dark:border-slate-700/80 p-6 sm:p-8 shadow-md dark:shadow-2xl theme-transition">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/15 dark:bg-[#00E599]/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-pink-400/15 dark:bg-[#FF2E7E]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-pink-100 text-[#FF2E7E] font-bold border border-pink-200 dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40">
                CURRENT MODULE IN PROGRESS
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Lesson 2 of 18</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white leading-snug">
              {activeLesson.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Master Delta, Gamma, Theta decay, and volatility sensitivity. Prepare for 12 numerical questions in NISM Series VIII.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('learn')}
                className="px-6 py-3 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs shadow-md dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 dark:shadow-[0_0_20px_rgba(0,229,153,0.35)] transition flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Lesson (35 mins)</span>
              </button>

              <button
                onClick={() => onNavigate('quizzes')}
                className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Take Option Greeks Quiz</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right Progress Meter */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 text-center w-full max-w-xs space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono">Course Completion</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-[#00E599]">68%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#FF2E7E] rounded-full w-[68%]" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">COMPLETED</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">12 / 18</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-[10px]">TIME SPENT</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">8.5 Hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: AI Smart Recommendations & Performance Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: AI Tutor Recommendations */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-pink-100 dark:bg-[#FF2E7E]/20 text-[#FF2E7E]">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                AI Tutor Adaptive Recommendations
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Refreshed 10m ago</span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.recommandation_id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0C101B] border border-slate-200 dark:border-slate-800/90 hover:border-pink-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs theme-transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      rec.priority === 'HIGH' 
                        ? 'bg-pink-100 text-pink-700 border border-pink-200 dark:bg-[#FF2E7E]/20 dark:text-[#FF2E7E] dark:border-[#FF2E7E]/40' 
                        : 'bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/40'
                    }`}>
                      {rec.recommandation_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xl">
                    {rec.reason}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (rec.target_url?.includes('practice-lab')) onNavigate('practice-lab');
                    else if (rec.target_url?.includes('mock-exams')) onNavigate('mock-exams');
                    else onNavigate('learn');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-emerald-700 dark:text-[#00E599] whitespace-nowrap flex items-center justify-center gap-1.5 transition self-start sm:self-auto shadow-xs"
                >
                  <span>{rec.action_label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Study Plan Roadmap */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs theme-transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">This Week's Study Schedule</h4>
              </div>
              <button
                onClick={() => onNavigate('study-plans')}
                className="text-xs text-pink-600 dark:text-[#00E599] font-semibold hover:underline"
              >
                Full Calendar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 mb-1">TODAY • TUESDAY</div>
                <div className="font-bold text-slate-900 dark:text-slate-200">Option Greeks & Theta Decay</div>
                <div className="text-[10px] text-emerald-700 dark:text-[#00E599] mt-1.5 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ready for Quiz
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 mb-1">THURSDAY</div>
                <div className="font-bold text-slate-900 dark:text-slate-200">Multi-Leg Options Strategies</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">28 mins • Theory & Math</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 mb-1">SATURDAY</div>
                <div className="font-bold text-slate-900 dark:text-slate-200">Full NISM Mock Exam #1</div>
                <div className="text-[10px] text-pink-600 dark:text-[#FF2E7E] mt-1.5 font-semibold">120 mins • Timed Test</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Goals, Streak & Practice Lab Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Goals */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0C101B] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs theme-transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Active Goals</h4>
              </div>
              <button onClick={() => onNavigate('goals')} className="text-xs text-pink-600 dark:text-[#00E599] font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.goal_id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{goal.goal_title}</span>
                    <span className="font-mono text-emerald-700 dark:text-[#00E599] font-bold">{goal.current_progress_percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-[#00E599] dark:to-[#00B377] rounded-full"
                      style={{ width: `${goal.current_progress_percent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>Deadline: {goal.target_date}</span>
                    <span className="uppercase">{goal.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Lab Sandbox Snapshot */}
          <div className="p-5 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#0A1424] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs theme-transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">PRACTICE LAB PORTFOLIO</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599] font-mono font-bold">
                +₹47,200 (6.4%)
              </span>
            </div>
            <div>
              <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">₹7,42,500.00</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Available Cash Balance</div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Holdings: ₹2,94,700</span>
              <button
                onClick={() => onNavigate('practice-lab')}
                className="text-emerald-700 dark:text-[#00E599] font-bold hover:underline flex items-center gap-1"
              >
                <span>Open Terminal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
