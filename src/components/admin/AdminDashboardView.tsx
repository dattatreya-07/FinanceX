import React from 'react';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  FileCheck2, 
  Award, 
  Users, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { AdminDashboardMetrics } from '../../types/schema';
import { AdminTab } from './AdminLayout';

interface AdminDashboardViewProps {
  metrics: AdminDashboardMetrics;
  onNavigateTab: (tab: AdminTab) => void;
  onQuickAction: (action: 'CREATE_COURSE' | 'CREATE_LESSON' | 'CREATE_QUESTION' | 'CREATE_QUIZ' | 'CREATE_EXAM') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  metrics,
  onNavigateTab,
  onQuickAction
}) => {
  const statCards = [
    { label: 'Total Courses', value: metrics.totalCourses, sub: `${metrics.publishedCourses} Published • ${metrics.draftCourses} Draft`, icon: <BookOpen className="w-5 h-5 text-pink-600 dark:text-[#00E599]" />, tab: 'courses' as AdminTab },
    { label: 'Educational Lessons', value: metrics.totalLessons, sub: 'Rich Markdown & Formulas', icon: <FileText className="w-5 h-5 text-blue-500" />, tab: 'lessons' as AdminTab },
    { label: 'Question Bank', value: metrics.totalQuestions, sub: 'NISM & Quantitative MCQs', icon: <HelpCircle className="w-5 h-5 text-amber-500" />, tab: 'questions' as AdminTab },
    { label: 'Quizzes & Mock Exams', value: metrics.totalQuizzes + metrics.totalMockExams, sub: `${metrics.totalQuizzes} Quizzes • ${metrics.totalMockExams} NISM Exams`, icon: <FileCheck2 className="w-5 h-5 text-emerald-500" />, tab: 'quizzes-exams' as AdminTab },
    { label: 'Certifications', value: metrics.totalCertifications, sub: 'NISM, NCFM, SEBI & Prep', icon: <Award className="w-5 h-5 text-purple-500" />, tab: 'certifications' as AdminTab },
    { label: 'Active Learners', value: metrics.totalLearners, sub: 'Real Auth Profiles', icon: <Users className="w-5 h-5 text-cyan-500" />, tab: 'learners' as AdminTab },
  ];

  return (
    <div className="space-y-8" id="admin-dashboard-view">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden theme-transition">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 dark:bg-[#00E599]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
                Content Management System
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599] font-bold border border-emerald-200 dark:border-[#00E599]/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                RLS SERVER-SECURED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Authoritative management console for FinanceX regulatory curricula, interactive mathematical formulas, PDF study resources, and official NISM mock assessments.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <button
              onClick={() => onQuickAction('CREATE_COURSE')}
              className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Course</span>
            </button>
            <button
              onClick={() => onQuickAction('CREATE_LESSON')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lesson</span>
            </button>
            <button
              onClick={() => onQuickAction('CREATE_QUESTION')}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add MCQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            onClick={() => onNavigateTab(card.tab)}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-pink-300 dark:hover:border-[#00E599]/40 transition cursor-pointer group theme-transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition">
                {card.icon}
              </div>
            </div>
            <div className="text-3xl font-display font-black text-slate-900 dark:text-white mt-2">
              {card.value}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between font-mono">
              <span>{card.sub}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-pink-600 dark:text-[#00E599] transition transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Quality & Audit Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incomplete / Needing Review Alert */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Content Quality Verification
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold">
              {metrics.incompleteContent.length} Alerts
            </span>
          </div>

          {metrics.incompleteContent.length === 0 ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">All Content Verified</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400">All published courses and assessments satisfy completeness requirements.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.incompleteContent.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-snug">
                    {item.missing}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Admin Audit Activity */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-600 dark:text-[#00E599]" />
              Recent Curriculum Mutations (Audit Trail)
            </h2>
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="text-xs text-pink-600 dark:text-[#00E599] hover:underline font-mono font-bold"
            >
              View Full Ledger →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {metrics.recentAuditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      log.action === 'PUBLISH' ? 'bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599]' :
                      log.action === 'CREATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                      log.action === 'DELETE' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {log.entity_title || `${log.entity_type} #${log.entity_id}`}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    By {log.admin_email}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
