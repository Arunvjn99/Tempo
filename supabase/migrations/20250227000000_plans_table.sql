-- =============================================================================
-- Plans table: company-scoped retirement plans (dynamic, white-label)
-- Run in Supabase SQL Editor. Requires: companies table.
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  match_info text DEFAULT '',
  benefits jsonb DEFAULT '[]'::jsonb,
  sort_order int DEFAULT 0,
  is_eligible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS plans_company_id_idx ON plans(company_id);
CREATE INDEX IF NOT EXISTS plans_company_sort_idx ON plans(company_id, sort_order);

-- Trigger: updated_at
DROP TRIGGER IF EXISTS plans_updated_at ON plans;
CREATE TRIGGER plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

-- RLS: users see only plans for their company
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_own_company"
  ON plans FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Optional: allow company admins to manage plans (insert/update/delete)
CREATE POLICY "plans_insert_admin"
  ON plans FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "plans_update_admin"
  ON plans FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "plans_delete_admin"
  ON plans FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

COMMENT ON TABLE plans IS 'Company-scoped retirement plans; RLS restricts to user company.';
