import React, { useState } from 'react';
import { 
  Layers, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  Award,
  Clock
} from 'lucide-react';
import { Course, Topic, Lesson, Quiz, MockExam } from '../../types/schema';

interface CourseStructureBuilderProps {
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  quizzes: Quiz[];
  mockExams: MockExam[];
  selectedCourseId: number;
  onSelectCourse: (courseId: number) => void;
  onReorderLesson: (lessonId: number, direction: 'UP' | 'DOWN') => void;
  onAddLessonToTopic: (courseId: number, topicId: number) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: number) => void;
}

export const CourseStructureBuilder: React.FC<CourseStructureBuilderProps> = ({
  courses,
  topics,
  lessons,
  quizzes,
  mockExams,
  selectedCourseId,
  onSelectCourse,
  onReorderLesson,
  onAddLessonToTopic,
  onEditLesson,
  onDeleteLesson
}) => {
  const [collapsedTopics, setCollapsedTopics] = useState<Record<number, boolean>>({});

  const currentCourse = courses.find(c => c.course_id === selectedCourseId) || courses[0];
  const courseLessons = lessons
    .filter(l => l.course_id === (currentCourse?.course_id || 1))
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  const toggleTopicCollapse = (topicId: number) => {
    setCollapsedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  return (
    <div className="space-y-6" id="course-structure-builder">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Course Structure & Curriculum Tree Builder
          </h1>
          <p className="text-xs text-slate-500">
            Visually arrange modules, lessons, downloadable resources, and end-of-module assessment quizzes.
          </p>
        </div>

        {/* Course Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase">Active Course:</span>
          <select
            value={currentCourse?.course_id}
            onChange={(e) => onSelectCourse(Number(e.target.value))}
            className="p-2.5 rounded-xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none shadow-xs"
          >
            {courses.map((c) => (
              <option key={c.course_id} value={c.course_id}>
                {c.course_title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Visual Hierarchy Tree */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 theme-transition">
        {/* Course Root Node */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-600 text-white dark:bg-[#00E599] dark:text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-pink-600 dark:text-[#00E599] uppercase tracking-wider">
                ROOT COURSE CONTAINER
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentCourse?.course_title}
              </h2>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-3 mt-0.5">
                <span>{courseLessons.length} Total Lessons</span>
                <span>•</span>
                <span>{currentCourse?.level || 'INTERMEDIATE'}</span>
                <span>•</span>
                <span>Status: <strong className="text-emerald-600 dark:text-[#00E599]">{currentCourse?.status || 'PUBLISHED'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules & Topics List */}
        <div className="space-y-6 pl-2 sm:pl-6 border-l-2 border-dashed border-slate-200 dark:border-slate-800 ml-4 sm:ml-6">
          {topics.map((topic, topicIdx) => {
            const topicLessons = courseLessons.filter(l => l.topic_id === topic.topic_id);
            const topicQuizzes = quizzes.filter(q => q.topic_id === topic.topic_id);
            const isCollapsed = collapsedTopics[topic.topic_id];

            return (
              <div key={topic.topic_id} className="relative space-y-3">
                {/* Branch Pin Icon */}
                <div className="absolute -left-[19px] sm:-left-[35px] top-4 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-[#0B0F19]" />

                {/* Topic Header Card */}
                <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => toggleTopicCollapse(topic.topic_id)}
                    className="flex items-center gap-3 text-left cursor-pointer flex-1"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-pink-600 dark:text-[#00E599]" />
                    )}
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                        MODULE {topicIdx + 1}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {topic.topic_name}
                      </h3>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500 font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800">
                      {topicLessons.length} Lessons
                    </span>
                    <button
                      onClick={() => onAddLessonToTopic(currentCourse.course_id, topic.topic_id)}
                      className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Lesson</span>
                    </button>
                  </div>
                </div>

                {/* Lessons under this topic */}
                {!isCollapsed && (
                  <div className="space-y-2 pl-4 sm:pl-6">
                    {topicLessons.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                        No lessons assigned to this module yet. Click "+ Add Lesson".
                      </div>
                    ) : (
                      topicLessons.map((lesson, lIdx) => (
                        <div
                          key={lesson.lesson_id}
                          className="p-3.5 rounded-xl bg-white dark:bg-[#06090F] border border-slate-200 dark:border-slate-800/80 shadow-xs flex items-center justify-between gap-3 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                              {lIdx + 1}
                            </span>
                            <div className="overflow-hidden">
                              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {lesson.title}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                                <span>~{lesson.estimated_mins || 15} mins</span>
                                <span>•</span>
                                <span>Status: {lesson.status || 'PUBLISHED'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Reorder Buttons */}
                            <button
                              onClick={() => onReorderLesson(lesson.lesson_id, 'UP')}
                              disabled={lIdx === 0}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onReorderLesson(lesson.lesson_id, 'DOWN')}
                              disabled={lIdx === topicLessons.length - 1}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditLesson(lesson)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                              title="Open Full Content Editor"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteLesson(lesson.lesson_id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition cursor-pointer"
                              title="Delete Lesson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Attached Quizzes */}
                    {topicQuizzes.map((quiz) => (
                      <div
                        key={quiz.quiz_id}
                        className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="font-bold text-slate-900 dark:text-white">
                            Module Quiz: {quiz.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-bold">
                          Passing: {quiz.passing_score_percent || 70}%
                        </span>
                      </div>
                    ))}
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
