import { pool } from "../db.js";

const VARIANT_IMAGES_TABLE = "ecommerce.variant_images";
const PRODUCT_VARIANTS_TABLE = "ecommerce.product_variants";
const VARIANT_ATTRIBUTE_VALUES_TABLE = "ecommerce.variant_attribute_values";
const ATTRIBUTE_VALUES_TABLE = "ecommerce.attribute_values";
const ATTRIBUTES_TABLE = "ecommerce.attributes";

const syncVariantImagesIdSequence = async () => {
  await pool.query(`
    SELECT setval(
      pg_get_serial_sequence('${VARIANT_IMAGES_TABLE}', 'id'),
      COALESCE((SELECT MAX(id) FROM ${VARIANT_IMAGES_TABLE}), 0) + 1,
      false
    )
  `);
};

const variantImageSelect = `
  SELECT 
    vi.id, 
    vi.variant_id,
    vi.image_order,
    vi.image_link,
    vi.storage_bucket,
    vi.storage_path,
    vi.content_type,
    vi.file_size
  FROM ${VARIANT_IMAGES_TABLE} AS vi`;

export const createVariantImageRepository = async (
  variantId,
  { storage_bucket, storage_path, content_type, file_size, image_order },
) => {
  const insertQuery = `
    INSERT INTO ${VARIANT_IMAGES_TABLE}(variant_id, storage_bucket, storage_path, content_type, file_size, image_order, image_link)
    VALUES ($1, $2, $3, $4, $5, $6, NULL) 
    RETURNING *`;

  const values = [
    variantId,
    storage_bucket,
    storage_path,
    content_type,
    file_size,
    image_order,
  ];

  try {
    const { rows } = await pool.query(insertQuery, values);
    return rows[0];
  } catch (error) {
    if (error.code === "23503") {
      const notFoundError = new Error("Variant not found");
      notFoundError.status = 404;
      throw notFoundError;
    }

    if (error.code === "23505" && error.constraint === "variant_images_pkey") {
      await syncVariantImagesIdSequence();
      const { rows } = await pool.query(insertQuery, values);
      return rows[0];
    }
    throw error;
  }
};

export const getVariantImageStorageContextRepository = async (variantId) => {
  const { rows } = await pool.query(
    `
    SELECT 
      pv.id as variant_id, 
      pv.product_id, 
      MAX(CASE WHEN a.name = 'color' THEN av.value END) AS color
    FROM ${PRODUCT_VARIANTS_TABLE} AS pv
    LEFT JOIN ${VARIANT_ATTRIBUTE_VALUES_TABLE} AS vav ON pv.id = vav.variant_id
    LEFT JOIN ${ATTRIBUTE_VALUES_TABLE} AS av ON vav.attribute_value_id = av.id
    LEFT JOIN ${ATTRIBUTES_TABLE} AS a ON av.attribute_id = a.id
    WHERE pv.id = $1
    GROUP BY pv.id, pv.product_id
  `,
    [variantId],
  );

  return rows[0] ?? null;
};

export const getVariantImageRepository = async (imageId) => {
  const { rows } = await pool.query(`${variantImageSelect} WHERE vi.id = $1`, [
    imageId,
  ]);
  return rows[0] ?? null;
};

export const updateVariantImageOrderRepository = async (
  imageId,
  image_order,
) => {
  const { rows } = await pool.query(
    `
    UPDATE ${VARIANT_IMAGES_TABLE}
    SET image_order = COALESCE($1, image_order)
    WHERE id = $2
    RETURNING *
  `,
    [image_order, imageId],
  );
  return rows[0] ?? null;
};

export const deleteVariantImageRepository = async (imageId) => {
  const { rows } = await pool.query(
    `DELETE FROM ${VARIANT_IMAGES_TABLE} WHERE id = $1 RETURNING *`,
    [imageId],
  );
  return rows[0] ?? null;
};
