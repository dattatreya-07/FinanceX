import React, { useState } from 'react';
import { 
  FileQuestion, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { Quiz, Topic, QuizAttempt, AppNavView } from '../../types/schema';

interface QuizzesCatalogViewProps {
  quizzes: Quiz[];
  topics: Topic[];
  attempts: QuizAttempt[];
  onStartQuiz: (quiz: Quiz) => void;
  onNavigate: (view: AppNavView) => void;
}

export const QuizzesCatalogView: React.FC<QuizzesCatalogViewProps> = ({
  quizzes,
  topics,
  attempts,
  onStartQuiz,
  onNavigate
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<number | 'ALL'>('ALL');

  const filteredQuizzes = selectedTopicId === 'ALL'
    ? quizzes
    : quizzes.filter(q => q.topic_id === selectedTopicId);

  return (
    <div className="space-y-6" id="quizzes-catalog-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              Topic Mastery Quizzes
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] border border-emerald-200 dark:border-[#00E599]/40">
              INSTANT FEEDBACK
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Bite-sized diagnostic quizzes with detailed step-by-step mathematical explanations and AI tutor hints.
          </p>
        </div>

        <button
          onClick={() => onNavigate('mock-exams')}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Switch to Full Mock Exams</span>
        </button>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedTopicId('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap cursor-pointer ${
            selectedTopicId === 'ALL'
              ? 'bg-[#FF2E7E] text-white font-bold shadow-xs dark:bg-[#00E599] dark:text-slate-950'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Topics ({quizzes.length})
        </button>
        {topics.map((t) => (
          <button
            key={t.topic_id}
            onClick={() => setSelectedTopicId(t.topic_id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap cursor-pointer ${
              selectedTopicId === t.topic_id
                ? 'bg-[#FF2E7E] text-white font-bold shadow-xs dark:bg-[#00E599] dark:text-slate-950'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t.topic_name}
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => {
          const topic = topics.find(t => t.topic_id === quiz.topic_id);
          const pastAttempt = attempts.find(a => a.quiz_id === quiz.quiz_id);
          const isPassed = pastAttempt && pastAttempt.score >= (quiz.passing_score_percent || 70);

          return (
            <div
              key={quiz.quiz_id}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-4 group shadow-xs theme-transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 font-bold border border-slate-200 dark:border-slate-700">
                    {topic?.topic_name || 'General Finance'}
                  </span>
                  {pastAttempt && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isPassed ? 'bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599]' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      Best: {pastAttempt.score}%
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-[#00E599] transition-colors leading-snug">
                  {quiz.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <FileQuestion className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quiz.total_questions || 5} Questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quiz.time_limit_mins || 10} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pass: {quiz.passing_score_percent || 75}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  +100 XP on completion
                </span>
                <button
                  onClick={() => onStartQuiz(quiz)}
                  className="px-4 py-2 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{pastAttempt ? 'Retake Quiz' : 'Start Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
