import { pool } from "../db.js";
export const createVariantImageRepository = async (
  variantId,
  image_link,
  image_order,
) => {
  const { rows } = await pool.query(
    `INSERT INTO ecommerce.variant_images(variant_id, image_link, image_order) 
                VALUES ($1, $2, $3) RETURNING *`,
    [variantId, image_link, image_order],
  );
  return rows[0];
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
