import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Video, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Award 
} from 'lucide-react';
import { CoinFlipLoader } from '../brand/CoinFlipLoader';
import { FinanceXLogo } from '../brand/FinanceXLogo';

interface PersonalizationFlowProps {
  onComplete: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  knowledgeLevel: string;
  primaryGoal: string;
  preferredFormat: 'TEXT' | 'VIDEO' | 'PRACTICAL';
  dailyCommitmentMins: number;
}

export const PersonalizationFlow: React.FC<PersonalizationFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const [knowledgeLevel, setKnowledgeLevel] = useState<string>('Market Explorer');
  const [primaryGoal, setPrimaryGoal] = useState<string>('NISM Series VIII Derivatives');
  const [preferredFormat, setPreferredFormat] = useState<'TEXT' | 'VIDEO' | 'PRACTICAL'>('TEXT');
  const [dailyCommitmentMins, setDailyCommitmentMins] = useState<number>(30);

  const handleFinish = () => {
    setIsCompiling(true);
    setTimeout(() => {
      onComplete({
        knowledgeLevel,
        primaryGoal,
        preferredFormat,
        dailyCommitmentMins
      });
    }, 2000);
  };

  if (isCompiling) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090E] flex flex-col items-center justify-center p-6 text-center theme-transition">
        <CoinFlipLoader label="FinanceX AI is compiling your customized syllabus & study plan..." size="lg" />
        <div className="max-w-md w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mt-6 text-left text-xs font-mono text-slate-600 dark:text-slate-400 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00E599]">
            <Check className="w-3.5 h-3.5" />
            <span>Assessed Level: {knowledgeLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00E599]">
            <Check className="w-3.5 h-3.5" />
            <span>Target Goal: {primaryGoal}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00E599]">
            <Check className="w-3.5 h-3.5" />
            <span>Simulation Balance: ₹10,00,000 Allocated</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-[#00E599]">
            <Check className="w-3.5 h-3.5" />
            <span>AI Tutor Vector Index Initialized</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8 theme-transition" id="personalization-flow">
      {/* Top Header */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between">
        <FinanceXLogo size="sm" variant="compact" />
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>Step {step} of 4</span>
          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-[#FF2E7E] dark:from-[#00E599] dark:to-[#FF2E7E] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Questionnaire Box */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-pink-600 dark:text-[#00E599] uppercase font-bold">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Knowledge Assessment</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mt-1">
                  What is your current financial knowledge level?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  We will calibrate our math depth, formulas, and AI tutoring explanations accordingly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Novice Saver', desc: 'New to stock markets, interest rates, and financial terms.', badge: 'Level 1' },
                  { title: 'Market Explorer', desc: 'Understand basics (P/E, equities, SIPs, mutual funds).', badge: 'Level 2' },
                  { title: 'Derivative Analyst', desc: 'Familiar with futures, options Greeks, and technical setups.', badge: 'Level 3' },
                  { title: 'Chartered Master', desc: 'Preparing for NISM/CFA certification or professional roles.', badge: 'Level 4' }
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setKnowledgeLevel(item.title)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer shadow-xs ${
                      knowledgeLevel === item.title
                        ? 'bg-pink-50 border-[#FF2E7E] ring-1 ring-[#FF2E7E] dark:bg-slate-800/80 dark:border-[#00E599] dark:ring-[#00E599]'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-pink-600 dark:text-[#00E599] uppercase font-bold">
                  <Target className="w-4 h-4" />
                  <span>Target Milestones</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mt-1">
                  What is your primary learning goal?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  FinanceX will assemble your mock exams, daily quizzes, and simulations around this.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'NISM Series VIII Derivatives Certification', subtitle: 'Official regulatory certification for equity derivative dealers.', icon: <Award className="w-5 h-5 text-emerald-600 dark:text-[#00E599]" /> },
                  { title: 'NISM Series XV Research Analyst Prep', subtitle: 'Financial modeling, valuation methodologies, and SEBI compliance.', icon: <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> },
                  { title: 'Practical Options & Hedging Mastery', subtitle: 'Learn to trade delta-neutral straddles and multi-leg risk strategies.', icon: <TrendingUp className="w-5 h-5 text-pink-600 dark:text-[#FF2E7E]" /> },
                  { title: 'Fixed Income & Bond Market Fundamentals', subtitle: 'Yield curves, Macaulay duration, and central bank interest rate mechanics.', icon: <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> }
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setPrimaryGoal(item.title)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center gap-4 cursor-pointer shadow-xs ${
                      primaryGoal === item.title
                        ? 'bg-pink-50 border-[#FF2E7E] ring-1 ring-[#FF2E7E] dark:bg-slate-800/80 dark:border-[#00E599] dark:ring-[#00E599]'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">{item.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{item.subtitle}</div>
                    </div>
                    {primaryGoal === item.title && <Check className="w-5 h-5 text-pink-600 dark:text-[#00E599]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-pink-600 dark:text-[#00E599] uppercase font-bold">
                  <BookOpen className="w-4 h-4" />
                  <span>Learning Modality</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mt-1">
                  How do you learn best?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  All lessons support both formats, but we will default your view.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { mode: 'TEXT' as const, label: 'Concise Text & Formulas', desc: 'Mathematical explanations, markdown cheatsheets, and quick skim notes.', icon: <BookOpen className="w-6 h-6 text-cyan-600 dark:text-cyan-400" /> },
                  { mode: 'VIDEO' as const, label: 'Video Lectures', desc: 'Visual step-by-step walkthroughs with timestamped transcripts.', icon: <Video className="w-6 h-6 text-pink-600 dark:text-[#FF2E7E]" /> },
                  { mode: 'PRACTICAL' as const, label: 'Hands-On Simulation', desc: 'Jump directly into interactive market order books and virtual sandboxes.', icon: <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-[#00E599]" /> }
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setPreferredFormat(item.mode)}
                    className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer shadow-xs ${
                      preferredFormat === item.mode
                        ? 'bg-pink-50 border-[#FF2E7E] ring-1 ring-[#FF2E7E] dark:bg-slate-800/80 dark:border-[#00E599] dark:ring-[#00E599]'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="mb-3">{item.icon}</div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{item.label}</div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-pink-600 dark:text-[#00E599] uppercase font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Daily Commitment</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mt-1">
                  How much time can you dedicate daily?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Consistent micro-learning creates bulletproof financial intuition and streaks.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDailyCommitmentMins(mins)}
                    className={`p-5 rounded-2xl border text-center transition flex flex-col items-center justify-center cursor-pointer shadow-xs ${
                      dailyCommitmentMins === mins
                        ? 'bg-pink-50 border-[#FF2E7E] ring-1 ring-[#FF2E7E] dark:bg-slate-800/80 dark:border-[#00E599] dark:ring-[#00E599]'
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">{mins}</span>
                    <span className="text-xs text-slate-500 uppercase mt-0.5 font-bold">Mins / Day</span>
                    {dailyCommitmentMins === mins && (
                      <span className="mt-2 text-[10px] font-mono text-pink-600 dark:text-[#00E599] font-bold">OPTIMAL</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800/60">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-4 py-2 font-bold cursor-pointer"
          >
            Previous
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => {
            if (step < 4) {
              setStep((s) => s + 1);
            } else {
              handleFinish();
            }
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <span>{step === 4 ? 'Build My Learning Path' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
