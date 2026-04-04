import { pool } from "../db.js";

const PRODUCTS_TABLE = "ecommerce.products";
const CATEGORIES_TABLE = "ecommerce.categories";
const PRODUCT_VARIANTS_TABLE = "ecommerce.product_variants";
const VARIANT_IMAGES_TABLE = "ecommerce.variant_images";
const VARIANT_ATTRIBUTE_VALUES_TABLE = "ecommerce.variant_attribute_values";
const ATTRIBUTE_VALUES_TABLE = "ecommerce.attribute_values";
const ATTRIBUTES_TABLE = "ecommerce.attributes";

export const createProductRepository = async (
  category_id,
  name,
  slug,
  description,
  base_price,
) => {
  const { rows } = await pool.query(
    `INSERT INTO ${PRODUCTS_TABLE}(category_id, name, slug, description, base_price )
          VALUES ($1, $2, $3, $4, $5) RETURNING * `,
    [category_id, name, slug, description, base_price],
  );
  return rows[0];
};

export const getProductBySlugRepository = async (slug) => {
  const { rows } = await pool.query(
    `
      SELECT
        jsonb_build_object(
          'id', p.id,
          'slug', p.slug,
          'name', p.name,
          'description', p.description,
          'category_id', p.category_id,
          'category_name', c.name,
          'category_slug', c.slug,
          'base_price', p.base_price,
          'variants', COALESCE(
            (
              SELECT jsonb_agg(
                jsonb_build_object(
                  'id', pv.id,
                  'sku', pv.sku,
                  'price', pv.price,
                  'stock', pv.stock,
                  'variant_images', COALESCE(
                    (
                      SELECT jsonb_agg(
                        jsonb_build_object(
                          'id', vi.id,
                          'legacy_image_link', vi.image_link,
                          'storage_bucket', vi.storage_bucket,
                          'storage_path', vi.storage_path,
                          'content_type', vi.content_type,
                          'file_size', vi.file_size,
                          'image_order', vi.image_order
                        )
                        ORDER BY vi.image_order ASC, vi.id ASC
                      )
                      FROM ${VARIANT_IMAGES_TABLE} vi
                      WHERE vi.variant_id = pv.id
                    ),
                    '[]'::jsonb
                  ),
                  'attributes', COALESCE(
                    (
                      SELECT jsonb_object_agg(a.code, av.value)
                      FROM ${VARIANT_ATTRIBUTE_VALUES_TABLE} vav
                      JOIN ${ATTRIBUTE_VALUES_TABLE} av ON av.id = vav.attribute_value_id
                      JOIN ${ATTRIBUTES_TABLE} a ON a.id = av.attribute_id
                      WHERE vav.variant_id = pv.id
                    ),
                    '{}'::jsonb
                  )
                )
              )
              FROM ${PRODUCT_VARIANTS_TABLE} pv
              WHERE pv.product_id = p.id
            ),
            '[]'::jsonb
          )
        ) AS result
      FROM ${PRODUCTS_TABLE} p
      LEFT JOIN ${CATEGORIES_TABLE} c ON p.category_id = c.id
      WHERE p.slug = $1;
      `,
    [slug],
  );
  return rows[0]?.result;
};

export const getAllProductsRepository = async (limit, offset) => {
  const { rows } = await pool.query(
    `SELECT
      p.*,
      c.name AS category_name,
      COUNT(pv.id)::int AS variant_count,
      COALESCE(SUM(pv.stock), 0)::int AS total_stock,
      COUNT(*) OVER() AS total_count
    FROM ${PRODUCTS_TABLE} p
    LEFT JOIN ${CATEGORIES_TABLE} c ON c.id = p.category_id
    LEFT JOIN ${PRODUCT_VARIANTS_TABLE} pv ON pv.product_id = p.id
    GROUP BY p.id, c.name
    ORDER BY p.id DESC
    LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const total_count = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
  const products = rows.map(({ total_count, ...rest }) => rest);
  return { rows: products, total_count };
};

export const deleteProductRepository = async (slug) => {
  const { rows } = await pool.query(
    `DELETE FROM ${PRODUCTS_TABLE} WHERE slug = $1 RETURNING *`,
    [slug],
  );
  return rows[0];
};

export const updateProductRepository = async (
  slug,
  category_id,
  name,
  newSlug,
  description,
  base_price,
) => {
  const { rows } = await pool.query(
    `UPDATE ${PRODUCTS_TABLE}
     SET category_id = COALESCE($1, category_id),
         name = COALESCE($2, name),
         slug = COALESCE($3, slug),
         description = COALESCE($4, description),
         base_price = COALESCE($5, base_price)
     WHERE slug = $6
     RETURNING *`,
    [category_id, name, newSlug, description, base_price, slug],
  );
  return rows[0];
};
