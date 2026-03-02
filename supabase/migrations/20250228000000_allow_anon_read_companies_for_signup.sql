-- =============================================================================
-- Allow anonymous read of companies (id, name) for signup form dropdown
-- Run in Supabase SQL Editor. Requires: public.companies table to exist.
-- =============================================================================

-- Ensure RLS is enabled on companies (no-op if already enabled)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Allow unauthenticated users to read id and name for signup company selector
-- Drop first if you need to re-run (e.g. to change policy)
DROP POLICY IF EXISTS "Allow anon read company list for signup" ON public.companies;
CREATE POLICY "Allow anon read company list for signup"
  ON public.companies
  FOR SELECT
  TO anon
  USING (true);

-- Note: anon can only SELECT; they cannot INSERT/UPDATE/DELETE.
-- If you already have other SELECT policies for authenticated users, they are unchanged.
