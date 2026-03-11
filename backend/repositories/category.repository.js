import { pool } from "../db.js";

export const createCategoryRepository = async (name, slug) => {
  const { rows } = await pool.query(
    `INSERT INTO ecommerce.categories(name, slug) VALUES ($1, $2) RETURNING * `,
    [name, slug],
  );
  return rows[0];
};

export const getAllCategoriesRepository = async () => {
  const { rows } = await pool.query(`SELECT * FROM ecommerce.categories`);
  return rows;
};
