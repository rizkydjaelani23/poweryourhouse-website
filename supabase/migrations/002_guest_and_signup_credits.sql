-- ============================================================
-- Migration 002: Guest usage tracking + auto signup credits
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. Guest usage table ─────────────────────────────────────────────────────
-- Tracks how many times each anonymous guest token has generated.
-- No auth required — accessed only via the service-role key server-side.

CREATE TABLE IF NOT EXISTS public.saas_guest_usage (
  token      TEXT        PRIMARY KEY,
  count      INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.saas_guest_usage ENABLE ROW LEVEL SECURITY;
-- No RLS policies needed: only the service-role key touches this table.

-- ── 2. Auto-grant credits on signup ─────────────────────────────────────────
-- Fires after every new row in auth.users (i.e., every new signup).
-- Inserts 5 STANDARD + 1 HD credits with reason = 'signup_bonus'.
-- The EXISTS guard prevents double-granting if the trigger fires twice.

CREATE OR REPLACE FUNCTION public.grant_signup_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_signup_credits();

-- ── 3. Backfill existing users ───────────────────────────────────────────────
-- Gives the 5 STANDARD + 1 HD bonus to every existing user who hasn't
-- already received it (safe to run multiple times thanks to the NOT EXISTS).

INSERT INTO public.saas_credit_ledger (user_id, type, delta, reason)
SELECT au.id, 'STANDARD', 5, 'signup_bonus'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.saas_credit_ledger cl
  WHERE  cl.user_id = au.id
    AND  cl.reason  = 'signup_bonus'
    AND  cl.type    = 'STANDARD'
);

INSERT INTO public.saas_credit_ledger (user_id, type, delta, reason)
SELECT au.id, 'HD', 1, 'signup_bonus'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.saas_credit_ledger cl
  WHERE  cl.user_id = au.id
    AND  cl.reason  = 'signup_bonus'
    AND  cl.type    = 'HD'
);
