import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { getVariantImageStorageContextRepository } from "../repositories/variantImages.repository.js";

const LOCAL_UPLOAD_ROOT = path.resolve(process.cwd(), "uploads", "variants");
const DEFAULT_BUCKET = "product-images";

const sanitizeFileName = (fileName) => {
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

const slugifySegment = (value) =>
  value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "unassigned";

const encodeObjectPath = (objectPath) =>
  objectPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const getSupabaseProjectRefFromDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(databaseUrl);
    const username = decodeURIComponent(parsedUrl.username);

    if (!username.startsWith("postgres.")) {
      return null;
    }

    return username.slice("postgres.".length) || null;
  } catch {
    return null;
  }
};

const getSupabaseBaseUrl = () => {
  const configuredUrl = process.env.SUPABASE_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const projectRef = getSupabaseProjectRefFromDatabaseUrl();
  return projectRef ? `https://${projectRef}.supabase.co` : null;
};

const getStorageBucket = () =>
  process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET;

const getStorageApiKey = () =>
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.SUPABASE_ANON_KEY?.trim() ||
  null;

const isSupabaseStorageConfigured = () =>
  Boolean(getSupabaseBaseUrl() && getStorageApiKey());

const buildVariantObjectPath = (context, fileName) => {
  const colorSegment = slugifySegment(context?.color);
  const safeFileName = sanitizeFileName(fileName);
  // to avoid potential filename collisions, we prepend a unique prefix to the filename
  const uniquePrefix = `${Date.now()}-${crypto.randomUUID()}`;

  return [
    "products",
    String(context.product_id),
    "variants",
    String(context.variant_id),
    "colors",
    colorSegment,
    `${uniquePrefix}-${safeFileName}`,
  ].join("/");
};
// This structure allows for efficient organization and retrieval of variant images based on their associated product, variant, and color, while also ensuring that filenames are safe and unique to prevent collisions
const buildSupabasePublicUrl = (objectPath) => {
  const supabaseBaseUrl = getSupabaseBaseUrl();
  const bucket = getStorageBucket();

  if (!supabaseBaseUrl) {
    throw new Error("Supabase URL is not configured");
  }

  return `${supabaseBaseUrl}/storage/v1/object/public/${bucket}/${encodeObjectPath(objectPath)}`;
};

const uploadToSupabaseStorage = async (objectPath, file) => {
  const supabaseBaseUrl = getSupabaseBaseUrl();
  const apiKey = getStorageApiKey();
  const bucket = getStorageBucket();

  if (!supabaseBaseUrl || !apiKey) {
    throw new Error("Supabase storage credentials are not configured");
  }

  const response = await fetch(
    `${supabaseBaseUrl}/storage/v1/object/${bucket}/${encodeObjectPath(objectPath)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        apikey: apiKey,
        "Content-Type": file.mimetype || "application/octet-stream",
        "x-upsert": "false",
      },
      body: file.buffer,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Supabase storage upload failed");
  }

  return buildSupabasePublicUrl(objectPath);
};

const uploadToLocalStorage = async (objectPath, file) => {
  const targetPath = path.resolve(LOCAL_UPLOAD_ROOT, objectPath);
  const targetDir = path.dirname(targetPath);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, file.buffer);

  return `/uploads/variants/${objectPath.replace(/\\/g, "/")}`;
};

const extractSupabaseObjectPath = (imageLink) => {
  const supabaseBaseUrl = getSupabaseBaseUrl();
  const bucket = getStorageBucket();

  if (!supabaseBaseUrl || !imageLink) {
    return null;
  }

  try {
    const imageUrl = new URL(imageLink);
    const supabaseUrl = new URL(supabaseBaseUrl);
    const prefix = `/storage/v1/object/public/${bucket}/`;

    if (
      imageUrl.origin !== supabaseUrl.origin ||
      !imageUrl.pathname.startsWith(prefix)
    ) {
      return null;
    }

    return decodeURIComponent(imageUrl.pathname.slice(prefix.length));
  } catch {
    return null;
  }
};

const deleteFromSupabaseStorage = async (objectPath) => {
  const supabaseBaseUrl = getSupabaseBaseUrl();
  const apiKey = getStorageApiKey();
  const bucket = getStorageBucket();

  if (!supabaseBaseUrl || !apiKey || !objectPath) {
    return;
  }

  const response = await fetch(
    `${supabaseBaseUrl}/storage/v1/object/${bucket}/${encodeObjectPath(objectPath)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        apikey: apiKey,
      },
    },
  );

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(errorText || "Supabase storage delete failed");
  }
};

const deleteFromLocalStorage = async (imageLink) => {
  if (!imageLink?.startsWith("/uploads/variants/")) {
    return;
  }

  const relativePath = imageLink.slice("/uploads/variants/".length);
  const targetPath = path.resolve(LOCAL_UPLOAD_ROOT, relativePath);

  if (!targetPath.startsWith(LOCAL_UPLOAD_ROOT)) {
    return;
  }

  try {
    await fs.unlink(targetPath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
};

export const uploadVariantImageFile = async (variantId, file) => {
  const context = await getVariantImageStorageContextRepository(variantId);

  if (!context) {
    const error = new Error("Variant not found");
    error.status = 404;
    throw error;
  }

  const objectPath = buildVariantObjectPath(context, file.originalname);

  if (isSupabaseStorageConfigured()) {
    const imageLink = await uploadToSupabaseStorage(objectPath, file);
    return { imageLink, objectPath, storage: "supabase" };
  }

  const imageLink = await uploadToLocalStorage(objectPath, file);
  return { imageLink, objectPath, storage: "local" };
};

export const removeStoredVariantImage = async (imageLink) => {
  const supabaseObjectPath = extractSupabaseObjectPath(imageLink);

  if (supabaseObjectPath) {
    await deleteFromSupabaseStorage(supabaseObjectPath);
    return;
  }

  await deleteFromLocalStorage(imageLink);
};
