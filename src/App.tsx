import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { authService } from './services/authService';
import { adminService } from './services/adminService';
import { courseService } from './services/courseService';
import { quizService } from './services/quizService';
import { examService } from './services/examService';
import { tradingService } from './services/tradingService';
import { goalService } from './services/goalService';
import { notificationService } from './services/notificationService';
import { learningLoopService } from './services/learningLoopService';
import { spacedReviewService } from './services/spacedReviewService';
import { AppNavView, User, Course, Lesson, LessonContent, LessonResource, Quiz, Question, MockExam, Certification, Goal, Notification, DemoHolding, DemoTransaction, DemoAccount, Achievement, UserAchievement, Certificate, QuizAttempt, MockExamAttempt, ConceptMastery } from './types/schema';
import { 
  MOCK_CURRENT_USER, 
  MOCK_COURSES, 
  MOCK_LESSONS, 
  MOCK_LESSON_CONTENTS, 
  MOCK_LESSON_RESOURCES, 
  MOCK_QUIZZES, 
  MOCK_QUESTIONS, 
  MOCK_EXAMS, 
  MOCK_CERTIFICATIONS, 
  MOCK_CERTIFICATES, 
  MOCK_GOALS, 
  MOCK_ACHIEVEMENTS, 
  MOCK_USER_ACHIEVEMENTS, 
  MOCK_USER_SOCIAL_LINKS, 
  MOCK_KNOWLEDGE_LEVELS, 
  MOCK_NOTIFICATIONS, 
  MOCK_DEMO_ACCOUNT, 
  MOCK_INSTRUMENTS, 
  MOCK_DEMO_HOLDINGS, 
  MOCK_DEMO_TRANSACTIONS, 
  MOCK_TOPICS, 
  MOCK_STUDY_PLANS, 
  MOCK_DISCUSSION_THREADS, 
  MOCK_DISCUSSION_REPLIES,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_QUIZ_ATTEMPTS,
  MOCK_EXAM_ATTEMPTS
} from './data/mockData';
import { TAMIL_LESSONS, TAMIL_LESSON_CONTENTS } from './data/translations/tamilContent';
import { NISM_XV_CHAPTERS } from './data/nismFullCurriculum';

// Brand & Layout
import { BootExperience } from './components/brand/BootExperience';
import { AppShell } from './components/layout/AppShell';
import { AuthModal } from './components/auth/AuthModal';
import { PersonalizationFlow, UserPreferences } from './components/onboarding/PersonalizationFlow';
import { LandingPageView } from './components/landing/LandingPageView';

// Primary Views
import { DashboardView } from './components/dashboard/DashboardView';
import { CourseCatalogView } from './components/learn/CourseCatalogView';
import { LessonView } from './components/learn/LessonView';
import { QuizzesCatalogView } from './components/quizzes/QuizzesCatalogView';
import { QuizRunner } from './components/quizzes/QuizRunner';
import { QuizResultView } from './components/quizzes/QuizResultView';
import { MockExamsCatalogView } from './components/mockExams/MockExamsCatalogView';
import { MockExamRunner } from './components/mockExams/MockExamRunner';
import { MockExamResultView } from './components/mockExams/MockExamResultView';
import { PracticeLabView } from './components/practiceLab/PracticeLabView';
import { AITutorView } from './components/aiTutor/AITutorView';
import { CertificationsView } from './components/certifications/CertificationsView';
import { StudyPlansView } from './components/studyPlans/StudyPlansView';
import { CommunityView } from './components/community/CommunityView';
import { GoalsView } from './components/goals/GoalsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { FigmaBlueprintView } from './components/blueprint/FigmaBlueprintView';
import { FinancialCalculatorsView } from './components/tools/FinancialCalculatorsView';
import { CompetitiveArenaView } from './components/arena/CompetitiveArenaView';
import { AdminPortalView } from './components/admin/AdminPortalView';

const INITIAL_FRESH_USER: User = {
  user_id: 'guest',
  full_name: 'New Learner',
  email: 'learner@financex.com',
  phone_number: '',
  account_status: 'ACTIVE',
  knowledge_level_id: 1,
  current_streak: 0,
  longest_streak: 0,
  xp_points: 0,
  social_links: []
};

const INITIAL_FRESH_DEMO_ACCOUNT: DemoAccount = {
  demo_account_id: 1,
  user_id: 1,
  virtual_balance: 1000000.00,
  currency: 'INR',
  initial_capital: 1000000.00
};

const INITIAL_FRESH_NOTIFICATIONS: Notification[] = [
  {
    notification_id: 1,
    user_id: 1,
    type: 'ALERT',
    title: 'Welcome to FinanceX!',
    message: 'Your institutional financial sandbox & NISM learning terminal is ready with ₹10,00,000 virtual capital.',
    read: false,
    created_at: new Date().toISOString().substring(0, 10),
    priority: 'HIGH'
  }
];

export default function App() {
  // App-level State
  const [isBooting, setIsBooting] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return !sessionStorage.getItem('hasSeenFinanceXBoot');
      } catch {
        return true;
      }
    }
    return true;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin'>('login');
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<AppNavView>('landing');
  const [user, setUser] = useState<User>(INITIAL_FRESH_USER);

  // Curriculum State
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [lessonContents, setLessonContents] = useState<LessonContent[]>(MOCK_LESSON_CONTENTS);
  const [lessonResources, setLessonResources] = useState<LessonResource[]>(MOCK_LESSON_RESOURCES);
  const [activeCourse, setActiveCourse] = useState<Course>(MOCK_COURSES[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson>(() => ({ ...MOCK_LESSONS[0], is_completed: false }));

  // Quiz & Mock Exam State
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizScoreResult, setQuizScoreResult] = useState<{ score: number; totalQuestions: number; correctCount: number } | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  const [mockExams, setMockExams] = useState<MockExam[]>(MOCK_EXAMS);
  const [certificationsList, setCertificationsList] = useState<Certification[]>(MOCK_CERTIFICATIONS);
  const [activeMockExam, setActiveMockExam] = useState<MockExam | null>(null);
  const [mockExamStatsResult, setMockExamStatsResult] = useState<{
    score: number;
    totalMarks: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    timeSpentMins: number;
    topicBreakdown?: any[];
    isInvalidated?: boolean;
  } | null>(null);
  const [mockExamAttempts, setMockExamAttempts] = useState<MockExamAttempt[]>([]);

  // Simulation & Paper Trading State (Fresh ₹10,00,000 Portfolio)
  const [demoAccount, setDemoAccount] = useState<DemoAccount>(INITIAL_FRESH_DEMO_ACCOUNT);
  const [instruments, setInstruments] = useState(MOCK_INSTRUMENTS);
  const [holdings, setHoldings] = useState<DemoHolding[]>([]);
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);

  // Goals, Badges & Notifications
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievementsList] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_FRESH_NOTIFICATIONS);
  const [userCertificates, setUserCertificates] = useState<Certificate[]>([]);
  const [adminLearners, setAdminLearners] = useState<User[]>([]);

  // AI Tutor Prompt Handoff
  const [aiTutorPrompt, setAiTutorPrompt] = useState<string>('');

  // 1. Initial catalog data loading from Supabase service layer
  const loadCatalogData = async () => {
    try {
      const [loadedCourses, loadedQuizzes, loadedExams, loadedInstruments, loadedQuestions] = await Promise.all([
        courseService.getCourses(),
        quizService.getQuizzes(),
        examService.getMockExams(),
        tradingService.getInstruments(),
        quizService.getQuizQuestions(1)
      ]);
      if (loadedCourses && loadedCourses.length > 0) {
        setCourses(loadedCourses);
        setActiveCourse(loadedCourses[0]);
      }
      if (loadedQuizzes && loadedQuizzes.length > 0) setQuizzes(loadedQuizzes);
      if (loadedExams && loadedExams.length > 0) setMockExams(loadedExams);
      if (loadedInstruments && loadedInstruments.length > 0) setInstruments(loadedInstruments);
      if (loadedQuestions && loadedQuestions.length > 0) setQuestions(loadedQuestions);
      adminService.getLearners().then((list) => {
        if (list && list.length > 0) setAdminLearners(list);
      });
    } catch (err) {
      console.error('Error loading initial catalog data from services:', err);
    }
  };

  useEffect(() => {
    loadCatalogData();
    const handleLangChange = () => {
      loadCatalogData();
    };
    const handleXpUpdate = (e: any) => {
      if (e?.detail) {
        setUser((prev) => ({
          ...prev,
          xp_points: e.detail.xp_points,
          current_streak: e.detail.current_streak,
          longest_streak: e.detail.longest_streak
        }));
      }
    };
    window.addEventListener('financex-xp-updated', handleXpUpdate);
    return () => {
      window.removeEventListener('financex-language-change', handleLangChange);
      window.removeEventListener('financex-xp-updated', handleXpUpdate);
    };
  }, []);

  // 2. Restore Supabase / Local Auth Session & Subscribe to Auth State Changes
  useEffect(() => {
    const initAuth = async () => {
      const session = await authService.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        const profile = await authService.getProfile(session.user.id);
        if (profile) {
          setUser(profile);
          const saved = authService.loadUserData(profile.email);
          if (saved) {
            if (saved.demoAccount) setDemoAccount(saved.demoAccount);
            if (saved.holdings) setHoldings(saved.holdings);
            if (saved.transactions) setTransactions(saved.transactions);
            if (saved.goals) setGoals(saved.goals);
            if (saved.notifications) setNotifications(saved.notifications);
            if (saved.quizAttempts) setQuizAttempts(saved.quizAttempts);
            if (saved.mockExamAttempts) setMockExamAttempts(saved.mockExamAttempts);
          }
        }
      }
    };
    initAuth();

    const sub = authService.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const profile = await authService.getProfile(session.user.id);
        if (profile) {
          setUser(profile);
          const saved = authService.loadUserData(profile.email);
          if (saved) {
            if (saved.demoAccount) setDemoAccount(saved.demoAccount);
            if (saved.holdings) setHoldings(saved.holdings);
            if (saved.transactions) setTransactions(saved.transactions);
            if (saved.goals) setGoals(saved.goals);
            if (saved.notifications) setNotifications(saved.notifications);
            if (saved.quizAttempts) setQuizAttempts(saved.quizAttempts);
            if (saved.mockExamAttempts) setMockExamAttempts(saved.mockExamAttempts);
          }
        }
      } else if (_event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(INITIAL_FRESH_USER);
        setDemoAccount(INITIAL_FRESH_DEMO_ACCOUNT);
        setHoldings([]);
        setTransactions([]);
        setGoals([]);
        setQuizAttempts([]);
        setMockExamAttempts([]);
        setUserCertificates([]);
        setNotifications(INITIAL_FRESH_NOTIFICATIONS);
        setCurrentView('landing');
      }
    });

    return () => {
      sub?.unsubscribe?.();
    };
  }, []);

  // 3. User-specific authenticated data loading from Database
  useEffect(() => {
    if (!isAuthenticated || user.user_id === 'guest') return;
    const loadUserData = async () => {
      try {
        const userIdStr = String(user.user_id);
        const [acc, hld, txs, gls, notifs, certs] = await Promise.all([
          tradingService.getDemoAccount(userIdStr),
          tradingService.getHoldings(userIdStr),
          tradingService.getTransactions(userIdStr),
          goalService.getGoals(userIdStr),
          notificationService.getNotifications(userIdStr),
          examService.getCertificates(userIdStr)
        ]);
        if (acc) setDemoAccount(acc);
        if (hld && hld.length > 0) setHoldings(hld);
        if (txs && txs.length > 0) setTransactions(txs);
        if (gls && gls.length > 0) setGoals(gls);
        if (notifs && notifs.length > 0) setNotifications(notifs);
        if (certs && certs.length > 0) setUserCertificates(certs);
      } catch (err) {
        console.warn('Non-blocking user data load:', err);
      }
    };
    loadUserData();
  }, [isAuthenticated, user.user_id]);

  // Navigation Handler
  const handleNavigate = (view: AppNavView, payload?: any) => {
    if (view === 'money-evolution') {
      setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'learn' && payload) {
      if (payload.course) setActiveCourse(payload.course);
      if (payload.lesson) setActiveLesson(payload.lesson);
    }

    if (view === 'quizzes' && payload) {
      if (payload.topicId) {
        const targetQuiz = quizzes.find((q) => q.topic_id === payload.topicId) || quizzes[0];
        if (targetQuiz) {
          setActiveQuiz(targetQuiz);
          setQuizScoreResult(null);
        }
      }
    }

    if (view === 'ai-tutor') {
      setAiTutorPrompt(payload?.prompt || '');
    }

    if ((view === 'admin' || view === 'figma-blueprint') && !adminService.hasAdminPrivileges(user)) {
      console.warn('[FinanceX RBAC] Access denied to administrative view:', view);
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'admin' && adminService.hasAdminPrivileges(user)) {
      adminService.getLearners().then(list => {
        if (list && list.length > 0) setAdminLearners(list);
      });
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Boot Experience complete handler
  const handleBootComplete = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('hasSeenFinanceXBoot', 'true');
      } catch {
        // Boot completion must not depend on browser storage permissions.
      }
    }
    setIsBooting(false);
  };

  // Auth Openers
  const handleOpenSignIn = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleOpenAdminSignIn = () => {
    setAuthModalMode('admin');
    setIsAuthModalOpen(true);
  };

  // Authoritative Paper Trade Execution (Server/Database validated)
  const handleExecuteTrade = async (trade: {
    instrumentId: number;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
  }) => {
    const totalAmount = trade.quantity * trade.price;

    // Call authoritative server/service backend
    const result = await tradingService.executeTrade(
      String(user.user_id),
      String(demoAccount.demo_account_id),
      String(trade.instrumentId),
      trade.type,
      trade.quantity,
      trade.price
    );

    if (!result.success) {
      alert(result.error || 'Trade execution failed.');
      return;
    }

    // Refresh updated balance from authoritative response
    if (result.newBalance !== undefined) {
      setDemoAccount((prev) => ({
        ...prev,
        virtual_balance: result.newBalance!
      }));
    }

    // Update holdings state securely
    if (trade.type === 'BUY') {
      setHoldings((prev) => {
        const existing = prev.find((h) => h.instrument_id === trade.instrumentId);
        if (existing) {
          const newQty = existing.quantity + trade.quantity;
          const newAvg = ((existing.quantity * existing.avg_buy_price) + totalAmount) / newQty;
          return prev.map((h) =>
            h.instrument_id === trade.instrumentId
              ? { ...h, quantity: newQty, avg_buy_price: parseFloat(newAvg.toFixed(2)) }
              : h
          );
        } else {
          return [
            ...prev,
            {
              holding_id: Date.now(),
              demo_account_id: demoAccount.demo_account_id,
              instrument_id: trade.instrumentId,
              quantity: trade.quantity,
              avg_buy_price: trade.price
            }
          ];
        }
      });
    } else {
      // SELL
      setHoldings((prev) =>
        prev
          .map((h) => (h.instrument_id === trade.instrumentId ? { ...h, quantity: h.quantity - trade.quantity } : h))
          .filter((h) => h.quantity > 0)
      );
    }

    // Add to transaction history
    const newTx: DemoTransaction = {
      demo_transaction_id: Date.now(),
      demo_account_id: demoAccount.demo_account_id,
      instrument_id: trade.instrumentId,
      transaction_type: trade.type,
      quantity: trade.quantity,
      price_per_unit: trade.price,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Award XP and sync to Supabase
    try {
      const xpRes = await authService.updateUserXpAndStreak(user.user_id, 50);
      setUser((prev) => ({
        ...prev,
        xp_points: xpRes.xp_points,
        current_streak: xpRes.current_streak,
        longest_streak: xpRes.longest_streak
      }));
    } catch (err) {
      console.warn('XP sync error:', err);
    }
  };

  // Reset Paper Trading Portfolio
  const handleResetPaperPortfolio = () => {
    const freshAccount: DemoAccount = {
      demo_account_id: 1,
      user_id: user.user_id,
      virtual_balance: 1000000.00,
      currency: 'INR',
      initial_capital: 1000000.00
    };
    setDemoAccount(freshAccount);
    setHoldings([]);
    setTransactions([]);
    if (user.email) {
      authService.saveUserData(user.email, {
        user,
        demoAccount: freshAccount,
        holdings: [],
        transactions: [],
        goals,
        notifications,
        quizAttempts,
        mockExamAttempts
      });
    }
  };

  // Goal handlers
  const handleAddGoal = async (newGoal: Omit<Goal, 'goal_id'>) => {
    await goalService.createGoal(String(user.user_id), newGoal.goal_title, newGoal.target_date, newGoal.category);
    const created: Goal = {
      ...newGoal,
      goal_id: Date.now()
    };
    const updatedGoals = [created, ...goals];
    setGoals(updatedGoals);
    if (user.email) {
      authService.saveUserData(user.email, {
        user,
        demoAccount,
        holdings,
        transactions,
        goals: updatedGoals,
        notifications,
        quizAttempts,
        mockExamAttempts
      });
    }
  };

  const handleToggleGoalStatus = (goalId: number) => {
    const updatedGoals = goals.map((g) => {
      if (g.goal_id === goalId) {
        const isComp = g.status === 'COMPLETED';
        return {
          ...g,
          status: isComp ? 'IN_PROGRESS' : 'COMPLETED',
          current_progress_percent: isComp ? 40 : 100
        } as Goal;
      }
      return g;
    });
    setGoals(updatedGoals);
    if (user.email) {
      authService.saveUserData(user.email, {
        user,
        demoAccount,
        holdings,
        transactions,
        goals: updatedGoals,
        notifications,
        quizAttempts,
        mockExamAttempts
      });
    }
  };

  // Notifications handlers
  const handleMarkAllNotificationsAsRead = () => {
    notifications.forEach(n => notificationService.markAsRead(String(n.notification_id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleNotificationRead = (id: number) => {
    notificationService.markAsRead(String(id));
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, read: !n.read } : n))
    );
  };

  // Auth / Switch Demo Account
  const handleAuthSuccess = (userData: { email: string; name: string; isNewUser?: boolean; isDemoUser?: boolean; role?: any }) => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    if (userData.isDemoUser) {
      const demoRole = userData.role || (userData.email.includes('admin') ? 'ADMIN' : 'USER');
      setUser({ ...MOCK_CURRENT_USER, role: demoRole });
      setDemoAccount(MOCK_DEMO_ACCOUNT);
      setHoldings(MOCK_DEMO_HOLDINGS);
      setTransactions(MOCK_DEMO_TRANSACTIONS);
      setGoals(MOCK_GOALS);
      setQuizAttempts(MOCK_QUIZ_ATTEMPTS);
      setMockExamAttempts(MOCK_EXAM_ATTEMPTS);
      setNotifications(MOCK_NOTIFICATIONS);
      if (demoRole === 'ADMIN') {
        handleNavigate('admin');
      } else {
        handleNavigate('dashboard');
      }
      return;
    }

    const saved = authService.loadUserData(userData.email);
    if (saved && !userData.isNewUser) {
      const userWithRole = { ...saved.user, role: saved.user.role || (userData.email.includes('admin') ? 'ADMIN' : 'USER') };
      setUser(userWithRole);
      setDemoAccount(saved.demoAccount || INITIAL_FRESH_DEMO_ACCOUNT);
      setHoldings(saved.holdings || []);
      setTransactions(saved.transactions || []);
      setGoals(saved.goals || []);
      setNotifications(saved.notifications || INITIAL_FRESH_NOTIFICATIONS);
      setQuizAttempts(saved.quizAttempts || []);
      setMockExamAttempts(saved.mockExamAttempts || []);
      if (userWithRole.role === 'ADMIN') {
        handleNavigate('admin');
      } else {
        handleNavigate('dashboard');
      }
    } else {
      const assignedRole = userData.role || (userData.email.includes('admin') ? 'ADMIN' : 'USER');
      const freshUser: User = {
        user_id: Date.now(),
        email: userData.email,
        full_name: userData.name || userData.email.split('@')[0],
        phone_number: '',
        account_status: 'ACTIVE',
        role: assignedRole,
        knowledge_level_id: 1,
        current_streak: 0,
        longest_streak: 0,
        xp_points: 0,
        social_links: []
      };
      const freshAccount: DemoAccount = {
        demo_account_id: 1,
        user_id: freshUser.user_id,
        virtual_balance: 1000000.00,
        currency: 'INR',
        initial_capital: 1000000.00
      };
      setUser(freshUser);
      setDemoAccount(freshAccount);
      setHoldings([]);
      setTransactions([]);
      setGoals([]);
      setQuizAttempts([]);
      setMockExamAttempts([]);
      setNotifications(INITIAL_FRESH_NOTIFICATIONS);
      setLessons((prev) => prev.map((l) => ({ ...l, is_completed: false })));
      setActiveLesson({ ...MOCK_LESSONS[0], is_completed: false });

      authService.saveUserData(userData.email, {
        user: freshUser,
        demoAccount: freshAccount,
        holdings: [],
        transactions: [],
        goals: [],
        notifications: INITIAL_FRESH_NOTIFICATIONS,
        quizAttempts: [],
        mockExamAttempts: []
      });

      if (userData.isNewUser) {
        setIsOnboarding(true);
      } else if (assignedRole === 'ADMIN') {
        handleNavigate('admin');
      } else {
        handleNavigate('dashboard');
      }
    }
  };

  // Sign Out Handler (Clear session, reset user, return to landing)
  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setIsAuthenticated(false);
    setUser(INITIAL_FRESH_USER);
    setDemoAccount(INITIAL_FRESH_DEMO_ACCOUNT);
    setHoldings([]);
    setTransactions([]);
    setGoals([]);
    setQuizAttempts([]);
    setMockExamAttempts([]);
    setNotifications(INITIAL_FRESH_NOTIFICATIONS);
    setCurrentView('landing');
  };

  // Onboarding completion
  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setIsOnboarding(false);
    setUser((prev) => {
      const updated = {
        ...prev,
        knowledge_level_id: prefs.knowledgeLevel === 'Novice Saver' ? 1 : prefs.knowledgeLevel === 'Market Explorer' ? 2 : 3
      };
      if (prev.email) {
        const saved = authService.loadUserData(prev.email);
        if (saved) authService.saveUserData(prev.email, { ...saved, user: updated });
      }
      return updated;
    });
    handleNavigate('dashboard');
  };

  // Quiz completion
  const handleQuizComplete = async (score: number, totalQuestions: number, correctCount: number) => {
    setQuizScoreResult({ score, totalQuestions, correctCount });
    let newAttempts = [...quizAttempts];
    if (activeQuiz) {
      const attempt = await quizService.submitQuizAttempt(
        String(user.user_id),
        String(activeQuiz.quiz_id),
        score,
        totalQuestions * 20,
        correctCount,
        totalQuestions,
        180
      );
      if (attempt) {
        newAttempts = [attempt, ...quizAttempts];
      } else {
        newAttempts = [
          {
            attempt_id: Date.now(),
            user_id: user.user_id,
            quiz_id: activeQuiz.quiz_id,
            score,
            completed_at: new Date().toISOString().substring(0, 10),
            total_questions: totalQuestions,
            correct_answers: correctCount
          },
          ...quizAttempts
        ];
      }
      setQuizAttempts(newAttempts);

      // Phase 28: Update Spaced Review Schedule & Longitudinal Mastery Log
      const topicId = activeQuiz.topic_id || 1;
      const pctScore = Math.round((correctCount / (totalQuestions || 1)) * 100);
      spacedReviewService.recordReviewOutcome(String(user.user_id), topicId, pctScore, pctScore >= 75);
      learningLoopService.recordMasteryObservation(
        String(user.user_id),
        topicId,
        'QUIZ_ATTEMPT',
        pctScore,
        `Completed Quiz #${activeQuiz.quiz_id} (${correctCount}/${totalQuestions} correct, ${pctScore}%)`
      );
    }
    // Add XP & Increment Streak in Database
    try {
      const xpRes = await authService.updateUserXpAndStreak(user.user_id, 100);
      setUser((prev) => ({
        ...prev,
        xp_points: xpRes.xp_points,
        current_streak: xpRes.current_streak,
        longest_streak: xpRes.longest_streak
      }));
    } catch (err) {
      console.warn('Quiz XP sync error:', err);
    }
  };

  // Mock Exam completion
  const handleMockExamComplete = async (stats: {
    score: number;
    totalMarks: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    timeSpentMins: number;
    topicBreakdown?: any[];
    isInvalidated?: boolean;
  }) => {
    setMockExamStatsResult(stats);
    let newAttempts = [...mockExamAttempts];
    if (activeMockExam) {
      const accuracy = parseFloat(((stats.correctCount / (stats.correctCount + stats.wrongCount || 1)) * 100).toFixed(1));
      const attempt = await examService.submitExamAttempt(
        String(user.user_id),
        String(activeMockExam.exam_id),
        stats.score,
        activeMockExam.total_marks || 100,
        accuracy,
        stats.passed,
        stats.timeSpentMins * 60,
        stats.isInvalidated ? 4 : 0,
        stats.topicBreakdown
      );
      if (attempt) {
        newAttempts = [attempt, ...mockExamAttempts];
      } else {
        newAttempts = [
          {
            attempt_id: Date.now(),
            user_id: user.user_id,
            exam_id: activeMockExam.exam_id,
            score: stats.score,
            passed: stats.passed ? 'YES' : 'NO',
            completed_at: new Date().toISOString().substring(0, 10),
            time_spent_mins: stats.timeSpentMins,
            accuracy_percent: accuracy,
            topic_breakdown: stats.topicBreakdown ? { list: stats.topicBreakdown } : undefined
          },
          ...mockExamAttempts
        ];
      }
      setMockExamAttempts(newAttempts);
    }
    // Add XP & Increment Streak in Database
    const xpBonus = stats.passed ? 350 : 120;
    try {
      const xpRes = await authService.updateUserXpAndStreak(user.user_id, xpBonus);
      setUser((prev) => ({
        ...prev,
        xp_points: xpRes.xp_points,
        current_streak: xpRes.current_streak,
        longest_streak: xpRes.longest_streak
      }));
    } catch (err) {
      console.warn('Exam XP sync error:', err);
    }
  };

  // Current lesson content and resources with language awareness
  const currentLang = typeof window !== 'undefined' ? localStorage.getItem('financex_language') || 'en' : 'en';
  let baseContent = MOCK_LESSON_CONTENTS.find((c) => c.lesson_id === activeLesson.lesson_id);
  if (!baseContent && activeLesson.lesson_id > 100 && activeLesson.lesson_id <= 115) {
    const chNum = activeLesson.lesson_id - 100;
    const nismCh = NISM_XV_CHAPTERS.find(c => c.chapterNumber === chNum);
    if (nismCh) {
      baseContent = {
        content_id: 200 + chNum,
        lesson_id: activeLesson.lesson_id,
        content_type: 'MARKDOWN_TEXT',
        content_url: '',
        raw_body: nismCh.detailedBody,
        key_takeaways: nismCh.keyTakeaways,
        formulas: nismCh.formulas.map(f => ({
          label: f.label,
          formula: f.formula,
          explanation: f.explanation
        }))
      };
    }
  }
  if (!baseContent) {
    baseContent = MOCK_LESSON_CONTENTS[0];
  }

  const taContent = TAMIL_LESSON_CONTENTS[activeLesson.lesson_id];
  const activeContent = (currentLang === 'ta' && taContent)
    ? { ...baseContent, raw_body: taContent.raw_body, key_takeaways: taContent.key_takeaways }
    : baseContent;

  const taLesson = TAMIL_LESSONS[activeLesson.lesson_id];
  const displayLesson = (currentLang === 'ta' && taLesson)
    ? { ...activeLesson, title: taLesson.title }
    : activeLesson;

  const activeResources = MOCK_LESSON_RESOURCES.filter((r) => r.lesson_id === activeLesson.lesson_id);
  if (activeResources.length === 0 && (activeLesson.course_id === 3 || activeLesson.lesson_id > 100)) {
    activeResources.push({
      resource_id: 999,
      lesson_id: activeLesson.lesson_id,
      resource_title: 'NISM-Series-XV Research Analyst Official Workbook (Feb 2026)',
      resource_url: '/assets/nism-series-xv-workbook-feb-2026.pdf',
      resource_type: 'PDF_CHEAT_SHEET'
    });
  }
  const currentKnowledgeLevel = MOCK_KNOWLEDGE_LEVELS.find((k) => k.level_id === user.knowledge_level_id) || MOCK_KNOWLEDGE_LEVELS[2];

  // Render Boot Experience on initial load
  if (isBooting) {
    return <BootExperience onComplete={handleBootComplete} />;
  }

  // Render Onboarding Personalization Flow if triggered
  if (isOnboarding) {
    return <PersonalizationFlow onComplete={handleOnboardingComplete} />;
  }

  // Render Active Main View
  const renderCurrentView = () => {
    // Phase 27: Compute live deterministic concept mastery & adaptive recommendations
    const conceptMastery = learningLoopService.computeConceptMastery(user.user_id, {
      quizAttempts,
      mockAttempts: mockExamAttempts,
      allLessons: lessons,
      allTopics: MOCK_TOPICS
    });

    const adaptiveRecommendations = learningLoopService.generateAdaptiveRecommendations(
      user.user_id,
      conceptMastery,
      mockExamAttempts,
      goals
    );

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            user={user}
            onNavigate={handleNavigate}
            recommendations={adaptiveRecommendations}
            goals={goals}
            courses={courses}
            activeLesson={displayLesson}
            demoAccount={demoAccount}
            conceptMastery={conceptMastery}
          />
        );

      case 'courses':
        return (
          <CourseCatalogView
            courses={courses}
            onSelectCourse={(c) => {
              setActiveCourse(c);
              const courseLessons = lessons.filter((l) => l.course_id === c.course_id);
              if (courseLessons.length > 0) {
                setActiveLesson(courseLessons[0]);
              }
              handleNavigate('learn');
            }}
            onNavigate={handleNavigate}
          />
        );

      case 'learn':
        return (
          <LessonView
            lesson={displayLesson}
            course={activeCourse}
            allLessons={lessons.filter((l) => l.course_id === activeCourse.course_id)}
            content={activeContent}
            resources={activeResources}
            onSelectLesson={(l) => setActiveLesson(l)}
            onNavigate={handleNavigate}
            onToggleComplete={(lessonId, completed) => {
              setLessons((prev) =>
                prev.map((les) =>
                  les.lesson_id === lessonId ? { ...les, is_completed: completed } : les
                )
              );
              if (completed) {
                authService.updateUserXpAndStreak(user.user_id, 50).then((xpRes) => {
                  setUser((prev) => ({
                    ...prev,
                    xp_points: xpRes.xp_points,
                    current_streak: xpRes.current_streak,
                    longest_streak: xpRes.longest_streak
                  }));
                }).catch(() => {});
              }
              courseService.recordLessonProgress(String(user.user_id), String(lessonId), completed ? 100 : 0, completed);
            }}
            onOpenAIWithContext={(topic) => {
              setAiTutorPrompt(
                currentLang === 'ta'
                  ? `தயவுசெய்து இந்த தலைப்பிற்கான முக்கிய கருத்துகள் மற்றும் கணித உதாரணங்களை விளக்கவும்: ${topic}`
                  : `Please explain key concepts and numerical examples for: ${topic}`
              );
              handleNavigate('ai-tutor');
            }}
          />
        );

      case 'quizzes':
        if (quizScoreResult && activeQuiz) {
          return (
            <QuizResultView
              quiz={activeQuiz}
              score={quizScoreResult.score}
              totalQuestions={quizScoreResult.totalQuestions}
              correctCount={quizScoreResult.correctCount}
              onRetry={() => setQuizScoreResult(null)}
              onNavigate={(v, payload) => {
                setQuizScoreResult(null);
                setActiveQuiz(null);
                handleNavigate(v, payload);
              }}
            />
          );
        }
        if (activeQuiz) {
          const quizQuestions = questions.filter((q) => q.topic_id === activeQuiz.topic_id);
          return (
            <QuizRunner
              quiz={activeQuiz}
              questions={quizQuestions.length > 0 ? quizQuestions : questions.slice(0, 5)}
              onComplete={handleQuizComplete}
              onOpenAIWithQuestion={(qText) => {
                setAiTutorPrompt(`Help me understand why the correct answer is chosen for this question:\n"${qText}"`);
                handleNavigate('ai-tutor');
              }}
              onNavigate={(v) => {
                setActiveQuiz(null);
                handleNavigate(v);
              }}
            />
          );
        }
        return (
          <QuizzesCatalogView
            quizzes={quizzes}
            topics={MOCK_TOPICS}
            attempts={quizAttempts}
            onStartQuiz={(q) => {
              setActiveQuiz(q);
              setQuizScoreResult(null);
            }}
            onNavigate={handleNavigate}
          />
        );

      case 'mock-exams':
        if (mockExamStatsResult && activeMockExam) {
          return (
            <MockExamResultView
              exam={activeMockExam}
              stats={mockExamStatsResult}
              onRetry={() => setMockExamStatsResult(null)}
              onNavigate={(v, payload) => {
                setMockExamStatsResult(null);
                setActiveMockExam(null);
                handleNavigate(v, payload);
              }}
            />
          );
        }
        if (activeMockExam) {
          return (
            <MockExamRunner
              exam={activeMockExam}
              questions={questions}
              onComplete={handleMockExamComplete}
              onNavigate={(v) => {
                setActiveMockExam(null);
                handleNavigate(v);
              }}
            />
          );
        }
        return (
          <MockExamsCatalogView
            exams={mockExams}
            courses={courses}
            attempts={mockExamAttempts}
            onStartExam={(e) => {
              setActiveMockExam(e);
              setMockExamStatsResult(null);
            }}
            onNavigate={handleNavigate}
          />
        );

      case 'practice-lab':
        return (
          <PracticeLabView
            demoAccount={demoAccount}
            instruments={instruments}
            holdings={holdings}
            transactions={transactions}
            userId={String(user.user_id)}
            onExecuteTrade={handleExecuteTrade}
            onNavigate={handleNavigate}
          />
        );

      case 'ai-tutor':
        return (
          <AITutorView
            initialPrompt={aiTutorPrompt}
            onNavigate={handleNavigate}
          />
        );

      case 'certifications':
        return (
          <CertificationsView
            certifications={certificationsList}
            onNavigate={handleNavigate}
            userName={user.full_name}
            conceptMastery={conceptMastery}
            mockAttempts={mockExamAttempts}
          />
        );

      case 'study-plans':
        return (
          <StudyPlansView
            studyPlans={MOCK_STUDY_PLANS}
            currentUser={user}
            onNavigate={handleNavigate}
          />
        );

      case 'community':
        return (
          <CommunityView
            threads={MOCK_DISCUSSION_THREADS}
            replies={MOCK_DISCUSSION_REPLIES}
            currentUser={user}
            onNavigate={handleNavigate}
          />
        );

      case 'goals':
        return (
          <GoalsView
            goals={goals}
            onAddGoal={handleAddGoal}
            onToggleGoalStatus={handleToggleGoalStatus}
            onNavigate={handleNavigate}
          />
        );

      case 'achievements':
        return (
          <AchievementsView
            achievements={achievements}
            userAchievements={userAchievements}
            onNavigate={handleNavigate}
          />
        );

      case 'notifications':
        return (
          <NotificationsView
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onToggleRead={handleToggleNotificationRead}
            onNavigate={handleNavigate}
          />
        );

      case 'profile':
        return (
          <ProfileView
            user={user}
            certificates={userCertificates}
            certifications={certificationsList}
            socialLinks={MOCK_USER_SOCIAL_LINKS}
            knowledgeLevel={currentKnowledgeLevel}
            onNavigate={handleNavigate}
            onUpdateUser={async (updated) => {
              const res = await authService.updateProfile(user.user_id, updated);
              if (res.user) {
                setUser(res.user);
              } else {
                setUser((prev) => ({ ...prev, ...updated }));
              }
            }}
          />
        );

      case 'settings':
        return (
          <SettingsView
            onResetPaperPortfolio={handleResetPaperPortfolio}
            onNavigate={handleNavigate}
          />
        );

      case 'landing':
        return (
          <LandingPageView
            isAuthenticated={isAuthenticated}
            user={user}
            onOpenSignIn={handleOpenSignIn}
            onOpenSignUp={handleOpenSignUp}
            onEnterApp={() => handleNavigate('dashboard')}
            onNavigateCourse={(courseId) => {
              const found = courses.find((c) => c.course_id === courseId);
              if (found) setActiveCourse(found);
              if (isAuthenticated) {
                handleNavigate('learn');
              } else {
                handleOpenSignUp();
              }
            }}
          />
        );

      case 'figma-blueprint':
        if (!adminService.hasAdminPrivileges(user)) {
          return (
            <DashboardView
              user={user}
              onNavigate={handleNavigate}
              recommendations={adaptiveRecommendations}
              goals={goals}
              courses={courses}
              activeLesson={displayLesson}
              demoAccount={demoAccount}
              conceptMastery={conceptMastery}
            />
          );
        }
        return (
          <FigmaBlueprintView
            onNavigate={handleNavigate}
          />
        );

      case 'calculators':
        return (
          <FinancialCalculatorsView
            onNavigate={handleNavigate}
          />
        );

      case 'arena':
        return (
          <CompetitiveArenaView
            currentUser={user}
            onNavigate={handleNavigate}
          />
        );

      case 'admin':
        return (
          <AdminPortalView
            currentUser={user}
            courses={courses}
            topics={MOCK_TOPICS}
            lessons={lessons}
            lessonContents={lessonContents}
            lessonResources={lessonResources}
            quizzes={quizzes}
            questions={questions}
            mockExams={mockExams}
            certifications={certificationsList}
            achievements={achievements}
            learners={adminLearners.length > 0 ? adminLearners : [user]}
            onNavigate={handleNavigate}
            onUpdateLearners={setAdminLearners}
            onUpdateCourses={setCourses}
            onUpdateLessons={setLessons}
            onUpdateLessonContents={setLessonContents}
            onUpdateLessonResources={setLessonResources}
            onUpdateQuestions={setQuestions}
            onUpdateQuizzes={setQuizzes}
            onUpdateMockExams={setMockExams}
            onUpdateCertifications={setCertificationsList}
            onUpdateAchievements={setAchievementsList}
          />
        );

      default:
        return (
          <DashboardView
            user={user}
            onNavigate={handleNavigate}
            recommendations={MOCK_AI_RECOMMENDATIONS}
            goals={goals}
            courses={courses}
            activeLesson={displayLesson}
            demoAccount={demoAccount}
          />
        );
    }
  };

  return (
    <>
      {/* Switch Demo Account / Authentication Modal */}
      <AuthModal
        key={authModalMode}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* When on landing page, show full-width public landing page directly */}
      {currentView === 'landing' ? (
        <LandingPageView
          isAuthenticated={isAuthenticated}
          user={user}
          onOpenSignIn={handleOpenSignIn}
          onOpenSignUp={handleOpenSignUp}
          onOpenAdminSignIn={handleOpenAdminSignIn}
          onEnterApp={() => handleNavigate('dashboard')}
          onNavigateCourse={(courseId) => {
            const found = courses.find((c) => c.course_id === courseId);
            if (found) setActiveCourse(found);
            if (isAuthenticated) {
              handleNavigate('learn');
            } else {
              handleOpenSignUp();
            }
          }}
        />
      ) : currentView === 'admin' ? (
        /* Full Institutional Admin LMS / CMS Experience (Guarded) */
        adminService.hasAdminPrivileges(user) ? (
          <AdminPortalView
            currentUser={user}
            courses={courses}
            topics={MOCK_TOPICS}
            lessons={lessons}
            lessonContents={lessonContents}
            lessonResources={lessonResources}
            quizzes={quizzes}
            questions={questions}
            mockExams={mockExams}
            certifications={certificationsList}
            achievements={achievements}
            learners={adminLearners.length > 0 ? adminLearners : [user]}
            onNavigate={handleNavigate}
            onUpdateLearners={setAdminLearners}
            onUpdateCourses={setCourses}
            onUpdateLessons={setLessons}
            onUpdateLessonContents={setLessonContents}
            onUpdateLessonResources={setLessonResources}
            onUpdateQuestions={setQuestions}
            onUpdateQuizzes={setQuizzes}
            onUpdateMockExams={setMockExams}
            onUpdateCertifications={setCertificationsList}
            onUpdateAchievements={setAchievementsList}
          />
        ) : (
          <AppShell
            currentView="dashboard"
            onNavigate={handleNavigate}
            user={user}
            notifications={notifications}
            virtualBalance={demoAccount.virtual_balance}
            holdingsCount={holdings.length}
            onOpenAuth={handleOpenSignIn}
            onSignOut={handleSignOut}
          >
            <div className="p-8 max-w-xl mx-auto text-center space-y-4 rounded-3xl bg-white dark:bg-[#0B0F19] border border-rose-200 dark:border-rose-900/40 shadow-xl my-12">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
                Administrative Access Required
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Your account ({user.email}) does not have administrative permissions to access the LMS & CMS Management Portal.
              </p>
              <button
                onClick={() => handleNavigate('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-[#FF2E7E] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Return to Learner Dashboard
              </button>
            </div>
          </AppShell>
        )
      ) : (
        /* Main Authenticated Application Shell */
        <AppShell
          currentView={currentView}
          onNavigate={handleNavigate}
          user={user}
          notifications={notifications}
          virtualBalance={demoAccount.virtual_balance}
          holdingsCount={holdings.length}
          onOpenAuth={handleOpenSignIn}
          onSignOut={handleSignOut}
        >
          {renderCurrentView()}
        </AppShell>
      )}
    </>
  );
}
