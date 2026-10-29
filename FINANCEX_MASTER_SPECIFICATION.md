# FinanceX (FX1) — Master Engineering & Architectural Specification

**Document Version:** 2.4.0  
**Status:** Institutional Production Release  
**Target Domain:** Indian Capital Markets, NISM / SEBI Certifications, Quantitative Valuation & Financial Simulation  
**Lead Architecture:** Senior Project Manager & Lead Systems Architect  

---

## 1. Executive Summary & Vision

### 1.1 Project Overview
**FinanceX** is an institutional-grade, gamified financial education platform, quantitative simulation terminal, and AI-powered certification learning system. The platform is purpose-built to prepare candidates for high-stakes capital market certifications regulated by the **Securities and Exchange Board of India (SEBI)** and administered by the **National Institute of Securities Markets (NISM)**, specifically:
- **NISM-Series-XV:** Research Analyst Examination (Full 15-Chapter Curriculum, 100-mark weightage)
- **NISM-Series-VIII:** Equity Derivatives Examination
- **NISM-Series-V-A:** Mutual Fund Distributors Examination
- Advanced Modules in Fixed Income, Corporate Valuation (DCF / Relative Multiples), and Financial Statement Analysis (DuPont 3/5-Stage Decomposition).

### 1.2 Core Mission & Differentiation
Traditional financial certification prep relies on static PDFs and dry question banks that fail to build practical execution skills. FinanceX bridges this pedagogical gap by integrating:
1. **Interactive Curriculum Terminal:** Mathematical LaTeX formula rendering via KaTeX, real SEBI regulatory case studies, and official February 2026 examination workbooks.
2. **Real-Time Paper Trading Sandbox:** Simulated ₹10,00,000 INR multi-asset portfolio engine with live limit, market, and stop-loss execution without financial risk.
3. **Adaptive AI Financial Tutor:** Context-aware domain LLM powered by Google Gemini, capable of explaining formulas, translating concepts to vernacular languages (Tamil & English), and operating via voice speech synthesis.
4. **Deterministic Spaced Repetition (Ebbinghaus Forgetting Curve):** Automated review scheduling that pinpoints weak concepts and schedules targeted reviews before memory decay occurs.
5. **Progressive Web App (PWA):** Zero-install desktop and mobile deployment with offline capabilities and multi-touch mobile responsiveness.

---

## 2. Technology Stack Architecture & Technical Rationale

The architecture was engineered under strict production principles: **blazing load speeds, mathematical precision, institutional security, offline resilience, and modern visual aesthetics.**

```
+-----------------------------------------------------------------------------------+
|                                  USER CLIENT                                      |
|   Desktop Browser / Mobile Browser / Installed PWA (Standalone Android & iOS)      |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        FRONTEND PRESENTATION TIER                                 |
|  • React 19 (Concurrent Mode, Transitions)    • TypeScript 5.8 (Strict Typing)    |
|  • Vite 6 (ESBuild Rollup Pipeline)           • Tailwind CSS v4 + Vanilla Tokens  |
|  • KaTeX Math Rendering Engine                • Motion (Framer Motion v12)        |
|  • Recharts Data Visualization                • Lucide React Icons (Institutional)|
|  • Web Speech API (Bi-directional Voice)      • i18next (English & Tamil Native)  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        STATE, LOGIC & SERVICE LAYER                               |
|  • authService        • communityService     • quizService     • examService      |
|  • courseService      • tradingService       • goalService     • aiService        |
|  • learningLoopService• spacedReviewService  • speechService   • adminService     |
+-----------------------------------------------------------------------------------+
                    │                                           │
                    ▼                                           ▼
+---------------------------------------+   +---------------------------------------+
|          REMOTE PERSISTENCE           |   |           LOCAL FALLBACK              |
|  • Supabase (PostgreSQL 15, RLS)      |   |  • HTML5 LocalStorage & SessionStorage|
|  • Supabase Auth (Google OAuth2 + JWT)|   |  • Service Worker (sw.js CacheStorage)|
|  • Google Gemini Generative AI Model  |   |  • Event-Driven Cross-Tab Syncer      |
+---------------------------------------+   +---------------------------------------+
```

### 2.1 Technology Matrix & Strategic Rationale

| Layer | Technology | Version | Rationale & Why Specifically Selected |
| :--- | :--- | :--- | :--- |
| **Framework** | **React** | `19.0.1` | Concurrent Rendering primitives, non-blocking UI transitions (`useTransition`), high-frequency state updates in trading simulator, seamless reactivity for real-time tickers. |
| **Language** | **TypeScript** | `5.8.2` | Complete end-to-end type safety across 40+ schema models (Questions, Quizzes, Lessons, Portfolios, Orders, Certifications), eliminating runtime crashes. |
| **Bundler & Tooling** | **Vite** | `6.2.3` | Instant Hot Module Replacement (HMR < 50ms), lightning-fast Rollup tree-shaking, production bundle minification, and native ES modules support. |
| **Styling & Design System** | **Tailwind CSS v4** | `4.1.14` | Modern JIT engine, CSS custom variable tokens, zero CSS runtime overhead, seamless dark/light theme switching with smooth transitions. |
| **Math Rendering** | **KaTeX** | `^0.16.21` | Sub-millisecond mathematical typesetting for complex financial formulas (DuPont fractions, Black-Scholes Greeks, Macaulay Duration integrals) without blocking the main UI thread. |
| **Backend & Database** | **Supabase (PostgreSQL)** | `^2.115.0` | Enterprise relational database with Row Level Security (RLS), ACID compliance, automatic REST endpoints, real-time WebSocket subscriptions, and built-in OAuth providers. |
| **Authentication** | **Google OAuth2 + Supabase Auth** | Native | One-click corporate and institutional sign-in, JWT token verification, and deterministic guest fallback mode. |
| **Generative AI** | **Google Gemini AI SDK** | `@google/genai` | Low-latency financial reasoning, structured JSON extraction, multilingual question explanation, and domain knowledge retrieval. |
| **Audio & Speech** | **Web Speech API** | Native Browser | Zero-dependency text-to-speech with pitch, speed adjustment (0.8x, 1.0x, 1.25x), speech synthesis, and voice dictation. |
| **Visualizations** | **Recharts** | `^3.10.1` | Declarative SVG charting for DCF forecast curves, portfolio equity trajectories, asset allocations, and DuPont ratio radar charts. |
| **Animation** | **Motion (Framer Motion)** | `^12.23.24` | 60 FPS hardware-accelerated micro-interactions, modal spring physics, boot sequences, and dynamic island layout animations. |
| **Internationalization** | **i18next + react-i18next** | `^26.4.2` | Full multilingual UI support with on-the-fly switching between English and Tamil (`ta`), complete with curriculum translations. |
| **Application Packaging** | **Progressive Web App (PWA)** | W3C Standard | Service Worker (`sw.js`) cache strategies, W3C Web Manifest, standalone desktop and mobile display, and offline asset availability. |

---

## 3. Core System Modules & Functional Breakdown

### 3.1 Module 1: Curriculum & Interactive Lesson Terminal (`LessonView`)
- **Curriculum Scope:** Complete 15 chapters covering the official SEBI/NISM Series XV workbook (February 2026 edition).
- **Dual-Mode Consumption:**
  - **Interactive Text Mode:** Powered by `FormulaMarkdownRenderer`, automatically transforming raw markdown headings, numbered steps, LaTeX display math (`$$...$$`), inline math (`$...$`), bold concepts, blockquotes, and tables into responsive, high-typography educational cards.
  - **HD 1080p Video Lecture Mode:** Embedded YouTube video player configured with clean, distraction-free playback parameters, timestamps, and chapter markers.
- **Real-World Market Case Studies:** Dedicated regulatory case study card in every chapter highlighting historical securities precedents (e.g., Dot-Com Wall Street Chinese Walls, Satyam corporate governance failure divergence of PAT vs Operating Cash Flow).
- **Mathematical Formulas Explorer:** Interactive formula cards complete with mathematical LaTeX display, variable definitions, and one-click copy to clipboard.
- **In-Lesson Self-Check Question Drills:** Direct comprehension testing inside the lesson with immediate multiple-choice options (`A`, `B`, `C`, `D`), color-coded validation, and comprehensive official explanations.
- **Official Exam Workbook Attachment:** One-click preview and download of the 342-page official NISM Series XV PDF workbook.

### 3.2 Module 2: Simulated Trading Sandbox & Paper Terminal (`PracticeLabView`)
- **Virtual Balance:** Initial balance of **₹10,00,000 INR** per learner.
- **Order Execution Engine:**
  - Order types: **Market**, **Limit**, **Stop-Loss (SL)**.
  - Real-time calculations: Total Order Value = `Quantity * Target Price`, margin checking against virtual balance.
  - Order verification and balance reservation.
- **Portfolio Tracking:**
  - Real-time positions table with Average Buy Price, Current Market Price (CMP), Day's Gain/Loss (₹ and %), and Total Unrealized P&L.
  - One-click Position Square-off / Sell execution updating portfolio cash instantly.
- **Transaction Audit Log:** Complete historical ledger recording timestamp, order type, instrument symbol, executed price, quantity, and balance after trade.

### 3.3 Module 3: AI Financial Educational Tutor (`AITutorView`, `FloatingAITutorWidget`)
- **Intelligence Model:** Backed by Google Gemini LLM augmented with custom institutional financial prompts and NISM curriculum guardrails.
- **Contextual Handoff:** Learners can click **"Explain with AI"** from any quiz question, lesson concept, or valuation ratio to launch the tutor pre-loaded with the exact problem context.
- **Voice Speech Engine:** Integrated `speechService` capable of reading tutor answers aloud with controls for Play, Pause, Resume, Stop, and variable playback speeds (0.8x, 1.0x, 1.25x).
- **Vernacular Language Support:** Native Tamil responses and explanations for South Indian market learners.
- **Formula Cheatsheet Extraction:** The AI automatically extracts referenced formulas into dedicated pillbox cards.

### 3.4 Module 4: Adaptive Spaced Repetition & Learning Loop (`spacedReviewService`, `learningLoopService`)
- **Concept Mastery Algorithm:** Computes deterministic 0–100% mastery scores for every market topic based on quiz accuracy, question difficulty, and mock exam results.
- **Adaptive Recommendations Engine:** Suggests personalized next steps:
  - `REVIEW_WEAK_CONCEPT`: Triggered when topic accuracy falls below 65%.
  - `TAKE_MOCK_EXAM`: Triggered after completing core chapters.
  - `RESUME_MODULE`: Points directly to the last active lesson.
- **Gamified Goal Roadmaps (`GamifiedGoalMap`):** Visual path mapping Level 1 (Novice, 0 XP) to Level 5 (Master Analyst, 3000+ XP) with interactive step milestones.

### 3.5 Module 5: Evaluation & Examination Suite (`QuizRunner`, `MockExamRunner`, `CompetitiveArenaView`)
- **Chapter-Specific Quizzes:** 15 modular quizzes with 5 targeted questions each, randomized order, instant score calculation, and review screens.
- **Full NISM Mock Exams:**
  - 100 questions timed over 120 minutes.
  - Official SEBI negative marking (-0.25 marks per wrong answer).
  - Minimum passing threshold: **60% (60/100)**.
- **Anti-Cheat Tab-Switch Detection:** Automatic detection of window blurring and tab switching during exams, issuing visual warnings or test invalidation.
- **Competitive Arena:** Real-time peer leaderboard tracking daily streaks, XP points, and curriculum accuracy.

### 3.6 Module 6: Community Discussion Forum & Doubt Clearing (`CommunityView`)
- **Persistent Synchronization:** Threads and replies stored in Supabase with local fallback (`financex_persistent_community_threads`), updating across the application via custom window events (`financex-threads-updated`).
- **Dynamic Author Attribution:** Displays author name, avatar, and role. Clicking an author opens their public professional profile modal (`PublicProfileModal`).
- **One-Like-Per-User Rule:** Enforces single upvote toggle per learner.
- **Cross-Platform Reflection:** Newly published discussion threads immediately reflect on the **Learner Dashboard** and within the **⌘K Global Search Modal**.
- **Incentive Economy:** Publishing a discussion thread awards **+50 XP** and triggers a system notification.

### 3.7 Module 7: Institutional Administration CMS / LMS (`AdminPortalView`)
- **Role-Based Access Control:** Validated through `adminService.hasAdminPrivileges(user)`.
- **Learner Management:** View student rosters, streak counts, XP scores, and account status.
- **Course & Lesson Editor:** Create, update, re-order, and publish curriculum modules.
- **Question Bank CMS:** Add, edit, and delete examination questions, option keys, and explanations.

### 3.8 Module 8: External Intelligence Portal (`ArgusFinPortalView`)
- Embedded institutional terminal frame connecting learners to external market research tools and financial analytics from Argus Fin.

### 3.9 Module 9: Financial Tools & Quantitative Calculators (`FinancialCalculatorsView`)
- **DCF Intrinsic Valuation Calculator:** Discounted Cash Flow valuation with WACC, terminal growth rate, and 5-year free cash flow projections.
- **Option Greeks Calculator:** Black-Scholes pricing calculating theoretical Call/Put premiums, Delta, Gamma, Theta, Vega, and Rho.
- **Fixed Income Calculator:** Bond Clean Price, Dirty Price, Macaulay Duration, and Modified Duration.
- **SIP & Compound Interest Calculator:** Wealth projection based on monthly investments, expected returns, and tenure.

---

## 4. Frontend Engineering & Mathematical Typography

### 4.1 The LaTeX / Math Rendering Problem & Resolution
**Problem:** In financial education, formulas like the DuPont 3-stage ROE decomposition, Macaulay Duration, and Black-Scholes equations:
$$\text{ROE} = \underbrace{\frac{\text{PAT}}{\text{Revenue}}}_{\text{Margin}} \times \underbrace{\frac{\text{Revenue}}{\text{Assets}}}_{\text{Turnover}} \times \underbrace{\frac{\text{Assets}}{\text{Equity}}}_{\text{Leverage}}$$
were previously treated as unformatted plain text. Naive string splitting left raw `$$`, `\frac`, and `\underbrace` tags exposed, degrading readability.

**Solution (`FormulaMarkdownRenderer.tsx`):**
1. **KaTeX Integration:** Configured with `displayMode: true` for block math and `displayMode: false` for inline math (`$...$`), utilizing the pre-compiled `katex/dist/katex.min.css` stylesheet for vector-sharp rendering.
2. **Multi-Pass Block Lexer:** Classifies markdown content into `h1`, `h2`, `h3`, `h4`, `math`, `ordered-list`, `unordered-list`, `blockquote`, `code`, `table`, and `paragraph`.
3. **Interactive Math Display Cards:** Equations are enclosed in styled emerald glassmorphic cards with copy buttons for one-click LaTeX copying.
4. **Resilient Error Boundaries:** Any malformed LaTeX falls back to high-readability monospace syntax highlighting without throwing React errors.

---

## 5. Service Layer Architecture & API Specifications

All business logic resides within dedicated singleton service modules located in `src/services/`:

```
src/services/
├── adminService.ts          # Admin privileges & LMS/CMS CRUD operations
├── aiService.ts             # Google Gemini API & Financial Tutor RAG pipeline
├── authService.ts           # Authentication, Google OAuth, Profile & Local Sync
├── communityService.ts      # Discussion threads, replies, upvotes & sync events
├── courseService.ts         # Course catalog, lesson completion & progress tracking
├── examService.ts           # Mock exam generation, scoring & attempt persistence
├── goalService.ts           # User study goals, milestones & progress computation
├── learningLoopService.ts   # Adaptive recommendations & deterministic concept mastery
├── marketDataService.ts     # Live market quotes & financial calculations
├── notificationService.ts   # Alert dispatching, priorities & unread counters
├── quizService.ts           # Question banks, randomized evaluation & explanations
├── spacedReviewService.ts   # Ebbinghaus spaced repetition review scheduling
├── speechService.ts         # Web Speech API voice synthesis & rate controls
└── tradingService.ts        # Virtual portfolio, orders & balance accounting
```

### 5.1 Service Functional Specifications

#### `authService`
- `signIn(email, password)`: Authenticates user against Supabase Auth; falls back to verified offline profile if network is unavailable.
- `signUp(email, password, fullName, phone)`: Registers new user and initializes fresh ₹10,00,000 demo trading account.
- `signInWithGoogle()`: Initiates Supabase Google OAuth2 redirect flow with automatic fallback to authenticated Google session.
- `signOut()`: Terminates active session and purges sensitive tokens.
- `updateUserXpAndStreak(userId, xpEarned)`: Deterministically calculates daily streaks and increments XP.

#### `communityService`
- `getInitialThreads()`: Synchronously loads persistent threads from localStorage or pre-seeded institutional discussions.
- `getThreads()`: Asynchronously fetches threads from Supabase database; merges with locally created learner threads.
- `createThread({ title, content, tags, user, topicId })`: Persists new discussion thread, sets real author metadata (`author_name`, `author_role`, `author_avatar`), stores locally, and dispatches `'financex-threads-updated'`.
- `createReply(threadId, content, user)`: Adds reply, increments thread reply counter, and emits sync events.
- `toggleUpvote(threadId, userId)`: Enforces 1-like-per-user rule and toggles upvote status.

#### `aiService`
- `askTutor(params: AskTutorParams)`: Sends user query with conversation context and curriculum guidelines to Google Gemini API; returns structured answer, formula cheatsheets, and suggested practice quiz topics.

#### `speechService`
- `speak(text, lang)`: Synthesizes text into natural voice output using available native voices.
- `pause()`, `resume()`, `stop()`: Controls audio playback.
- `setSpeed(rate)`: Configures playback rate (`0.8x`, `1.0x`, `1.25x`).

#### `learningLoopService` & `spacedReviewService`
- `computeConceptMastery(userId, context)`: Analyzes question responses across quizzes and exams to calculate percentage mastery for every topic.
- `getDueReviews(userId, masteryList)`: Identifies topics due for spaced repetition based on calculated retention decay.

#### `tradingService`
- `getAccount(userId)`: Returns current virtual portfolio cash balance.
- `executeOrder(userId, order)`: Validates cash sufficiency, executes trade, logs transaction, and adjusts holding positions.
- `resetPortfolio(userId)`: Restores virtual balance to ₹10,00,000 and clears transactions.

---

## 6. Database Schema & Data Models

### 6.1 Relational Schema (`src/types/schema.ts`)

```sql
-- 1. USERS & PROFILES
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role TEXT DEFAULT 'LEARNER' CHECK (role IN ('LEARNER', 'ADMIN', 'INSTRUCTOR')),
  knowledge_level_id INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  xp_points INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COURSES & LESSONS
CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  course_title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  estimated_hours NUMERIC DEFAULT 10
);

CREATE TABLE lessons (
  lesson_id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(course_id) ON DELETE CASCADE,
  topic_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  estimated_mins INTEGER DEFAULT 30,
  order_index INTEGER NOT NULL
);

-- 3. DISCUSSION THREADS & COMMUNITY
CREATE TABLE discussion_threads (
  thread_id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  topic_id INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY['NISM_SERIES_XV'],
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PINNED', 'RESOLVED')),
  author_name TEXT,
  author_role TEXT,
  author_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE discussion_replies (
  reply_id BIGINT PRIMARY KEY,
  thread_id BIGINT REFERENCES discussion_threads(thread_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  is_accepted_answer BOOLEAN DEFAULT FALSE,
  author_name TEXT,
  author_role TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE discussion_upvotes (
  thread_id BIGINT REFERENCES discussion_threads(thread_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (thread_id, user_id)
);

-- 4. SIMULATED PAPER TRADING
CREATE TABLE demo_accounts (
  demo_account_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  virtual_balance NUMERIC(15, 2) DEFAULT 1000000.00,
  currency TEXT DEFAULT 'INR',
  initial_capital NUMERIC(15, 2) DEFAULT 1000000.00
);

CREATE TABLE demo_holdings (
  holding_id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  instrument_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  average_buy_price NUMERIC(12, 2) NOT NULL,
  current_market_price NUMERIC(12, 2) NOT NULL
);
```

---

## 7. Progressive Web App (PWA) & Offline Architecture

### 7.1 W3C Manifest Specification (`public/manifest.json`)
```json
{
  "short_name": "FinanceX",
  "name": "FinanceX — Institutional Financial Terminal & NISM LMS",
  "description": "Gamified NISM/NCFM certification platform with simulated trading sandbox and AI financial tutor.",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#047857",
  "background_color": "#07090E",
  "categories": ["education", "finance", "productivity"],
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "192x192 512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

### 7.2 Service Worker Strategy (`public/sw.js`)
- **Pre-Caching Core Shell:** On install, caches `index.html`, `manifest.json`, `favicon.svg`, fonts, and primary CSS/JS chunks.
- **Stale-While-Revalidate Strategy:** Serves curriculum pages and static assets from cache immediately while revalidating and updating in the background.
- **Offline Navigation Fallback:** Returns cached `index.html` for single-page client routing when network connectivity is lost.

### 7.3 Multi-Platform Installation UI
- **Chromium / Edge / Android:** Intercepts the `beforeinstallprompt` event via the custom `usePWAInstall` hook, triggering an in-app installation modal.
- **iOS Safari:** Detects iOS mobile browsers and presents visual step-by-step instructions ("Tap the Share button and select 'Add to Home Screen'").

---

## 8. Design System & Aesthetic Standards

FinanceX adheres to an **institutional Bloomberg / Goldman Sachs terminal aesthetic** infused with modern glassmorphism:

### 8.1 Color Palette
- **Institutional Primary (Emerald Jade):** `#047857` / `#064E3B` / `#00E599`  
  *Represents market growth, liquidity, wealth generation, and SEBI compliance green.*
- **Wealth Gold Accent:** `#F59E0B` / `#FBBF24` / `#D97706`  
  *Used for certifications, exam badges, streak flames, and key takeaways.*
- **Terminal Obsidian Background:** `#07090E` / `#0B0F19` / `#0F172A`  
  *High-contrast dark mode eliminating eye fatigue during marathon study sessions.*
- **Quantitative Coral / Alert:** `#FF2E7E` / `#F43F5E`  
  *Used for Stop-Loss indicators, negative marking warnings, and AI tutor accents.*

### 8.2 Typography
- **Headings & Brand:** `Space Grotesk` & `Plus Jakarta Sans` (Font weights 700, 800, 900)
- **Body & Content:** `Plus Jakarta Sans` (Font weights 400, 500, 600)
- **Formulas & Tickers:** `JetBrains Mono` & `KaTeX Math Serif` (Monospaced alignment for numerical precision)

---

## 9. Local Setup, Build & Production Deployment

### 9.1 Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **NPM:** v9.0.0 or higher
- **Git**

### 9.2 Environment Variables (`.env`)
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini AI Key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 9.3 Installation & Execution Commands
```bash
# 1. Clone repository
git clone https://github.com/dattatreya-07/FinanceX.git
cd FinanceX

# 2. Install dependencies
npm install

# 3. Launch development server (Port 3000)
npm run dev

# 4. Compile production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 10. Verification & Quality Assurance Audit

| Test Category | Test Case | Target Metric | Status |
| :--- | :--- | :--- | :--- |
| **Mathematical Rendering** | KaTeX DuPont 3-Stage & Duration formula display | 0 raw TeX escape strings; 100% formatted fractions & symbols | **VERIFIED PASS** |
| **PWA Installability** | Lighthouse PWA Audit / Web App Manifest validation | Valid `start_url`, standalone display, active Service Worker | **VERIFIED PASS** |
| **OAuth Integration** | Sign in with Google | One-click OAuth initiation & session recovery | **VERIFIED PASS** |
| **Forum Reflection** | User-created discussion thread appearance on Dashboard | Immediate reflection on Dashboard & ⌘K search with XP reward | **VERIFIED PASS** |
| **Simulated Trading** | ₹10,00,000 INR order execution and P&L computation | Exact mathematical precision, no rounding errors | **VERIFIED PASS** |
| **Build Stability** | Vite production bundle compilation (`npm run build`) | 0 TypeScript errors, 0 bundling warnings | **VERIFIED PASS** |

---

*This document serves as the single source of truth for the architecture, engineering principles, data contracts, and implementation standards of the FinanceX platform.*
