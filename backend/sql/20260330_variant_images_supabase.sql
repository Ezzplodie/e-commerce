ALTER TABLE ecommerce.variant_images
  ADD COLUMN IF NOT EXISTS storage_bucket text,
  ADD COLUMN IF NOT EXISTS storage_path text,
  ADD COLUMN IF NOT EXISTS content_type text,
  ADD COLUMN IF NOT EXISTS file_size bigint;

ALTER TABLE ecommerce.variant_images
  ALTER COLUMN image_link DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'variant_images_storage_bucket_check'
  ) THEN
    ALTER TABLE ecommerce.variant_images
      ADD CONSTRAINT variant_images_storage_bucket_check
      CHECK (
        storage_bucket IS NULL
        OR storage_bucket = 'product-images'
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'variant_images_storage_path_presence_check'
  ) THEN
    ALTER TABLE ecommerce.variant_images
      ADD CONSTRAINT variant_images_storage_path_presence_check
      CHECK (
        (storage_path IS NULL AND storage_bucket IS NULL)
        OR (storage_path IS NOT NULL AND storage_bucket IS NOT NULL)
      );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS variant_images_storage_path_unique_idx
  ON ecommerce.variant_images (storage_path)
  WHERE storage_path IS NOT NULL;
