-- Enable Row Level Security on every table, with no policies.
--
-- The application reaches Postgres through Prisma on a direct connection as the
-- table owner, and owners bypass RLS, so nothing in the app changes.
--
-- What this closes is the Supabase PostgREST API, which serves the same tables
-- to the `anon` and `authenticated` roles. That anon key is designed to be
-- embedded in client code and must be assumed public. With RLS off, anyone
-- holding it could read every Person, Lead and Consent row.
--
-- No policies is deliberate, not an oversight: RLS with zero policies denies
-- everything on that path. We use neither Supabase Auth nor the JS client, so
-- there is no legitimate traffic to break. If the client portal (P3-L-048) ever
-- talks to PostgREST directly, policies get added then — explicitly.
--
-- docs/compliance/RULES.md §POPIA

ALTER TABLE "OrganisationSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Household" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Person" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Consent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Interaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
