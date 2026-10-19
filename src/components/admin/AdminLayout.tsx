import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  FileText, 
  HelpCircle, 
  FileCheck2, 
  Award, 
  Sparkles, 
  CalendarDays, 
  Megaphone, 
  Users, 
  History, 
  ArrowLeft, 
  ShieldAlert, 
  ShieldCheck,
  Search,
  ExternalLink,
  BarChart3,
  Building2
} from 'lucide-react';
import { User, AppNavView } from '../../types/schema';

export type AdminTab = 
  | 'dashboard'
  | 'enterprise-governance'
  | 'institutional-analytics'
  | 'courses'
  | 'structure'
  | 'lessons'
  | 'questions'
  | 'quizzes-exams'
  | 'certifications'
  | 'achievements'
  | 'study-plans'
  | 'announcements'
  | 'learners'
  | 'audit-logs';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitToLearnerApp: () => void;
  currentUser: User;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitToLearnerApp,
  currentUser,
  children
}) => {
  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard & KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'enterprise-governance' as AdminTab, label: 'Enterprise & Compliance', icon: <Building2 className="w-4 h-4" /> },
    { id: 'institutional-analytics' as AdminTab, label: 'Institutional & Item Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'courses' as AdminTab, label: 'Course Catalog', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'structure' as AdminTab, label: 'Course Structure Builder', icon: <Layers className="w-4 h-4" /> },
    { id: 'lessons' as AdminTab, label: 'Lessons & Content Editor', icon: <FileText className="w-4 h-4" /> },
    { id: 'questions' as AdminTab, label: 'Question Bank & Bulk Import', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'quizzes-exams' as AdminTab, label: 'Quizzes & Mock Exams', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'certifications' as AdminTab, label: 'Certifications Manager', icon: <Award className="w-4 h-4" /> },
    { id: 'achievements' as AdminTab, label: 'Achievements & Badges', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'study-plans' as AdminTab, label: 'Study Plan Templates', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'announcements' as AdminTab, label: 'Platform Announcements', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'learners' as AdminTab, label: 'Learners & Performance', icon: <Users className="w-4 h-4" /> },
    { id: 'audit-logs' as AdminTab, label: 'Audit Trail & Ledger', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#06090F] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row theme-transition">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-6">
          {/* Logo & Admin Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-600 dark:bg-[#00E599] flex items-center justify-center font-display font-black text-white dark:text-slate-950 text-base shadow-sm">
                FX
              </div>
              <div>
                <div className="font-display font-black text-base tracking-tight text-slate-900 dark:text-white leading-none">
                  FINANCEX
                </div>
                <div className="text-[10px] font-mono font-bold text-pink-600 dark:text-[#00E599] tracking-wider uppercase mt-0.5">
                  ADMIN LMS & CMS
                </div>
              </div>
            </div>

            <span className="p-1.5 rounded-lg bg-pink-50 dark:bg-[#00E599]/10 text-pink-600 dark:text-[#00E599]" title="Database Security RLS Active">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          {/* Return to Learner Portal */}
          <button
            onClick={onExitToLearnerApp}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-pink-600 dark:text-[#00E599]" />
              <span>Learner Experience</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Exit CMS</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
              Curriculum & Assessment
            </div>
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                    active
                      ? 'bg-pink-600 text-white dark:bg-[#00E599] dark:text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className={active ? 'text-white dark:text-slate-950' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Current Admin Identity Footer */}
        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.full_name}
              className="w-8 h-8 rounded-xl object-cover border border-pink-500/40 dark:border-[#00E599]/40"
            />
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.full_name}
              </div>
              <div className="text-[10px] font-mono text-pink-600 dark:text-[#00E599] font-semibold truncate">
                {currentUser.role || 'ADMINISTRATOR'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
