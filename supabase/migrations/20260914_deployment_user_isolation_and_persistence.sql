-- ============================================================================
-- FINANCEX MIGRATION: USER DATA ISOLATION, PERSISTENCE & DEPLOYMENT STAGE
-- Version: 2026-09-14
-- ============================================================================

-- 1. Profiles Table Updates: Activity Tracking & Streak Date
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS last_activity_date DATE DEFAULT CURRENT_DATE;

-- 2. Mock Exam Attempts: Anti-Cheat Violations, Topic Diagnostic & Timing
ALTER TABLE public.mock_exam_attempts 
  ADD COLUMN IF NOT EXISTS violation_count INTEGER DEFAULT 0 CHECK (violation_count >= 0),
  ADD COLUMN IF NOT EXISTS topic_breakdown JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS time_taken_seconds INTEGER DEFAULT 0;

-- 3. Course Ratings Table: UNIQUE per (course_id, user_id)
CREATE TABLE IF NOT EXISTS public.course_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_course_user_rating UNIQUE (course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_course_ratings_course ON public.course_ratings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_ratings_user ON public.course_ratings(user_id);

-- 4. Discussion Upvotes Table: UNIQUE per (thread_id, user_id)
CREATE TABLE IF NOT EXISTS public.discussion_upvotes (
  thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (thread_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_discussion_upvotes_thread ON public.discussion_upvotes(thread_id);

-- 5. Row Level Security Policies
ALTER TABLE public.course_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_upvotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Course Ratings" ON public.course_ratings;
CREATE POLICY "Public Read Course Ratings" ON public.course_ratings 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Manage Own Course Rating" ON public.course_ratings;
CREATE POLICY "Users Manage Own Course Rating" ON public.course_ratings 
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public Read Discussion Upvotes" ON public.discussion_upvotes;
CREATE POLICY "Public Read Discussion Upvotes" ON public.discussion_upvotes 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Manage Own Discussion Upvotes" ON public.discussion_upvotes;
CREATE POLICY "Users Manage Own Discussion Upvotes" ON public.discussion_upvotes 
  FOR ALL USING (auth.uid() = user_id);

-- 6. RPC Function: sync_user_xp_streak
CREATE OR REPLACE FUNCTION public.sync_user_xp_streak(
  p_user_id UUID,
  p_xp_delta INTEGER,
  p_activity_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB AS $$
DECLARE
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_last_date DATE;
  v_new_xp INTEGER;
  v_new_streak INTEGER;
  v_new_longest INTEGER;
BEGIN
  SELECT xp_points, current_streak, longest_streak, last_activity_date
  INTO v_new_xp, v_current_streak, v_longest_streak, v_last_date
  FROM public.profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Calculate XP
  v_new_xp := GREATEST(0, COALESCE(v_new_xp, 0) + p_xp_delta);
  v_current_streak := COALESCE(v_current_streak, 0);
  v_longest_streak := COALESCE(v_longest_streak, 0);

  -- Calculate Streak
  IF v_last_date IS NULL THEN
    v_new_streak := 1;
  ELSIF v_last_date = p_activity_date THEN
    v_new_streak := GREATEST(1, v_current_streak); -- same day activity
  ELSIF v_last_date = (p_activity_date - 1) THEN
    v_new_streak := v_current_streak + 1; -- consecutive day
  ELSE
    v_new_streak := 1; -- streak reset to 1 on qualifying activity
  END IF;

  v_new_longest := GREATEST(v_longest_streak, v_new_streak);

  UPDATE public.profiles
  SET xp_points = v_new_xp,
      current_streak = v_new_streak,
      longest_streak = v_new_longest,
      last_activity_date = p_activity_date,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'xp_points', v_new_xp,
    'current_streak', v_new_streak,
    'longest_streak', v_new_longest,
    'last_activity_date', p_activity_date
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
