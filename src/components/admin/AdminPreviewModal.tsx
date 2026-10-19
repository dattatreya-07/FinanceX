import React from 'react';
import { Eye, BookOpen, HelpCircle, Award, CheckCircle, FileText } from 'lucide-react';
import { Course, Lesson, LessonContent, LessonResource, Quiz, Question, MockExam } from '../../types/schema';

interface AdminPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewType: 'COURSE' | 'LESSON' | 'QUIZ' | 'EXAM';
  course?: Course;
  lesson?: Lesson;
  lessonContent?: LessonContent;
  lessonResources?: LessonResource[];
  quiz?: Quiz;
  questions?: Question[];
  mockExam?: MockExam;
}

export const AdminPreviewModal: React.FC<AdminPreviewModalProps> = ({
  isOpen,
  onClose,
  previewType,
  course,
  lesson,
  lessonContent,
  lessonResources = [],
  quiz,
  questions = [],
  mockExam
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-100 text-pink-600 dark:bg-[#00E599]/15 dark:text-[#00E599]">
              <Eye className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Learner View Preview Simulator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                  {previewType}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Accurate reproduction of how authenticated students experience this educational content.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono cursor-pointer"
          >
            Close [✕]
          </button>
        </div>

        {/* Content Preview based on Type */}
        {previewType === 'COURSE' && course && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-bold">
                  {course.level || 'INTERMEDIATE'}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  ~{course.estimated_hours || 4} Hours
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {course.course_title}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.description || 'Master this comprehensive institutional finance curriculum.'}
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>Total Modules: 4</span>
                <span>•</span>
                <span>Lessons: {course.total_lessons || 12}</span>
                <span>•</span>
                <span>Author: {course.author || 'FinanceX Academy'}</span>
              </div>
            </div>
          </div>
        )}

        {previewType === 'LESSON' && lesson && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>LESSON {lesson.order_index || 1} • {lesson.estimated_mins || 15} MINS READ</span>
                <span className="text-pink-600 dark:text-[#00E599] font-bold">NISM Regulatory Standard</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                  {lesson.description}
                </p>
              )}

              {/* Raw body / Markdown preview */}
              <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                {lessonContent?.raw_body || 'Educational lesson content and mathematical formulations will render here.'}
              </div>

              {/* Resources */}
              {lessonResources.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
                    Downloadable Resources & PDFs ({lessonResources.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lessonResources.map((res) => (
                      <div
                        key={res.resource_id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                          {res.resource_title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {res.resource_type?.replace(/_/g, ' ') || 'PDF'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {previewType === 'QUIZ' && quiz && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{quiz.title}</h2>
                <span className="text-xs font-mono font-bold text-pink-600 dark:text-[#00E599]">
                  Passing: {quiz.passing_score_percent || 70}%
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Assigned Questions: {questions.length} • Time Limit: {quiz.time_limit_mins || 15} mins
              </p>

              <div className="space-y-3 pt-2">
                {questions.slice(0, 3).map((q, idx) => (
                  <div key={q.question_id} className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Q{idx + 1}. {q.question_text}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">A) {q.option_a}</div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">B) {q.option_b}</div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">C) {q.option_c}</div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">D) {q.option_d}</div>
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-[#00E599] font-mono">
                      Correct: Option {q.correct_option}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {previewType === 'EXAM' && mockExam && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{mockExam.title}</h2>
                <span className="text-xs font-mono font-bold text-pink-600 dark:text-[#00E599]">
                  {mockExam.exam_code || 'NISM-VIII'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">DURATION</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{mockExam.duration_minutes || 120} Mins</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">TOTAL MARKS</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{mockExam.total_marks || 100} Marks</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">PASS CRITERIA</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{mockExam.passing_percentage || 60}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">NEGATIVE MARKING</span>
                  <span className="font-bold text-rose-500">-{mockExam.negative_marking ?? 0.25} per wrong</span>
                </div>
              </div>
              {mockExam.instructions && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                  <strong>Exam Instructions:</strong> {mockExam.instructions}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
