-- ====================================================================
-- FinanceX Phase 32: Multi-Role Learning Management System (LMS) Schema
-- Supabase PostgreSQL Migration with Strict RLS & Foreign Key Indexes
-- ====================================================================

-- 1. INSTRUCTOR PROFILES
CREATE TABLE IF NOT EXISTS public.instructor_profiles (
  instructor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT 'FinanceX Institutional Academy',
  bio TEXT,
  avatar_url TEXT,
  assigned_course_ids INTEGER[] DEFAULT '{}',
  active_cohorts_count INTEGER DEFAULT 0,
  total_students_mentored INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 4.90,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_instructor_user_id ON public.instructor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_instructor_status ON public.instructor_profiles(status);

-- 2. COURSE BATCHES (COHORTS)
CREATE TABLE IF NOT EXISTS public.course_batches (
  batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name TEXT NOT NULL,
  course_id INTEGER NOT NULL REFERENCES public.courses(course_id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  instructor_id UUID REFERENCES public.instructor_profiles(instructor_id) ON DELETE SET NULL,
  instructor_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 50,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('UPCOMING', 'ACTIVE', 'COMPLETED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_batches_course_id ON public.course_batches(course_id);
CREATE INDEX IF NOT EXISTS idx_batches_instructor_id ON public.course_batches(instructor_id);

-- 3. COURSE ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learner_name TEXT NOT NULL,
  learner_email TEXT NOT NULL,
  course_id INTEGER NOT NULL REFERENCES public.courses(course_id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  batch_id UUID REFERENCES public.course_batches(batch_id) ON DELETE SET NULL,
  batch_name TEXT NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'AT_RISK', 'DROPPED')),
  progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 10,
  quizzes_taken INTEGER NOT NULL DEFAULT 0,
  quiz_avg_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  assignments_submitted INTEGER NOT NULL DEFAULT 0,
  total_assignments INTEGER NOT NULL DEFAULT 2,
  assignment_avg_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  learning_hours NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  attendance_pct NUMERIC(5, 2) DEFAULT 100.00,
  final_grade TEXT,
  certificate_id TEXT,
  CONSTRAINT uq_learner_course UNIQUE(learner_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_learner_id ON public.course_enrollments(learner_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_batch_id ON public.course_enrollments(batch_id);

-- 4. LMS ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.lms_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id INTEGER NOT NULL REFERENCES public.courses(course_id) ON DELETE CASCADE,
  module_week INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rubric JSONB NOT NULL DEFAULT '[]'::jsonb,
  max_score INTEGER NOT NULL DEFAULT 100,
  due_date TIMESTAMPTZ NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 60,
  starter_financial_data JSONB,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON public.lms_assignments(course_id);

-- 5. LMS ASSIGNMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.lms_assignment_submissions (
  submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.lms_assignments(assignment_id) ON DELETE CASCADE,
  assignment_title TEXT NOT NULL,
  course_id INTEGER NOT NULL REFERENCES public.courses(course_id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  learner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learner_name TEXT NOT NULL,
  learner_email TEXT NOT NULL,
  batch_id UUID REFERENCES public.course_batches(batch_id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'GRADED', 'REVISION_REQUESTED')),
  content_text TEXT NOT NULL,
  quantitative_work JSONB,
  score NUMERIC(5, 2),
  max_score NUMERIC(5, 2) NOT NULL DEFAULT 100,
  evaluated_at TIMESTAMPTZ,
  evaluator_instructor_id UUID REFERENCES public.instructor_profiles(instructor_id) ON DELETE SET NULL,
  evaluator_name TEXT,
  instructor_feedback TEXT,
  rubric_scores JSONB
);

CREATE INDEX IF NOT EXISTS idx_submissions_learner_id ON public.lms_assignment_submissions(learner_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.lms_assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_course_id ON public.lms_assignment_submissions(course_id);

-- 6. INSTRUCTOR PRIVATE NOTES
CREATE TABLE IF NOT EXISTS public.instructor_private_notes (
  note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES public.instructor_profiles(instructor_id) ON DELETE CASCADE,
  instructor_name TEXT NOT NULL,
  course_id INTEGER NOT NULL REFERENCES public.courses(course_id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notes_learner_id ON public.instructor_private_notes(learner_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_private_notes ENABLE ROW LEVEL SECURITY;

-- 1. Instructor Profiles RLS
CREATE POLICY "Public read on instructors" ON public.instructor_profiles
  FOR SELECT TO authenticated USING (true);

-- 2. Course Batches RLS
CREATE POLICY "Public read on batches" ON public.course_batches
  FOR SELECT TO authenticated USING (true);

-- 3. Course Enrollments RLS
CREATE POLICY "Learner reads own enrollments" ON public.course_enrollments
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = learner_id);

CREATE POLICY "Learner inserts own enrollments" ON public.course_enrollments
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = learner_id);

CREATE POLICY "Learner updates own enrollments" ON public.course_enrollments
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = learner_id)
  WITH CHECK ((select auth.uid()) = learner_id);

CREATE POLICY "Instructors view assigned course enrollments" ON public.course_enrollments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.instructor_profiles ip
      WHERE ip.user_id = (select auth.uid())
        AND course_enrollments.course_id = ANY(ip.assigned_course_ids)
    )
  );

CREATE POLICY "Admin full access on enrollments" ON public.course_enrollments
  FOR ALL TO authenticated
  USING ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');

-- 4. LMS Assignments RLS
CREATE POLICY "Authenticated users view assignments" ON public.lms_assignments
  FOR SELECT TO authenticated USING (status = 'PUBLISHED');

-- 5. Submissions RLS
CREATE POLICY "Learner views own submissions" ON public.lms_assignment_submissions
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = learner_id);

CREATE POLICY "Learner creates own submission" ON public.lms_assignment_submissions
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = learner_id);

CREATE POLICY "Instructors view assigned submissions" ON public.lms_assignment_submissions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.instructor_profiles ip
      WHERE ip.user_id = (select auth.uid())
        AND lms_assignment_submissions.course_id = ANY(ip.assigned_course_ids)
    )
  );

CREATE POLICY "Instructors evaluate assigned submissions" ON public.lms_assignment_submissions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.instructor_profiles ip
      WHERE ip.user_id = (select auth.uid())
        AND lms_assignment_submissions.course_id = ANY(ip.assigned_course_ids)
    )
  );

CREATE POLICY "Admin full access on submissions" ON public.lms_assignment_submissions
  FOR ALL TO authenticated
  USING ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');

-- 6. Instructor Private Notes RLS
CREATE POLICY "Instructors view notes" ON public.instructor_private_notes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.instructor_profiles ip
      WHERE ip.user_id = (select auth.uid())
        AND ip.instructor_id = instructor_private_notes.instructor_id
    )
  );

CREATE POLICY "Instructors insert private notes" ON public.instructor_private_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.instructor_profiles ip
      WHERE ip.user_id = (select auth.uid())
        AND ip.instructor_id = instructor_private_notes.instructor_id
    )
  );

