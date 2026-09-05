import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Star, 
  Search, 
  ChevronRight
} from 'lucide-react';
import { Course, AppNavView } from '../../types/schema';

interface CourseCatalogViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onNavigate: (view: AppNavView) => void;
}

export const CourseCatalogView: React.FC<CourseCatalogViewProps> = ({
  courses,
  onSelectCourse,
  onNavigate
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCourses = courses.filter((c) => {
    const matchesLevel = filterLevel === 'ALL' || c.level === filterLevel;
    const matchesSearch = c.course_title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6" id="course-catalog-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
            Finance & Certification Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Structured syllabi designed for regulatory certifications (NISM, NCFM) and market mastery.
          </p>
        </div>

        <button
          onClick={() => onNavigate('certifications')}
          className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-yellow-500/30 hover:border-amber-400 dark:hover:border-yellow-500/60 text-amber-800 dark:text-yellow-400 text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Award className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
          <span>View Regulatory Certifications</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-[#0B0F19] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search courses by topic, exam code, or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF2E7E] dark:focus:border-[#00E599]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition whitespace-nowrap ${
                filterLevel === lvl
                  ? 'bg-pink-100 text-[#FF2E7E] border border-pink-300 font-bold dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.course_id}
            className="rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/90 hover:border-pink-300 dark:hover:border-slate-700 overflow-hidden flex flex-col justify-between group transition duration-300 shadow-sm dark:shadow-xl theme-transition"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={course.image_url}
                  alt={course.course_title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0B0F19] via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-[#00E599] border border-slate-200 dark:border-[#00E599]/40 backdrop-blur-md shadow-xs">
                    {course.level}
                  </span>
                  {course.certification_id && (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-100/90 dark:bg-yellow-500/20 text-amber-800 dark:text-yellow-300 border border-amber-300 dark:border-yellow-500/40 backdrop-blur-md flex items-center gap-1 shadow-xs">
                      <Award className="w-3 h-3 text-amber-600 dark:text-yellow-400" /> NISM / NCFM
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold border border-slate-200 dark:border-slate-800 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white group-hover:text-[#FF2E7E] dark:group-hover:text-[#00E599] transition-colors leading-snug">
                  {course.course_title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.total_lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.estimated_hours} Hours</span>
                  </div>
                  <div className="text-[11px] text-slate-400 ml-auto">
                    By {course.author?.split(',')[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-6 pt-0 flex items-center justify-between">
              <div className="text-xs font-mono text-emerald-700 dark:text-[#00E599] font-bold">
                100% INCLUDED (ACADEMY SCHOLARSHIP)
              </div>
              <button
                onClick={() => onSelectCourse(course)}
                className="px-4 py-2 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-sm dark:shadow-[0_0_15px_rgba(0,229,153,0.25)] cursor-pointer"
              >
                <span>Enter Course</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
