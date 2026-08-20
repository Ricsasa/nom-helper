-- The only seed record of this phase. Billing is not active.
INSERT INTO public.plans (name, daily_quota_limit, price)
VALUES ('free', 10, 0)
ON CONFLICT (name) DO NOTHING;
