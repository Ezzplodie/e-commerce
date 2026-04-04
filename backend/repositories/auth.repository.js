import { pool } from "../db.js";

const TABLE = "ecommerce.users";

export const authRepository = async (email) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${TABLE} WHERE email = $1`,
    [email],
  );
  return rows[0];
};
