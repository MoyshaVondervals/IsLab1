

BEGIN;


ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(255);


UPDATE users
SET role = 'USER'
WHERE role IS NULL;


ALTER TABLE users
    ALTER COLUMN role SET NOT NULL;


DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint c
                     JOIN pg_class t ON t.oid = c.conrelid
            WHERE t.relname = 'users'
              AND c.conname = 'uc_users_username'
              AND c.contype = 'u'
        ) THEN
            -- Если именно такого ограничения нет, создадим через индекс
            CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users(username);
            ALTER TABLE users
                ADD CONSTRAINT uc_users_username UNIQUE USING INDEX idx_users_username_unique;
        END IF;
    END$$;

COMMIT;
