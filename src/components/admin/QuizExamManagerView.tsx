import React, { useState } from 'react';
import { 
  Plus, 
  HelpCircle, 
  FileCheck2, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  Award, 
  CheckCircle2, 
  Check, 
  Search, 
  Layers
} from 'lucide-react';
import { Quiz, MockExam, Question, Course, Topic, ContentStatus } from '../../types/schema';

interface QuizExamManagerViewProps {
  quizzes: Quiz[];
  mockExams: MockExam[];
  questions: Question[];
  courses: Course[];
  topics: Topic[];
  onSaveQuiz: (quiz: Quiz, assignedQuestionIds: number[]) => void;
  onSaveMockExam: (exam: MockExam, assignedQuestionIds: number[]) => void;
  onDeleteQuiz: (quizId: number) => void;
  onDeleteMockExam: (examId: number) => void;
  onPreviewQuiz: (quiz: Quiz) => void;
  onPreviewExam: (exam: MockExam) => void;
}

export const QuizExamManagerView: React.FC<QuizExamManagerViewProps> = ({
  quizzes,
  mockExams,
  questions,
  courses,
  topics,
  onSaveQuiz,
  onSaveMockExam,
  onDeleteQuiz,
  onDeleteMockExam,
  onPreviewQuiz,
  onPreviewExam
}) => {
  const [activeTab, setActiveTab] = useState<'QUIZZES' | 'EXAMS'>('QUIZZES');

  // Quiz Modal State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizTopicId, setQuizTopicId] = useState<number>(topics[0]?.topic_id || 1);
  const [quizPassScore, setQuizPassScore] = useState(70);
  const [quizTimeLimit, setQuizTimeLimit] = useState(15);
  const [quizStatus, setQuizStatus] = useState<ContentStatus>('PUBLISHED');
  const [selectedQuizQIds, setSelectedQuizQIds] = useState<number[]>([]);

  // Mock Exam Modal State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<MockExam | null>(null);
  const [examTitle, setExamTitle] = useState('');
  const [examCourseId, setExamCourseId] = useState<number>(courses[0]?.course_id || 1);
  const [examCode, setExamCode] = useState('NISM-VIII-SIM');
  const [examDuration, setExamDuration] = useState(120);
  const [examTotalMarks, setExamTotalMarks] = useState(100);
  const [examPassPercent, setExamPassPercent] = useState(60);
  const [examNegativeMarking, setExamNegativeMarking] = useState(0.25);
  const [examInstructions, setExamInstructions] = useState('Official NISM pattern simulated exam. 100 questions, 120 minutes. Negative marking of 0.25 for incorrect responses.');
  const [examStatus, setExamStatus] = useState<ContentStatus>('PUBLISHED');
  const [selectedExamQIds, setSelectedExamQIds] = useState<number[]>([]);

  const [questionSearch, setQuestionSearch] = useState('');

  // Quiz Modal Open
  const openCreateQuizModal = () => {
    setEditingQuiz(null);
    setQuizTitle('');
    setQuizTopicId(topics[0]?.topic_id || 1);
    setQuizPassScore(70);
    setQuizTimeLimit(15);
    setQuizStatus('PUBLISHED');
    setSelectedQuizQIds([]);
    setIsQuizModalOpen(true);
  };

  const openEditQuizModal = (q: Quiz) => {
    setEditingQuiz(q);
    setQuizTitle(q.title);
    setQuizTopicId(q.topic_id);
    setQuizPassScore(q.passing_score_percent || 70);
    setQuizTimeLimit(q.time_limit_mins || 15);
    setQuizStatus(q.status || 'PUBLISHED');
    // Default select first 5 questions of this topic
    const topicQIds = questions.filter(item => item.topic_id === q.topic_id).map(item => item.question_id);
    setSelectedQuizQIds(topicQIds.slice(0, 5));
    setIsQuizModalOpen(true);
  };

  // Exam Modal Open
  const openCreateExamModal = () => {
    setEditingExam(null);
    setExamTitle('');
    setExamCourseId(courses[0]?.course_id || 1);
    setExamCode('NISM-VIII-SIM');
    setExamDuration(120);
    setExamTotalMarks(100);
    setExamPassPercent(60);
    setExamNegativeMarking(0.25);
    setExamInstructions('Official NISM Series VIII format. 100 questions. 25% negative marking for incorrect attempts.');
    setExamStatus('PUBLISHED');
    setSelectedExamQIds(questions.slice(0, 10).map(q => q.question_id));
    setIsExamModalOpen(true);
  };

  const openEditExamModal = (e: MockExam) => {
    setEditingExam(e);
    setExamTitle(e.title);
    setExamCourseId(e.course_id);
    setExamCode(e.exam_code || 'NISM-SIM');
    setExamDuration(e.duration_minutes || 120);
    setExamTotalMarks(e.total_marks || 100);
    setExamPassPercent(e.passing_percentage || 60);
    setExamNegativeMarking(e.negative_marking ?? 0.25);
    setExamInstructions(e.instructions || '');
    setExamStatus(e.status || 'PUBLISHED');
    setSelectedExamQIds(questions.slice(0, 8).map(q => q.question_id));
    setIsExamModalOpen(true);
  };

  const toggleQuestionSelection = (qId: number, isExam: boolean) => {
    if (isExam) {
      setSelectedExamQIds(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]);
    } else {
      setSelectedQuizQIds(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    const updated: Quiz = {
      quiz_id: editingQuiz ? editingQuiz.quiz_id : Date.now(),
      title: quizTitle.trim(),
      topic_id: quizTopicId,
      passing_score_percent: Number(quizPassScore),
      time_limit_mins: Number(quizTimeLimit),
      total_questions: selectedQuizQIds.length,
      status: quizStatus
    };

    onSaveQuiz(updated, selectedQuizQIds);
    setIsQuizModalOpen(false);
  };

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    const updated: MockExam = {
      exam_id: editingExam ? editingExam.exam_id : Date.now(),
      title: examTitle.trim(),
      course_id: examCourseId,
      exam_code: examCode.trim(),
      duration_minutes: Number(examDuration),
      total_marks: Number(examTotalMarks),
      passing_percentage: Number(examPassPercent),
      negative_marking: Number(examNegativeMarking),
      instructions: examInstructions,
      status: examStatus
    };

    onSaveMockExam(updated, selectedExamQIds);
    setIsExamModalOpen(false);
  };

  return (
    <div className="space-y-6" id="quiz-exam-manager-view">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Quizzes & Mock Exams Management
          </h1>
          <p className="text-xs text-slate-500">
            Configure passing thresholds, time limits, negative marking factors, and question allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'QUIZZES' ? (
            <button
              onClick={openCreateQuizModal}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Practice Quiz</span>
            </button>
          ) : (
            <button
              onClick={openCreateExamModal}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create NISM Mock Exam</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('QUIZZES')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold transition border-b-2 cursor-pointer ${
            activeTab === 'QUIZZES'
              ? 'border-pink-600 text-pink-600 dark:border-[#00E599] dark:text-[#00E599]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Practice Quizzes ({quizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EXAMS')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold transition border-b-2 cursor-pointer ${
            activeTab === 'EXAMS'
              ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>NISM Mock Exams ({mockExams.length})</span>
        </button>
      </div>

      {/* Quizzes Tab Content */}
      {activeTab === 'QUIZZES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((q) => {
            const topic = topics.find(t => t.topic_id === q.topic_id);

            return (
              <div
                key={q.quiz_id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599]">
                      {q.status || 'PUBLISHED'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ~{q.time_limit_mins || 15} Mins
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {q.title}
                    </h3>
                    <div className="text-xs font-mono text-pink-600 dark:text-[#00E599] mt-1">
                      {topic?.topic_name || 'Regulatory Module'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span>Questions: <strong>{q.total_questions || 5}</strong></span>
                    <span>Pass: <strong>{q.passing_score_percent || 70}%</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditQuizModal(q)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Edit Quiz"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPreviewQuiz(q)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Preview Quiz"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteQuiz(q.quiz_id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                    title="Delete Quiz"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mock Exams Tab Content */}
      {activeTab === 'EXAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockExams.map((exam) => {
            const course = courses.find(c => c.course_id === exam.course_id);

            return (
              <div
                key={exam.exam_id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-400 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                      {exam.exam_code || 'NISM-VIII'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {exam.duration_minutes || 120} Mins
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {exam.title}
                    </h3>
                    <div className="text-xs font-mono text-purple-600 dark:text-purple-400 mt-1 truncate">
                      {course?.course_title || 'NISM Regulatory Track'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">TOTAL MARKS</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{exam.total_marks || 100}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">NEG. MARK</span>
                      <span className="font-bold text-rose-500">-{exam.negative_marking ?? 0.25}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditExamModal(exam)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Edit Exam"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPreviewExam(exam)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title="Preview Exam"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteMockExam(exam.exam_id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  {editingQuiz ? 'Edit Practice Quiz' : 'Create Practice Quiz'}
                </h3>
                <p className="text-xs text-slate-500">Configure topic association and allocate questions from the question bank.</p>
              </div>
              <button onClick={() => setIsQuizModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleQuizSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. SPAN Margining & Option Greeks Speed Check"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Topic</label>
                  <select
                    value={quizTopicId}
                    onChange={(e) => setQuizTopicId(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    {topics.map((t) => (
                      <option key={t.topic_id} value={t.topic_id}>{t.topic_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Passing Score (%)</label>
                  <input
                    type="number"
                    value={quizPassScore}
                    onChange={(e) => setQuizPassScore(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Limit (Mins)</label>
                  <input
                    type="number"
                    value={quizTimeLimit}
                    onChange={(e) => setQuizTimeLimit(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Question Allocator */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Assigned Questions ({selectedQuizQIds.length} Selected)
                  </span>
                  <input
                    type="text"
                    placeholder="Filter question bank..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  {questions
                    .filter(q => q.question_text.toLowerCase().includes(questionSearch.toLowerCase()))
                    .map((q) => {
                      const isSelected = selectedQuizQIds.includes(q.question_id);
                      return (
                        <div
                          key={q.question_id}
                          onClick={() => toggleQuestionSelection(q.question_id, false)}
                          className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                            isSelected
                              ? 'bg-emerald-100/70 dark:bg-[#00E599]/20 text-emerald-950 dark:text-[#00E599] font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="truncate">{q.question_text}</span>
                          <span className="text-[10px] font-mono shrink-0">
                            {isSelected ? '✓ Assigned' : '+ Add'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:text-slate-950 text-xs font-bold"
                >
                  Save Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mock Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  {editingExam ? 'Edit Mock Exam' : 'Create NISM Mock Exam'}
                </h3>
                <p className="text-xs text-slate-500">Configure regulatory grading rules, pass percentage, and negative marking.</p>
              </div>
              <button onClick={() => setIsExamModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-mono">
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleExamSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="e.g. NISM Series VIII Full-Length Mock Exam"
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Exam Code / ID
                  </label>
                  <input
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder="e.g. NISM-VIII-2026"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={examTotalMarks}
                    onChange={(e) => setExamTotalMarks(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pass Score (%)</label>
                  <input
                    type="number"
                    value={examPassPercent}
                    onChange={(e) => setExamPassPercent(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Negative Marking</label>
                  <input
                    type="number"
                    step="0.05"
                    value={examNegativeMarking}
                    onChange={(e) => setExamNegativeMarking(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Candidate Instructions
                </label>
                <textarea
                  rows={2}
                  value={examInstructions}
                  onChange={(e) => setExamInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Save Exam Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
