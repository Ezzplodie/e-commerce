import { pool } from "../db.js";
import { getVariantsByIdsRepository } from "./productVariants.repository.js";

const TABLE = "ecommerce.wish_lists";

export const createWishListRepository = async (user_id, variant_id) => {
  const { rows } = await pool.query(
    `INSERT INTO ${TABLE} (user_id, variant_id) VALUES ($1, $2) RETURNING *`,
    [user_id, variant_id],
  );
  return rows[0];
};

export const getWishListByUserIdRepository = async (user_id) => {
  const { rows } = await pool.query(
    `SELECT id, variant_id, created_at
     FROM ${TABLE}
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user_id],
  );

  if (rows.length === 0) {
    return [];
  }

  const variantIds = rows.map((row) => Number(row.variant_id));
  const variants = await getVariantsByIdsRepository(variantIds);

  // Index variants for O(1) lookup so we keep wish_lists ordering (created_at DESC)
  const variantsById = new Map(variants.map((v) => [v.variant_id, v]));

  return rows
    .map((row) => {
      const variant = variantsById.get(Number(row.variant_id));
      if (!variant) return null;
      return {
        wish_list_id: row.id,
        created_at: row.created_at,
        ...variant,
      };
    })
    .filter(Boolean);
};

export const deleteWishListItemRepository = async (user_id, variant_id) => {
  await pool.query(
    `DELETE FROM ${TABLE} WHERE user_id = $1 AND variant_id = $2`,
    [user_id, variant_id],
  );
};
