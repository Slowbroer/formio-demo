-- SQLite initial schema

CREATE TABLE "form_definitions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "definition" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "form_submits" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "form_definition_id" TEXT NOT NULL,
  "submission" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "form_submits_form_definition_id_fkey"
    FOREIGN KEY ("form_definition_id") REFERENCES "form_definitions" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "form_submits_form_definition_id_created_at_idx"
  ON "form_submits"("form_definition_id", "created_at");

CREATE TRIGGER "form_definitions_updated_at"
AFTER UPDATE ON "form_definitions"
FOR EACH ROW
BEGIN
  UPDATE "form_definitions" SET "updated_at" = CURRENT_TIMESTAMP WHERE "id" = OLD."id";
END;

