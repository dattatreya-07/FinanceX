# FinanceX Phase 17 — Production Data Mapping & Seeding Specification

This document defines the authoritative mapping between frontend entities / mock dataset and the live PostgreSQL 34-table Supabase database.

---

## 1. Domain Entities & Database Table Mapping

### 1.1 Knowledge Levels
- **Frontend Source**: `MOCK_KNOWLEDGE_LEVELS` (5 Levels)
- **Target Table**: `public.knowledge_levels`
- **Fields**:
  - `id`: Deterministic UUID (`00000001-0000-0000-0000-000000000001` .. `5`)
  - `level_name`: `Novice Saver`, `Market Explorer`, `Derivative Analyst`, `Portfolio Strategist`, `Chartered Master`
  - `min_score`: Numeric (`0`, `251`, `601`, `1101`, `1801`)
  - `max_score`: Numeric (`250`, `600`, `1100`, `1800`, `3000`)
  - `badge_color`: Hex color strings (`#94A3B8`, `#06B6D4`, `#00E599`, `#A855F7`, `#FF2E7E`)
- **Relationships**: Referenced by `profiles.knowledge_level_id`.
- **Seed Strategy**: `INSERT ... ON CONFLICT (level_name) DO UPDATE`.

---

### 1.2 Topics
- **Frontend Source**: `MOCK_TOPICS` (6 Core Topics)
- **Target Table**: `public.topics`
- **Fields**:
  - `id`: Deterministic UUID (`00000002-0000-0000-0000-000000000001` .. `6`)
  - `topic_name`: e.g. `Introduction to Securities Markets`, `Equity Derivatives & Futures Pricing`, `Options Strategies & The Greeks`, `Fixed Income, Bonds & Duration`, `SEBI Regulations & Code of Conduct`, `Fundamental Valuation & Financial Ratios`
  - `difficulty_level`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`
  - `icon`: Icon identifier (`Compass`, `TrendingUp`, `Layers`, `Percent`, `Scale`, `FileSpreadsheet`)
  - `description`: Text
- **Relationships**: Referenced by `lessons.topic_id`, `questions.topic_id`, `quizzes.topic_id`, `instruments.topic_id`.
- **Seed Strategy**: `INSERT ... ON CONFLICT (topic_name) DO UPDATE`.

---

### 1.3 Certifications
- **Frontend Source**: `MOCK_CERTIFICATIONS` (4 Benchmark Certifications)
- **Target Table**: `public.certifications`
- **Fields**:
  - `id`: Deterministic UUID (`00000003-0000-0000-0000-000000000001` .. `4`)
  - `certification_name`: `NISM-Series-VIII: Equity Derivatives Certification`, `NISM-Series-XV: Research Analyst Certification`, `NCFM: Debt & Fixed Income Markets Module`, `FinanceX Certified Financial Strategist (FCFS)`
  - `governing_body`: `NISM`, `NCFM`, `FINANCEX ACADEMY`
  - `validity_years`: Integer (`3`, `3`, `5`, `10`)
  - `prerequisites`: Text
  - `badge_icon`: Lucide icon name (`Award`, `FileText`, `Percent`, `GraduationCap`)
  - `summary`: Text
- **Relationships**: Referenced by `courses.certification_id`, `mock_exams.certification_id`, `certificates.certification_id`, `study_plans.certification_id`.
- **Seed Strategy**: `INSERT ... ON CONFLICT (certification_name) DO UPDATE`.

---

### 1.4 Courses
- **Frontend Source**: `MOCK_COURSES` (4 Benchmark Courses)
- **Target Table**: `public.courses`
- **Fields**:
  - `id`: Deterministic UUID (`00000004-0000-0000-0000-000000000001` .. `4`)
  - `course_title`: Unique course titles
  - `description`: Text
  - `price`: Numeric (`0.00`)
  - `certification_id`: UUID reference to `certifications(id)`
  - `level`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
  - `author`: Faculty attribution
  - `image_url`: Unsplash imagery
  - `estimated_hours`: Numeric
- **Relationships**: Referenced by `lessons.course_id`, `mock_exams.course_id`.
- **Seed Strategy**: `INSERT ... ON CONFLICT (course_title) DO UPDATE`.

---

### 1.5 Lessons
- **Frontend Source**: `MOCK_LESSONS` (6 Lessons)
- **Target Table**: `public.lessons`
- **Fields**:
  - `id`: Deterministic UUID (`00000005-0000-0000-0000-000000000001` .. `6`)
  - `course_id`: UUID reference to `courses(id)`
  - `topic_id`: UUID reference to `topics(id)`
  - `title`: Lesson title
  - `order_index`: Integer order per course
  - `estimated_minutes`: Duration in minutes
- **Relationships**: Unique on `(course_id, order_index)`. Referenced by `lesson_content.lesson_id`, `lesson_resources.lesson_id`.
- **Seed Strategy**: `INSERT ... ON CONFLICT (course_id, order_index) DO UPDATE`.

---

### 1.6 Lesson Content & Resources
- **Frontend Source**: `MOCK_LESSON_CONTENTS`, `MOCK_LESSON_RESOURCES`
- **Target Tables**: `public.lesson_content`, `public.lesson_resources`
- **Fields**:
  - `lesson_id`: UUID reference to `lessons(id)`
  - `content_type`: `MARKDOWN_TEXT`, `VIDEO`
  - `raw_body`: Markdown curriculum text with LaTeX mathematical formulations
  - `metadata`: JSONB containing `key_takeaways` and `formulas`
  - `resource_title`, `resource_url`, `resource_type`: `PDF_CHEAT_SHEET`, `EXCEL_MODEL`, `SEBI_CIRCULAR`
- **Seed Strategy**: `INSERT ... ON CONFLICT DO NOTHING`.

---

### 1.7 Questions
- **Frontend Source**: `MOCK_QUESTIONS` (8 Quantitative & Regulatory Questions)
- **Target Table**: `public.questions`
- **Fields**:
  - `id`: Deterministic UUID (`00000007-0000-0000-0000-000000000001` .. `8`)
  - `topic_id`: UUID reference to `topics(id)`
  - `question_text`: Complete problem statement
  - `option_a`, `option_b`, `option_c`, `option_d`: Options
  - `correct_option`: `A`, `B`, `C`, or `D`
  - `difficulty`: `EASY`, `MEDIUM`, `HARD`
  - `explanation`: Detailed mathematical / regulatory derivation
- **Relationships**: Referenced by `quiz_questions.question_id`, `mock_exam_questions.question_id`.
- **Seed Strategy**: `INSERT ... ON CONFLICT (id) DO UPDATE`.

---

### 1.8 Quizzes & Quiz Questions
- **Frontend Source**: `MOCK_QUIZZES`, `MOCK_QUIZ_QUESTIONS`
- **Target Tables**: `public.quizzes`, `public.quiz_questions`
- **Fields**:
  - `id`: Deterministic UUID (`00000008-0000-0000-0000-000000000001` .. `3`)
  - `topic_id`: UUID reference to `topics(id)`
  - `title`: Quiz title
  - `quiz_type`: `PRACTICE`, `TOPIC`, `DAILY`
  - `passing_score_percent`: Numeric (`75`, `70`, `80`)
  - `time_limit_minutes`: Integer (`10`, `8`, `12`)
- **Seed Strategy**: `INSERT ... ON CONFLICT (id) DO UPDATE`.

---

### 1.9 Mock Exams & Mock Exam Questions
- **Frontend Source**: `MOCK_EXAMS`, `MOCK_EXAM_QUESTIONS`
- **Target Tables**: `public.mock_exams`, `public.mock_exam_questions`
- **Fields**:
  - `id`: Deterministic UUID (`00000009-0000-0000-0000-000000000001` .. `3`)
  - `certification_id`: UUID reference to `certifications(id)`
  - `course_id`: UUID reference to `courses(id)`
  - `certification_series`: `NISM-VIII`, `NISM-XV`, `NCFM-FM`
  - `title`: Exam title
  - `total_time_minutes`: Duration (`120`, `120`, `90`)
  - `total_marks`: Total marks (`100`, `100`, `75`)
  - `passing_percentage`: `60.00`
- **Seed Strategy**: `INSERT ... ON CONFLICT (id) DO UPDATE`.

---

### 1.10 Achievements
- **Frontend Source**: `MOCK_ACHIEVEMENTS` (8 Gamification Badges)
- **Target Table**: `public.achievements`
- **Fields**:
  - `id`: Deterministic UUID (`00000010-0000-0000-0000-000000000001` .. `8`)
  - `achievement_name`: Unique badge title
  - `description`: Requirement description
  - `category`: `STREAK`, `LEARNING`, `TRADING`, `EXAM`, `COMMUNITY`
  - `xp_reward`: Integer XP points awarded
- **Seed Strategy**: `INSERT ... ON CONFLICT (achievement_name) DO UPDATE`.

---

### 1.11 Instruments
- **Frontend Source**: `MOCK_INSTRUMENTS` (5 Multi-Asset Instruments)
- **Target Table**: `public.instruments`
- **Fields**:
  - `id`: Deterministic UUID (`00000011-0000-0000-0000-000000000001` .. `5`)
  - `symbol`: `RELIANCE`, `INFY`, `HDFCBANK`, `GOI-7.18-2033`, `PPFCAP-DIR`
  - `name`: Full security name
  - `instrument_type`: `EQUITY`, `BOND`, `MUTUAL_FUND`
  - `topic_id`: UUID reference to `topics(id)`
  - `currency`: `INR`
  - `simulated_price`: Reference price (`2984.50`, `1845.20`, `1672.00`, `100.85`, `84.62`)
- **Seed Strategy**: `INSERT ... ON CONFLICT (symbol) DO UPDATE`.

---

## 2. Foreign Key Dependency Tree

```
knowledge_levels (No FK)
topics (No FK)
certifications (No FK)
achievements (No FK)
  ↓
courses (FK: certifications)
instruments (FK: topics)
questions (FK: topics)
  ↓
lessons (FK: courses, topics)
quizzes (FK: topics, courses)
mock_exams (FK: certifications, courses)
  ↓
lesson_content (FK: lessons)
lesson_resources (FK: lessons)
quiz_questions (FK: quizzes, questions)
mock_exam_questions (FK: mock_exams, questions)
```

---

## 3. Seed Execution Protocol
1. Generate `supabase/seed.sql` with deterministic UUIDs and idempotent clauses.
2. Execute the seed script in PostgreSQL / Supabase SQL Editor.
3. Validate row counts and relations in the live database.
4. Verify end-to-end rendering and real live data flow in the frontend.
