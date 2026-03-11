import { pool } from "../db.js";
export const authRepository = async (email) => {
  const { rows } = await pool.query(
    `SELECT * FROM ecommerce.users WHERE email = $1`,
    [email],
  );
  return rows[0];
};
