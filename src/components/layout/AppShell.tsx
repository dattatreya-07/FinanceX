import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles, 
  Menu, 
  X, 
  Compass,
  Code2,
  ChevronDown,
  Calculator,
  Zap,
  ShieldCheck,
  LogOut,
  Globe
} from 'lucide-react';
import { FinanceXLogo } from '../brand/FinanceXLogo';
import { AppNavView, User, Notification } from '../../types/schema';
import { adminService } from '../../services/adminService';
import { useTranslation } from 'react-i18next';
import { GlobalSearchModal } from './GlobalSearchModal';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { FloatingRadialMenu } from './FloatingRadialMenu';
import { FloatingAITutorWidget } from '../aiTutor/FloatingAITutorWidget';

interface AppShellProps {
  currentView: AppNavView;
  onNavigate: (view: AppNavView, payload?: any) => void;
  user: User;
  notifications: Notification[];
  virtualBalance?: number;
  holdingsCount?: number;
  onOpenAuth: () => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  user,
  notifications,
  virtualBalance,
  holdingsCount,
  onOpenAuth,
  onSignOut,
  children
}) => {
  const { t } = useTranslation('navigation');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  const streakRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = adminService.hasAdminPrivileges(user);

  // Close all popovers on route / view changes
  useEffect(() => {
    setIsNotificationsOpen(false);
    setIsProfileMenuOpen(false);
    setIsStreakModalOpen(false);
    setIsMobileNavOpen(false);
  }, [currentView]);

  // Click outside and Escape key handler with cleanup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isStreakModalOpen && streakRef.current && !streakRef.current.contains(target)) {
        setIsStreakModalOpen(false);
      }
      if (isNotificationsOpen && notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (isProfileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsStreakModalOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStreakModalOpen, isNotificationsOpen, isProfileMenuOpen]);

  const toggleStreak = () => {
    setIsStreakModalOpen((prev) => {
      if (!prev) {
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
      }
      return !prev;
    });
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => {
      if (!prev) {
        setIsStreakModalOpen(false);
        setIsProfileMenuOpen(false);
      }
      return !prev;
    });
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => {
      if (!prev) {
        setIsStreakModalOpen(false);
        setIsNotificationsOpen(false);
      }
      return !prev;
    });
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const rawNavItems = [
    { section: t('learning_and_certifications'), items: [
      { id: 'dashboard' as AppNavView, label: t('dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'learn' as AppNavView, label: t('active_lesson'), icon: <BookOpen className="w-4 h-4" /> },
      { id: 'courses' as AppNavView, label: t('course_catalog'), icon: <Compass className="w-4 h-4" /> },
      { id: 'certifications' as AppNavView, label: t('certifications_hub'), icon: <Award className="w-4 h-4" /> },
      { id: 'study-plans' as AppNavView, label: t('study_plans'), icon: <CalendarDays className="w-4 h-4" /> },
    ]},
    { section: t('practice_and_evaluation'), items: [
      { id: 'quizzes' as AppNavView, label: t('topic_quizzes'), icon: <FileQuestion className="w-4 h-4" /> },
      { id: 'mock-exams' as AppNavView, label: t('mock_exams'), icon: <Clock className="w-4 h-4" /> },
      { id: 'practice-lab' as AppNavView, label: t('practice_lab'), icon: <TrendingUp className="w-4 h-4 text-[#00E599]" />, badge: 'LIVE' },
      { id: 'calculators' as AppNavView, label: 'Financial Calculators', icon: <Calculator className="w-4 h-4 text-emerald-500" />, badge: 'QUANT' },
      { id: 'arena' as AppNavView, label: 'Competitive Arena', icon: <Zap className="w-4 h-4 text-amber-500" />, badge: 'ARENA' },
      { id: 'ai-tutor' as AppNavView, label: t('ai_financial_tutor'), icon: <BrainCircuit className="w-4 h-4 text-[#FF5722]" />, badge: 'AI' },
    ]},
    { section: 'Argus Fin Ecosystem', items: [
      { id: 'argus-fin' as AppNavView, label: 'Argus Fin Platform', icon: <Globe className="w-4 h-4 text-emerald-400" />, badge: 'EXTERNAL' },
    ]},
    { section: t('growth_and_community'), items: [
      { id: 'community' as AppNavView, label: t('community_forum'), icon: <Users className="w-4 h-4" /> },
      { id: 'goals' as AppNavView, label: t('learning_goals'), icon: <Target className="w-4 h-4" /> },
      { id: 'achievements' as AppNavView, label: t('achievements_gallery'), icon: <Trophy className="w-4 h-4" /> },
    ]},
    { section: t('system_and_blueprint'), items: [
      { id: 'admin' as AppNavView, label: 'Admin CMS & LMS', icon: <ShieldCheck className="w-4 h-4 text-orange-400 dark:text-orange-600" />, badge: 'ADMIN', adminOnly: true },
      { id: 'notifications' as AppNavView, label: t('notifications'), icon: <Bell className="w-4 h-4" />, count: unreadNotificationsCount },
      { id: 'profile' as AppNavView, label: t('learner_profile'), icon: <UserIcon className="w-4 h-4" /> },
      { id: 'settings' as AppNavView, label: t('settings'), icon: <Settings className="w-4 h-4" /> },
      { id: 'figma-blueprint' as AppNavView, label: t('blueprint_34_table'), icon: <Code2 className="w-4 h-4 text-cyan-400 dark:text-cyan-600" />, adminOnly: true },
    ]}
  ];

  // Role-based visibility: Filter out admin-only items if user does not have admin permissions
  const navItems = rawNavItems.map(group => ({
    ...group,
    items: group.items.filter(item => !(item as any).adminOnly || isAdmin)
  })).filter(group => group.items.length > 0);

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#F7F7F4] dark:bg-[#07090E] text-slate-900 dark:text-slate-100 flex flex-col antialiased theme-transition relative" id="financex-app-shell">
      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Floating Radial Menu (Left-Middle Edge) */}
      <FloatingRadialMenu
        currentView={currentView}
        onNavigate={onNavigate}
        user={user}
      />

      {/* Dynamic Island Header Capsule (Emerald Jade & Wealth Gold Tone) */}
      <header className="sticky top-0 z-40 w-full px-1.5 sm:px-6 pt-1.5 sm:pt-3 pb-1 flex-shrink-0 pointer-events-none theme-transition">
        <div className="pointer-events-auto mx-auto w-full sm:w-[96%] max-w-7xl rounded-2xl sm:rounded-full bg-gradient-to-r from-[#032B25] via-[#064E3B] to-[#047857] text-white shadow-[0_8px_30px_rgba(4,120,87,0.38)] backdrop-blur-xl border border-amber-300/30 px-2 sm:px-6 py-1.5 sm:py-2.5 flex items-center justify-between gap-1 sm:gap-4 transition-all duration-300">
          {/* Left: Mobile Drawer Trigger & Brand Logo */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-1 sm:p-1.5 text-white/90 hover:text-white rounded-lg hover:bg-white/20 transition cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              {isMobileNavOpen ? <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
            </button>
            
            <div className="hidden sm:block">
              <FinanceXLogo size="sm" variant="full" inverse={true} onClick={() => onNavigate('dashboard')} />
            </div>
            <div className="sm:hidden">
              <FinanceXLogo size="sm" variant="icon" inverse={true} onClick={() => onNavigate('dashboard')} />
            </div>
          </div>

          {/* Center: Fluidly Responsive Search Bar */}
          <div className="flex-1 min-w-[60px] max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 bg-white/15 hover:bg-white/25 border border-white/25 rounded-full text-xs text-white placeholder-white/80 transition group shadow-xs cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-amber-300 group-hover:text-amber-200 transition-colors flex-shrink-0" />
                <span className="hidden sm:inline truncate font-medium text-white/90">Search NISM XV topics, formulas, ratios...</span>
                <span className="sm:hidden text-[11px] truncate text-white/90">Search...</span>
              </div>
              <kbd className="hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-amber-200 border border-white/30">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Consolidated Streak/XP (Single Pill), Capital, Theme, Language & User */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Unified Streak & XP Pill */}
            <div className="relative" ref={streakRef}>
              <button
                onClick={toggleStreak}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-mono font-bold transition shadow-xs cursor-pointer group"
                title="Continuous Learning Streak & XP"
              >
                <span className="flex items-center gap-0.5 sm:gap-1 text-amber-300">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-300 animate-pulse" />
                  <span>{user.current_streak || 0}d</span>
                </span>
                <span className="hidden sm:inline text-white/40">|</span>
                <span className="hidden sm:flex items-center gap-1 text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{user.xp_points || 0} XP</span>
                </span>
              </button>

              {/* Streak Popover */}
              {isStreakModalOpen && (
                <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-[#0B0F19] dark:bg-white text-white dark:text-slate-900 border border-slate-800 dark:border-slate-200 shadow-2xl z-50 text-xs theme-transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold flex items-center gap-1.5 text-amber-400 dark:text-amber-600">
                      <Flame className="w-4 h-4 fill-amber-500" />
                      {user.current_streak || 0} Day Streak
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Record: {user.longest_streak || 0}d</span>
                  </div>
                  <p className="text-[11px] text-slate-300 dark:text-slate-600 mb-3 leading-relaxed">
                    Complete 1 NISM lesson or 1 practice test daily to maintain your active knowledge streak!
                  </p>
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div
                        key={i}
                        className={`p-1.5 rounded-lg ${
                          i < Math.min(user.current_streak || 0, 7)
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' 
                            : 'bg-white/5 dark:bg-slate-100 text-slate-500'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Virtual Capital Badge (Paper Trading) */}
            {virtualBalance !== undefined && (
              <button
                onClick={() => onNavigate('practice-lab')}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-mono font-bold transition cursor-pointer"
                title="Virtual Paper Portfolio Balance"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>₹{virtualBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </button>
            )}

            <ThemeToggle />
            <LanguageSelector />

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-300 rounded-full ring-2 ring-orange-500" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 p-3 rounded-2xl bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-2xl z-50 text-xs theme-transition">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="font-bold">Notifications</span>
                    <span className="text-[10px] font-mono text-slate-500">{notifications.length} alerts</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-center text-slate-400 text-[11px]">No alerts right now</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.notification_id}
                          onClick={() => {
                            onNavigate('notifications');
                            setIsNotificationsOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-1 cursor-pointer hover:border-[#FF5722] transition"
                        >
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{notif.title}</div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 sm:pl-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white transition cursor-pointer"
                aria-label="Learner Profile Menu"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.full_name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-white/60"
                />
                <span className="text-xs font-bold text-white hidden md:inline max-w-[90px] truncate">
                  {user.full_name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80 hidden sm:inline" />
              </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#0E1320] border border-slate-200 dark:border-slate-700 shadow-2xl z-50 text-xs theme-transition">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{user.full_name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                  <div className="text-[10px] font-mono text-[#FF2E7E] dark:text-[#00E599] font-semibold mt-1">
                    {user.role || 'Derivative Analyst'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Profile & Certificates</span>
                </button>
                {adminService.hasAdminPrivileges(user) && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>Admin CMS & LMS</span>
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                      PORTAL
                    </span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>System Settings</span>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                <button
                  onClick={() => {
                    onOpenAuth();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  Switch Account
                </button>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (onSignOut) {
                      onSignOut();
                    } else {
                      onNavigate('landing');
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition font-bold flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#0A0D14] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#032B25] to-[#047857] text-white">
              <FinanceXLogo size="sm" variant="full" inverse={true} onClick={() => { onNavigate('dashboard'); setIsMobileNavOpen(false); }} />
              <button
                onClick={() => setIsMobileNavOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 space-y-4 flex-1">
              {navItems.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
                    {group.section}
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        currentView === item.id
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={currentView === item.id ? 'text-emerald-500' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {(item as any).badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-400 font-bold">
                          {(item as any).badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-400">FinanceX NISM XV AI Platform</span>
            </div>
          </div>
        </div>
      )}

      {/* Main App Body (Full Width - Static Sidebar Removed as per Item 2 & 4) */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Main Content Area (Dynamic Workspace - Full Width) */}
        <main className="flex-1 h-full overflow-y-auto bg-[#FAFAFA] dark:bg-[#07090E] p-3 sm:p-5 lg:p-6 w-full theme-transition">
          <div className="w-full">
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

      {/* Floating Interactive AI Tutor with Voice Assistance (Item 5) */}
      <FloatingAITutorWidget onNavigate={onNavigate} />
    </div>
  );
};
