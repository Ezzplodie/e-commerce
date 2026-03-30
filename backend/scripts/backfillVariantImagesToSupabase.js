import fs from "node:fs/promises";
import path from "node:path";
import { pool } from "../db.js";
import {
  buildStoragePathFromLegacyUploadsLink,
  uploadBufferToSupabaseStorage,
} from "../services/variantImageStorage.service.js";

const LEGACY_UPLOAD_ROOT = path.resolve(process.cwd(), "uploads", "variants");

const MIME_BY_EXTENSION = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

const getContentType = (imageLink, existingContentType) => {
  if (existingContentType) {
    return existingContentType;
  }

  const extension = path.extname(imageLink).toLowerCase();
  return MIME_BY_EXTENSION[extension] ?? null;
};

const backfillVariantImagesToSupabase = async () => {
  const { rows } = await pool.query(
    `
      SELECT
        id,
        image_link,
        content_type
      FROM ecommerce.variant_images
      WHERE storage_path IS NULL
        AND image_link LIKE '/uploads/variants/%'
      ORDER BY id ASC
    `,
  );

  for (const row of rows) {
    const storagePath = buildStoragePathFromLegacyUploadsLink(row.image_link);
    const localFilePath = path.resolve(LEGACY_UPLOAD_ROOT, storagePath);
    const buffer = await fs.readFile(localFilePath);
    const contentType = getContentType(row.image_link, row.content_type);

    if (!contentType) {
      throw new Error(`Cannot determine content type for image #${row.id}`);
    }

    const storedFile = await uploadBufferToSupabaseStorage({
      storagePath,
      buffer,
      contentType,
    });

    await pool.query(
      `
        UPDATE ecommerce.variant_images
        SET storage_bucket = $1,
            storage_path = $2,
            content_type = $3,
            file_size = $4
        WHERE id = $5
      `,
      [
        storedFile.storage_bucket,
        storedFile.storage_path,
        contentType,
        buffer.length,
        row.id,
      ],
    );

    console.log(`Backfilled image #${row.id} -> ${storagePath}`);
  }
};

backfillVariantImagesToSupabase()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exitCode = 1;
  });
