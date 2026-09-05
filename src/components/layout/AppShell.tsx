import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  CalendarDays, 
  FileQuestion, 
  Clock, 
  TrendingUp, 
  BrainCircuit, 
  Users, 
  Target, 
  Trophy, 
  Bell, 
  User as UserIcon, 
  Settings, 
  Search, 
  Flame, 
  Coins, 
  Sparkles, 
  Menu, 
  X, 
  Compass,
  Code2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { FinanceXLogo } from '../brand/FinanceXLogo';
import { AppNavView, User, Notification } from '../../types/schema';
import { GlobalSearchModal } from './GlobalSearchModal';
import { ThemeToggle } from './ThemeToggle';

interface AppShellProps {
  currentView: AppNavView;
  onNavigate: (view: AppNavView, payload?: any) => void;
  user: User;
  notifications: Notification[];
  onOpenAuth: () => void;
  onOpenMoneyEvolution: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  user,
  notifications,
  onOpenAuth,
  onOpenMoneyEvolution,
  children
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { section: 'LEARNING & CERTIFICATIONS', items: [
      { id: 'dashboard' as AppNavView, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'learn' as AppNavView, label: 'Active Lesson', icon: <BookOpen className="w-4 h-4" /> },
      { id: 'courses' as AppNavView, label: 'Course Catalog', icon: <Compass className="w-4 h-4" /> },
      { id: 'certifications' as AppNavView, label: 'Certifications Hub', icon: <Award className="w-4 h-4" /> },
      { id: 'study-plans' as AppNavView, label: 'Study Plans', icon: <CalendarDays className="w-4 h-4" /> },
    ]},
    { section: 'PRACTICE & EVALUATION', items: [
      { id: 'quizzes' as AppNavView, label: 'Topic Quizzes', icon: <FileQuestion className="w-4 h-4" /> },
      { id: 'mock-exams' as AppNavView, label: 'Mock Exams (NISM)', icon: <Clock className="w-4 h-4" /> },
      { id: 'practice-lab' as AppNavView, label: 'Practice Lab (Sim)', icon: <TrendingUp className="w-4 h-4 text-[#00E599] dark:text-[#00E599]" />, badge: 'LIVE' },
      { id: 'ai-tutor' as AppNavView, label: 'AI Financial Tutor', icon: <BrainCircuit className="w-4 h-4 text-[#FF2E7E]" />, badge: 'AI' },
    ]},
    { section: 'GROWTH & COMMUNITY', items: [
      { id: 'community' as AppNavView, label: 'Community Forum', icon: <Users className="w-4 h-4" /> },
      { id: 'goals' as AppNavView, label: 'Learning Goals', icon: <Target className="w-4 h-4" /> },
      { id: 'achievements' as AppNavView, label: 'Achievements Gallery', icon: <Trophy className="w-4 h-4" /> },
    ]},
    { section: 'SYSTEM & BLUEPRINT', items: [
      { id: 'notifications' as AppNavView, label: 'Notifications', icon: <Bell className="w-4 h-4" />, count: unreadNotificationsCount },
      { id: 'profile' as AppNavView, label: 'Learner Profile', icon: <UserIcon className="w-4 h-4" /> },
      { id: 'settings' as AppNavView, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      { id: 'figma-blueprint' as AppNavView, label: '34-Table Blueprint', icon: <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> },
    ]}
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F4] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col antialiased theme-transition" id="financex-app-shell">
      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between theme-transition">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <FinanceXLogo size="sm" variant="full" onClick={() => onNavigate('dashboard')} />
        </div>

        {/* Center: Search Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 transition group shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-[#FF2E7E] dark:group-hover:text-[#00E599] transition-colors" />
              <span>Search topics, NISM prep, formulas, virtual stocks...</span>
            </div>
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Telemetry, Theme Toggle & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Money Evolution Trigger */}
          <button
            onClick={onOpenMoneyEvolution}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 hover:border-amber-400 text-xs font-medium text-amber-800 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-slate-800 transition"
            title="Revisit the Evolution of Money 9-Chapter Story"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden xl:inline">Evolution Story</span>
          </button>

          {/* Daily Streak Flame */}
          <div className="relative">
            <button
              onClick={() => setIsStreakModalOpen(!isStreakModalOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-500/60 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 transition shadow-xs"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{user.current_streak}D</span>
            </button>

            {/* Streak Popover */}
            {isStreakModalOpen && (
              <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-white dark:bg-[#0F1422] border border-slate-200 dark:border-slate-700 shadow-xl z-50 text-xs theme-transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    {user.current_streak} Day Streak
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Record: {user.longest_streak}d</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-3">
                  Study 1 lesson or take 1 quiz daily to maintain your active streak multiplier!
                </p>
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div
                      key={i}
                      className={`p-1.5 rounded-lg ${
                        i < 5 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 font-bold' 
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* XP Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-[#00E599]/30 text-xs font-mono font-bold text-emerald-700 dark:text-[#00E599] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00E599]" />
            <span>{user.xp_points || 840} XP</span>
          </div>

          {/* Theme Toggle (Light / Dark Switch) */}
          <ThemeToggle variant="compact" />

          {/* Notifications Flyout */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF2E7E] animate-ping" />
              )}
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF2E7E]" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto p-3 rounded-2xl bg-white dark:bg-[#0E1320] border border-slate-200 dark:border-slate-700 shadow-2xl z-50 theme-transition">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Notifications</span>
                  <button
                    onClick={() => {
                      onNavigate('notifications');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-[10px] text-[#FF2E7E] dark:text-[#00E599] font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.notification_id}
                      onClick={() => {
                        onNavigate('notifications');
                        setIsNotificationsOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        !n.read 
                          ? 'bg-pink-50/70 dark:bg-slate-800/80 border-pink-200 dark:border-[#00E599]/30' 
                          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-200">{n.title}</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick AI Tutor Pill Button */}
          <button
            onClick={() => onNavigate('ai-tutor')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 dark:from-[#FF2E7E]/20 dark:to-[#00E599]/20 hover:opacity-90 dark:hover:from-[#FF2E7E]/30 dark:hover:to-[#00E599]/30 text-white dark:text-white border border-transparent dark:border-[#FF2E7E]/40 text-xs font-bold transition shadow-sm dark:shadow-[0_0_15px_rgba(255,46,126,0.15)]"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-white dark:text-[#FF2E7E]" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-7 h-7 rounded-lg object-cover border border-[#FF2E7E]/50 dark:border-[#00E599]/40"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#0E1320] border border-slate-200 dark:border-slate-700 shadow-2xl z-50 text-xs theme-transition">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="font-bold text-slate-900 dark:text-white">{user.full_name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</div>
                  <div className="text-[10px] font-mono text-[#FF2E7E] dark:text-[#00E599] font-semibold mt-1">
                    Level 3: Derivative Analyst
                  </div>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Profile & Certificates</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Account & Preferences</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#FF2E7E]" />
                  <span>Public Landing Page</span>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                <button
                  onClick={() => {
                    onOpenAuth();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Switch Demo Account
                </button>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition font-medium"
                >
                  Exit to Public Website
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main App Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-[#0A0D15] border-r border-slate-200 dark:border-slate-800/80 p-4 overflow-y-auto select-none theme-transition">
          <div className="space-y-6">
            {navItems.map((group) => (
              <div key={group.section}>
                <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">
                  {group.section}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-pink-50/90 text-[#FF2E7E] border border-pink-200/80 shadow-xs font-bold dark:bg-slate-800/90 dark:text-white dark:border-[#00E599]/40 dark:shadow-[0_0_15px_rgba(0,229,153,0.15)]'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-[#FF2E7E] dark:text-[#00E599]' : 'text-slate-400 dark:text-slate-400'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            item.badge === 'LIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40'
                              : 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-[#FF2E7E]/20 dark:text-[#FF2E7E] dark:border-[#FF2E7E]/40'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && item.count > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#FF2E7E] text-white">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Practice Lab Widget in Sidebar Footer */}
          <div className="mt-auto pt-6">
            <div 
              onClick={() => onNavigate('practice-lab')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#0A1320] border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-[#00E599]/50 cursor-pointer transition group shadow-xs"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                <span>SIMULATED CAPITAL</span>
                <span className="text-emerald-600 dark:text-[#00E599] font-bold">PAPER TRADING</span>
              </div>
              <div className="text-sm font-mono font-black text-slate-900 dark:text-white group-hover:text-[#FF2E7E] dark:group-hover:text-[#00E599] transition-colors">
                ₹7,42,500.00
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>Holdings: 3 Assets</span>
                <span className="text-emerald-600 dark:text-[#00E599] font-semibold">+6.4% Unrealized</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <div className="relative w-72 bg-white dark:bg-[#0A0D15] border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col h-full overflow-y-auto z-10 theme-transition shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                <FinanceXLogo size="sm" variant="full" />
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                {navItems.map((group) => (
                  <div key={group.section}>
                    <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">
                      {group.section}
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            setIsMobileNavOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                            currentView === item.id
                              ? 'bg-pink-50 text-[#FF2E7E] dark:bg-slate-800 dark:text-[#00E599] font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FF2E7E]/10 dark:bg-[#00E599]/20 text-[#FF2E7E] dark:text-[#00E599]">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#F7F7F4] dark:bg-[#07090E] p-4 sm:p-6 lg:p-8 theme-transition">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden sticky bottom-0 z-40 h-16 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/90 px-3 flex items-center justify-around theme-transition">
        {[
          { id: 'dashboard' as AppNavView, label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'learn' as AppNavView, label: 'Learn', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'practice-lab' as AppNavView, label: 'Practice', icon: <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-[#00E599]" /> },
          { id: 'ai-tutor' as AppNavView, label: 'AI Tutor', icon: <BrainCircuit className="w-5 h-5 text-[#FF2E7E]" /> },
          { id: 'profile' as AppNavView, label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg transition ${
              currentView === item.id ? 'text-[#FF2E7E] dark:text-[#00E599] font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
