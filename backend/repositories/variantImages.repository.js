import { pool } from "../db.js";

const syncVariantImagesIdSequence = async () => {
  await pool.query(`
    SELECT setval(
      pg_get_serial_sequence('ecommerce.variant_images', 'id'),
      COALESCE((SELECT MAX(id) FROM ecommerce.variant_images), 0) + 1,
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
  FROM ecommerce.variant_images vi
`;

export const createVariantImageRepository = async (
  variantId,
  { storage_bucket, storage_path, content_type, file_size, image_order },
) => {
  const insertQuery = `
    INSERT INTO ecommerce.variant_images(
      variant_id,
      image_order,
      storage_bucket,
      storage_path,
      content_type,
      file_size,
      image_link
    )
    VALUES ($1, $2, $3, $4, $5, $6, NULL)
    RETURNING *
  `;

  const values = [
    variantId,
    image_order,
    storage_bucket,
    storage_path,
    content_type,
    file_size,
  ];

  try {
    const { rows } = await pool.query(insertQuery, values);
    return rows[0];
  } catch (error) {
    if (
      error?.code === "23505" &&
      error?.constraint === "variant_images_pkey"
    ) {
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
        pv.id AS variant_id,
        pv.product_id,
        MAX(CASE WHEN a.code = 'color' THEN av.value END) AS color
      FROM ecommerce.product_variants pv
      LEFT JOIN ecommerce.variant_attribute_values vav ON vav.variant_id = pv.id
      LEFT JOIN ecommerce.attribute_values av ON av.id = vav.attribute_value_id
      LEFT JOIN ecommerce.attributes a ON a.id = av.attribute_id
      WHERE pv.id = $1
      GROUP BY pv.id, pv.product_id
    `,
    [variantId],
  );

  return rows[0] ?? null;
};

export const getVariantImageRepository = async (imageId) => {
  const { rows } = await pool.query(
    `${variantImageSelect} WHERE vi.id = $1`,
    [imageId],
  );

  return rows[0] ?? null;
};

export const updateVariantImageRepository = async (imageId, image_order) => {
  const { rows } = await pool.query(
    `UPDATE ecommerce.variant_images
     SET image_order = COALESCE($1, image_order)
     WHERE id = $2
     RETURNING *`,
    [image_order, imageId],
  );

  return rows[0] ?? null;
};

export const deleteVariantImageRepository = async (imageId) => {
  const { rows } = await pool.query(
    `DELETE FROM ecommerce.variant_images WHERE id = $1 RETURNING *`,
    [imageId],
  );

  return rows[0] ?? null;
};
