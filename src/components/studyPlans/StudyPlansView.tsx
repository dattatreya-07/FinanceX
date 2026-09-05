import React, { useState } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { StudyPlan, AppNavView } from '../../types/schema';

interface StudyPlansViewProps {
  studyPlans: StudyPlan[];
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const StudyPlansView: React.FC<StudyPlansViewProps> = ({
  studyPlans,
  onNavigate
}) => {
  const [selectedPlan] = useState<StudyPlan>(studyPlans[0]);
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
  });

  const toggleDay = (day: number) => {
    setCompletedDays((prev) => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  return (
    <div className="space-y-6" id="study-plans-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Adaptive Study Schedules
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40">
              AI PACED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Personalized day-by-day roadmap targeting regulatory exam mastery.
          </p>
        </div>

        <button
          onClick={() => alert('AI is calculating optimal schedule based on your recent 80% quiz accuracy...')}
          className="px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 dark:bg-gradient-to-r dark:from-[#FF2E7E]/20 dark:to-[#00E599]/20 dark:border-[#FF2E7E]/40 dark:text-white text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-pink-600 dark:text-[#00E599]" />
          <span>Regenerate Schedule with AI</span>
        </button>
      </div>

      {/* Plan Card Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs theme-transition">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-pink-600 dark:text-[#00E599]" />
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
              {selectedPlan.plan_title}
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
            {selectedPlan.description}
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
            <span>Duration: {selectedPlan.total_days} Days</span>
            <span>•</span>
            <span>Target: 1.5 Hours / Day</span>
            <span>•</span>
            <span className="text-emerald-700 dark:text-[#00E599] font-bold">Progress: 7 / 30 Days Done</span>
          </div>
        </div>

        <div className="w-full sm:w-48 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <span className="text-[10px] font-mono text-slate-500 block font-bold">COMPLETION</span>
          <span className="text-2xl font-mono font-black text-pink-600 dark:text-[#00E599]">23.3%</span>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 dark:bg-[#00E599] rounded-full w-[23.3%]" />
          </div>
        </div>
      </div>

      {/* Day by Day Schedule Grid */}
      <div className="space-y-3">
        <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
          30-Day Milestone Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { day: 1, title: 'Introduction to Derivatives & Forwards vs Futures', type: 'LESSON', duration: '45 mins', targetView: 'learn' },
            { day: 2, title: 'Futures Margining, MTM & Settlement Cycles', type: 'LESSON', duration: '50 mins', targetView: 'learn' },
            { day: 3, title: 'Hedging with Futures & Beta-weighted Hedging', type: 'MATH', duration: '60 mins', targetView: 'learn' },
            { day: 4, title: 'Futures Payoff Quiz & Numerical Checkpoint', type: 'QUIZ', duration: '20 mins', targetView: 'quizzes' },
            { day: 5, title: 'Practice Lab: Simulating Cash-Carry Arbitrage', type: 'SIMULATION', duration: '45 mins', targetView: 'practice-lab' },
            { day: 6, title: 'Options Call/Put Moneyness & Intrinsic Value', type: 'LESSON', duration: '45 mins', targetView: 'learn' },
            { day: 7, title: 'Weekly Diagnostic Revision & AI Weakness Review', type: 'AI_REVIEW', duration: '30 mins', targetView: 'ai-tutor' },
            { day: 8, title: 'Option Greeks: Delta & Gamma Acceleration', type: 'LESSON', duration: '55 mins', targetView: 'learn' },
            { day: 9, title: 'Option Greeks: Theta Decay & Vega Volatility', type: 'LESSON', duration: '50 mins', targetView: 'learn' },
            { day: 10, title: 'Comprehensive Mid-Term Mock Test (50 Questions)', type: 'MOCK_EXAM', duration: '60 mins', targetView: 'mock-exams' },
          ].map((item) => {
            const isDone = completedDays[item.day] || false;

            return (
              <div
                key={item.day}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 shadow-xs theme-transition ${
                  isDone
                    ? 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-900/40 dark:border-slate-800/80 dark:text-slate-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 dark:bg-[#0B0F19] dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDay(item.day)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white dark:bg-[#00E599] dark:border-[#00E599] dark:text-slate-950'
                        : 'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-pink-600 dark:text-[#00E599]">
                        DAY {item.day}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.type}
                      </span>
                    </div>
                    <div className={`text-xs font-semibold mt-0.5 ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Estimated: {item.duration}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(item.targetView as AppNavView)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-[#00E599] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shadow-xs"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
