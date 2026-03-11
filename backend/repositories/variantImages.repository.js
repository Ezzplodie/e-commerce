import { pool } from "../db.js";
export const variantImagesRepository = async (
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
