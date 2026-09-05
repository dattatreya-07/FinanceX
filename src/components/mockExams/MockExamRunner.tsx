import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag
} from 'lucide-react';
import { MockExam, Question, AppNavView } from '../../types/schema';

interface MockExamRunnerProps {
  exam: MockExam;
  questions: Question[];
  onComplete: (stats: {
    score: number;
    totalMarks: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    timeSpentMins: number;
  }) => void;
  onNavigate: (view: AppNavView) => void;
}

export const MockExamRunner: React.FC<MockExamRunnerProps> = ({
  exam,
  questions,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState((exam.duration_minutes || 120) * 60);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleSubmitExam = () => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q) => {
      const ans = answers[q.question_id];
      if (!ans) {
        unanswered++;
      } else if (ans === q.correct_option) {
        correct++;
      } else {
        wrong++;
      }
    });

    const netScore = Math.max(0, correct * 1 - wrong * (exam.negative_marking || 0.25));
    const passed = (netScore / questions.length) * 100 >= (exam.passing_percentage || 60);
    const timeSpent = Math.round(((exam.duration_minutes || 120) * 60 - secondsLeft) / 60);

    onComplete({
      score: netScore,
      totalMarks: questions.length,
      passed,
      correctCount: correct,
      wrongCount: wrong,
      unansweredCount: unanswered,
      timeSpentMins: timeSpent
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ = questions[currentIndex];
  const userSelected = answers[currentQ.question_id];
  const isMarked = markedForReview[currentQ.question_id] || false;

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.question_id]: opt
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.question_id]: !prev[currentQ.question_id]
    }));
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.question_id];
      return next;
    });
  };

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;

  return (
    <div className="space-y-6" id="mock-exam-runner">
      {/* NISM Exam Top Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#090D17] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-yellow-500/20 dark:text-yellow-300 border border-amber-200 dark:border-yellow-500/40">
              OFFICIAL NISM SIMULATION
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Code: {exam.exam_code}</span>
          </div>
          <h2 className="text-base sm:text-lg font-display font-black text-slate-900 dark:text-white mt-1">
            {exam.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-slate-900 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-400 font-mono font-bold text-sm shadow-xs">
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white font-bold text-xs transition shadow-xs cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Grid: Exam Question & Question Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Question Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 theme-transition">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Question <strong className="text-slate-900 dark:text-white text-sm">{currentIndex + 1}</strong> of {questions.length}
              </span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-700 dark:text-[#00E599] font-bold">+1.00 Mark</span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="text-rose-600 dark:text-[#FF2E7E] font-bold">-0.25 Negative Mark</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQ.question_text}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                const optText = currentQ[`option_${opt.toLowerCase()}` as keyof Question] as string;
                const isSelected = userSelected === opt;

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center gap-3.5 text-xs sm:text-sm cursor-pointer ${
                      isSelected
                        ? 'bg-pink-50 border-[#FF2E7E] text-slate-900 font-bold ring-1 ring-[#FF2E7E] dark:bg-[#00E599]/15 dark:border-[#00E599] dark:text-white dark:ring-[#00E599]'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      isSelected ? 'bg-[#FF2E7E] text-white dark:bg-[#00E599] dark:text-slate-950' : 'bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-transparent dark:text-slate-400'
                    }`}>
                      {opt}
                    </span>
                    <span className="flex-1">{optText}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Bar (Review, Clear, Next) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleReview}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                    isMarked
                      ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40 font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                {userSelected && (
                  <button
                    onClick={handleClearResponse}
                    className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-rose-600 transition cursor-pointer"
                  >
                    Clear Response
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="px-5 py-2 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 text-xs font-bold transition shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Question Palette */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs theme-transition">
            <div className="font-display font-black text-sm text-slate-900 dark:text-white">
              Question Palette
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500 dark:bg-[#00E599]" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span>Review ({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
                <span>Unanswered ({questions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded ring-2 ring-pink-500 dark:ring-white bg-slate-400 dark:bg-slate-700" />
                <span>Current</span>
              </div>
            </div>

            {/* Grid of numbers */}
            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const hasAnswer = answers[q.question_id] !== undefined;
                const isRev = markedForReview[q.question_id];
                const isCur = idx === currentIndex;

                let colorStyle = 'bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700';
                if (hasAnswer) colorStyle = 'bg-emerald-500 text-white font-bold dark:bg-[#00E599] dark:text-slate-950';
                else if (isRev) colorStyle = 'bg-purple-600 text-white font-bold';

                return (
                  <button
                    key={q.question_id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl border text-xs font-mono transition flex items-center justify-center cursor-pointer ${colorStyle} ${
                      isCur ? 'ring-2 ring-pink-500 dark:ring-white scale-105 shadow-sm' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Instructions box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-300">NISM Guidelines:</div>
              <p>Passing score is 60%. Negative marks of 0.25 apply for incorrect options. Do not leave calculations blank if confident of eliminating 2 choices.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl theme-transition">
            <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
              Confirm Final Examination Submission?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
              {reviewCount > 0 && ` You also have ${reviewCount} questions marked for review.`}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px] font-bold">ANSWERED</span>
                <span className="font-bold text-emerald-700 dark:text-[#00E599]">{answeredCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px] font-bold">REVIEW</span>
                <span className="font-bold text-purple-700 dark:text-purple-400">{reviewCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px] font-bold">UNANSWERED</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{questions.length - answeredCount}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 transition cursor-pointer"
              >
                Back to Exam
              </button>
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleSubmitExam();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Confirm & Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
