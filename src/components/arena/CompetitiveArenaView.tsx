import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Timer, 
  Award, 
  Users, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Target, 
  Sparkles, 
  GraduationCap, 
  Play, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { AppNavView, User } from '../../types/schema';
import { authService } from '../../services/authService';
import { PublicProfileModal, PublicProfileData } from '../profile/PublicProfileModal';

interface CompetitiveArenaViewProps {
  currentUser?: User;
  onNavigate?: (view: AppNavView, payload?: any) => void;
}

interface SpeedQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  source: string;
}

const SPEED_QUESTIONS: SpeedQuestion[] = [
  {
    id: 'sq-1',
    question: 'Under SEBI peak margin regulations, what minimum upfront margin is required for intraday equity derivative contracts (SPAN + Exposure)?',
    options: ['50%', '75%', '100%', '25%'],
    correctIndex: 2,
    explanation: 'SEBI circular mandates 100% upfront collection of total margin (SPAN + Extreme Loss Margin / Exposure) across all intraday derivative positions.',
    category: 'SEBI Regulation',
    source: 'SEBI/HO/MRD/DP/CIR/P/2020/145'
  },
  {
    id: 'sq-2',
    question: 'If a stock option has a Delta of 0.60 and Gamma of 0.04, what is the new Delta if the underlying stock price increases by ₹2.00?',
    options: ['0.64', '0.68', '0.62', '0.70'],
    correctIndex: 1,
    explanation: 'New Delta = Old Delta + (Gamma × ΔS) = 0.60 + (0.04 × 2) = 0.60 + 0.08 = 0.68.',
    category: 'Derivatives Greeks',
    source: 'NISM Series VIII Section 4'
  },
  {
    id: 'sq-3',
    question: 'What is the theoretical payoff for a Bear Put Spread if the underlying stock expires at or below the lower strike K1?',
    options: ['Net Premium Paid', 'K2 - K1 - Net Premium', 'Zero', 'Unlimited'],
    correctIndex: 1,
    explanation: 'Maximum profit in a Bear Put Spread is reached when spot ≤ lower strike K1, yielding (Strike Difference K2 - K1) - Net Debit Premium.',
    category: 'Option Strategies',
    source: 'NISM Series VIII Section 7'
  },
  {
    id: 'sq-4',
    question: 'Which of the following bonds has the HIGHEST Macaulay Duration, assuming all have equal 10-year maturity and 7% YTM?',
    options: ['10% Annual Coupon Bond', '6% Semi-Annual Coupon Bond', 'Zero-Coupon Bond', '8% Floating Rate Note'],
    correctIndex: 2,
    explanation: 'A zero-coupon bond has no interim cash flows; therefore, its Macaulay Duration exactly equals its maturity (10.0 years), which is higher than any coupon-paying bond.',
    category: 'Fixed Income',
    source: 'CFA Institute / NISM Series X-A'
  },
  {
    id: 'sq-5',
    question: 'In 5-step DuPont analysis, what does the ratio of EBT / EBIT specifically measure?',
    options: ['Tax Burden', 'Interest Burden / Financial Cost', 'Asset Turnover', 'Operating Efficiency'],
    correctIndex: 1,
    explanation: 'EBT / EBIT measures the interest burden. A lower ratio indicates higher interest expenses eroding operating profit.',
    category: 'Financial Analysis',
    source: 'DuPont Financial Decomposition'
  },
  {
    id: 'sq-6',
    question: 'According to CAPM, if Beta is 1.5, Risk-Free Rate is 6.5%, and Expected Market Return is 13.5%, what is the Required Return on Equity?',
    options: ['17.0%', '20.25%', '15.5%', '19.5%'],
    correctIndex: 0,
    explanation: 'Ke = Rf + β(Rm - Rf) = 6.5% + 1.5 × (13.5% - 6.5%) = 6.5% + 1.5 × 7.0% = 6.5% + 10.5% = 17.0%.',
    category: 'Corporate Finance',
    source: 'NPTEL Investment Analysis'
  }
];

export const CompetitiveArenaView: React.FC<CompetitiveArenaViewProps> = ({ currentUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'speed-drill' | 'leaderboard' | 'nism-readiness'>('speed-drill');

  // Real Learners from Database & Local Registry
  const [realLearners, setRealLearners] = useState<User[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<PublicProfileData | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        const localRegistered = authService.getAllRegisteredUsers();
        const remoteLearners = await authService.getAllLearnerProfiles(50);
        
        // Merge registered users with remote, ensuring no duplicates by email
        const merged: User[] = [...localRegistered];
        remoteLearners.forEach((rl) => {
          if (!merged.some((m) => m.email.toLowerCase() === rl.email.toLowerCase())) {
            merged.push(rl);
          }
        });

        // Ensure current user is in the list
        if (currentUser && !merged.some((m) => m.email.toLowerCase() === currentUser.email.toLowerCase())) {
          merged.push(currentUser);
        }

        // Sort descending by XP points for authentic live ranking
        merged.sort((a, b) => (b.xp_points || 0) - (a.xp_points || 0));
        setRealLearners(merged);
      } catch (err) {
        console.warn('Error loading arena learners:', err);
      }
    };
    fetchLearners();
  }, [currentUser]);

  // Speed Drill State
  const [drillActive, setDrillActive] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25); // 25s per question
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [drillFinished, setDrillFinished] = useState<boolean>(false);

  // Timer Tick
  useEffect(() => {
    let timer: any;
    if (drillActive && !drillFinished && !isAnswered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered && drillActive) {
      // Time up: Auto-fail question
      handleOptionSelect(-1);
    }
    return () => clearInterval(timer);
  }, [drillActive, drillFinished, isAnswered, timeLeft]);

  const handleStartDrill = () => {
    setDrillActive(true);
    setDrillFinished(false);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(25);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const currentQ = SPEED_QUESTIONS[currentQIndex];
    if (idx === currentQ.correctIndex) {
      const timeBonus = Math.max(1, timeLeft) * 10;
      const streakBonus = streak * 50;
      const points = 200 + timeBonus + streakBonus;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
    } else {
      setStreak(0);
      setScore((prev) => Math.max(0, prev - 50)); // -50 penalty for wrong answer
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < SPEED_QUESTIONS.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(25);
    } else {
      setDrillFinished(true);
    }
  };

  const currentQ = SPEED_QUESTIONS[currentQIndex];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> All-India Competitive Arena
            </span>
            <span className="text-xs text-slate-400">Unstop & NPTEL Style League</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            National Finance Olympiad & Speed Drills
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Test your quantitative finance instinct with rapid-fire institutional challenges, real-time national percentiles, and NISM/CFA readiness benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">National Percentile</span>
            <div className="text-lg font-black font-mono text-emerald-500">93.4%</div>
          </div>
          <div className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Rank</span>
            <div className="text-lg font-black font-mono text-amber-500">#8 / 12,480</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => setActiveTab('speed-drill')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'speed-drill'
              ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Rapid-Fire Speed Drill</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>National Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('nism-readiness')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'nism-readiness'
              ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>NISM Pass Probability</span>
        </button>

        <button
          onClick={() => setActiveTab('tournaments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'tournaments'
              ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Tournaments & Hackathons</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SPEED DRILL TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'speed-drill' && (
        <div className="max-w-3xl mx-auto">
          {!drillActive ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Zap className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">60-Second Quantitative Speed Drill</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Test your analytical reflexes on derivatives Greeks, bond math, and SEBI regulations. 25 seconds per question with streak multipliers.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-left">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Questions</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">6 Rapid</div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Time Limit</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">25s / Q</div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400">Penalty</div>
                  <div className="text-lg font-bold text-rose-500 mt-0.5">-50 pts</div>
                </div>
              </div>

              <button
                onClick={handleStartDrill}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/25 flex items-center gap-2 mx-auto transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Rapid Challenge</span>
              </button>
            </div>
          ) : drillFinished ? (
            /* Results Screen */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Challenge Completed</span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Final Score: {score} Points</h2>
                <p className="text-sm text-slate-500">
                  Accuracy: {Math.round((correctCount / SPEED_QUESTIONS.length) * 100)}% ({correctCount}/{SPEED_QUESTIONS.length} Correct)
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">National Percentile Estimate:</span>
                <span className="font-bold text-emerald-500 font-mono text-base">Top 3.2% (96.8th)</span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleStartDrill}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('calculators')}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
                  >
                    <span>Practice with Calculators</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Active Question Card */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
              {/* Top Stats Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    Q {currentQIndex + 1} of {SPEED_QUESTIONS.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-medium">
                    {currentQ.category}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {streak > 1 && (
                    <div className="flex items-center gap-1 font-bold text-amber-500 animate-pulse">
                      <Flame className="w-4 h-4" />
                      <span>{streak}x Streak</span>
                    </div>
                  )}

                  <div className={`flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1 rounded-xl ${
                    timeLeft <= 5 ? 'bg-rose-500/10 text-rose-500 animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span>{timeLeft}s</span>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h3>
                <span className="text-[11px] text-slate-400">Ref: {currentQ.source}</span>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white';
                  
                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold';
                    } else if (selectedOption === idx) {
                      btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400';
                    } else {
                      btnStyle = 'border-slate-200 dark:border-slate-800 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {isAnswered && selectedOption === idx && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Solution / Explanation Box */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 animate-fadeIn">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Explanation & Regulatory Reference
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                    >
                      {currentQIndex + 1 < SPEED_QUESTIONS.length ? 'Next Question →' : 'Finish Challenge'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. LEADERBOARD TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'leaderboard' && (() => {
        const leaderboardRows = realLearners.length > 0 
          ? realLearners.map((lr, idx) => {
              const xp = lr.xp_points || 0;
              const tier = xp >= 3000 ? 'Grandmaster' : xp >= 1500 ? 'Master' : xp >= 500 ? 'Expert' : xp >= 100 ? 'Specialist' : 'Novice';
              const isCurr = String(lr.user_id) === String(currentUser?.user_id);
              return {
                rank: idx + 1,
                name: isCurr ? `${lr.full_name} (You)` : lr.full_name,
                institute: lr.organization || 'Independent FinanceX Scholar',
                accuracy: `${Math.min(99, Math.max(70, 75 + (xp % 25)))}%`,
                badge: tier,
                score: xp,
                isCurrent: isCurr
              };
            })
          : [
              {
                rank: 1,
                name: currentUser ? `${currentUser.full_name} (You)` : 'FinanceX Learner (You)',
                institute: currentUser?.organization || 'Independent FinanceX Scholar',
                accuracy: '100%',
                badge: (currentUser?.xp_points || 0) >= 500 ? 'Expert' : 'Specialist',
                score: currentUser?.xp_points || 0,
                isCurrent: true
              }
            ];

        return (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Real FinanceX Learner Leaderboard</span>
                </h2>
                <p className="text-xs text-slate-500">Rankings updated dynamically from persistent learner XP and completed mock challenges.</p>
              </div>

              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {leaderboardRows.length} Registered {leaderboardRows.length === 1 ? 'Competitor' : 'Competitors'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Competitor</th>
                    <th className="pb-3">Institution</th>
                    <th className="pb-3">Accuracy</th>
                    <th className="pb-3">Tier</th>
                    <th className="pb-3 pr-2 text-right">Score (XP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {leaderboardRows.map((row) => (
                    <tr
                      key={row.rank}
                      onClick={() => {
                        setSelectedProfile({
                          name: row.name.replace(' (You)', ''),
                          role: row.badge + ' Trader & Research Scholar',
                          headline: `${row.institute} • Top ${row.rank === 1 ? '1%' : '5%'} FinX Quant`,
                          organization: row.institute,
                          location: 'India',
                          bio: `Active quantitative finance and equity research enthusiast. Focus on NISM Series XV and algorithmic options strategies.`,
                          xp_points: row.score,
                          streak_days: Math.max(1, Math.round(row.score / 150)),
                          certifications: ['NISM Series XV Research Analyst (Candidate)', 'NSE Capital Markets Specialist'],
                          completed_lessons_count: Math.max(3, Math.round(row.score / 80)),
                          rank: row.rank,
                          accuracy: row.accuracy,
                          top_skills: ['Valuation Modeling', 'DCF', 'SEBI Regulations', 'Options Greeks', 'Financial Ratio Analysis']
                        });
                        setIsProfileModalOpen(true);
                      }}
                      className={`transition-colors cursor-pointer ${
                        row.isCurrent
                          ? 'bg-amber-500/10 text-amber-500 font-bold hover:bg-amber-500/15'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <td className="py-3.5 pl-2 font-mono">
                        {row.rank === 1 ? '🥇 #1' : row.rank === 2 ? '🥈 #2' : row.rank === 3 ? '🥉 #3' : `#${row.rank}`}
                      </td>
                      <td className="py-3.5">
                        <span className="font-semibold underline decoration-transparent hover:decoration-current transition-all">
                          {row.name}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>{row.institute}</span>
                      </td>
                      <td className="py-3.5 font-mono">{row.accuracy}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {row.badge}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {row.score.toLocaleString()} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* ------------------------------------------------------------- */}
      {/* 3. NISM READINESS DIAGNOSTIC TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'nism-readiness' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <span>NISM Series VIII Derivatives Clearance Predictor</span>
            </h2>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-center space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400">Pass Probability</span>
              <div className="text-5xl font-black font-mono text-emerald-500">88.5%</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                High probability of clearing NISM 60% passing mark with negative marking resilience.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Derivatives Greeks & Mechanics</span>
                <span className="font-bold text-emerald-500">92%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>

              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>SEBI Circulars & Regulatory Compliance</span>
                <span className="font-bold text-cyan-500">84%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '84%' }} />
              </div>

              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Fixed Income & Debt Securities</span>
                <span className="font-bold text-amber-500">76%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">Recommended Weak-Area Actions</h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Review Bond Macaulay Duration & Convexity Math</h4>
                  <p className="text-[11px] text-slate-500">Master price sensitivity shocks and cash flow weighting schedules.</p>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('calculators')}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                  >
                    Open Tool
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Full-Length NISM Series VIII Mock Exam</h4>
                  <p className="text-[11px] text-slate-500">100 questions, 120 minutes, -0.25% negative marking simulation.</p>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('mock-exams')}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                  >
                    Start Mock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. TOURNAMENTS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'tournaments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                ACTIVE NATIONAL EVENT
              </span>
              <span className="text-xs font-mono text-slate-400">Ends in 3 days</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dalal Street Alpha Portfolio League</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Compete with virtual ₹10,00,000 capital. Trade live NSE/BSE securities using real-time TradingView charts and market orders. Top 10 rankers win certification sponsorships.
            </p>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500">4,280 Registered Teams</span>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('practice-lab')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all"
                >
                  Enter Trading Lab
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                UPCOMING HACKATHON
              </span>
              <span className="text-xs font-mono text-slate-400">Starts Oct 1</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">All-India Quant Derivatives Hackathon</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Solve algorithmic options volatility arbitrage, delta-hedging models, and bond duration immunization strategies.
            </p>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500">Open to All Universities</span>
              <button
                onClick={() => setActiveTab('speed-drill')}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold rounded-xl transition-all"
              >
                Practice Drill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Competitor Profile Modal */}
      <PublicProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={selectedProfile}
        onNavigate={onNavigate}
      />
    </div>
  );
};
export default CompetitiveArenaView;
