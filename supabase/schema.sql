-- ============================================================================
-- FINANCEX - AUTHORITATIVE 34-TABLE POSTGRESQL SCHEMAS & RLS POLICIES
-- Suitable for execution in Supabase SQL Editor or CLI Migrations
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES (Extends auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE,
  account_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'PENDING', 'SUSPENDED')),
  knowledge_level_id UUID,
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  xp_points INTEGER NOT NULL DEFAULT 0 CHECK (xp_points >= 0),
  avatar_url TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. KNOWLEDGE_LEVELS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_name TEXT UNIQUE NOT NULL,
  min_score NUMERIC NOT NULL CHECK (min_score >= 0),
  max_score NUMERIC NOT NULL CHECK (max_score >= min_score),
  badge_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key constraint back to profiles
ALTER TABLE public.profiles 
  ADD CONSTRAINT fk_profiles_knowledge_level 
  FOREIGN KEY (knowledge_level_id) REFERENCES public.knowledge_levels(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 3. ACHIEVEMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT CHECK (category IN ('STREAK', 'LEARNING', 'TRADING', 'EXAM', 'COMMUNITY')),
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. USER_ACHIEVEMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ----------------------------------------------------------------------------
-- 5. GOALS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_title TEXT NOT NULL,
  target_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'PAUSED')),
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. TOPICS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_name TEXT UNIQUE NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. CERTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certification_name TEXT UNIQUE NOT NULL,
  governing_body TEXT,
  validity_years INTEGER CHECK (validity_years > 0),
  prerequisites TEXT,
  badge_icon TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. COURSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_title TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  certification_id UUID REFERENCES public.certifications(id) ON DELETE SET NULL,
  level TEXT CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  author TEXT,
  image_url TEXT,
  estimated_hours NUMERIC CHECK (estimated_hours > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. LESSONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1 CHECK (order_index > 0),
  estimated_minutes INTEGER NOT NULL DEFAULT 15 CHECK (estimated_minutes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_course_lesson_order UNIQUE (course_id, order_index)
);

-- ----------------------------------------------------------------------------
-- 10. LESSON_CONTENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('MARKDOWN_TEXT', 'VIDEO', 'INTERACTIVE_CALCULATOR', 'FLOWCHART')),
  content_url TEXT,
  raw_body TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. LESSON_RESOURCES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  resource_title TEXT NOT NULL,
  resource_url TEXT NOT NULL,
  resource_type TEXT CHECK (resource_type IN ('PDF_CHEAT_SHEET', 'EXCEL_MODEL', 'SEBI_CIRCULAR', 'EXTERNAL_ARTICLE')),
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. USER_LESSON_PROGRESS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
  progress_percent NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  last_position NUMERIC,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

-- ----------------------------------------------------------------------------
-- 13. QUESTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 14. QUIZZES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  quiz_type TEXT NOT NULL DEFAULT 'PRACTICE' CHECK (quiz_type IN ('DAILY', 'TOPIC', 'COURSE', 'PRACTICE')),
  active_date DATE,
  passing_score_percent NUMERIC NOT NULL DEFAULT 70 CHECK (passing_score_percent BETWEEN 0 AND 100),
  time_limit_minutes INTEGER CHECK (time_limit_minutes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 15. QUIZ_QUESTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL DEFAULT 1 CHECK (question_order > 0),
  mark NUMERIC NOT NULL DEFAULT 1 CHECK (mark >= 0),
  PRIMARY KEY (quiz_id, question_id)
);

-- ----------------------------------------------------------------------------
-- 16. QUIZ_ATTEMPTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL CHECK (score >= 0),
  total_marks NUMERIC NOT NULL CHECK (total_marks > 0),
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------------------------------------------------------
-- 17. QUIZ_ATTEMPT_ANSWERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  marks_awarded NUMERIC NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 18. MOCK_EXAMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certification_id UUID NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  certification_series TEXT NOT NULL,
  title TEXT NOT NULL,
  total_time_minutes INTEGER NOT NULL CHECK (total_time_minutes > 0),
  total_marks NUMERIC NOT NULL CHECK (total_marks > 0),
  passing_percentage NUMERIC NOT NULL CHECK (passing_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 19. MOCK_EXAM_QUESTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_exam_questions (
  exam_id UUID NOT NULL REFERENCES public.mock_exams(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL DEFAULT 1 CHECK (question_order > 0),
  mark NUMERIC NOT NULL DEFAULT 1 CHECK (mark >= 0),
  negative_mark NUMERIC NOT NULL DEFAULT 0 CHECK (negative_mark >= 0),
  PRIMARY KEY (exam_id, question_id)
);

-- ----------------------------------------------------------------------------
-- 20. MOCK_EXAM_ATTEMPTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.mock_exams(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL CHECK (score >= 0),
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  accuracy_percent NUMERIC NOT NULL DEFAULT 0 CHECK (accuracy_percent BETWEEN 0 AND 100),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 21. MOCK_EXAM_ATTEMPT_ANSWERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_exam_attempt_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES public.mock_exam_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  marks_awarded NUMERIC NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 22. CERTIFICATES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  certification_id UUID NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  certificate_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'ISSUED' CHECK (verification_status IN ('ISSUED', 'VERIFIED', 'REVOKED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 23. STUDY_PLANS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  certification_id UUID NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ABANDONED')),
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 24. STUDY_PLAN_ITEMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_plan_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  study_plan_id UUID NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
  sequence_no INTEGER NOT NULL DEFAULT 1 CHECK (sequence_no > 0),
  item_type TEXT NOT NULL CHECK (item_type IN ('LESSON', 'QUIZ', 'MOCK_EXAM', 'REVISION')),
  reference_id UUID,
  completion_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (completion_status IN ('PENDING', 'COMPLETED', 'SKIPPED')),
  due_date DATE,
  completed_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 25. AI_CONVERSATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 26. AI_MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('USER', 'AI')),
  message_text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ----------------------------------------------------------------------------
-- 27. AI_RECOMMENDATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('REVIEW_WEAK_CONCEPT', 'TAKE_MOCK_EXAM', 'PRACTICE_SIMULATION', 'NEXT_MODULE')),
  insight_text TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ----------------------------------------------------------------------------
-- 28. DISCUSSION_THREADS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.discussion_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'PINNED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 29. DISCUSSION_REPLIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 30. NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'HIGH')),
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 31. INSTRUMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.instruments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  instrument_type TEXT NOT NULL CHECK (instrument_type IN ('EQUITY', 'BOND', 'MUTUAL_FUND')),
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  currency TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR', 'USD')),
  simulated_price NUMERIC(20, 6) NOT NULL CHECK (simulated_price >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 32. DEMO_ACCOUNTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  virtual_balance NUMERIC(20, 2) NOT NULL DEFAULT 1000000.00 CHECK (virtual_balance >= 0),
  currency TEXT NOT NULL DEFAULT 'INR' CHECK (currency IN ('INR', 'USD')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 33. DEMO_HOLDINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demo_account_id UUID NOT NULL REFERENCES public.demo_accounts(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  quantity NUMERIC(20, 8) NOT NULL CHECK (quantity >= 0),
  avg_buy_price NUMERIC(20, 8) NOT NULL CHECK (avg_buy_price >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_account_instrument UNIQUE (demo_account_id, instrument_id)
);

-- ----------------------------------------------------------------------------
-- 34. DEMO_TRANSACTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  demo_account_id UUID NOT NULL REFERENCES public.demo_accounts(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
  quantity NUMERIC(20, 8) NOT NULL CHECK (quantity > 0),
  price_per_unit NUMERIC(20, 8) NOT NULL CHECK (price_per_unit >= 0),
  total_value NUMERIC(20, 2) NOT NULL CHECK (total_value >= 0),
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all 34 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exam_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_transactions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Public Read Catalog Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Public Read Knowledge Levels" ON public.knowledge_levels FOR SELECT USING (true);
CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public Read Topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public Read Lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public Read Lesson Content" ON public.lesson_content FOR SELECT USING (true);
CREATE POLICY "Public Read Lesson Resources" ON public.lesson_resources FOR SELECT USING (true);
CREATE POLICY "Public Read Questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public Read Quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Public Read Quiz Questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public Read Mock Exams" ON public.mock_exams FOR SELECT USING (true);
CREATE POLICY "Public Read Mock Exam Questions" ON public.mock_exam_questions FOR SELECT USING (true);
CREATE POLICY "Public Read Discussion Threads" ON public.discussion_threads FOR SELECT USING (true);
CREATE POLICY "Public Read Discussion Replies" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "Public Read Instruments" ON public.instruments FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- User-Private Row Level Security Policies
-- ----------------------------------------------------------------------------
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own lesson progress" ON public.user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own lesson progress" ON public.user_lesson_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own quiz attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own quiz attempt answers" ON public.quiz_attempt_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.quiz_attempts WHERE id = quiz_attempt_answers.attempt_id AND user_id = auth.uid())
);

CREATE POLICY "Users view own mock exam attempts" ON public.mock_exam_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own mock exam attempts" ON public.mock_exam_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users view own study plans" ON public.study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own study plans" ON public.study_plans FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own study plan items" ON public.study_plan_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.study_plans WHERE id = study_plan_items.study_plan_id AND user_id = auth.uid())
);

CREATE POLICY "Users manage own AI conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own AI messages" ON public.ai_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.ai_conversations WHERE id = ai_messages.conversation_id AND user_id = auth.uid())
);

CREATE POLICY "Users view own AI recommendations" ON public.ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own AI recommendations" ON public.ai_recommendations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users manage own discussion threads" ON public.discussion_threads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own discussion replies" ON public.discussion_replies FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own demo account" ON public.demo_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own demo holdings" ON public.demo_holdings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.demo_accounts WHERE id = demo_holdings.demo_account_id AND user_id = auth.uid())
);
CREATE POLICY "Users view own demo transactions" ON public.demo_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.demo_accounts WHERE id = demo_transactions.demo_account_id AND user_id = auth.uid())
);

-- ============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, account_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    'ACTIVE'
  );
  
  -- Create initial demo paper-trading account (₹10,00,000 capital)
  INSERT INTO public.demo_accounts (user_id, virtual_balance, currency)
  VALUES (NEW.id, 1000000.00, 'INR');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- AUTHORITATIVE ATOMIC PAPER TRADING TRANSACTION EXECUTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.execute_paper_trade(
  p_user_id UUID,
  p_instrument_id UUID,
  p_transaction_type TEXT,
  p_quantity NUMERIC,
  p_price_per_unit NUMERIC
)
RETURNS JSONB AS $$
DECLARE
  v_account_id UUID;
  v_balance NUMERIC;
  v_total_cost NUMERIC;
  v_existing_qty NUMERIC := 0;
  v_existing_avg NUMERIC := 0;
  v_new_qty NUMERIC;
  v_new_avg NUMERIC;
  v_trans_id UUID;
BEGIN
  -- 1. Verify caller owns the account
  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized trade request.');
  END IF;

  -- 2. Validate input constraints
  IF p_quantity <= 0 OR p_price_per_unit < 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid quantity or price.');
  END IF;

  IF p_transaction_type NOT IN ('BUY', 'SELL') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid transaction type.');
  END IF;

  v_total_cost := p_quantity * p_price_per_unit;

  -- 3. Lock user demo account row for atomic balance update
  SELECT id, virtual_balance INTO v_account_id, v_balance
  FROM public.demo_accounts
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_account_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Demo account not found.');
  END IF;

  -- 4. Process BUY
  IF p_transaction_type = 'BUY' THEN
    IF v_balance < v_total_cost THEN
      RETURN jsonb_build_object('success', false, 'error', 'Insufficient virtual funds.');
    END IF;

    -- Deduct balance
    UPDATE public.demo_accounts
    SET virtual_balance = virtual_balance - v_total_cost, updated_at = NOW()
    WHERE id = v_account_id;

    -- Upsert holding
    SELECT quantity, avg_buy_price INTO v_existing_qty, v_existing_avg
    FROM public.demo_holdings
    WHERE demo_account_id = v_account_id AND instrument_id = p_instrument_id;

    IF v_existing_qty IS NOT NULL AND v_existing_qty > 0 THEN
      v_new_qty := v_existing_qty + p_quantity;
      v_new_avg := ((v_existing_qty * v_existing_avg) + v_total_cost) / v_new_qty;

      UPDATE public.demo_holdings
      SET quantity = v_new_qty, avg_buy_price = v_new_avg, updated_at = NOW()
      WHERE demo_account_id = v_account_id AND instrument_id = p_instrument_id;
    ELSE
      INSERT INTO public.demo_holdings (demo_account_id, instrument_id, quantity, avg_buy_price)
      VALUES (v_account_id, p_instrument_id, p_quantity, p_price_per_unit);
    END IF;

  -- 5. Process SELL
  ELSE
    SELECT quantity INTO v_existing_qty
    FROM public.demo_holdings
    WHERE demo_account_id = v_account_id AND instrument_id = p_instrument_id;

    IF v_existing_qty IS NULL OR v_existing_qty < p_quantity THEN
      RETURN jsonb_build_object('success', false, 'error', 'Cannot sell more shares than currently held.');
    END IF;

    -- Credit balance
    UPDATE public.demo_accounts
    SET virtual_balance = virtual_balance + v_total_cost, updated_at = NOW()
    WHERE id = v_account_id;

    -- Update or remove holding
    IF v_existing_qty = p_quantity THEN
      DELETE FROM public.demo_holdings
      WHERE demo_account_id = v_account_id AND instrument_id = p_instrument_id;
    ELSE
      UPDATE public.demo_holdings
      SET quantity = quantity - p_quantity, updated_at = NOW()
      WHERE demo_account_id = v_account_id AND instrument_id = p_instrument_id;
    END IF;
  END IF;

  -- 6. Record transaction ledger entry
  INSERT INTO public.demo_transactions (
    demo_account_id,
    instrument_id,
    transaction_type,
    quantity,
    price_per_unit,
    total_value,
    executed_at
  )
  VALUES (
    v_account_id,
    p_instrument_id,
    p_transaction_type,
    p_quantity,
    p_price_per_unit,
    v_total_cost,
    NOW()
  )
  RETURNING id INTO v_trans_id;

  -- Return authoritative resulting balance
  SELECT virtual_balance INTO v_balance FROM public.demo_accounts WHERE id = v_account_id;

  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_balance,
    'transaction_id', v_trans_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 35. AUTH.USERS AUTOMATIC PROFILE & DEMO ACCOUNT PROVISIONING TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.profiles
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone_number,
    account_status,
    current_streak,
    longest_streak,
    xp_points
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone_number',
    'ACTIVE',
    0,
    0,
    0
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;

  -- Create default paper trading demo account with ₹10,00,000 initial capital
  INSERT INTO public.demo_accounts (
    user_id,
    virtual_balance,
    currency,
    initial_capital
  )
  VALUES (
    NEW.id,
    1000000.00,
    'INR',
    1000000.00
  )
  ON CONFLICT DO NOTHING;

  -- Create welcome notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    is_read,
    priority
  )
  VALUES (
    NEW.id,
    'ALERT',
    'Welcome to FinanceX!',
    'Your institutional financial sandbox & NISM learning terminal is ready with ₹10,00,000 virtual capital.',
    false,
    'HIGH'
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if existing and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


