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
  Check 
} from 'lucide-react';
import { 
  Lesson, 
  Course, 
  LessonContent, 
  LessonResource, 
  AppNavView 
} from '../../types/schema';

interface LessonViewProps {
  lesson: Lesson;
  course: Course;
  allLessons: Lesson[];
  content: LessonContent;
  resources: LessonResource[];
  onSelectLesson: (lesson: Lesson) => void;
  onNavigate: (view: AppNavView, payload?: any) => void;
  onOpenAIWithContext: (topicName: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  course,
  allLessons,
  content,
  resources,
  onSelectLesson,
  onNavigate,
  onOpenAIWithContext
}) => {
  const [activeMode, setActiveMode] = useState<'TEXT' | 'VIDEO'>(
    content.content_type === 'VIDEO' ? 'VIDEO' : 'TEXT'
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userNote, setUserNote] = useState('Theta decay is non-linear; max decay occurs in the last 10 days before Nifty Thursday expiry.');
  const [activeTab, setActiveTab] = useState<'SYLLABUS' | 'RESOURCES' | 'NOTES'>('SYLLABUS');
  const [isCompleted, setIsCompleted] = useState(lesson.is_completed || false);

  const currentIndex = allLessons.findIndex((l) => l.lesson_id === lesson.lesson_id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

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
              {course.course_title} • Lesson {currentIndex + 1} of {allLessons.length}
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
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
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
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#FF2E7E]" />
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

      {/* Main Grid: Content Area & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Active Learning Material */}
        <div className="lg:col-span-8 space-y-6">
          {activeMode === 'VIDEO' ? (
            /* Video Mode Player */
            <div className="rounded-3xl bg-black border border-slate-800 overflow-hidden shadow-2xl">
              <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center group">
                <div className="w-20 h-20 rounded-full bg-[#00E599]/20 border border-[#00E599]/60 flex items-center justify-center text-[#00E599] shadow-[0_0_30px_rgba(0,229,153,0.3)] group-hover:scale-110 transition duration-300 cursor-pointer">
                  <Play className="w-8 h-8 fill-[#00E599] translate-x-1" />
                </div>
                <span className="text-xs font-mono text-slate-400 mt-4">
                  Interactive Video Lecture • 1080p 60fps
                </span>
              </div>
              <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Timestamp: 04:12 / 22:45</span>
                <span className="font-mono text-[#00E599]">Auto-Synced Notes Active</span>
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

            {/* Markdown Body Rendering */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm space-y-4">
              <div className="space-y-3">
                <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
                  1. Deep Dive: Delta & Option Price Curvature
                </h2>
                <p>
                  In derivatives trading, <strong>Delta (Δ)</strong> is the first derivative of the option price with respect to the underlying asset price:
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-emerald-800 dark:text-[#00E599] border border-slate-200 dark:border-slate-800 font-bold">
                  Delta = ∂V / ∂S
                </div>
                <p>
                  Delta represents the hedge ratio. For a portfolio of 1,000 long Call options with Delta 0.50, the trader holds equivalent directional exposure of <strong>500 shares</strong> of underlying spot stock.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
                  2. Gamma Acceleration & Tail Risk
                </h2>
                <p>
                  While Delta measures velocity, <strong>Gamma (Γ)</strong> measures acceleration:
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-pink-700 dark:text-[#FF2E7E] border border-slate-200 dark:border-slate-800 font-bold">
                  Gamma = ∂²V / ∂S² = ∂Δ / ∂S
                </div>
                <p>
                  As expiry approaches, ATM Gamma explodes upwards. This requires option sellers to rapidly buy spot when the market rallies and sell when it crashes—a phenomenon known as <em>adverse Gamma drag</em>.
                </p>
              </div>
            </div>

            {/* Interactive Formulas Explorer */}
            {content.formulas && (
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
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-pink-600 dark:text-[#00E599] transition cursor-pointer shadow-xs"
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev: {prevLesson.title.split(':')[0]}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={() => setIsCompleted(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-xs ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-[#00E599] dark:border-emerald-500/40'
                  : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompleted ? 'Lesson Completed (+50 XP)' : 'Mark as Complete'}</span>
            </button>

            {nextLesson && (
              <button
                onClick={() => onSelectLesson(nextLesson)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
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
          <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50 to-teal-50 dark:from-slate-900 dark:via-[#0C1422] dark:to-[#0E1F30] border border-pink-200 dark:border-[#00E599]/40 space-y-3 shadow-xs theme-transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#FF2E7E] dark:text-[#00E599] uppercase tracking-wider">
                CHECKPOINT EVALUATION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                5 Questions
              </span>
            </div>
            <h4 className="font-display font-black text-sm text-slate-900 dark:text-white">
              Test Your Option Greeks Mastery
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Verify your numerical calculation skills before proceeding to multi-leg option strategies.
            </p>
            <button
              onClick={() => onNavigate('quizzes')}
              className="w-full py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Launch Quiz Runner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tabs: Syllabus / Resources / Notes */}
          <div className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs theme-transition">
            {/* Tab Headers */}
            <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
              {[
                { id: 'SYLLABUS' as const, label: 'Syllabus' },
                { id: 'RESOURCES' as const, label: 'Files' },
                { id: 'NOTES' as const, label: 'My Notes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-center transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-50 dark:bg-slate-800/80 text-[#FF2E7E] dark:text-[#00E599] font-bold border-b-2 border-[#FF2E7E] dark:border-[#00E599]'
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
                <div className="space-y-2">
                  {allLessons.map((l, idx) => {
                    const isCurrent = l.lesson_id === lesson.lesson_id;
                    return (
                      <div
                        key={l.lesson_id}
                        onClick={() => onSelectLesson(l)}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                          isCurrent
                            ? 'bg-pink-50 border-[#FF2E7E] text-slate-900 font-bold dark:bg-slate-800 dark:border-[#00E599] dark:text-white'
                            : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="mt-0.5">
                          {l.is_completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-400 dark:border-slate-600 flex items-center justify-center text-[9px] font-mono text-slate-500">
                              {idx + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="line-clamp-2">{l.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {l.estimated_mins} mins
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'RESOURCES' && (
                <div className="space-y-2">
                  {resources.map((res) => (
                    <div
                      key={res.resource_id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileDown className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-200">{res.resource_title}</div>
                          <div className="text-[10px] font-mono text-slate-500">{res.resource_type}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Downloading verified study resource: ${res.resource_title}`)}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </button>
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
