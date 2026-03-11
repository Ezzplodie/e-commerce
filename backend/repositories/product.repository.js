import { pool } from "../db.js";
export const createProductRepository = async (
  category_id,
  name,
  slug,
  description,
  base_price,
) => {
  const { rows } = await pool.query(
    `INSERT INTO ecommerce.products(category_id, name, slug, description, base_price ) 
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
          'name', p.name,
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
                          'image_link', vi.image_link,
                          'image_order', vi.image_order
                        )
                      )
                      FROM ecommerce.variant_images vi
                      WHERE vi.variant_id = pv.id
                    ),
                    '[]'::jsonb
                  ),
                  'attributes', COALESCE(
                    (
                      SELECT jsonb_object_agg(a.code, av.value)
                      FROM ecommerce.variant_attribute_values vav
                      JOIN ecommerce.attribute_values av ON av.id = vav.attribute_value_id
                      JOIN ecommerce.attributes a ON a.id = av.attribute_id
                      WHERE vav.variant_id = pv.id
                    ),
                    '{}'::jsonb
                  )
                )
              )
              FROM ecommerce.product_variants pv
              WHERE pv.product_id = p.id
            ),
            '[]'::jsonb
          )
        ) AS result
      FROM ecommerce.products p
      LEFT JOIN ecommerce.categories c ON p.category_id = c.id
      WHERE p.slug = $1;
      `,
    [slug],
  );
  return rows[0]?.result;
};

export const getAllProductsRepository = async (limit, offset) => {
  const { rows } = await pool.query(
    `SELECT *, COUNT(*) OVER() as total_count
  FROM ecommerce.products
  LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const total_count = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
  const products = rows.map(({ total_count, ...rest }) => rest);
  return { rows: products, total_count };
};
