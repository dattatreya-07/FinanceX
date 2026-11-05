import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Award, 
  BookOpen, 
  Users, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Edit2
} from 'lucide-react';
import { InstructorProfile, Course } from '../../types/schema';
import { lmsService } from '../../services/lmsService';

interface InstructorManagerViewProps {
  courses: Course[];
}

export const InstructorManagerView: React.FC<InstructorManagerViewProps> = ({ courses }) => {
  const [instructors, setInstructors] = useState<InstructorProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingInstructor, setEditingInstructor] = useState<InstructorProfile | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    setInstructors(lmsService.getInstructors());
    return lmsService.subscribe(() => {
      setInstructors(lmsService.getInstructors());
    });
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleToggleStatus = (id: string | number) => {
    setInstructors(prev => prev.map(inst => {
      if (inst.instructor_id === id) {
        const nextStatus = inst.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        showToast(`Instructor ${inst.full_name} status updated to ${nextStatus}.`);
        return { ...inst, status: nextStatus };
      }
      return inst;
    }));
  };

  const filteredInstructors = instructors.filter(i => 
    i.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-cyan-500" />
            <span>Faculty & Instructor Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee certified market experts, faculty workload, course allocations, and teaching credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300">
            {instructors.length} Certified Faculty Members
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search instructors by name, specialization, or email..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Instructor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInstructors.map(inst => (
          <div
            key={inst.instructor_id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={inst.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                    alt={inst.full_name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {inst.full_name}
                      </h3>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        inst.status === 'ACTIVE'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {inst.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{inst.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{inst.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono text-amber-500 font-bold text-xs bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{inst.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {inst.bio}
              </p>

              {/* Assigned Courses Badges */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Assigned Teaching Modules
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {inst.assigned_course_ids.map(cid => {
                    const match = courses.find(c => c.course_id === cid);
                    return (
                      <span
                        key={cid}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3 h-3 text-cyan-600" />
                        <span>{match ? match.course_title : `Course #${cid}`}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
              <div>
                <span>{inst.total_students_mentored} Students Mentored</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(inst.instructor_id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    inst.status === 'ACTIVE'
                      ? 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {inst.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

