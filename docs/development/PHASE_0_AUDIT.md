# Phase 0 — Repository Audit Document

**Project**: FinanceX
**Status**: `COMPLETE`
**Date**: September 6, 2026

---

## 1. Architecture Summary
- **Frontend Stack**: React 19, TypeScript (~5.8.2), Vite 6.2.
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css`), Framer Motion 12, Lucide React icons.
- **Application Structure**:
  - `src/App.tsx`: Main application coordinator, state container, and view router.
  - `src/types/schema.ts`: 34 domain interface definitions.
  - `src/data/mockData.ts`: 31 mock entity exports serving as temporary frontend data source.
  - `src/components/`: 21 domain component directories (landing, dashboard, learn, quizzes, mockExams, practiceLab, aiTutor, certifications, studyPlans, community, goals, achievements, notifications, profile, settings, auth, onboarding, brand, layout, blueprint, moneyEvolution).

## 2. Mock Data Inventory
All 34 database entities are represented in `src/data/mockData.ts`:
- User & Knowledge: `MOCK_CURRENT_USER`, `MOCK_KNOWLEDGE_LEVELS`, `MOCK_USER_SOCIAL_LINKS`
- Gamification & Progress: `MOCK_ACHIEVEMENTS`, `MOCK_USER_ACHIEVEMENTS`, `MOCK_GOALS`, `MOCK_NOTIFICATIONS`
- Learning Curriculum: `MOCK_TOPICS`, `MOCK_COURSES`, `MOCK_LESSONS`, `MOCK_LESSON_CONTENTS`, `MOCK_LESSON_RESOURCES`
- Assessment & Certifications: `MOCK_QUESTIONS`, `MOCK_QUIZZES`, `MOCK_QUIZ_ATTEMPTS`, `MOCK_EXAMS`, `MOCK_EXAM_ATTEMPTS`, `MOCK_CERTIFICATIONS`, `MOCK_CERTIFICATES`
- Study & Community: `MOCK_STUDY_PLANS`, `MOCK_DISCUSSION_THREADS`, `MOCK_DISCUSSION_REPLIES`
- AI System: `MOCK_AI_RECOMMENDATIONS`
- Paper Trading: `MOCK_DEMO_ACCOUNT`, `MOCK_INSTRUMENTS`, `MOCK_DEMO_HOLDINGS`, `MOCK_DEMO_TRANSACTIONS`

## 3. Backend Integration Points
1. **Authentication**: `src/components/auth/AuthModal.tsx` → `src/services/authService.ts` → `supabase.auth`.
2. **Profile & User Data**: `src/App.tsx` state `user` → `authService.getProfile`.
3. **Curriculum & Progress**: `CourseCatalogView` & `LessonView` → `src/services/courseService.ts`.
4. **Quizzes & Mock Exams**: `QuizRunner` & `MockExamRunner` → `src/services/quizService.ts` & `src/services/examService.ts`.
5. **Paper Trading**: `PracticeLabView` → `src/services/tradingService.ts`.
6. **AI Tutor**: `AITutorView` → `src/services/aiService.ts`.
7. **Community**: `CommunityView` → `src/services/communityService.ts`.
8. **Goals & Study Plans**: `GoalsView` & `StudyPlansView` → `src/services/goalService.ts`.
9. **Notifications**: `NotificationsView` → `src/services/notificationService.ts`.

## 4. Phase 0 Gate Checklist
- [x] Repository structure audited
- [x] Mock data locations cataloged
- [x] Component dependencies mapped
- [x] Service abstraction boundary planned
- [x] Zero breaking UI changes rule confirmed
