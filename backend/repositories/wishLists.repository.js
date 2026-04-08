import { pool } from "../db.js";
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
    `SELECT * FROM ${TABLE} WHERE user_id = $1`,
    [user_id],
  );
  return rows;
};

export const deleteWishListItemRepository = async (user_id, variant_id) => {
  await pool.query(
    `DELETE FROM ${TABLE} WHERE user_id = $1 AND variant_id = $2`,
    [user_id, variant_id],
  );
};
