-- ====================================================================
-- FinanceX Phase 33: Production Readiness & Institutional Deployment
-- Automated Profile Provisioning, Bulk Ingestion & Cryptographic Ledger
-- ====================================================================

-- 1. AUTOMATED USER PROFILE PROVISIONING (GOOGLE OAUTH & EMAIL SIGNUPS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    account_status,
    knowledge_level_id,
    current_streak,
    longest_streak,
    xp_points,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    ),
    COALESCE(new.raw_app_meta_data->>'role', 'USER'),
    'ACTIVE',
    1,
    1,
    1,
    100,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc'::text, now());

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. BULK COHORT ENROLLMENT STORED PROCEDURE
CREATE OR REPLACE FUNCTION public.bulk_enroll_cohort(
  p_batch_id UUID,
  p_learners JSONB
)
RETURNS TABLE (
  enrolled_count INTEGER,
  skipped_count INTEGER
) AS $$
DECLARE
  v_batch RECORD;
  v_item JSONB;
  v_email TEXT;
  v_name TEXT;
  v_user_id UUID;
  v_enrolled INTEGER := 0;
  v_skipped INTEGER := 0;
BEGIN
  -- Verify batch exists
  SELECT * INTO v_batch FROM public.course_batches WHERE batch_id = p_batch_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target cohort batch not found: %', p_batch_id;
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_learners)
  LOOP
    v_email := lower(trim(v_item->>'email'));
    v_name := trim(COALESCE(v_item->>'name', split_part(v_email, '@', 1)));

    IF v_email IS NULL OR v_email NOT LIKE '%@%' THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    -- Look up or generate user record
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();
    END IF;

    -- Avoid duplicate enrollment in the same course
    IF EXISTS (
      SELECT 1 FROM public.course_enrollments 
      WHERE course_id = v_batch.course_id AND (learner_id = v_user_id OR learner_email = v_email)
    ) THEN
      v_skipped := v_skipped + 1;
      CONTINUE;
    END IF;

    INSERT INTO public.course_enrollments (
      learner_id,
      learner_name,
      learner_email,
      course_id,
      course_title,
      batch_id,
      batch_name,
      status,
      progress_pct
    ) VALUES (
      v_user_id,
      v_name,
      v_email,
      v_batch.course_id,
      v_batch.course_title,
      v_batch.batch_id,
      v_batch.batch_name,
      'ACTIVE',
      0
    );

    v_enrolled := v_enrolled + 1;
  END LOOP;

  -- Update batch enrolled count
  UPDATE public.course_batches
  SET enrolled_count = enrolled_count + v_enrolled
  WHERE batch_id = p_batch_id;

  RETURN QUERY SELECT v_enrolled, v_skipped;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CRYPTOGRAPHIC IMMUTABILITY CHECKSUM FOR ACTIVITY AUDIT LEDGER
ALTER TABLE public.learner_activity_ledger 
ADD COLUMN IF NOT EXISTS integrity_hash TEXT;

CREATE OR REPLACE FUNCTION public.generate_ledger_hash()
RETURNS trigger AS $$
BEGIN
  new.integrity_hash := encode(
    digest(
      concat_ws(':', new.event_id, new.learner_id, new.type, new.course_id, new.created_at::text),
      'sha256'
    ),
    'hex'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ledger_integrity ON public.learner_activity_ledger;
CREATE TRIGGER trg_ledger_integrity
  BEFORE INSERT ON public.learner_activity_ledger
  FOR EACH ROW EXECUTE FUNCTION public.generate_ledger_hash();

