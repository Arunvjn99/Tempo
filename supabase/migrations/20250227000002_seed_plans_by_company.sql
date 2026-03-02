-- =============================================================================
-- Seed plans per company: Congruent (1), Lincoln (2), Transamerica (multiple)
-- Run after plans table. Matches companies by name (case-insensitive).
-- =============================================================================

-- Congruent: 1 plan
INSERT INTO plans (company_id, name, description, match_info, benefits, sort_order)
SELECT id, '401(k) Plan', 'A straightforward 401(k) to help you save for retirement with tax advantages.', 'Best for getting started with retirement savings.', '["Pre-tax contributions", "Employer match", "Tax-deferred growth"]'::jsonb, 1
FROM companies WHERE name ILIKE '%Congruent%' LIMIT 1;

-- Lincoln: 2 plans
INSERT INTO plans (company_id, name, description, match_info, benefits, sort_order)
SELECT id, 'Traditional 401(k)', 'Reduce taxable income now; pay taxes in retirement.', 'Best for keeping more in your paycheck today.', '["Tax deduction now", "Employer match", "Tax-deferred growth"]'::jsonb, 1
FROM companies WHERE name ILIKE '%Lincoln%' LIMIT 1;
INSERT INTO plans (company_id, name, description, match_info, benefits, sort_order)
SELECT id, 'Roth 401(k)', 'Pay taxes now; tax-free growth and withdrawals in retirement.', 'Best for tax-free growth over time.', '["Tax-free withdrawals", "Employer match", "No RMDs on contributions"]'::jsonb, 2
FROM companies WHERE name ILIKE '%Lincoln%' LIMIT 1;

-- Transamerica: multiple plans
INSERT INTO plans (company_id, name, description, match_info, benefits, sort_order)
SELECT id, 'Traditional 401(k)', 'Pre-tax contributions with tax-deferred growth.', 'Solid option for your retirement savings.', '["Pre-tax savings", "Employer match"]'::jsonb, 1
FROM companies WHERE name ILIKE '%Transamerica%' LIMIT 1;
INSERT INTO plans (company_id, name, description, match_info, benefits, sort_order)
SELECT id, 'Roth 401(k)', 'After-tax contributions with tax-free qualified withdrawals.', 'Excellent for growing your money tax-free.', '["Tax-free growth", "Employer match"]'::jsonb, 2
FROM companies WHERE name ILIKE '%Transamerica%' LIMIT 1;
INSERT INTO plans (company_id, name, description, match_info, benefits, sort_order)
SELECT id, 'After-Tax 401(k)', 'Additional savings beyond pre-tax and Roth limits.', 'For maxing out your retirement savings.', '["Higher contribution limit", "Mega backdoor potential"]'::jsonb, 3
FROM companies WHERE name ILIKE '%Transamerica%' LIMIT 1;
