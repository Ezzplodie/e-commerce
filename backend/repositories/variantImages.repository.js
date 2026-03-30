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
// This function ensures that the sequence for the 'id' column in the 'variant_images' table is correctly set to avoid conflicts when inserting new records, especially after manual inserts or deletions that might have caused the sequence to become out of sync with the actual data in the table.
export const createVariantImageRepository = async (
  variantId,
  image_link,
  image_order,
) => {
  const insertQuery = `
    INSERT INTO ecommerce.variant_images(variant_id, image_link, image_order)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  try {
    const { rows } = await pool.query(insertQuery, [
      variantId,
      image_link,
      image_order,
    ]);
    return rows[0];
  } catch (error) {
    if (
      error?.code === "23505" &&
      error?.constraint === "variant_images_pkey"
    ) {
      await syncVariantImagesIdSequence();
      const { rows } = await pool.query(insertQuery, [
        variantId,
        image_link,
        image_order,
      ]);
      return rows[0];
    }

    throw error;
  }
};

// The getVariantImageStorageContextRepository function retrieves the necessary context for storing variant images, such as the variant ID, product ID, and color attribute (if available). This information is crucial for determining where and how to store the image, especially when using structured storage solutions like Supabase or local file systems.
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

export const updateVariantImageRepository = async (
  imageId,
  image_link,
  image_order,
) => {
  const { rows } = await pool.query(
    `UPDATE ecommerce.variant_images
     SET image_link = COALESCE($1, image_link),
         image_order = COALESCE($2, image_order)
     WHERE id = $3
     RETURNING *`,
    [image_link, image_order, imageId],
  );

  return rows[0];
};

export const deleteVariantImageRepository = async (imageId) => {
  const { rows } = await pool.query(
    `DELETE FROM ecommerce.variant_images WHERE id = $1 RETURNING *`,
    [imageId],
  );

  return rows[0];
};
