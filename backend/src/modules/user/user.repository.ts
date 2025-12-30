import { query } from "../../db";
import { User } from "./user.types";

export const createUser = async (
  email: string,
  passwordHash: string
): Promise<User> => {
  const { rows } = await query(
    `
    INSERT INTO clothes_shop.users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at
    `,
    [email, passwordHash]
  );

  return rows[0];
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const { rows } = await query(
    `
    SELECT *
    FROM clothes_shop.users
    WHERE email = $1
    `,
    [email]
  );

  return rows[0] ?? null;
};
