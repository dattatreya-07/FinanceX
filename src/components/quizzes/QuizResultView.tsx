import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  BrainCircuit, 
  Sparkles
} from 'lucide-react';
import { Quiz, AppNavView } from '../../types/schema';

interface QuizResultViewProps {
  quiz: Quiz;
  score: number;
  totalQuestions: number;
  correctCount: number;
  onRetry: () => void;
  onNavigate: (view: AppNavView) => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  quiz,
  score,
  totalQuestions,
  correctCount,
  onRetry,
  onNavigate
}) => {
  const isPassed = score >= (quiz.passing_score_percent || 70);

  useEffect(() => {
    if (isPassed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E599', '#FF2E7E', '#06B6D4', '#FBBF24']
      });
    }
  }, [isPassed]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-center py-6" id="quiz-result-view">
      {/* Trophy & Score Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 theme-transition"
      >
        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl ${
          isPassed
            ? 'bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-gradient-to-br dark:from-emerald-500/20 dark:to-[#00E599]/30 dark:text-[#00E599] dark:border-[#00E599]/40 glow-mint'
            : 'bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:text-[#FF2E7E] dark:border-rose-500/40'
        }`}>
          {isPassed ? <Trophy className="w-10 h-10" /> : <Award className="w-10 h-10" />}
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            QUIZ PERFORMANCE SCORECARD
          </span>
          <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white mt-1">
            {isPassed ? 'Outstanding! Quiz Cleared' : 'Needs A Quick Revision'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {quiz.title}
          </p>
        </div>

        {/* Big Score Display */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-36 shadow-xs">
            <span className="text-[10px] font-mono text-slate-500 block font-bold">FINAL SCORE</span>
            <span className={`text-3xl font-mono font-black ${isPassed ? 'text-emerald-600 dark:text-[#00E599]' : 'text-amber-600 dark:text-amber-400'}`}>
              {score.toFixed(0)}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-36 shadow-xs">
            <span className="text-[10px] font-mono text-slate-500 block font-bold">ACCURACY</span>
            <span className="text-3xl font-mono font-black text-slate-900 dark:text-white">
              {correctCount}/{totalQuestions}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-36 shadow-xs">
            <span className="text-[10px] font-mono text-slate-500 block font-bold">XP REWARD</span>
            <span className="text-3xl font-mono font-black text-emerald-600 dark:text-[#00E599] flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>+{correctCount * 30}</span>
            </span>
          </div>
        </div>

        {/* Diagnosis & Recommendations */}
        <div className="text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
          <div className="font-mono font-bold text-slate-900 dark:text-slate-300 flex items-center gap-1.5 uppercase">
            <BrainCircuit className="w-3.5 h-3.5 text-pink-600 dark:text-[#FF2E7E]" />
            <span>AI Tutor Diagnostic Feedback</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {score >= 80
              ? 'You demonstrated strong command of Delta and Gamma sensitivity. You are now prepared to tackle multi-leg option strategies in Lesson 3.'
              : 'You missed questions regarding ATM Gamma peaking near expiration. Review the Option Greeks visualizer in Lesson 2 before attempting the full mock exam.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={() => onNavigate('learn')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
