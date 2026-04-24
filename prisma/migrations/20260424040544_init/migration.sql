/*
  Warnings:

  - You are about to alter the column `definition` on the `form_definitions` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `submission` on the `form_submits` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_form_definitions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_form_definitions" ("created_at", "definition", "id", "name", "updated_at") SELECT "created_at", "definition", "id", "name", "updated_at" FROM "form_definitions";
DROP TABLE "form_definitions";
ALTER TABLE "new_form_definitions" RENAME TO "form_definitions";
CREATE TABLE "new_form_submits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "form_definition_id" TEXT NOT NULL,
    "submission" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "form_submits_form_definition_id_fkey" FOREIGN KEY ("form_definition_id") REFERENCES "form_definitions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_form_submits" ("created_at", "form_definition_id", "id", "submission") SELECT "created_at", "form_definition_id", "id", "submission" FROM "form_submits";
DROP TABLE "form_submits";
ALTER TABLE "new_form_submits" RENAME TO "form_submits";
CREATE INDEX "form_submits_form_definition_id_created_at_idx" ON "form_submits"("form_definition_id", "created_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
