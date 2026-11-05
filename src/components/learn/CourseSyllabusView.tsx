import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  User, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Course, Lesson, User as UserType, AppNavView } from '../../types/schema';
import { NISM_XV_CHAPTERS } from '../../data/nismFullCurriculum';
import { lmsService } from '../../services/lmsService';

interface CourseSyllabusViewProps {
  course: Course;
  lessons: Lesson[];
  currentUser: UserType;
  onNavigate: (view: AppNavView, payload?: any) => void;
  onSelectLesson: (lesson: Lesson) => void;
}

export const CourseSyllabusView: React.FC<CourseSyllabusViewProps> = ({
  course,
  lessons,
  currentUser,
  onNavigate,
  onSelectLesson
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [enrollToast, setEnrollToast] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(() => {
    return lmsService.getLearnerEnrollments(currentUser.user_id).some(e => e.course_id === course.course_id);
  });

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const handleEnroll = () => {
    const res = lmsService.enrollLearner(
      currentUser.user_id,
      course.course_id,
      undefined,
      { name: currentUser.full_name, email: currentUser.email }
    );
    if (res.success) {
      setIsEnrolled(true);
      setEnrollToast(`Successfully enrolled in ${course.course_title}! Track your progress in Gradebook.`);
      setTimeout(() => setEnrollToast(null), 4000);
    } else {
      setEnrollToast(res.error || 'Failed to enroll in course.');
      setTimeout(() => setEnrollToast(null), 4000);
    }
  };

  // Group lessons by week / chapters
  const weeklyModules = NISM_XV_CHAPTERS.map(ch => ({
    week: ch.chapterNumber,
    title: ch.chapterTitle,
    weightage: ch.weightageMarks,
    description: ch.summary,
    objectives: [
      `Master regulatory requirements of ${ch.chapterTitle}`,
      `Solve quantitative practice exercises with official workbooks`,
      `Pass comprehension checkpoint quiz with >60% accuracy`
    ],
    lessons: lessons.filter(l => l.topic_id === ch.chapterNumber || l.lesson_id === 100 + ch.chapterNumber)
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {enrollToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{enrollToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#022C22] p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-mono font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            NPTEL / SWAYAM Pedagogical Framework
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {course.course_title}
              </h1>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {course.description || 'Comprehensive curriculum aligned with official SEBI/NISM guidelines. Combines theoretical legal frameworks with quantitative financial modeling.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-4 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                alt="Faculty"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-300/60"
              />
              <div className="text-xs">
                <div className="font-mono text-emerald-200 text-[10px]">Course Instructor</div>
                <div className="font-bold text-white text-sm">Dr. R. Subramanian</div>
                <div className="text-emerald-300/80 text-[11px]">Ex-SEBI Advisory Faculty</div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-200 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              Duration: 15 Weeks (60 Hours)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              Weightage: 100 Marks (SEBI Series XV)
            </span>
            <span>•</span>
            <span>Level: Intermediate to Advanced</span>
          </div>
        </div>
      </div>

      {/* Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {isEnrolled ? (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Enrolled (Active Cohort)</span>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Enroll in Course</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('learn')}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            <span>Open Current Lesson Terminal</span>
          </button>
          <button
            onClick={() => onNavigate('assignments')}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Assignments & Drills</span>
          </button>
        </div>
        <a
          href="/assets/nism-series-xv-workbook-feb-2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Download NISM XV 342-Page Workbook (Feb 2026)</span>
        </a>
      </div>

      {/* Weekly Schedule & Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Weekly Curriculum Breakdown</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">
            15 Modules • Official NISM Series XV
          </span>
        </div>

        <div className="space-y-3">
          {weeklyModules.map((mod) => {
            const isExpanded = !!expandedWeeks[mod.week];
            return (
              <div
                key={mod.week}
                className="rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition"
              >
                {/* Module Header Bar */}
                <button
                  onClick={() => toggleWeek(mod.week)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                      W{mod.week}
                    </span>
                    <div>
                      <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        Week {mod.week}: {mod.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Weightage: {mod.weightage} Marks • 4 Hours Lecture & Drills
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 space-y-4 text-xs bg-slate-50/30 dark:bg-slate-900/20">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed pt-3">
                      {mod.description}
                    </p>

                    {/* Learning Objectives */}
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Learning Objectives
                      </div>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] pl-4 list-disc">
                        {mod.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Module Lessons & Activities */}
                    <div className="space-y-2">
                      <div className="font-mono text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        Class Lectures & Self-Check Checkpoints
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          onClick={() => {
                            const matched = lessons.find(l => l.topic_id === mod.week || l.lesson_id === 100 + mod.week);
                            if (matched) onSelectLesson(matched);
                            onNavigate('learn');
                          }}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex items-center justify-between text-left transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <PlayCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition flex-shrink-0" />
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                              Interactive Lecture & LaTeX Terminal
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                        </button>

                        <button
                          onClick={() => onNavigate('quizzes')}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex items-center justify-between text-left transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <CheckCircle2 className="w-4 h-4 text-purple-600 group-hover:scale-110 transition flex-shrink-0" />
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                              Chapter {mod.week} Comprehension Quiz
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

