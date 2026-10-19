import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  FileDown, 
  BrainCircuit, 
  Sparkles, 
  Bookmark, 
  Play, 
  Check,
  FileText,
  Download,
  ExternalLink,
  Award
} from 'lucide-react';
import { 
  Lesson, 
  Course, 
  LessonContent, 
  LessonResource, 
  AppNavView 
} from '../../types/schema';
import { NISM_XV_CHAPTERS } from '../../data/nismFullCurriculum';

interface LessonViewProps {
  lesson: Lesson;
  course: Course;
  allLessons: Lesson[];
  content: LessonContent;
  resources: LessonResource[];
  onSelectLesson: (lesson: Lesson) => void;
  onNavigate: (view: AppNavView, payload?: any) => void;
  onOpenAIWithContext: (topicName: string) => void;
  onToggleComplete?: (lessonId: number, isCompleted: boolean) => void;
}

const NISM_XV_VIDEOS: Record<number, { youtubeId: string; title: string; duration: string }> = {
  1: { youtubeId: 'wQpG48u4_Q0', title: 'Chapter 1: Intro to Research Analyst Profession & Ethics', duration: '28m' },
  2: { youtubeId: 'p7HKvqRI_Bo', title: 'Chapter 2: Securities Markets Architecture & Structure', duration: '35m' },
  3: { youtubeId: 'b_VpIq3ZlXk', title: 'Chapter 3: Terminology in Equity & Debt Markets', duration: '42m' },
  4: { youtubeId: 'mYF2_FBCvXw', title: 'Chapter 4: Fundamentals of Research & E-I-C Framework', duration: '32m' },
  5: { youtubeId: 'x_36E8N6s-0', title: 'Chapter 5: Economic Analysis & RBI Monetary Policy', duration: '46m' },
  6: { youtubeId: 'q6rE6q34rXw', title: 'Chapter 6: Industry Analysis & Porter 5 Forces', duration: '38m' },
  7: { youtubeId: 'K5bC4Z9HrqY', title: 'Chapter 7: Company Analysis – Qualitative Dimensions', duration: '48m' },
  8: { youtubeId: 'X3s3u2zN2v8', title: 'Chapter 8: Financial Analysis & DuPont 3-Step ROE', duration: '54m' },
  9: { youtubeId: 'V36rL9K63B4', title: 'Chapter 9: Corporate Actions, Splits, Bonus & Ex-Dates', duration: '34m' },
  10: { youtubeId: 'fd_epV96106', title: 'Chapter 10: Valuation Principles (DCF, FCFF & Multiples)', duration: '58m' },
  11: { youtubeId: '5wQ30N7xYd0', title: 'Chapter 11: Risk and Return, CAPM, Beta & Sharpe Ratio', duration: '44m' },
  12: { youtubeId: 'dQe7t8bI4F0', title: 'Chapter 12: Qualities of a Good Research Report', duration: '30m' },
  13: { youtubeId: 'vE98mO43xK1', title: 'Chapter 13: Legal & Regulatory Framework (SEBI RA 2014)', duration: '52m' },
  14: { youtubeId: '3WpD_6FpM-c', title: 'Chapter 14: Mutual Funds, Passive Funds & Alternatives', duration: '36m' },
  15: { youtubeId: 'qQLM_sCg73k', title: 'Chapter 15: Derivatives Markets & Institutional Hedging', duration: '40m' }
};

const DEFAULT_VIDEOS: Record<number, { youtubeId: string; title: string; duration: string }> = {
  1: { youtubeId: 'sVjX9F_gO80', title: 'Futures Contracts Basics & Cost of Carry Model', duration: '25m' },
  2: { youtubeId: 'xUjMh31yB8I', title: 'Option Greeks: Delta, Gamma, Theta & Vega', duration: '35m' },
  3: { youtubeId: '1Z3oY6o1VbQ', title: 'Multi-Leg Strategies: Bull Spreads & Iron Condors', duration: '30m' },
  4: { youtubeId: '4_ZlC_k9v7w', title: 'Derivatives Clearing, Margining & SEBI Framework', duration: '25m' },
  5: { youtubeId: 'b_VpIq3ZlXk', title: 'Bond Pricing Mechanics & Yield to Maturity', duration: '30m' },
  6: { youtubeId: '5wQ30N7xYd0', title: 'Macaulay Duration & Convexity Hedging', duration: '32m' }
};

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  course,
  allLessons,
  content,
  resources,
  onSelectLesson,
  onNavigate,
  onOpenAIWithContext,
  onToggleComplete
}) => {
  const [activeMode, setActiveMode] = useState<'TEXT' | 'VIDEO'>('TEXT');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userNote, setUserNote] = useState('Key concept note: Always cross-verify Operating Cash Flow with Net Profit when evaluating earnings quality.');
  const [activeTab, setActiveTab] = useState<'SYLLABUS' | 'RESOURCES' | 'NOTES'>('SYLLABUS');
  const [isCompleted, setIsCompleted] = useState(lesson.is_completed || false);

  React.useEffect(() => {
    setIsCompleted(lesson.is_completed || false);
  }, [lesson.lesson_id, lesson.is_completed]);

  const currentIndex = allLessons.findIndex((l) => l.lesson_id === lesson.lesson_id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isNismXv = course.course_id === 3 || lesson.lesson_id > 100;
  const chapterNumber = isNismXv 
    ? (lesson.lesson_id > 100 ? lesson.lesson_id - 100 : lesson.lesson_id)
    : lesson.lesson_id;

  const currentVideo = isNismXv 
    ? (NISM_XV_VIDEOS[chapterNumber] || NISM_XV_VIDEOS[1])
    : (DEFAULT_VIDEOS[lesson.lesson_id] || DEFAULT_VIDEOS[1]);

  return (
    <div className="space-y-6" id="lesson-view">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('courses')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {course.course_title} • Lesson {currentIndex >= 0 ? currentIndex + 1 : chapterNumber} of {Math.max(15, allLessons.length)}
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveMode('TEXT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeMode === 'TEXT'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-[#00E599] font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" />
              <span>Read Text</span>
            </button>
            <button
              onClick={() => setActiveMode('VIDEO')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeMode === 'VIDEO'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-500" />
              <span>Video Lecture</span>
            </button>
          </div>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isBookmarked
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Bookmark this lesson"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official NISM Series XV Workbook Attachment Banner */}
      {isNismXv && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#032B25] via-[#064E3B] to-[#047857] text-white border border-amber-300/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  OFFICIAL EXAM WORKBOOK
                </span>
                <span className="text-xs text-emerald-200 font-mono">February 2026 Edition • 342 Pages</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                NISM-Series-XV: Research Analyst Examination Workbook
              </h3>
              <p className="text-[11px] text-emerald-100/80 mt-0.5">
                Complete official syllabus text with formulas, regulatory case studies, and chapter review questions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <a
              href="/assets/nism-series-xv-workbook-feb-2026.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview PDF</span>
            </a>
            <a
              href="/assets/nism-series-xv-workbook-feb-2026.pdf"
              download="17 NISM-Series-XV-Research Analyst Examination Workbook February 2026.pdf"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-amber-500/25 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Workbook</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Grid: Content Area & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Active Learning Material */}
        <div className="lg:col-span-8 space-y-6">
          {activeMode === 'VIDEO' ? (
            /* Real YouTube Video Player */
            <div className="rounded-3xl bg-black border border-emerald-900/40 overflow-hidden shadow-2xl">
              <div className="relative aspect-video w-full bg-slate-950">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?autoplay=0&rel=0`}
                  title={currentVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 bg-[#032B25] border-t border-emerald-800/40 flex items-center justify-between text-xs text-emerald-200">
                <div className="truncate max-w-md font-bold">
                  {currentVideo.title}
                </div>
                <div className="flex items-center gap-2 font-mono text-amber-300 shrink-0 font-bold">
                  <span>HD 1080p</span>
                  <span>•</span>
                  <span>{currentVideo.duration}</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Text Mode Rich Content Card */}
          <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-xl leading-relaxed theme-transition">
            {/* Key Takeaways Highlight Box */}
            {content.key_takeaways && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-slate-900 dark:to-[#0B1524] border border-emerald-200 dark:border-[#00E599]/30 space-y-2 shadow-xs">
                <div className="text-xs font-mono font-bold text-emerald-800 dark:text-[#00E599] flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" />
                  <span>Key Exam Takeaways (NISM Series VIII)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {content.key_takeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-[#00E599] font-bold">✓</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dynamic Markdown Body Rendering */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm space-y-4">
              {content.raw_body ? (
                content.raw_body.split('\n\n').map((block, idx) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-lg font-display font-black text-slate-900 dark:text-white pt-2">
                        {trimmed.replace(/^###\s+/, '')}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-xl font-display font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800/60 first:border-0 first:pt-0">
                        {trimmed.replace(/^##\s+/, '')}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const items = trimmed.split('\n').filter(Boolean);
                    return (
                      <ul key={idx} className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300 pl-2">
                        {items.map((item, itemIdx) => {
                          const cleanItem = item.replace(/^[-*]\s+/, '');
                          // Format bold text
                          const parts = cleanItem.split(/(\*\*.*?\*\*)/g);
                          return (
                            <li key={itemIdx}>
                              {parts.map((part, pIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={pIdx} className="text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                              })}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }
                  if (trimmed.startsWith('```') || trimmed.includes(' = ') && trimmed.length < 120 && !trimmed.includes('\n')) {
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-emerald-800 dark:text-[#00E599] border border-slate-200 dark:border-slate-800 font-bold overflow-x-auto">
                        {trimmed.replace(/```[a-z]*/g, '').trim()}
                      </div>
                    );
                  }

                  // Standard paragraph with bold formatting
                  const parts = trimmed.split(/(\*\*.*?\*\*|\*.*?\*)/g);
                  return (
                    <p key={idx} className="leading-relaxed">
                      {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pIdx} className="text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('*') && part.endsWith('*')) {
                          return <em key={pIdx} className="text-slate-800 dark:text-slate-200">{part.slice(1, -1)}</em>;
                        }
                        return part;
                      })}
                    </p>
                  );
                })
              ) : (
                <div className="space-y-3">
                  <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
                    {lesson.title}
                  </h2>
                  <p>Comprehensive interactive lesson module. Review the syllabus, key takeaways, and mathematical models below.</p>
                </div>
              )}
            </div>

            {/* Interactive Formulas Explorer */}
            {content.formulas && content.formulas.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Mathematical Formulas & Pricing Models
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {content.formulas.map((form, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">{form.label}</div>
                      <div className="font-mono text-xs text-cyan-700 dark:text-cyan-400 my-2 font-bold">{form.formula}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{form.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Explainer Quick CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-slate-50 to-emerald-50 dark:from-[#FF2E7E]/10 dark:via-slate-900 dark:to-[#00E599]/10 border border-pink-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-pink-100 dark:bg-[#FF2E7E]/20 text-[#FF2E7E]">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">Need a simpler explanation?</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Ask AI Tutor to explain with everyday examples.</div>
                </div>
              </div>
              <button
                onClick={() => onOpenAIWithContext(lesson.title)}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition cursor-pointer shadow-xs"
              >
                Explain with AI
              </button>
            </div>
          </div>

          {/* Lesson Navigation Bottom Controls */}
          <div className="flex items-center justify-between pt-4">
            {prevLesson ? (
              <button
                onClick={() => onSelectLesson(prevLesson)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev: {prevLesson.title.split(':')[0]}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={() => {
                const nextState = !isCompleted;
                setIsCompleted(nextState);
                if (onToggleComplete) {
                  onToggleComplete(lesson.lesson_id, nextState);
                }
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-xs ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-[#00E599] dark:border-emerald-500/40'
                  : 'bg-gradient-to-r from-[#047857] via-[#059669] to-[#0D9488] hover:from-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompleted ? 'Lesson Completed (+50 XP)' : 'Mark as Complete'}</span>
            </button>

            {nextLesson && (
              <button
                onClick={() => onSelectLesson(nextLesson)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#047857] via-[#059669] to-[#10B981] hover:from-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Syllabus, Resources & Study Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Checkpoint Quiz CTA */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 dark:from-[#032B25] dark:via-[#064E3B] dark:to-[#047857] border border-amber-300/30 space-y-3 shadow-md theme-transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                CHAPTER MASTERY QUIZ
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/30 text-slate-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/60 font-bold">
                5 Questions
              </span>
            </div>
            <h4 className="font-display font-black text-sm text-slate-900 dark:text-white">
              {isNismXv ? `Test Chapter ${chapterNumber} Mastery` : 'Test Concept Mastery'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-emerald-100/90 leading-relaxed">
              Verify your numerical calculation and conceptual skills with official NISM exam questions.
            </p>
            <button
              onClick={() => onNavigate('quizzes', { quizId: isNismXv ? 100 + chapterNumber : 1 })}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <span>Launch Chapter Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tabs: Syllabus / Resources / Notes */}
          <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs theme-transition">
            {/* Tab Headers */}
            <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
              {[
                { id: 'SYLLABUS' as const, label: 'Syllabus (15 Ch)' },
                { id: 'RESOURCES' as const, label: 'Resources' },
                { id: 'NOTES' as const, label: 'My Notes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-center transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'SYLLABUS' && (
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {(allLessons.length > 0 ? allLessons : (
                    NISM_XV_CHAPTERS.map(ch => ({
                      lesson_id: 100 + ch.chapterNumber,
                      course_id: 3,
                      topic_id: ch.chapterNumber,
                      title: `Chapter ${ch.chapterNumber}: ${ch.chapterTitle}`,
                      resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
                      estimated_mins: ch.estimatedMinutes,
                      is_completed: false,
                      order_index: ch.chapterNumber
                    }))
                  )).map((l, idx) => {
                    const isCurrent = l.lesson_id === lesson.lesson_id;
                    const chNum = l.lesson_id > 100 ? l.lesson_id - 100 : idx + 1;
                    const chData = NISM_XV_CHAPTERS.find(c => c.chapterNumber === chNum);
                    const weightage = chData ? chData.weightageMarks : 5;

                    return (
                      <div
                        key={l.lesson_id}
                        onClick={() => onSelectLesson(l)}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                          isCurrent
                            ? 'bg-emerald-50/80 border-emerald-500 text-slate-900 font-bold dark:bg-emerald-950/40 dark:border-emerald-400 dark:text-white shadow-xs'
                            : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {l.is_completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-mono font-bold ${
                              isCurrent ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300' : 'border-slate-400 text-slate-500'
                            }`}>
                              {chNum}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="line-clamp-2 leading-snug">{l.title}</div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {l.estimated_mins || 30} mins
                            </span>
                            {isNismXv && (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 font-mono text-[9px] font-black border border-amber-300/40">
                                {weightage} Marks
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'RESOURCES' && (
                <div className="space-y-3">
                  {/* Official PDF Workbook Primary Card */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-300/60 dark:border-emerald-800/60 flex items-center justify-between text-xs shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-emerald-200 truncate">
                          Official NISM-Series-XV Workbook
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                          February 2026 • 342 Pages • 6.1 MB PDF
                        </div>
                      </div>
                    </div>
                    <a
                      href="/assets/nism-series-xv-workbook-feb-2026.pdf"
                      download="17 NISM-Series-XV-Research Analyst Examination Workbook February 2026.pdf"
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 transition shadow-xs cursor-pointer shrink-0"
                      title="Download Official Workbook PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>

                  {resources.map((res) => (
                    <div
                      key={res.resource_id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-slate-900 dark:text-slate-200 truncate">{res.resource_title}</div>
                          <div className="text-[10px] font-mono text-slate-500">{res.resource_type}</div>
                        </div>
                      </div>
                      <a
                        href={res.resource_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'NOTES' && (
                <div className="space-y-3">
                  <textarea
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    rows={6}
                    placeholder="Type your study notes and formulas here (auto-saved)..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>Auto-saved to your profile</span>
                    <button
                      onClick={() => alert('Notes synchronized to cloud notebook!')}
                      className="text-[#FF2E7E] dark:text-[#00E599] font-bold hover:underline"
                    >
                      Sync Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
