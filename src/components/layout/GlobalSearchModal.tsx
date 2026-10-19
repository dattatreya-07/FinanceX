import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  X, 
  BookOpen, 
  Award, 
  FileQuestion, 
  TrendingUp, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  MOCK_COURSES, 
  MOCK_LESSONS, 
  MOCK_CERTIFICATIONS, 
  MOCK_QUESTIONS, 
  MOCK_INSTRUMENTS, 
  MOCK_DISCUSSION_THREADS 
} from '../../data/mockData';
import { AppNavView } from '../../types/schema';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'COURSES' | 'CERTIFICATIONS' | 'INSTRUMENTS' | 'QUESTIONS' | 'COMMUNITY'>('ALL');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search across entities
  const matchingCourses = MOCK_COURSES.filter(
    (c) => c.course_title.toLowerCase().includes(normalizedQuery) || c.description?.toLowerCase().includes(normalizedQuery)
  );

  const matchingLessons = MOCK_LESSONS.filter(
    (l) => l.title.toLowerCase().includes(normalizedQuery)
  );

  const matchingCertifications = MOCK_CERTIFICATIONS.filter(
    (cert) => cert.certification_name.toLowerCase().includes(normalizedQuery) || cert.summary?.toLowerCase().includes(normalizedQuery)
  );

  const matchingInstruments = MOCK_INSTRUMENTS.filter(
    (inst) => inst.symbol.toLowerCase().includes(normalizedQuery) || inst.name?.toLowerCase().includes(normalizedQuery)
  );

  const matchingQuestions = MOCK_QUESTIONS.filter(
    (q) => q.question_text.toLowerCase().includes(normalizedQuery) || q.explanation.toLowerCase().includes(normalizedQuery)
  );

  const matchingDiscussions = MOCK_DISCUSSION_THREADS.filter(
    (d) => d.title.toLowerCase().includes(normalizedQuery) || d.tags.some(t => t.toLowerCase().includes(normalizedQuery))
  );

  const totalResults = matchingCourses.length + matchingLessons.length + matchingCertifications.length + matchingInstruments.length + matchingQuestions.length + matchingDiscussions.length;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 dark:bg-slate-950/85 backdrop-blur-md cursor-pointer select-none" 
      id="global-search-modal"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#0C101B] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] theme-transition cursor-default select-text"
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-3 bg-slate-50/80 dark:bg-slate-900/60">
          <Search className="w-5 h-5 text-[#FF2E7E] dark:text-[#00E599]" />
          <input
            autoFocus
            type="text"
            placeholder="Search courses, NISM certifications, option Greeks, instruments, questions... (Cmd+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/80 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Filter Badges */}
        <div className="px-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['ALL', 'COURSES', 'CERTIFICATIONS', 'INSTRUMENTS', 'QUESTIONS', 'COMMUNITY'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-xl font-mono text-[10px] transition ${
                selectedFilter === filter
                  ? 'bg-pink-100 text-[#FF2E7E] border border-pink-300 font-bold dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center">
              <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600 dark:text-slate-400">Type to search across 34 finance learning databases</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['Delta Neutral', 'NISM Series VIII', 'GOI 10Y Bond', 'Cost of Carry', 'Reliance Futures'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-[11px] px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#FF2E7E]/40 hover:text-[#FF2E7E] dark:hover:border-slate-700 dark:hover:text-white transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching financial entities found for "{query}". Try checking your spelling or search terms.
            </div>
          ) : (
            <>
              {/* Courses & Lessons */}
              {(selectedFilter === 'ALL' || selectedFilter === 'COURSES') && (matchingCourses.length > 0 || matchingLessons.length > 0) && (
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#FF2E7E] dark:text-[#00E599]" />
                    <span>Courses & Lessons</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingCourses.map((c) => (
                      <div
                        key={`c-${c.course_id}`}
                        onClick={() => {
                          onNavigate('courses');
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-pink-50/60 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 cursor-pointer flex items-center justify-between group transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-[#FF2E7E] dark:group-hover:text-[#00E599]">{c.course_title}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{c.total_lessons} Lessons • {c.level}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF2E7E] dark:group-hover:text-[#00E599] group-hover:translate-x-0.5 transition" />
                      </div>
                    ))}
                    {matchingLessons.map((l) => (
                      <div
                        key={`l-${l.lesson_id}`}
                        onClick={() => {
                          onNavigate('learn');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-50/60 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/60 cursor-pointer flex items-center justify-between group transition ml-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-semibold">LESSON</span>
                          <span className="text-xs text-slate-800 dark:text-slate-300 group-hover:text-[#FF2E7E] dark:group-hover:text-white">{l.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{l.estimated_mins} mins</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {(selectedFilter === 'ALL' || selectedFilter === 'CERTIFICATIONS') && matchingCertifications.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500 dark:text-yellow-400" />
                    <span>Regulatory Certifications</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingCertifications.map((cert) => (
                      <div
                        key={cert.certification_id}
                        onClick={() => {
                          onNavigate('certifications');
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-amber-200/80 dark:border-slate-800/80 cursor-pointer flex items-center justify-between group transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-yellow-400">{cert.certification_name}</div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Body: {cert.governing_body} • Validity: {cert.validity_years} Years</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-yellow-400 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Lab Instruments */}
              {(selectedFilter === 'ALL' || selectedFilter === 'INSTRUMENTS') && matchingInstruments.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" />
                    <span>Practice Lab Instruments</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingInstruments.map((inst) => (
                      <div
                        key={inst.instrument_id}
                        onClick={() => {
                          onNavigate('practice-lab');
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 cursor-pointer flex items-center justify-between group transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00E599]">{inst.symbol}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{inst.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">₹{inst.simulated_price.toFixed(2)}</div>
                          <div className={`text-[10px] font-mono ${(inst.daily_change_percent || 0) >= 0 ? 'text-emerald-600 dark:text-[#00E599]' : 'text-rose-600 dark:text-[#FF2E7E]'}`}>
                            {(inst.daily_change_percent || 0) >= 0 ? '+' : ''}{inst.daily_change_percent}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions & Quizzes */}
              {(selectedFilter === 'ALL' || selectedFilter === 'QUESTIONS') && matchingQuestions.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                    <FileQuestion className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Exam Question Bank</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingQuestions.map((q) => (
                      <div
                        key={q.question_id}
                        onClick={() => {
                          onNavigate('quizzes');
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 cursor-pointer group transition"
                      >
                        <div className="text-xs text-slate-800 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white line-clamp-2">{q.question_text}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-500 font-mono mt-1 flex items-center gap-2">
                          <span>Difficulty: {q.difficulty}</span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-[#00E599]">Correct: Option {q.correct_option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Discussions */}
              {(selectedFilter === 'ALL' || selectedFilter === 'COMMUNITY') && matchingDiscussions.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                    <span>Community Discussions</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingDiscussions.map((d) => (
                      <div
                        key={d.thread_id}
                        onClick={() => {
                          onNavigate('community');
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 cursor-pointer flex items-center justify-between group transition"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-[#FF2E7E] dark:group-hover:text-pink-400">{d.title}</div>
                          <div className="flex gap-1 mt-1">
                            {d.tags.map(t => (
                              <span key={t} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400">#{t}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{d.upvotes_count} Upvotes</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
