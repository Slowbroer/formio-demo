-- Remove legacy "forms" table (no longer used).
-- Safe for fresh DBs where it doesn't exist.

DROP TRIGGER IF EXISTS "forms_updated_at";
DROP TABLE IF EXISTS "forms";

