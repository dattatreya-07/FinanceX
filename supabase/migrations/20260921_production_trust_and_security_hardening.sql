-- ============================================================================
-- FINANCEX MIGRATION: PRODUCTION TRUST, SECURITY & EVIDENCE HARDENING
-- Version: 2026-09-21
-- Phase: 31
-- ============================================================================

-- 1. Helper Functions: Enhanced Role Checking with Tenant Awareness
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role IN ('ADMIN', 'SUPER_ADMIN', 'CONTENT_ADMIN', 'INSTITUTION_ADMIN', 'INSTRUCTOR')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'SUPER_ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Prevent Self-Privilege Escalation on PROFILES Table
-- Any non-admin attempting to alter role or account_status is rejected at the database level.
CREATE OR REPLACE FUNCTION public.prevent_profile_security_tampering()
RETURNS TRIGGER AS $$
BEGIN
  -- If role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- If caller is not a SUPER_ADMIN, disallow setting role to SUPER_ADMIN
    IF NEW.role = 'SUPER_ADMIN' AND NOT public.is_super_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Unauthorized: Only SUPER_ADMIN accounts can grant or assign the SUPER_ADMIN role.';
    END IF;

    -- If caller is not an admin at all, disallow changing role
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Unauthorized: Non-administrative accounts cannot modify user roles.';
    END IF;
  END IF;

  -- If account_status is being altered by non-admin
  IF NEW.account_status IS DISTINCT FROM OLD.account_status THEN
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Unauthorized: Non-administrative accounts cannot alter account status.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_profile_tampering ON public.profiles;
CREATE TRIGGER trg_prevent_profile_tampering
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_security_tampering();

-- 3. Enforce Absolute Immutability on CONTENT_AUDIT_LOGS Table
-- Audit logs can NEVER be updated or deleted, even by administrative users.
CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Security Violation: Administrative audit records are strictly immutable and cannot be modified or deleted.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON public.content_audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
  BEFORE UPDATE OR DELETE ON public.content_audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- 4. Harden RLS Policies on CONTENT_AUDIT_LOGS
-- Drop the overly permissive insert policy and enforce admin check
DROP POLICY IF EXISTS "Admins Insert Audit Logs" ON public.content_audit_logs;
CREATE POLICY "Admins Insert Audit Logs" ON public.content_audit_logs 
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Ensure no UPDATE or DELETE policy exists for public.content_audit_logs
DROP POLICY IF EXISTS "Admins Update Audit Logs" ON public.content_audit_logs;
DROP POLICY IF EXISTS "Admins Delete Audit Logs" ON public.content_audit_logs;

-- 5. Multi-Tenant Scoped RLS for Tenant Admins
CREATE OR REPLACE FUNCTION public.get_user_organization(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_org TEXT;
BEGIN
  SELECT organization INTO v_org FROM public.profiles WHERE id = user_id;
  RETURN v_org;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
