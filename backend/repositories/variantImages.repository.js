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
