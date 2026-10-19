# FinanceX Phase 18 — Mock Data Migration Matrix

This matrix inventories every mock dataset and fallback dependency across FinanceX, establishing the production migration strategy, service integration layer, and allowable fallback classification.

---

## Migration Matrix

| # | Feature / Domain | Current Source | Service Module | Supabase Table(s) | Production Ready? | Fallback Allowed? | Action |
|---|---|---|---|---|---|---|---|
| 1 | **Knowledge Levels** | `MOCK_KNOWLEDGE_LEVELS` | `authService` | `public.knowledge_levels` | **YES** | YES (Guest/Demo) | Fetch live levels from Supabase; fallback for onboarding demo |
| 2 | **Topics Catalog** | `MOCK_TOPICS` | `courseService` | `public.topics` | **YES** | YES (Guest/Demo) | Query live `topics` table; populate catalog filters |
| 3 | **Certifications Catalog** | `MOCK_CERTIFICATIONS` | `examService` | `public.certifications` | **YES** | YES (Guest/Demo) | Query live `certifications` table |
| 4 | **Courses Catalog** | `MOCK_COURSES` | `courseService` | `public.courses` | **YES** | YES (Guest/Demo) | Query live `courses` table; map to `CourseCatalogView` |
| 5 | **Lessons Catalog** | `MOCK_LESSONS` | `courseService` | `public.lessons` | **YES** | YES (Guest/Demo) | Query live `lessons` table per course |
| 6 | **Lesson Content** | `MOCK_LESSON_CONTENTS` | `courseService` | `public.lesson_content` | **YES** | YES (Guest/Demo) | Query live `lesson_content` with markdown & formulas |
| 7 | **Lesson Resources** | `MOCK_LESSON_RESOURCES` | `courseService` | `public.lesson_resources` | **YES** | YES (Guest/Demo) | Query live `lesson_resources` for download links |
| 8 | **Quizzes Catalog** | `MOCK_QUIZZES` | `quizService` | `public.quizzes` | **YES** | YES (Guest/Demo) | Query live `quizzes` table |
| 9 | **Quiz Questions** | `MOCK_QUESTIONS` | `quizService` | `public.questions`, `quiz_questions` | **YES** | YES (Guest/Demo) | Query live questions mapped by `quiz_id` |
| 10 | **Mock Exams Catalog** | `MOCK_EXAMS` | `examService` | `public.mock_exams` | **YES** | YES (Guest/Demo) | Query live `mock_exams` table |
| 11 | **Mock Exam Questions** | `MOCK_QUESTIONS` | `examService` | `public.questions`, `mock_exam_questions` | **YES** | YES (Guest/Demo) | Query live exam questions with negative marking |
| 12 | **Instruments Catalog** | `MOCK_INSTRUMENTS` | `tradingService` | `public.instruments` | **YES** | YES (Guest/Demo) | Query live `instruments` table with reference prices |
| 13 | **Achievements Catalog** | `MOCK_ACHIEVEMENTS` | `authService` | `public.achievements` | **YES** | YES (Guest/Demo) | Query live `achievements` badge definitions |
| 14 | **User Profile** | `MOCK_CURRENT_USER` | `authService` | `public.profiles` | **YES** | YES (Guest/Demo) | Load authenticated user profile from `auth.users` / `profiles` |
| 15 | **User Lesson Progress** | Local state | `courseService` | `public.user_lesson_progress` | **YES** | NO (Authenticated) | Persist & fetch progress via `user_lesson_progress` upserts |
| 16 | **Quiz Attempts** | `MOCK_QUIZ_ATTEMPTS` | `quizService` | `public.quiz_attempts` | **YES** | NO (Authenticated) | Insert real completed attempts to `quiz_attempts` |
| 17 | **Mock Exam Attempts** | `MOCK_EXAM_ATTEMPTS` | `examService` | `public.mock_exam_attempts` | **YES** | NO (Authenticated) | Insert real completed attempts to `mock_exam_attempts` |
| 18 | **User Goals** | `MOCK_GOALS` | `goalService` | `public.goals` | **YES** | YES (Guest/Demo) | Query & mutate goals in `public.goals` by `user_id` |
| 19 | **Notifications** | `MOCK_NOTIFICATIONS` | `notificationService` | `public.notifications` | **YES** | YES (Guest/Demo) | Query & update read status in `public.notifications` |
| 20 | **Discussion Community** | `MOCK_DISCUSSION_THREADS` | `communityService` | `public.discussion_threads`, `replies` | **YES** | YES (Guest/Demo) | Query live forum threads & post authenticated replies |
| 21 | **Paper Trading Account** | `MOCK_DEMO_ACCOUNT` | `tradingService` | `public.demo_accounts` | **YES** | YES (Guest/Demo) | Authoritative balance loaded from `demo_accounts` |
| 22 | **Holdings & Portfolio** | `MOCK_DEMO_HOLDINGS` | `tradingService` | `public.demo_holdings` | **YES** | YES (Guest/Demo) | Authoritative portfolio loaded from `demo_holdings` |
| 23 | **Transactions Ledger** | `MOCK_DEMO_TRANSACTIONS` | `tradingService` | `public.demo_transactions` | **YES** | YES (Guest/Demo) | Authoritative transactions from `demo_transactions` |
| 24 | **Trade Order Execution** | Local client mutation | `tradingService` | `execute_paper_trade` (RPC) | **YES** | NO (Authenticated) | Execute atomic server-side RPC procedure |
| 25 | **AI Tutor Generative API** | Local heuristics | `aiService` | Supabase Edge Function (`gemini-tutor`) | **YES** | YES (Offline fallback) | Proxy requests to Gemini via Edge Function |

---

## Fallback Classification Policy
1. **Explicit Guest / Demo Mode**: When the user browses without logging in, the app uses clean baseline educational records and a sandbox demo portfolio.
2. **Defensive Network Exception Handler**: If a network drop or offline condition occurs, services safely return structured data rather than throwing unhandled exceptions that break the React component tree.
3. **Production Authenticated Mode**: When authenticated, all user data (profile, streak, XP, progress, attempts, goals, notifications, holdings, transactions) is strictly read from and written to Supabase PostgreSQL with RLS enforcement.
