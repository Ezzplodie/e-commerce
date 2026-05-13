import { pool } from "../db.js";

const TABLE = "ecommerce.users";

export const authRepository = async (email) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${TABLE} WHERE email = $1`,
    [email],
  );
  return rows[0];
};

export const getUserByEmailRepository = authRepository;

export const createUserRepository = async ({
  email,
  passwordHash,
  role = "user",
}) => {
  const { rows } = await pool.query(
    `INSERT INTO ${TABLE} (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [email, passwordHash, role],
  );

  return rows[0];
};
