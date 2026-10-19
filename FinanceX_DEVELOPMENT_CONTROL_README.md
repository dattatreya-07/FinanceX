# FinanceX

> Interactive Financial Learning, Practice, Certification, Analytics, AI Tutor, Community & Paper Trading Platform

---

# 🚨 DEVELOPMENT CONTROL DOCUMENT

This README is the primary development-control document for the FinanceX project.

All AI agents, developers, and automated coding tools working on this repository MUST follow the development phases, rules, checkpoints, and verification requirements defined here.

The goal is to evolve FinanceX from its existing frontend implementation into a production-ready application backed by Supabase/PostgreSQL without unnecessarily breaking or redesigning the existing product.

---

# 1. PROJECT OBJECTIVE

FinanceX follows the core learning cycle:

**Learn → Practice → Test → Analyze → Improve → Achieve → Learn**

The platform combines:

- Financial education
- Courses
- Lessons
- Interactive learning
- Practice questions
- Daily/practice quizzes
- Mock examinations
- Certification preparation
- Certificates
- Learning analytics
- Goals
- Study plans
- Achievements
- XP/gamification
- AI Tutor
- AI recommendations
- Community discussions
- Notifications
- Paper trading
- User profiles
- Progress tracking

The existing frontend is the current product/UI reference.

The approved FinanceX database schema is the backend data contract.

---

# 2. AUTHORITATIVE SOURCES

Development must follow this priority:

1. Final approved FinanceX database schema document
2. Existing FinanceX repository implementation
3. This README
4. Explicit developer/user instructions
5. Agent assumptions

Never silently override an approved database decision.

If two sources conflict, STOP and report the conflict instead of silently changing the architecture.

---

# 3. DATABASE CONTRACT

The attached/final FinanceX database schema document is the authoritative source for the database structure.

It defines the approved FinanceX PostgreSQL/Supabase data model.

## Database rules

Agents MUST NOT:

- Invent tables unnecessarily
- Remove approved tables
- Rename approved tables without approval
- Change approved relationships without approval
- Change field meaning without approval
- Introduce an alternative database architecture
- Recreate the database using a different database engine
- Store sensitive authentication credentials in application tables

The database schema must be treated as a contract.

If the frontend does not perfectly match the database contract, use an appropriate service/adapter layer rather than silently changing the database.

---

# 4. TECHNOLOGY DIRECTION

FinanceX backend direction:

```text
React + TypeScript
        ↓
FinanceX Service Layer
        ↓
Supabase
   ├── Auth
   ├── PostgreSQL
   ├── Storage
   ├── Realtime
   └── Edge Functions
```

The frontend should not become tightly coupled to raw database queries.

Preferred architecture:

```text
UI
 ↓
Hooks / Application Logic
 ↓
Service Layer
 ↓
Supabase
 ↓
PostgreSQL
```

Sensitive business operations should use secure server-side logic.

---

# 5. DEVELOPMENT PRINCIPLES

## Principle 1 — Do not break working features

The existing frontend is a valuable product reference.

Do not rewrite working functionality simply for stylistic reasons.

## Principle 2 — Small controlled changes

Prefer:

```text
Understand
↓
Plan
↓
Implement
↓
Verify
↓
Checkpoint
↓
Continue
```

over:

```text
Change everything
↓
Hope it works
```

## Principle 3 — No blind coding

Before making major changes, inspect:

- repository structure
- related components
- types
- services
- mock data
- existing state management
- routing
- authentication
- dependencies

## Principle 4 — No fake completion

Never report a feature as complete unless it has actually been implemented and verified.

Use:

- `COMPLETE`
- `PARTIALLY COMPLETE`
- `BLOCKED`
- `NOT STARTED`

when reporting progress.

## Principle 5 — Preserve UI

Backend integration must not unnecessarily redesign:

- layout
- colors
- animations
- navigation
- typography
- responsive behavior
- dark/light theme
- existing user experience

Backend integration should feel invisible to the user.

---

# 6. DEVELOPMENT PHASES

```text
PHASE 0  → Repository Audit
PHASE 1  → Supabase Foundation
PHASE 2  → Database Implementation
PHASE 3  → Authentication
PHASE 4  → Core Data / Service Layer
PHASE 5  → Learning System
PHASE 6  → Assessment System
PHASE 7  → Certification & Study System
PHASE 8  → Gamification / Goals / Notifications
PHASE 9  → Community
PHASE 10 → AI System
PHASE 11 → Paper Trading
PHASE 12 → Mock Data Removal
PHASE 13 → Security / RLS / Hardening
PHASE 14 → Testing / QA
PHASE 15 → Production Readiness
```

---

# 7. 🚦 PHASE GATE SYSTEM

An agent MUST NOT automatically jump from one phase to the next.

A phase is complete only when:

```text
Implementation
+
Verification
+
No critical errors
+
Documentation
+
Checkpoint
```

If a phase is blocked:

**STOP.**

Report:

1. What is blocked
2. Why it is blocked
3. What is required
4. What should NOT be changed

Do not bypass the gate.

---

# 8. PHASE 0 — REPOSITORY AUDIT

## Objective

Understand the existing FinanceX application before changing it.

## Tasks

Inspect:

- project structure
- package configuration
- React entry points
- App architecture
- routing
- authentication
- components
- pages/views
- hooks
- contexts
- types
- mock data
- utility functions
- existing services
- state management
- environment configuration

Identify all mock/demo data.

Identify all places where frontend state currently acts as a fake backend.

## Deliverable

Create:

```text
docs/development/PHASE_0_AUDIT.md
```

Include:

- Current architecture
- Mock data locations
- Authentication implementation
- Backend integration points
- Potential conflicts
- Files likely to change
- Recommended implementation order

## Gate

Do not proceed until the audit is complete.

---

# 9. PHASE 1 — SUPABASE FOUNDATION

## Objective

Connect the project to Supabase safely.

## Tasks

- Install/configure Supabase client
- Configure environment variables
- Create centralized Supabase client
- Add `.env.example`
- Verify environment loading
- Ensure secrets are not committed

Expected environment configuration:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Use the project's existing environment conventions if different.

## Security

Never expose service-role or secret keys to the frontend.

## Verification

Confirm:

- application starts
- Supabase client initializes
- environment variables load
- no credentials are hardcoded
- TypeScript passes
- build passes

## Gate

Supabase connection must be verified before proceeding.

---

# 10. PHASE 2 — DATABASE IMPLEMENTATION

## Objective

Implement the approved database schema in Supabase/PostgreSQL.

## Tasks

Implement the approved schema exactly.

Include where appropriate:

- tables
- primary keys
- foreign keys
- unique constraints
- check constraints
- indexes
- timestamps
- triggers
- database functions

Create migrations in a controlled manner.

Recommended structure:

```text
supabase/
  migrations/
```

Do not manually modify production database state without maintaining migration history.

## Verification

Verify:

- migrations apply successfully
- tables exist
- relationships work
- constraints work
- indexes exist
- no accidental schema changes exist

## Gate

Database structure must match the approved schema.

---

# 11. PHASE 3 — AUTHENTICATION

## Objective

Replace fake authentication with real Supabase Auth.

## Tasks

Implement:

- sign up
- sign in
- sign out
- session restoration
- protected routes
- authentication state
- password reset where supported by the existing UX
- user profile synchronization

Authentication credentials must be handled by Supabase Auth.

Do not create a custom password system.

## Verification

Test:

```text
New user
Existing user
Invalid credentials
Logout
Refresh
Session restoration
Expired session
Protected route
```

## Gate

Authentication must work before private application data is connected.

---

# 12. PHASE 4 — CORE DATA / SERVICE LAYER

## Objective

Create a clean bridge between React and Supabase.

Create domain services such as:

```text
services/
  profileService
  topicService
  courseService
  lessonService
  progressService
  questionService
  quizService
  examService
  certificationService
  goalService
  achievementService
  studyPlanService
  notificationService
  communityService
  aiService
  tradingService
```

Use the project's architecture where appropriate.

## Rule

React components should not become collections of raw database queries.

Prefer:

```text
Component
 ↓
Hook / Service
 ↓
Supabase
```

---

# 13. PHASE 5 — LEARNING SYSTEM

## Objective

Connect the educational content to the real database.

Implement progressively:

- topics
- courses
- lessons
- lesson content
- lesson resources
- user lesson progress

Replace corresponding mock data.

## Required behavior

Users should be able to:

- browse courses
- open lessons
- consume lesson content
- access resources
- track progress
- complete lessons
- resume lessons

Progress must be user-specific.

Never treat lesson completion as a global property of the lesson itself.

---

# 14. PHASE 6 — ASSESSMENT SYSTEM

## Objective

Connect quizzes and examinations.

Implement:

- question bank
- quizzes
- quiz questions
- quiz attempts
- quiz attempt answers
- mock exams
- mock exam questions
- mock exam attempts
- mock exam attempt answers

## Critical rule

The client must not be the final authority for scoring sensitive assessment results.

Support server-side/trusted scoring where required.

Persist enough information to support:

- review
- accuracy
- topic analysis
- weak areas
- historical attempts
- recommendations

---

# 15. PHASE 7 — CERTIFICATION & STUDY SYSTEM

Connect:

- certifications
- certificates
- study plans
- study plan items

Implement:

- certification selection
- preparation plans
- study timelines
- completion tracking
- certificate records
- certificate verification where supported

Do not fabricate certificates or certificate numbers.

---

# 16. PHASE 8 — GAMIFICATION / GOALS / NOTIFICATIONS

Connect:

- achievements
- user achievements
- goals
- notifications

Implement appropriate backend logic for:

- XP
- achievement unlocking
- streak-related behavior
- goals
- goal status
- notifications
- read/unread state

Do not blindly trust client-side XP or achievement claims.

---

# 17. PHASE 9 — COMMUNITY

Connect:

- discussion threads
- discussion replies

Implement:

- thread creation
- thread listing
- thread viewing
- replies
- ownership/security
- timestamps
- appropriate loading/error states

Protect private/user-owned operations with authorization.

---

# 18. PHASE 10 — AI SYSTEM

## Objective

Move AI functionality from simulated frontend behavior to secure backend integration.

Architecture:

```text
FinanceX UI
    ↓
Secure backend / Edge Function
    ↓
AI provider
    ↓
FinanceX database
```

Never expose AI provider secrets in React.

Connect:

- AI conversations
- AI messages
- AI recommendations

AI recommendations should be based on real FinanceX learning/performance data once the assessment system is operational.

Do not fabricate production AI results.

---

# 19. PHASE 11 — PAPER TRADING

## Objective

Make FinanceX Practice Lab/paper trading backend-authoritative.

Connect:

- instruments
- demo accounts
- demo holdings
- demo transactions

## CRITICAL SECURITY RULE

The frontend must never be trusted to directly control:

- virtual balance
- holdings
- trade validity
- transaction execution
- authoritative portfolio state

Trade execution should follow:

```text
User
 ↓
BUY / SELL request
 ↓
Secure backend operation
 ↓
Validate
 ↓
Execute transaction
 ↓
Update account/holdings
 ↓
Commit atomically
 ↓
Return authoritative result
```

Do not implement insecure client-side balance manipulation.

---

# 20. PHASE 12 — MOCK DATA REMOVAL

Only after real backend functionality has been verified.

Audit:

```text
mockData.ts
```

and all other mock/demo sources.

For every mock value:

```text
MOCK
 ↓
REAL DATABASE/SERVICE
```

Remove mock dependencies feature by feature.

Do not delete the mock data file until all dependencies have been identified.

At the end:

```text
No production feature
should depend on mock data.
```

Development/demo fixtures may remain separately if explicitly required.

---

# 21. PHASE 13 — SECURITY / RLS / HARDENING

Review every Supabase table.

Determine:

- public read access
- authenticated read access
- owner-only access
- admin-only access
- server-only operations

Verify Row Level Security.

Examples:

```text
User A
  ↓
Can access User A private data

User A
  X
Cannot access User B private data
```

Check:

- profiles
- goals
- progress
- attempts
- certificates
- study plans
- AI conversations
- notifications
- community ownership
- demo accounts
- holdings
- transactions

Never assume frontend route protection is sufficient security.

---

# 22. PHASE 14 — TESTING / QA

Run:

- TypeScript checks
- lint
- build
- unit tests if available
- integration tests if available
- authentication tests
- database tests
- RLS tests
- critical user-flow tests

## Critical user flows

### Authentication

```text
Sign up
 ↓
Profile
 ↓
Dashboard
```

### Learning

```text
Course
 ↓
Lesson
 ↓
Progress
 ↓
Completion
```

### Quiz

```text
Quiz
 ↓
Questions
 ↓
Submit
 ↓
Score
 ↓
Attempt history
```

### Exam

```text
Mock Exam
 ↓
Submit
 ↓
Score
 ↓
Pass/Fail
 ↓
Analytics
```

### Paper Trading

```text
Instrument
 ↓
BUY/SELL
 ↓
Transaction
 ↓
Holding
 ↓
Portfolio
```

---

# 23. PHASE 15 — PRODUCTION READINESS

Before production release verify:

```text
[ ] Supabase configured
[ ] Authentication secure
[ ] Database migrations tracked
[ ] RLS enabled and tested
[ ] No secret keys in frontend
[ ] Mock data removed from production flows
[ ] Error handling implemented
[ ] Loading states implemented
[ ] Empty states implemented
[ ] Database indexes verified
[ ] Critical business logic secured
[ ] Paper trading secured
[ ] Assessment scoring secured
[ ] AI secrets protected
[ ] Build succeeds
[ ] Tests pass
[ ] No critical console errors
[ ] No broken routes
[ ] Responsive UI verified
```

---

# 24. AGENT WORKFLOW

Every coding agent MUST follow this workflow.

## STEP 1 — READ

Read:

- this README
- approved database schema
- relevant project files
- current phase documentation

## STEP 2 — INSPECT

Understand existing implementation.

## STEP 3 — PLAN

Before significant modifications, explain:

- files to change
- files to create
- purpose
- dependencies
- risks

## STEP 4 — IMPLEMENT

Make the smallest reasonable set of changes.

## STEP 5 — VERIFY

Run available checks.

## STEP 6 — DOCUMENT

Update the relevant phase document.

## STEP 7 — CHECKPOINT

Report the phase status.

## STEP 8 — WAIT AT THE GATE

Do not automatically start unrelated future phases.

---

# 25. PHASE STATUS FORMAT

Every phase report should use:

```text
PHASE: <number>
NAME: <name>

STATUS:
COMPLETE / PARTIALLY COMPLETE / BLOCKED / NOT STARTED

COMPLETED:
- ...

FILES CREATED:
- ...

FILES MODIFIED:
- ...

VERIFICATION:
- ...

ISSUES:
- ...

BLOCKERS:
- ...

NEXT PHASE:
- ...
```

---

# 26. CHANGE CONTROL

For every significant change, record:

```text
WHY:
What problem is being solved?

WHAT:
What was changed?

WHERE:
Which files were changed?

IMPACT:
What parts of FinanceX are affected?

RISK:
What could break?

VERIFICATION:
How was it tested?
```

---

# 27. DO NOT DO THESE THINGS

Agents MUST NOT:

- rewrite the whole application without approval
- replace React architecture unnecessarily
- replace Supabase with another backend
- redesign the approved database
- expose secret keys
- implement insecure authentication
- trust client-side financial transactions
- trust client-side authoritative scores
- delete mock data prematurely
- remove working UI unnecessarily
- install unnecessary dependencies
- create duplicate services
- create duplicate database tables
- silently change schema
- silently change product behavior
- claim untested functionality is complete

---

# 28. WHEN A CONFLICT IS FOUND

If an agent encounters a conflict:

```text
STOP
```

Do not guess.

Report:

```text
CONFLICT

Source A:
...

Source B:
...

Observed behavior:
...

Potential solutions:
...

Recommended solution:
...

Approval required:
YES / NO
```

---

# 29. DOCUMENTATION STRUCTURE

Maintain development documentation under:

```text
docs/
  development/
    PHASE_0_AUDIT.md
    PHASE_1_SUPABASE.md
    PHASE_2_DATABASE.md
    PHASE_3_AUTH.md
    PHASE_4_SERVICES.md
    PHASE_5_LEARNING.md
    PHASE_6_ASSESSMENT.md
    PHASE_7_CERTIFICATION.md
    PHASE_8_GAMIFICATION.md
    PHASE_9_COMMUNITY.md
    PHASE_10_AI.md
    PHASE_11_TRADING.md
    PHASE_12_MOCK_REMOVAL.md
    PHASE_13_SECURITY.md
    PHASE_14_QA.md
    PHASE_15_PRODUCTION.md
```

Do not create documentation for phases that have not started unless needed for planning.

---

# 30. CURRENT DEVELOPMENT STATE

At the beginning of backend development:

```text
Frontend:
FUNCTIONALLY IMPLEMENTED

Database:
FINAL SCHEMA APPROVED

Backend:
IN PROGRESS

Supabase:
INTEGRATION PHASE

Mock Data:
PRESENT

Authentication:
TRANSITIONING TO SUPABASE AUTH
```

The current objective is to transition from a frontend/mock-data architecture to a real production backend without breaking the existing FinanceX experience.

---

# 31. IMMEDIATE DEVELOPMENT PRIORITY

The next active phase should always be explicitly identified.

If no active phase is specified, start with:

```text
PHASE 0 — REPOSITORY AUDIT
```

Do not skip directly to mock-data removal or full backend integration.

---

# 32. FINAL DEVELOPMENT PRINCIPLE

FinanceX development must remain:

**Controlled**
**Incremental**
**Secure**
**Tested**
**Documented**
**Reversible where possible**
**Schema-consistent**
**UI-preserving**

The objective is not merely to make the application "work."

The objective is to build a maintainable, secure, scalable FinanceX platform.

---

# FINANCEX DEVELOPMENT LOOP

```text
┌─────────────────────────────┐
│       READ THE CONTRACT     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│        INSPECT THE CODE     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│            PLAN             │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│         IMPLEMENT           │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│           VERIFY            │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│         DOCUMENT            │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│        PHASE GATE           │
└──────────────┬──────────────┘
               ↓
        NEXT PHASE
```

**Never skip the gate.**
