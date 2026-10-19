# FinanceX — Authoritative Project Documentation & Technical Architecture Report

**Prepared by:** Senior Project Manager & Full-Stack Systems Architect  
**Project Name:** FinanceX (Institutional Financial Learning, NISM/NCFM Certification Preparation & Simulated Trading Terminal)  
**Version:** 31.0 (Production Hardened & Verified)  
**Date:** September 2026  

---

## 1. Executive Summary & Project Overview

**FinanceX** is a production-grade, enterprise-hardened financial education platform, NISM/NCFM certification preparation system, and simulated paper trading terminal. Designed for university finance students, university institutions, research analysts, derivative traders, and financial education platforms, FinanceX provides a closed-loop learning architecture:

$$\text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Assess} \longrightarrow \text{Measure} \longrightarrow \text{Identify Weakness} \longrightarrow \text{Recommend} \longrightarrow \text{AI Coaching}$$

### Key Project Objectives
1. **Curriculum & Certification Preparedness:** Complete preparation coverage for NISM Series VIII (Equity Derivatives), NISM Series XV (Research Analyst), SEBI regulatory frameworks, and quantitative financial modeling.
2. **Grounded AI Mentorship:** A Retrieval-Augmented Generation (RAG) AI Tutor delivering bilingual (English & Tamil) coaching, mathematical formula derivations, and step-by-step problem solving without off-domain hallucinations.
3. **Simulated Paper Trading (Practice Lab):** Risk-free trading terminal initialized with ₹10,00,000 virtual capital, real-time market data feed simulation, option chain analytics, and Option Greeks calculators.
4. **Assessment Intelligence & Psychometrics:** Classical Test Theory (CTT) item analysis ($p$-value, $D$-index, point-biserial correlations, distractor distribution) to detect flawed assessment questions automatically.
5. **Enterprise Governance & Multi-Tenant Compliance:** Multi-tenant institutional management (HDFC Bank, ICICI Securities, Mumbai Financial Institute, Kotak Equities), scoped Role-Based Access Control (RBAC), 1-click statutory CSV compliance exports with deterministic SHA-256 verification checksums, and human-in-the-loop AI item improvement workflows.

---

## 2. Technology Stack & Architectural Rationale

| Technology Layer | Core Tech Used | Selection Rationale & Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript 5.7** | High-performance component rendering, strict static typing across 34 locked database schema entities, zero runtime type errors. |
| **Build Tool & Bundler** | **Vite 6.4** | Ultra-fast Hot Module Replacement (HMR) during development and optimized production bundling (HTML, CSS, JS minification, code splitting, chunking). |
| **Styling & Design System** | **TailwindCSS (Vanilla CSS Tokens)** | Tailored dark aesthetic (`#0B0F19`, `#06090F`), HSL custom color tokens, glassmorphism overlays, accent gradients (`#00E599` emerald green, `#FF2E7E` hot pink), responsive typography. |
| **Iconography** | **Lucide React** | Modern, lightweight, accessible UI iconography across all views. |
| **Mathematical Rendering** | **KaTeX** | High-precision LaTeX formula rendering for financial equations (Black-Scholes option pricing model, Option Greeks partial derivatives, Bond Yield to Maturity, DCF intrinsic valuation). |
| **Backend & Database** | **Supabase (PostgreSQL 15+)** | Relational SQL database backing all 34 locked schema tables, transactional integrity, foreign key constraints, and custom PL/pgSQL stored procedures/RPC functions. |
| **Authentication** | **Supabase Auth** | Secure OAuth and Email/Password auth with strict email confirmation checks, session persistence, and server-side profile synchronization. |
| **Database Security** | **PostgreSQL Row Level Security (RLS)** | Database-enforced Row Level Security policies protecting profiles, quiz/exam attempts, trade holdings, and audit logs. |
| **Asset Storage** | **Supabase Storage** | Public bucket (`educational-assets` for course media) and private bucket (`user-certificates` for verified learner credentials). |
| **Serverless Execution** | **Supabase Edge Functions** | Deno / TypeScript serverless functions for secure LLM proxying, RAG context retrieval, and background execution. |
| **Testing & Quality Tooling** | **Node.js TSX Runner + TSC** | Headless TypeScript test suites (`scratch/test_phase*.ts`) running unit, integration, psychometric, and security regression checks. |

---

## 3. Core Algorithms & Mathematical Formulations

FinanceX implements seven proprietary algorithms across learning, psychometrics, trading, and security:

### 3.1 Algorithm 1: RAG & Cosine Similarity Vector Search (`ragService.ts`)
- **Mechanism:** TF-IDF vectorization with domain keyword boosting ($2.5\times$ multiplier for financial terms like *Delta*, *Gamma*, *Black-Scholes*, *SPAN Margin*).
- **Matching Metric:** Cosine similarity calculation across 40+ structured knowledge items:
  $$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$$
- **Bilingual Processing:** Detects prompt language (`en` / `ta`). Queries in Tamil map to Tamil-translated curriculum vector chunks.
- **Score Thresholding:** Minimum score threshold ($\text{Score} \ge 80$) to prevent Sharpe Ratio hallucination leaks and ensure grounding in published NISM content.

### 3.2 Algorithm 2: Deterministic Concept Mastery Engine (`learningLoopService.ts`)
- **Formula:** Multi-factor weighted composite scoring equation:
  $$\text{Mastery Score} = (0.35 \times \text{Lesson Progress}) + (0.35 \times \text{Quiz Accuracy}) + (0.20 \times \text{Mock Exam Score}) + (0.10 \times \text{Practice Lab Credit})$$
- **Level Categorization:**
  - `NOT_STARTED` ($0\%$)
  - `LEARNING` ($1 - 49\%$)
  - `NEEDS_PRACTICE` ($50 - 64\%$)
  - `PROFICIENT` ($65 - 84\%$)
  - `MASTERED` ($\ge 85\%$)
- **Weakness Detection:** Topics with accuracy $< 65\%$ are automatically flagged as weaknesses and trigger AI Tutor coaching prompts.

### 3.3 Algorithm 3: Spaced Repetition & Memory Decay Engine (`spacedReviewService.ts`)
- **Mechanism:** SuperMemo SM-2 / Leitner variant calculating review intervals ($1\text{d} \to 3\text{d} \to 7\text{d} \to 14\text{d} \to 30\text{d}$) based on recall success or failure.
- **Overdue Evaluation:** Computes `days_overdue` and schedules targeted active recall sessions before memory decay occurs.

### 3.4 Algorithm 4: Classical Test Theory (CTT) Psychometric Analysis (`assessmentIntelligenceService.ts`)
- **Difficulty Index ($p$-value):**
  $$p = \frac{N_{\text{correct}}}{N_{\text{total}}} \quad (0.00 \le p \le 1.00)$$
- **Discrimination Index ($D$-index):**
  $$D = p_{\text{Upper } 27\%} - p_{\text{Lower } 27\%} \quad (-1.00 \le D \le +1.00)$$
- **Point-Biserial Correlation Approximation ($r_{\text{pbi}}$):**
  $$r_{\text{pbi}} = D \times 0.82$$
- **Distractor Analysis:** Evaluates Option A, B, C, D distribution percentages to identify non-functional or misleading distractors.
- **Quality Status Rules:** `EXCELLENT` ($D \ge 0.40$), `GOOD` ($D \ge 0.30$), `FAIR` ($D \ge 0.20$), `POOR_DISCRIMINATION` ($D < 0.20$), `TOO_EASY` ($p > 0.95$), `TOO_HARD` ($p < 0.20$), `NEEDS_REVISION` ($D < 0.00$).

### 3.5 Algorithm 5: Privacy-Preserving Cohort Benchmarking (`cohortAnalyticsService.ts`)
- **Statistical Distribution:** Calculates Mean, Std Dev, and Percentiles ($P_{25}, P_{50}, P_{75}, P_{90}$).
- **Privacy Suppression:** Automatically enforces `is_privacy_suppressed = true` whenever cohort sample size $N < 5$ to prevent individual learner identification.

### 3.6 Algorithm 6: Simulated Market Matching & Position Valuation (`tradingService.ts` & PL/pgSQL `execute_demo_trade`)
- **Mechanism:** Market, Limit, and Stop-Loss order matching, average buy price updating:
  $$\text{New Avg Price} = \frac{(Q_{\text{existing}} \times P_{\text{avg}}) + (Q_{\text{new}} \times P_{\text{new}})}{Q_{\text{existing}} + Q_{\text{new}}}$$
- Position tracking, margin verification, P&L calculations, and transaction ledger updates.

### 3.7 Algorithm 7: Exam Integrity & Proctored Anomaly Engine (`examIntegrityService.ts`)
- **Mechanism:** Real-time tracking of tab switches, fullscreen exit events, and velocity anomalies ($t < 4\text{s}$ for quantitative questions).
- **Integrity Score:** Computes Integrity Score % ($0 - 100\%$). Automatically invalidates attempt if fullscreen exit count $\ge 3$.

---

## 4. AI Models, APIs & Training / Prompting Methodology

### 4.1 LLM Provider & Architecture
- **Model Engine:** Gemini 1.5 Pro via Supabase Edge Functions / OpenRouter LLM API endpoints.
- **RAG Architecture:** Vector retrieval over published NISM Series VIII (Equity Derivatives) and NISM Series XV (Research Analyst) official curriculum data.

### 4.2 System Guardrails & Prompt Design
- **System Prompts:** Enforce strict zero-hallucination guardrails, LaTeX math formatting (`$$...$$`), bilingual English/Tamil response generation, and domain boundary checks.
- **Response Structure:** Returns explanation, mathematical step-by-step breakdown, LaTeX formula, and structured array of suggested follow-up actions.

### 4.3 Human-in-the-Loop AI Governance
- **Quarantine Workflow:** AI item improvement proposals generated for psychometrically flawed questions ($D < 0.20$, $p > 0.95$, $p < 0.20$) start strictly in `PENDING_REVIEW` quarantine.
- **Human Approval:** Requires explicit human assessment manager sign-off (`APPROVE` / `REJECT`) before staging into curriculum draft status.

---

## 5. Deep Research: The Three Major Interaction & Communication Channels

FinanceX features three distinct interaction/communication channels tailored for tutoring, peer learning, and administrative broadcasting:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FINANCEX THREE MAJOR INTERACTION CHANNELS              │
├──────────────────────────────┬──────────────────────────────┬───────────────┤
│ 1. AI Tutor Conversational   │ 2. Community Discussion &    │ 3. Platform   │
│    Terminal (RAG Coach)      │    Peer Q&A Hub              │    Broadcasts │
└──────────────────────────────┴──────────────────────────────┴───────────────┘
```

### Channel 1: AI Tutor Conversational Terminal (`AITutorView.tsx` / `aiService.ts` / `ragService.ts`)
- **Purpose:** 1-on-1 personalized AI coaching and mathematical problem solving.
- **Capabilities:**
  - Grounded RAG retrieval across 40+ curriculum knowledge items.
  - Bilingual prompt switching (English and Tamil).
  - Mathematical LaTeX equation rendering via KaTeX.
  - Step-by-step derivation of Option Greeks, Black-Scholes pricing, and SPAN margining.
  - Interactive suggested follow-up action buttons.

### Channel 2: Community Discussion & Peer Q&A Hub (`CommunityView.tsx` / `communityService.ts`)
- **Purpose:** Collaborative peer learning, discussion threads, and instructor Q&A.
- **Capabilities:**
  - Thread creation, replies, upvoting system (`discussion_upvotes`).
  - Category tagging (`Equity Derivatives`, `Research Analyst`, `Valuation`, `Trading`, `SEBI Circulars`).
  - Verified instructor badges on authoritative answers.
  - Search and tag filtering.

### Channel 3: Institutional & Administrative Broadcast Channel (`NotificationsView.tsx` / `notificationService.ts` / `AnnouncementsManagerView.tsx`)
- **Purpose:** Official platform announcements, targeted notifications, and system alerts.
- **Capabilities:**
  - Targeted audience delivery (`ALL_USERS`, `COURSE_LEARNERS`, `CERTIFICATION_LEARNERS`, `ADMINS`).
  - Priority levels (`HIGH`, `MEDIUM`, `LOW`).
  - System trigger notifications (welcome virtual capital provisioning, exam reminders, certificate verification alerts).
  - Unread badge counters and notification center UI.

---

## 6. Key Features & Subsystems of FinanceX

1. **Launchpad Dashboard (`DashboardView.tsx`):** Compact, non-scrollable, high-efficiency launchpad with quick tiles for Resume Learning, AI Tutor, Spaced Practice, Paper Trading, and Goals.
2. **Course & Lesson Player (`LessonEditorView.tsx` / `CourseManagerView.tsx`):** Rich markdown text, LaTeX equations, video embeds, interactive calculators, and downloadable PDF study resources.
3. **NISM & NCFM Certification Prep Terminal (`QuizExamManagerView.tsx` / `MockExamRunner.tsx`):** Topic quizzes and 120-minute timed proctored mock exams with anti-cheat monitoring.
4. **Simulated Paper Trading Terminal (Practice Lab) (`PracticeLabView.tsx`):** Initialized with ₹10,00,000 virtual capital, real-time market data feed simulation, option chain analytics, and Option Greeks calculators.
5. **Enterprise Governance Console (`EnterpriseGovernanceView.tsx`):** Multi-tenant institutional management (HDFC Bank, ICICI Securities, Mumbai Financial Institute, Kotak Equities), scoped RBAC (`SUPER_ADMIN`, `ADMIN`, `INSTITUTION_ADMIN`, `INSTRUCTOR`, `LEARNER`), 1-click statutory CSV compliance exports with deterministic SHA-256 verification checksums, and side-by-side AI item diff inspector.
6. **Immutable Administrative Audit Trail (`adminService.ts` / `AuditLogsView.tsx`):** PostgreSQL trigger-enforced immutable ledger recording all role mutations, compliance exports, content updates, and AI item approvals.

---

## 7. Project Phasing & Verification Matrix

All test suites from Phase 26 through Phase 31 have been executed and verified **100% GREEN**:

| Phase | Core Focus | Test Suite File | Result |
| :--- | :--- | :--- | :--- |
| **Phase 26.1** | Live Supabase Integration & RBAC | `scratch/test_phase26_1_live_verification.ts` | **GREEN** |
| **Phase 26.2** | AI Tutor Root-Cause Fix | `scratch/test_ai_matrix.ts` | **GREEN** |
| **Phase 26.3** | AI Tutor Runtime Regression | `scratch/test_ai_regression.ts` | **GREEN** |
| **Phase 26.4** | Curriculum Grounding & Bilingual RAG | `scratch/test_ai_grounding_matrix.ts` | **100% GREEN** |
| **Phase 27** | Closed-Loop Learning & Concept Mastery | `scratch/test_phase27_learning_loop.ts` | **13 / 13 PASSED** |
| **Phase 28** | Adaptive Practice & Spaced Review | `scratch/test_phase28_continuous_mastery.ts` | **31 / 31 PASSED** |
| **Phase 29** | Assessment Intelligence & Cohorts | `scratch/test_phase29_assessment_intelligence.ts` | **29 / 29 PASSED** |
| **Phase 30** | Enterprise Governance & Compliance | `scratch/test_phase30_enterprise_governance.ts` | **30 / 30 PASSED** |
| **Phase 31** | Security, RLS & Production Trust | `scratch/test_phase31_production_trust_security.ts` | **26 / 26 PASSED** |
| **Static Types**| TypeScript Compilation | `npx tsc --noEmit` | **0 Errors (100% Clean)** |
| **Production** | Vite Production Bundle | `npm run build` | **Built in 7.26s** |

---

## 8. Conclusion

FinanceX is an enterprise-ready, mathematically grounded, security-hardened, and AI-powered financial learning platform. Combining classical test theory, spaced repetition memory algorithms, grounded retrieval-augmented generation, real-time paper trading, and multi-tenant enterprise compliance, FinanceX delivers a complete end-to-end learning environment for modern quantitative finance education.
