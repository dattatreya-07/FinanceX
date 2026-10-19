# FinanceX Phase 19 — End-to-End Real User Validation Test Plan

**Document Version**: 1.0.0  
**Target Environment**: Live Remote Supabase (`https://timegqdfnokfzsupawuo.supabase.co`) + React TypeScript Production Application  
**Execution Objective**: Validate real authenticated and unauthenticated user journeys across the full stack (React ➔ Service Layer ➔ Supabase / RPC / Edge Functions ➔ PostgreSQL 15) with zero fabricated mock successes.

---

## 1. Test Scenarios Definition

### Scenario A: New User Onboarding Journey
- **Objective**: Verify that a brand new user can sign up via Supabase Auth, trigger automated profile creation, complete the onboarding questionnaire, and land on the personalized dashboard with initial XP, streak, and a clean state.
- **Expected Outcome**: New row in `auth.users`, matching row in `public.profiles`, initial knowledge level assigned, default demo account provisioned.

### Scenario B: Returning User Authenticated Session
- **Objective**: Verify that an existing user can log in, restore their persisted profile, custom learning streak, progress, portfolio, and notification count, and that page reloads preserve the active JWT session without regression to mock state.
- **Expected Outcome**: Session restored from `localStorage` / Supabase auth tokens; data fetched directly from PostgreSQL.

### Scenario C: Guest / Unauthenticated Mode
- **Objective**: Verify that an unauthenticated guest can navigate the landing page, view the public course catalog, open the interactive demo showcase, and preview simulation components without error, but cannot execute authenticated operations or access private user data.
- **Expected Outcome**: Public catalogs render via open RLS read policies; private mutations prompt authentication modal.

### Scenario D: Invalid & Failed Request Handling
- **Objective**: Verify system resilience against malformed inputs, nonexistent IDs, network drops, and edge-case parameters.
- **Expected Outcome**: UI renders structured error/empty states instead of crashing or silently substituting fake mock data.

### Scenario E: Multi-User Isolation & RLS Security Boundary
- **Objective**: Using two distinct test accounts (`USER_A` and `USER_B`), prove that `USER_A` cannot read, modify, or delete `USER_B`'s profile, lesson progress, quiz attempts, goals, notifications, AI conversations, or trading portfolio.
- **Expected Outcome**: Supabase RLS returns empty sets or permission errors when querying another user's private data.

### Scenario F: Paper Trading & Financial Authority
- **Objective**: Validate the server-side PostgreSQL stored procedure `execute_paper_trade` for:
  1. Valid Buy order (cash deduction, holdings increment, transaction ledger insertion).
  2. Valid Sell order (cash credit, holdings decrement/removal, transaction ledger insertion).
  3. Insufficient Funds rejection (server-side balance guard).
  4. Invalid Quantity rejection (negative/zero quantity guard).
  5. Unauthorized / Guest rejection.
- **Expected Outcome**: PostgreSQL is the single source of financial truth; browser state is purely presentational.

### Scenario G: AI Tutor & Edge Function Integration
- **Objective**: Verify AI Tutor communication flow through Supabase Edge Function proxy to Google Gemini without exposing client-side API keys.
- **Expected Outcome**: Zero occurrences of `VITE_GEMINI_API_KEY` in frontend bundles; authenticated requests pass Bearer token to Edge Function; graceful offline fallback when offline.

### Scenario H: Learning Curriculum Progression
- **Objective**: Navigate Dashboard ➔ Courses ➔ Lesson ➔ Complete Lesson. Persist completion to `public.user_lesson_progress`. Refresh and verify persistence.
- **Expected Outcome**: `user_lesson_progress` table records row with `is_completed = true`; dashboard reflects updated progress percentage.

### Scenario I: Assessment & Quiz Engine
- **Objective**: Start quiz, submit answers, calculate score, persist attempt to `public.quiz_attempts`, verify attempt history after reload.
- **Expected Outcome**: Attempt persisted with correct score, percentage, and user ID.

### Scenario J: Mock Exam Engine with Negative Marking
- **Objective**: Start mock exam, answer questions, submit, verify server/client negative marking calculation (e.g. +1 for correct, -0.25 for incorrect), persist attempt to `public.mock_exam_attempts`.
- **Expected Outcome**: Attempt stored in database with accurate net score and time spent.

### Scenario K: Certifications & Certificate Issuance
- **Objective**: Query certification series catalog, evaluate readiness metrics, verify user certificate ownership.
- **Expected Outcome**: Live certifications loaded from `public.certifications`; user certificates bound by `user_id`.

### Scenario L: Gamification Engine (XP, Streak, Achievements)
- **Objective**: Trigger learning/quiz actions, award XP, update streak, unlock badges in `public.user_achievements`.
- **Expected Outcome**: Real database records in `user_achievements` and updated `profiles.xp_points`.

### Scenario M: Goals Management
- **Objective**: Create learning/financial goal in `public.goals`, update target progress, mark complete, verify persistence.
- **Expected Outcome**: CRUD operations succeed with user ownership enforced by RLS.

### Scenario N: Notifications Inbox
- **Objective**: Query user notifications from `public.notifications`, mark as read, verify unread badge updates.
- **Expected Outcome**: Real notification rows loaded and updated per authenticated user.

### Scenario O: Community Discussions
- **Objective**: Fetch forum threads, post a new thread or reply as an authenticated user, verify author attribution.
- **Expected Outcome**: Thread/reply stored in `public.discussion_threads` / `public.discussion_replies` with matching `user_id`.

---

## 2. Test Execution Methodology

Automated end-to-end integration test scripts will run directly against the live Supabase instance using `@supabase/supabase-js` to:
1. Create and authenticate isolated test users.
2. Execute all real database read/write queries and RPC calls.
3. Validate RLS boundary enforcement between `USER_A` and `USER_B`.
4. Verify schema constraints, foreign keys, and transaction atomicity.
5. Inspect codebase for mock data dependencies and security token exposure.
6. Verify production build and type integrity.
