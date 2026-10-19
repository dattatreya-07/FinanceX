-- ============================================================================
-- FINANCEX MIGRATION: ADMIN CMS & PROFILE EXTENSIONS
-- Version: 2026-09-13
-- ============================================================================

-- 1. Extend PROFILES table with Admin Roles and Profile Bio / Certificates
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'USER' 
    CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN', 'CONTENT_ADMIN', 'INSTRUCTOR', 'REVIEWER', 'ANALYST', 'MODERATOR')),
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS organization TEXT,
  ADD COLUMN IF NOT EXISTS target_certifications JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS uploaded_certificates JSONB DEFAULT '[]'::jsonb;

-- 2. Add Content Status & Localization columns to Educational Catalog tables
ALTER TABLE public.courses 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PUBLISHED' 
    CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en' 
    CHECK (language IN ('en', 'ta')),
  ADD COLUMN IF NOT EXISTS learning_outcomes JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.lessons 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PUBLISHED' 
    CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en' 
    CHECK (language IN ('en', 'ta'));

ALTER TABLE public.quizzes 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PUBLISHED' 
    CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'));

ALTER TABLE public.mock_exams 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PUBLISHED' 
    CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
  ADD COLUMN IF NOT EXISTS instructions TEXT;

ALTER TABLE public.certifications 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PUBLISHED' 
    CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED')),
  ADD COLUMN IF NOT EXISTS is_official BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.achievements 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- 3. Create CONTENT_AUDIT_LOGS table
CREATE TABLE IF NOT EXISTS public.content_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH', 'ARCHIVE', 'UPLOAD', 'DUPLICATE', 'IMPORT')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('COURSE', 'TOPIC', 'LESSON', 'LESSON_CONTENT', 'RESOURCE', 'QUESTION', 'QUIZ', 'MOCK_EXAM', 'CERTIFICATION', 'ACHIEVEMENT', 'STUDY_PLAN_TEMPLATE', 'ANNOUNCEMENT')),
  entity_id TEXT NOT NULL,
  entity_title TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast audit query
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.content_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.content_audit_logs(entity_type, entity_id);

-- 4. Create ANNOUNCEMENTS table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'ALL_USERS' CHECK (audience IN ('ALL_USERS', 'COURSE_LEARNERS', 'CERTIFICATION_LEARNERS', 'ADMINS')),
  target_id UUID,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'EXPIRED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 5. Helper Function: Is User Admin?
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role IN ('ADMIN', 'SUPER_ADMIN', 'CONTENT_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS Policies for Admin Content Mutations
ALTER TABLE public.content_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Announcements Read & Admin Manage
CREATE POLICY "Public Read Announcements" ON public.announcements 
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Admins Manage Announcements" ON public.announcements 
  FOR ALL USING (public.is_admin(auth.uid()));

-- Audit Logs Policies
CREATE POLICY "Admins View Audit Logs" ON public.content_audit_logs 
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Insert Audit Logs" ON public.content_audit_logs 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Admin Mutation Policies for Catalog Tables
CREATE POLICY "Admins Manage Courses" ON public.courses 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Lessons" ON public.lessons 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Lesson Content" ON public.lesson_content 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Lesson Resources" ON public.lesson_resources 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Topics" ON public.topics 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Questions" ON public.questions 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Quizzes" ON public.quizzes 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Quiz Questions" ON public.quiz_questions 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Mock Exams" ON public.mock_exams 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Mock Exam Questions" ON public.mock_exam_questions 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Certifications" ON public.certifications 
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins Manage Achievements" ON public.achievements 
  FOR ALL USING (public.is_admin(auth.uid()));

-- 7. Supabase Storage Bucket Setup & Security
-- Bucket: educational-assets (public read, admin-only write)
-- Bucket: user-certificates (user & admin read/write)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('educational-assets', 'educational-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-certificates', 'user-certificates', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Educational Assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'educational-assets');

CREATE POLICY "Admins Upload Educational Assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'educational-assets' AND public.is_admin(auth.uid())
  );

CREATE POLICY "Admins Update/Delete Educational Assets" ON storage.objects
  FOR ALL USING (
    bucket_id = 'educational-assets' AND public.is_admin(auth.uid())
  );

CREATE POLICY "Users Upload Own Certificate" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-certificates' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users View Own Certificate" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-certificates' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin(auth.uid())
    )
  );
