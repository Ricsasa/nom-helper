-- The application reaches the database through the service role only: every
-- query goes through src/lib/db, which runs on the server. The default
-- privileges of the instance do not cover the tables created by these
-- migrations, so the grants are explicit here.
--
-- The role is guarded: on a plain PostgreSQL instance (RDS, self-hosted) it
-- does not exist and the migration becomes a no-op instead of an error.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT USAGE ON SCHEMA public TO service_role;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      GRANT EXECUTE ON FUNCTIONS TO service_role;
  END IF;
END;
$$;
