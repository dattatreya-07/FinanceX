import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  BrainCircuit
} from 'lucide-react';
import { Quiz, Question, AppNavView } from '../../types/schema';

interface QuizRunnerProps {
  quiz: Quiz;
  questions: Question[];
  onComplete: (score: number, totalQuestions: number, correctCount: number) => void;
  onOpenAIWithQuestion: (qText: string) => void;
  onNavigate: (view: AppNavView) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  quiz,
  questions,
  onComplete,
  onOpenAIWithQuestion
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState((quiz.time_limit_mins || 10) * 60);

  const handleFinishQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.question_id] === q.correct_option) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / questions.length) * 100;
    onComplete(finalScore, questions.length, correctCount);
  };

  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleFinishQuiz();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const currentQ = questions[currentIndex];
  const selectedOption = selectedAnswers[currentQ.question_id];
  const isAnswered = selectedOption !== undefined;

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.question_id]: option
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrev = () => {
    setShowExplanation(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="quiz-runner">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
        <div>
          <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-[#00E599] font-bold">
            PRACTICE EVALUATION
          </span>
          <h2 className="text-base font-display font-black text-slate-900 dark:text-white">
            {quiz.title}
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 text-amber-700 dark:text-amber-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            Question <span className="text-slate-900 dark:text-white font-bold">{currentIndex + 1}</span> of {questions.length}
          </div>
        </div>
      </div>

      {/* Question Progress Dots */}
      <div className="flex items-center gap-1.5">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const userAns = selectedAnswers[q.question_id];
          const isRight = userAns === q.correct_option;
          const isAnswered = userAns !== undefined;

          return (
            <button
              key={q.question_id}
              onClick={() => {
                setCurrentIndex(idx);
                setShowExplanation(false);
              }}
              className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-slate-900 ring-2 ring-pink-500 dark:bg-white dark:ring-[#00E599]'
                  : isAnswered
                  ? isRight
                    ? 'bg-emerald-500 dark:bg-[#00E599]'
                    : 'bg-rose-500 dark:bg-[#FF2E7E]'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 theme-transition">
        <div className="flex justify-between items-start">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            DIFFICULTY: {currentQ.difficulty}
          </span>
          <button
            onClick={() => onOpenAIWithQuestion(currentQ.question_text)}
            className="text-xs text-pink-600 hover:text-pink-700 dark:text-[#FF2E7E] dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-[#FF2E7E]/10 border border-pink-200 dark:border-[#FF2E7E]/30 font-bold transition cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Ask AI Tutor</span>
          </button>
        </div>

        <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ.question_text}
        </h3>

        {/* 4 Options Grid */}
        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
            const optionText = currentQ[`option_${optKey.toLowerCase()}` as keyof Question] as string;
            const isThisSelected = selectedOption === optKey;
            const isThisCorrect = currentQ.correct_option === optKey;

            let optionStyle = 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-300';
            if (isAnswered) {
              if (isThisCorrect) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400 dark:bg-emerald-500/20 dark:border-emerald-500 dark:text-white dark:ring-emerald-500';
              } else if (isThisSelected && !isThisCorrect) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400 dark:bg-rose-500/20 dark:border-rose-500 dark:text-white dark:ring-rose-500';
              }
            }

            return (
              <button
                key={optKey}
                onClick={() => handleSelectOption(optKey)}
                className={`w-full p-4 rounded-2xl border text-left transition flex items-center gap-3.5 text-xs sm:text-sm cursor-pointer ${optionStyle}`}
              >
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                  isAnswered && isThisCorrect
                    ? 'bg-emerald-500 text-white dark:bg-[#00E599] dark:text-slate-950'
                    : isAnswered && isThisSelected
                    ? 'bg-rose-500 text-white dark:bg-[#FF2E7E]'
                    : 'bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-transparent dark:text-slate-300'
                }`}>
                  {optKey}
                </span>
                <span className="flex-1">{optionText}</span>
                {isAnswered && isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />}
                {isAnswered && isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-rose-600 dark:text-[#FF2E7E]" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Reveal */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
          >
            <div className="font-mono font-bold text-emerald-700 dark:text-[#00E599] flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic Explanation</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentQ.explanation}
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:text-slate-900 bg-white border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-900 dark:border-slate-800 shadow-xs'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
        >
          <span>{currentIndex === questions.length - 1 ? 'Finish & View Scorecard' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
