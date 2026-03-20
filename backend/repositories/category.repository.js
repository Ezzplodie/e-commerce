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

export const getCategoryBySlugRepository = async (slug) => {
  const { rows } = await pool.query(
    `SELECT * FROM ecommerce.categories WHERE slug = $1`,
    [slug],
  );
  return rows[0];
};

export const updateCategoryRepository = async (slug, name, newSlug) => {
  const { rows } = await pool.query(
    `UPDATE ecommerce.categories SET name = COALESCE($1, name), slug = COALESCE($2, slug) WHERE slug = $3 RETURNING *`,
    [name, newSlug, slug],
  );
  return rows[0];
};

export const deleteCategoryRepository = async (slug) => {
  const { rows } = await pool.query(
    `DELETE FROM ecommerce.categories WHERE slug = $1 RETURNING *`,
    [slug],
  );
  return rows[0];
};
