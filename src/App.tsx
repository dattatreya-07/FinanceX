import React, { useState } from 'react';
import { AppNavView, User, Course, Lesson, Quiz, MockExam, Goal, Notification, DemoHolding, DemoTransaction, DemoAccount, Achievement, UserAchievement, Certificate, QuizAttempt, MockExamAttempt } from './types/schema';
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

// Brand & Layout
import { BootExperience } from './components/brand/BootExperience';
import { AppShell } from './components/layout/AppShell';
import { AuthModal } from './components/auth/AuthModal';
import { PersonalizationFlow, UserPreferences } from './components/onboarding/PersonalizationFlow';
import { MoneyEvolutionJourney } from './components/moneyEvolution/MoneyEvolutionJourney';
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
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMoneyEvolutionOpen, setIsMoneyEvolutionOpen] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<AppNavView>('landing');
  const [user, setUser] = useState<User>(MOCK_CURRENT_USER);

  // Curriculum State
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [lessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [activeCourse, setActiveCourse] = useState<Course>(MOCK_COURSES[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson>(MOCK_LESSONS[1]); // Default to Lesson 2 (Option Greeks)

  // Quiz & Mock Exam State
  const [quizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizScoreResult, setQuizScoreResult] = useState<{ score: number; totalQuestions: number; correctCount: number } | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(MOCK_QUIZ_ATTEMPTS);

  const [mockExams] = useState<MockExam[]>(MOCK_EXAMS);
  const [activeMockExam, setActiveMockExam] = useState<MockExam | null>(null);
  const [mockExamStatsResult, setMockExamStatsResult] = useState<{
    score: number;
    totalMarks: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    timeSpentMins: number;
  } | null>(null);
  const [mockExamAttempts, setMockExamAttempts] = useState<MockExamAttempt[]>(MOCK_EXAM_ATTEMPTS);

  // Simulation & Paper Trading State
  const [demoAccount, setDemoAccount] = useState<DemoAccount>(MOCK_DEMO_ACCOUNT);
  const [instruments] = useState(MOCK_INSTRUMENTS);
  const [holdings, setHoldings] = useState<DemoHolding[]>(MOCK_DEMO_HOLDINGS);
  const [transactions, setTransactions] = useState<DemoTransaction[]>(MOCK_DEMO_TRANSACTIONS);

  // Goals, Badges & Notifications
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [achievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(MOCK_USER_ACHIEVEMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // AI Tutor Prompt Handoff
  const [aiTutorPrompt, setAiTutorPrompt] = useState<string>('');

  // Navigation Handler
  const handleNavigate = (view: AppNavView, payload?: any) => {
    if (view === 'money-evolution') {
      setIsMoneyEvolutionOpen(true);
      return;
    }

    if (view === 'learn' && payload) {
      if (payload.course) setActiveCourse(payload.course);
      if (payload.lesson) setActiveLesson(payload.lesson);
    }

    if (view === 'ai-tutor' && payload?.prompt) {
      setAiTutorPrompt(payload.prompt);
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

  // Trade Execution
  const handleExecuteTrade = (trade: {
    instrumentId: number;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
  }) => {
    const totalAmount = trade.quantity * trade.price;

    if (trade.type === 'BUY') {
      if (demoAccount.virtual_balance < totalAmount) {
        alert('Insufficient virtual balance to execute this trade.');
        return;
      }

      setDemoAccount((prev) => ({
        ...prev,
        virtual_balance: prev.virtual_balance - totalAmount
      }));

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
      const existing = holdings.find((h) => h.instrument_id === trade.instrumentId);
      if (!existing || existing.quantity < trade.quantity) {
        alert('Cannot sell more shares than currently held.');
        return;
      }

      setDemoAccount((prev) => ({
        ...prev,
        virtual_balance: prev.virtual_balance + totalAmount
      }));

      setHoldings((prev) => {
        return prev
          .map((h) => {
            if (h.instrument_id === trade.instrumentId) {
              return { ...h, quantity: h.quantity - trade.quantity };
            }
            return h;
          })
          .filter((h) => h.quantity > 0);
      });
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

    // Award XP and check first trade achievement
    setUser((prev) => ({ ...prev, xp_points: (prev.xp_points || 840) + 50 }));
  };

  // Reset Paper Trading Portfolio
  const handleResetPaperPortfolio = () => {
    setDemoAccount({
      demo_account_id: 1,
      user_id: user.user_id,
      virtual_balance: 1000000.00,
      currency: 'INR',
      initial_capital: 1000000.00
    });
    setHoldings([]);
    setTransactions([]);
  };

  // Goal handlers
  const handleAddGoal = (newGoal: Omit<Goal, 'goal_id'>) => {
    const created: Goal = {
      ...newGoal,
      goal_id: Date.now()
    };
    setGoals((prev) => [created, ...prev]);
  };

  const handleToggleGoalStatus = (goalId: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.goal_id === goalId) {
          const isComp = g.status === 'COMPLETED';
          return {
            ...g,
            status: isComp ? 'IN_PROGRESS' : 'COMPLETED',
            current_progress_percent: isComp ? 40 : 100
          };
        }
        return g;
      })
    );
  };

  // Notifications handlers
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleNotificationRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, read: !n.read } : n))
    );
  };

  // Auth / Switch Demo Account
  const handleAuthSuccess = (userData: { email: string; name: string; isNewUser?: boolean }) => {
    setUser((prev) => ({
      ...prev,
      email: userData.email,
      full_name: userData.name
    }));
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    if (userData.isNewUser) {
      setIsOnboarding(true);
    } else {
      handleNavigate('dashboard');
    }
  };

  // Onboarding completion
  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setIsOnboarding(false);
    setUser((prev) => ({
      ...prev,
      knowledge_level_id: prefs.knowledgeLevel === 'Novice Saver' ? 1 : prefs.knowledgeLevel === 'Market Explorer' ? 2 : 3
    }));
    handleNavigate('dashboard');
  };

  // Quiz completion
  const handleQuizComplete = (score: number, totalQuestions: number, correctCount: number) => {
    setQuizScoreResult({ score, totalQuestions, correctCount });
    if (activeQuiz) {
      setQuizAttempts((prev) => [
        {
          attempt_id: Date.now(),
          user_id: user.user_id,
          quiz_id: activeQuiz.quiz_id,
          score,
          completed_at: new Date().toISOString().substring(0, 10),
          total_questions: totalQuestions,
          correct_answers: correctCount
        },
        ...prev
      ]);
    }
    // Add XP
    setUser((prev) => ({ ...prev, xp_points: (prev.xp_points || 840) + 100 }));
  };

  // Mock Exam completion
  const handleMockExamComplete = (stats: {
    score: number;
    totalMarks: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    timeSpentMins: number;
  }) => {
    setMockExamStatsResult(stats);
    if (activeMockExam) {
      setMockExamAttempts((prev) => [
        {
          attempt_id: Date.now(),
          user_id: user.user_id,
          exam_id: activeMockExam.exam_id,
          score: stats.score,
          passed: stats.passed ? 'YES' : 'NO',
          completed_at: new Date().toISOString().substring(0, 10),
          time_spent_mins: stats.timeSpentMins,
          accuracy_percent: parseFloat(((stats.correctCount / (stats.correctCount + stats.wrongCount || 1)) * 100).toFixed(1))
        },
        ...prev
      ]);
    }
    // Add XP
    setUser((prev) => ({ ...prev, xp_points: (prev.xp_points || 840) + 250 }));
  };

  // Current lesson content and resources
  const activeContent = MOCK_LESSON_CONTENTS.find((c) => c.lesson_id === activeLesson.lesson_id) || MOCK_LESSON_CONTENTS[0];
  const activeResources = MOCK_LESSON_RESOURCES.filter((r) => r.lesson_id === activeLesson.lesson_id);
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
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            user={user}
            onNavigate={handleNavigate}
            recommendations={MOCK_AI_RECOMMENDATIONS}
            goals={goals}
            courses={courses}
            activeLesson={activeLesson}
            demoAccount={demoAccount}
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
            lesson={activeLesson}
            course={activeCourse}
            allLessons={lessons.filter((l) => l.course_id === activeCourse.course_id)}
            content={activeContent}
            resources={activeResources}
            onSelectLesson={(l) => setActiveLesson(l)}
            onNavigate={handleNavigate}
            onOpenAIWithContext={(topic) => {
              setAiTutorPrompt(`Please explain key concepts and numerical examples for: ${topic}`);
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
              onNavigate={(v) => {
                setQuizScoreResult(null);
                setActiveQuiz(null);
                handleNavigate(v);
              }}
            />
          );
        }
        if (activeQuiz) {
          const quizQuestions = MOCK_QUESTIONS.filter((q) => q.topic_id === activeQuiz.topic_id);
          return (
            <QuizRunner
              quiz={activeQuiz}
              questions={quizQuestions.length > 0 ? quizQuestions : MOCK_QUESTIONS.slice(0, 5)}
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
              onNavigate={(v) => {
                setMockExamStatsResult(null);
                setActiveMockExam(null);
                handleNavigate(v);
              }}
            />
          );
        }
        if (activeMockExam) {
          return (
            <MockExamRunner
              exam={activeMockExam}
              questions={MOCK_QUESTIONS}
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
            certifications={MOCK_CERTIFICATIONS}
            onNavigate={handleNavigate}
          />
        );

      case 'study-plans':
        return (
          <StudyPlansView
            studyPlans={MOCK_STUDY_PLANS}
            onNavigate={handleNavigate}
          />
        );

      case 'community':
        return (
          <CommunityView
            threads={MOCK_DISCUSSION_THREADS}
            replies={MOCK_DISCUSSION_REPLIES}
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
            certificates={MOCK_CERTIFICATES}
            certifications={MOCK_CERTIFICATIONS}
            socialLinks={MOCK_USER_SOCIAL_LINKS}
            knowledgeLevel={currentKnowledgeLevel}
            onNavigate={handleNavigate}
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
        return (
          <FigmaBlueprintView
            onNavigate={handleNavigate}
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
            activeLesson={activeLesson}
            demoAccount={demoAccount}
          />
        );
    }
  };

  return (
    <>
      {/* 9-Chapter Evolution of Money Story Modal */}
      {isMoneyEvolutionOpen && (
        <MoneyEvolutionJourney
          onComplete={() => setIsMoneyEvolutionOpen(false)}
          onSkip={() => setIsMoneyEvolutionOpen(false)}
        />
      )}

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
      ) : (
        /* Main Authenticated Application Shell */
        <AppShell
          currentView={currentView}
          onNavigate={handleNavigate}
          user={user}
          notifications={notifications}
          onOpenAuth={handleOpenSignIn}
          onOpenMoneyEvolution={() => setIsMoneyEvolutionOpen(true)}
        >
          {renderCurrentView()}
        </AppShell>
      )}
    </>
  );
}
