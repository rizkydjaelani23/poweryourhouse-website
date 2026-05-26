-- ============================================================
-- Migration 003: Fix grant_signup_credits trigger
--
-- PROBLEM: The original trigger inserts into saas_credit_ledger,
-- which has a FK: user_id → saas_profiles(id).
-- But saas_profiles doesn't exist yet at trigger time (AFTER INSERT
-- on auth.users). This causes a FK violation that can silently fail
-- or, worse, rollback the auth.users insert (blocking new signups).
--
-- FIX:
-- 1. Insert saas_profiles FIRST (ON CONFLICT DO NOTHING so it's
--    safe to run even if the auth callback creates it first).
-- 2. Wrap everything in EXCEPTION so any error is logged as a
--    WARNING but never bubbles up to fail the user creation.
--
-- The auth callback (/api/auth/callback) also creates the profile
-- and grants credits, but uses a NOT EXISTS guard so there is no
-- double-credit risk.
-- ============================================================

CREATE OR REPLACE FUNCTION public.grant_signup_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Step 1: ensure saas_profiles exists before inserting the FK-referencing row
  INSERT INTO public.saas_profiles (id, email, marketing_consent, plan)
  VALUES (NEW.id, COALESCE(NEW.email, ''), false, 'free')
  ON CONFLICT (id) DO NOTHING;

  -- Step 2: grant signup bonus if not already done (idempotent)
  IF NOT EXISTS (
    SELECT 1 FROM public.saas_credit_ledger
    WHERE user_id = NEW.id AND reason = 'signup_bonus'
  ) THEN
    INSERT INTO public.saas_credit_ledger (user_id, type, delta, reason)
    VALUES
      (NEW.id, 'STANDARD', 5, 'signup_bonus'),
      (NEW.id, 'HD',       1, 'signup_bonus');
  END IF;

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Log the error but never let it fail the user creation
  RAISE WARNING 'grant_signup_credits failed for user % : %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;
