import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  Star, 
  Award, 
  ChevronRight, 
  Flame,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers
} from 'lucide-react';
import { AppNavView, User } from '../../types/schema';

interface GamifiedGoalMapProps {
  user: User;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

interface StageNode {
  id: number;
  title: string;
  subtitle: string;
  chapters: string;
  xpReward: number;
  status: 'COMPLETED' | 'ACTIVE' | 'UNLOCKED' | 'LOCKED';
  stars: number;
  targetView: AppNavView;
  targetPayload?: any;
  color: string;
  topics: string[];
}

export const GamifiedGoalMap: React.FC<GamifiedGoalMapProps> = ({ user, onNavigate }) => {
  const [selectedStage, setSelectedStage] = useState<StageNode | null>(null);

  const userXp = Number(user.xp_points || 0);

  // Dynamic status based on real user XP & learning milestones
  const stages: StageNode[] = [
    {
      id: 1,
      title: 'Market Architecture & SEBI Basics',
      subtitle: 'Securities fundamentals, exchanges, T+1 settlement & regulatory role',
      chapters: 'Chapters 1, 2 & 3',
      xpReward: 150,
      status: userXp >= 150 ? 'COMPLETED' : 'ACTIVE',
      stars: userXp >= 150 ? 3 : 0,
      targetView: 'learn',
      targetPayload: { lessonId: 101 },
      color: '#10B981',
      topics: ['SEBI Act 1992', 'Primary vs Secondary Markets', 'T+1 Rolling Settlement', 'NSDL / CDSL Depositories']
    },
    {
      id: 2,
      title: 'Economic & Industry Analysis',
      subtitle: 'Monetary policy, inflation, Porter’s Five Forces & sectoral lifecycles',
      chapters: 'Chapters 4, 5 & 6',
      xpReward: 300,
      status: userXp >= 450 ? 'COMPLETED' : userXp >= 150 ? 'ACTIVE' : 'LOCKED',
      stars: userXp >= 450 ? 3 : userXp >= 150 ? 1 : 0,
      targetView: 'learn',
      targetPayload: { lessonId: 104 },
      color: '#059669',
      topics: ['Repo Rate Transmission', 'IIP & PMI Indicators', 'Porter Five Forces', 'Cyclical vs Defensive Sectors']
    },
    {
      id: 3,
      title: 'Financial Statements & Forensics',
      subtitle: 'Balance Sheet, P&L, Cash Flow, DuPont ROE decomposition & ratios',
      chapters: 'Chapters 7, 8 & 9',
      xpReward: 450,
      status: userXp >= 900 ? 'COMPLETED' : userXp >= 450 ? 'ACTIVE' : 'LOCKED',
      stars: userXp >= 900 ? 3 : userXp >= 450 ? 1 : 0,
      targetView: 'learn',
      targetPayload: { lessonId: 107 },
      color: '#0D9488',
      topics: ['DuPont 3-Step Model', 'EV/EBITDA vs P/E', 'Auditor Notes & Related Party', 'Bonus vs Stock Split']
    },
    {
      id: 4,
      title: 'Intrinsic Valuation & DCF Models',
      subtitle: 'Free Cash Flow (FCFF/FCFE), WACC, Terminal Value & relative multiples',
      chapters: 'Chapters 10 & 11',
      xpReward: 600,
      status: userXp >= 1500 ? 'COMPLETED' : userXp >= 900 ? 'ACTIVE' : 'LOCKED',
      stars: userXp >= 1500 ? 3 : userXp >= 900 ? 1 : 0,
      targetView: 'learn',
      targetPayload: { lessonId: 110 },
      color: '#0284C7',
      topics: ['Cost of Equity (CAPM)', 'Gordon Growth DDM', 'FCFF to Enterprise Value', 'Commodity Basis & Contango']
    },
    {
      id: 5,
      title: 'Risk, Derivatives & Technicals',
      subtitle: 'Portfolio Beta, Option Greeks (Delta/Gamma), Sharpe ratio & chart patterns',
      chapters: 'Chapters 12, 13, 14 & 15',
      xpReward: 800,
      status: userXp >= 2200 ? 'COMPLETED' : userXp >= 1500 ? 'ACTIVE' : 'LOCKED',
      stars: userXp >= 2200 ? 3 : userXp >= 1500 ? 1 : 0,
      targetView: 'learn',
      targetPayload: { lessonId: 112 },
      color: '#D97706',
      topics: ['Option Delta & Time Decay', 'Macaulay Duration', 'RSI & MACD Oscillators', 'Research Report Quality Checklist']
    },
    {
      id: 6,
      title: 'FINAL CITADEL: NISM Series XV Mock Exam',
      subtitle: 'Official 100-mark simulation: 80 standalone MCQs + 5 case studies',
      chapters: 'Full Syllabus (100 Marks)',
      xpReward: 1200,
      status: userXp >= 3000 ? 'COMPLETED' : userXp >= 2200 ? 'ACTIVE' : 'LOCKED',
      stars: userXp >= 3000 ? 3 : 0,
      targetView: 'mock-exams',
      targetPayload: { examId: 1 },
      color: '#F59E0B',
      topics: ['80 Standalone MCQs', '5 Case Studies (20 Qs)', '25% Negative Marking', 'Passing Threshold: 60%']
    }
  ];

  const completedCount = stages.filter(s => s.status === 'COMPLETED').length;
  const overallProgress = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#070D18] border border-emerald-500/20 dark:border-emerald-500/30 shadow-[0_15px_40px_rgba(4,120,87,0.08)] p-5 sm:p-7 theme-transition">
      {/* Decorative gradient aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/15 via-teal-500/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-100 dark:border-emerald-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-sm shadow-emerald-500/30 border border-amber-300/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>CERTIFICATION ROADMAP</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              Goal: NISM Series XV Research Analyst
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Research Analyst Master Roadmap
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Progress through interactive milestones from securities market basics to real-time valuation models and full 100-mark NISM case simulations.
          </p>
        </div>

        {/* Overall Completion Ring */}
        <div className="flex items-center gap-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 p-3 rounded-2xl shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-display font-black text-sm shadow-md shadow-emerald-500/30 shrink-0 border border-amber-300/30">
            {overallProgress}%
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{completedCount} of {stages.length} Milestones</span>
            </div>
            <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700" 
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Nodes Track */}
      <div className="relative z-10 py-8 px-2 overflow-x-auto no-scrollbar">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-6 bg-slate-200 dark:bg-slate-800 rounded-full pointer-events-none hidden md:block">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(10, (completedCount / stages.length) * 100))}%` }}
          />
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'COMPLETED';
            const isActive = stage.status === 'ACTIVE';
            const isUnlocked = stage.status === 'UNLOCKED';
            const isLocked = stage.status === 'LOCKED';

            return (
              <motion.div
                key={stage.id}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center cursor-pointer group"
                onClick={() => setSelectedStage(stage)}
              >
                {/* Node Orb */}
                <div className="relative mb-3">
                  {/* Pulsing ring for active node */}
                  {isActive && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-500/30 dark:bg-emerald-500/20 animate-ping pointer-events-none" />
                  )}

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-sm transition-all duration-300 shadow-md ${
                      isCompleted
                        ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-500/25 ring-4 ring-emerald-100 dark:ring-emerald-950/60'
                        : isActive
                        ? 'bg-gradient-to-tr from-[#047857] via-[#059669] to-[#10B981] text-white shadow-emerald-500/40 ring-4 ring-amber-300/50 scale-110 border border-amber-300/40'
                        : isUnlocked
                        ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-emerald-300 dark:border-emerald-700 hover:border-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-900/80 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                    ) : (
                      <span>{stage.id}</span>
                    )}
                  </div>

                  {/* Stars Badge */}
                  {stage.stars > 0 && (
                    <div className="absolute -bottom-2 -right-1 flex items-center bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 ml-0.5">{stage.stars}</span>
                    </div>
                  )}
                </div>

                {/* Node Text */}
                <div className="space-y-1 max-w-[160px]">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    STAGE {stage.id}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {stage.title}
                  </h4>
                  <span className="inline-block text-[10px] text-slate-500 dark:text-slate-400">
                    {stage.chapters}
                  </span>
                </div>

                {/* Status Indicator Chip */}
                <div className="mt-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 font-black animate-pulse border border-emerald-300/40'
                      : isUnlocked
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500'
                  }`}>
                    {stage.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Popover / Modal */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="relative z-20 mt-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 dark:from-[#0B1526] dark:via-[#0B1526] dark:to-[#0B1526] border border-emerald-200 dark:border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px]">
                  STAGE {selectedStage.id} DETAILS
                </span>
                <span className="text-xs font-semibold text-slate-500">{selectedStage.chapters}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 font-bold text-[10px] flex items-center gap-1 border border-amber-300/30">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>+{selectedStage.xpReward} XP</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedStage.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {selectedStage.subtitle}
              </p>

              {/* Core Topics Checklist */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedStage.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-medium"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Stage Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedStage(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  onNavigate(selectedStage.targetView, selectedStage.targetPayload);
                  setSelectedStage(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-amber-300/30"
              >
                <Play className="w-3.5 h-3.5 fill-current text-amber-200" />
                <span>Launch Stage Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
