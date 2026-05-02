import crypto from "node:crypto";
import path from "node:path";
import { getVariantImageStorageContextRepository } from "../repositories/variantImages.repository.js";

const REQUIRED_BUCKET = "product-images";
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const MAX_VARIANT_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const slugifySegment = (value) =>
  value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") ?? "";

const encodeObjectPath = (storagePath) =>
  storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const getRequiredEnvValue = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    const error = new Error(`${name} is required for Supabase Storage`);
    error.status = 500;
    throw error;
  }

  return value;
};

const getSupabaseConfig = () => {
  const url = getRequiredEnvValue("SUPABASE_URL").replace(/\/+$/, "");
  const serviceRoleKey = getRequiredEnvValue("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = getRequiredEnvValue("SUPABASE_STORAGE_BUCKET");

  if (bucket !== REQUIRED_BUCKET) {
    const error = new Error(
      `SUPABASE_STORAGE_BUCKET must be "${REQUIRED_BUCKET}"`,
    );
    error.status = 500;
    throw error;
  }

  return {
    url,
    serviceRoleKey,
    bucket,
  };
};

const getStoredImageTarget = (imageRecord) => {
  if (!imageRecord?.storage_path) {
    const error = new Error(
      "Image does not have a storage_path; bucket-only storage is required",
    );
    error.status = 409;
    throw error;
  }

  return {
    bucket: imageRecord.storage_bucket || REQUIRED_BUCKET,
    storagePath: imageRecord.storage_path,
  };
};

export const assertSupabaseStorageConfigured = () => getSupabaseConfig();

export const sanitizeFileName = (fileName) => {
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);
  const safeBaseName = baseName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const safeExtension = extension.replace(/[^a-zA-Z0-9.]/g, "");

  return `${safeBaseName || "image"}${safeExtension || ""}`;
};

export const buildStoragePath = ({
  productId,
  variantId,
  color,
  originalName,
}) => {
  const normalizedColor = slugifySegment(color);

  if (!normalizedColor) {
    const error = new Error(
      "Variant color is required before uploading images",
    );
    error.status = 400;
    throw error;
  }

  return [
    "products",
    String(productId),
    "variants",
    String(variantId),
    "colors",
    normalizedColor,
    `${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(originalName)}`,
  ].join("/");
};

export const generatePublicUrl = (storagePath, bucket = REQUIRED_BUCKET) => {
  const { url } = getSupabaseConfig();
  return `${url}/storage/v1/object/public/${bucket}/${encodeObjectPath(storagePath)}`;
};

export const uploadBufferToSupabaseStorage = async ({
  storagePath,
  buffer,
  contentType,
}) => {
  const { url, serviceRoleKey, bucket } = getSupabaseConfig();

  const response = await fetch(
    `${url}/storage/v1/object/${bucket}/${encodeObjectPath(storagePath)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        "Content-Type": contentType,
        "x-upsert": "false",
      },
      body: buffer,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(errorText || "Supabase storage upload failed");
    error.status = response.status >= 400 ? response.status : 502;
    throw error;
  }

  return {
    storage_bucket: bucket,
    storage_path: storagePath,
  };
};

export const assertVariantImageUploadIsAllowed = (file) => {
  if (!file) {
    const error = new Error("Image file is required");
    error.status = 400;
    throw error;
  }

  if (!SUPPORTED_IMAGE_TYPES.has(file.mimetype)) {
    const error = new Error("Unsupported image type");
    error.status = 400;
    throw error;
  }

  if (!Number.isFinite(file.size) || file.size <= 0) {
    const error = new Error("Image file is invalid");
    error.status = 400;
    throw error;
  }

  if (file.size > MAX_VARIANT_IMAGE_SIZE_BYTES) {
    const error = new Error("Image file is too large");
    error.status = 413;
    throw error;
  }
};

const deleteObjectFromSupabaseStorage = async ({ bucket, storagePath }) => {
  const { url, serviceRoleKey } = getSupabaseConfig();

  const response = await fetch(
    `${url}/storage/v1/object/${bucket}/${encodeObjectPath(storagePath)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
    },
  );

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    const error = new Error(errorText || "Supabase storage delete failed");
    error.status = response.status >= 400 ? response.status : 502;
    throw error;
  }
};

export const uploadVariantImageFile = async (variantId, file) => {
  assertVariantImageUploadIsAllowed(file);

  const context = await getVariantImageStorageContextRepository(variantId);

  if (!context) {
    const error = new Error("Variant not found");
    error.status = 404;
    throw error;
  }

  if (!context.color?.trim()) {
    const error = new Error(
      "Variant color is required before uploading images",
    );
    error.status = 400;
    throw error;
  }

  const storagePath = buildStoragePath({
    productId: context.product_id,
    variantId: context.variant_id,
    color: context.color,
    originalName: file.originalname,
  });

  const storedFile = await uploadBufferToSupabaseStorage({
    storagePath,
    buffer: file.buffer,
    contentType: file.mimetype,
  });

  return {
    ...storedFile,
    content_type: file.mimetype,
    file_size: file.size,
  };
};

export const deleteStoredVariantImage = async (imageRecord) => {
  const path = imageRecord?.storage_path?.trim();
  if (!path) {
    return;
  }
  const target = getStoredImageTarget(imageRecord);
  await deleteObjectFromSupabaseStorage(target);
};

export const mapVariantImageRecordToResponse = (imageRecord) => {
  const legacyLink =
    imageRecord?.legacy_image_link ?? imageRecord?.image_link ?? null;
  const imageLink = imageRecord?.storage_path
    ? generatePublicUrl(
        imageRecord.storage_path,
        imageRecord.storage_bucket || REQUIRED_BUCKET,
      )
    : (legacyLink ?? "");

  return {
    id: imageRecord.id,
    image_link: imageLink,
    image_order: imageRecord.image_order,
    storage_bucket: imageRecord.storage_bucket ?? null,
    storage_path: imageRecord.storage_path ?? null,
    content_type: imageRecord.content_type ?? null,
    file_size: imageRecord.file_size ?? null,
  };
};

export const mapProductImagesToResponse = (product) => ({
  ...product,
  variants: (product.variants || []).map((variant) => ({
    ...variant,
    variant_images: (variant.variant_images || []).map(
      mapVariantImageRecordToResponse,
    ),
  })),
});
