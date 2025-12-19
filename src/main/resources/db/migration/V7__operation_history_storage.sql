ALTER TABLE operation_history
    ADD COLUMN IF NOT EXISTS import_file_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS storage_object_key VARCHAR(512),
    ADD COLUMN IF NOT EXISTS storage_bucket VARCHAR(128),
    ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
    ADD COLUMN IF NOT EXISTS storage_status VARCHAR(64);
