-- Rename legacy "table_*" objects to "form_*".
-- This migration is written to be safe on fresh installs where only "form_*" tables exist.

SET FOREIGN_KEY_CHECKS = 0;

-- Rename tables if (and only if) the legacy ones exist.
SET @rename_defs := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'table_definitions')
    AND NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'form_definitions'),
    'RENAME TABLE `table_definitions` TO `form_definitions`',
    'SELECT 1'
  )
);
PREPARE stmt FROM @rename_defs; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @rename_subs := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'table_submits')
    AND NOT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'form_submits'),
    'RENAME TABLE `table_submits` TO `form_submits`',
    'SELECT 1'
  )
);
PREPARE stmt FROM @rename_subs; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Rename FK column if it exists on form_submits.
SET @has_old_col := (
  SELECT IF(
    EXISTS(
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = DATABASE() AND table_name = 'form_submits' AND column_name = 'table_definition_id'
    ),
    1, 0
  )
);

-- Drop referencing FK constraint (name differs by environment) if needed.
SET @drop_fk := (
  SELECT IF(
    @has_old_col = 1,
    (
      SELECT IFNULL(
        CONCAT('ALTER TABLE `form_submits` DROP FOREIGN KEY `', rc.constraint_name, '`'),
        'SELECT 1'
      )
      FROM information_schema.referential_constraints rc
      WHERE rc.constraint_schema = DATABASE()
        AND rc.table_name = 'form_submits'
      LIMIT 1
    ),
    'SELECT 1'
  )
);
PREPARE stmt FROM @drop_fk; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @rename_col := (
  SELECT IF(
    @has_old_col = 1,
    'ALTER TABLE `form_submits` CHANGE COLUMN `table_definition_id` `form_definition_id` VARCHAR(36) NOT NULL',
    'SELECT 1'
  )
);
PREPARE stmt FROM @rename_col; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Ensure index exists (create only if missing).
SET @ensure_index := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'form_submits')
    AND NOT EXISTS(
      SELECT 1 FROM information_schema.statistics
      WHERE table_schema = DATABASE() AND table_name = 'form_submits' AND index_name = 'form_submits_form_definition_id_created_at_idx'
    ),
    'CREATE INDEX `form_submits_form_definition_id_created_at_idx` ON `form_submits` (`form_definition_id`, `created_at`)',
    'SELECT 1'
  )
);
PREPARE stmt FROM @ensure_index; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Ensure FK exists (add only if missing).
SET @ensure_fk := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'form_submits')
    AND NOT EXISTS(
      SELECT 1 FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
        AND table_name = 'form_submits'
        AND referenced_table_name = 'form_definitions'
    ),
    'ALTER TABLE `form_submits` ADD CONSTRAINT `form_submits_form_definition_id_fkey` FOREIGN KEY (`form_definition_id`) REFERENCES `form_definitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE',
    'SELECT 1'
  )
);
PREPARE stmt FROM @ensure_fk; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;

