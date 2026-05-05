import { pool } from "../db.js";
const ATTRIBUTE_VALUES_TABLE = "ecommerce.attribute_values";
const ATTRIBUTES_TABLE = "ecommerce.attributes";
const PRODUCTS_TABLE = "ecommerce.products";
const PRODUCT_VARIANTS_TABLE = "ecommerce.product_variants";
const MATERIALS_TABLE = "ecommerce.materials";

export const getAllSizesRepository = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT av.value 
    FROM ${ATTRIBUTE_VALUES_TABLE} av
    JOIN ${ATTRIBUTES_TABLE} a ON a.id = av.attribute_id
    WHERE a.code = 'size';`,
  );
  return rows;
};

export const getAllColorsRepository = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT av.value 
FROM ${ATTRIBUTE_VALUES_TABLE} av
JOIN ${ATTRIBUTES_TABLE} a ON a.id = av.attribute_id
WHERE a.code = 'color';`,
  );
  return rows;
};

export const getAllFabricRepository = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT m.name AS value
     FROM ${MATERIALS_TABLE} m
     WHERE m.name IS NOT NULL
     ORDER BY m.name ASC;`,
  );
  return rows;
};

export const getFacetsRepository = async ({ colors, sizes, fabric }) => {
  const colorsArr = colors?.length ? colors : null;
  const sizesArr = sizes?.length ? sizes : null;
  const fabricArr = fabric?.length ? fabric : null;

  const { rows } = await pool.query(
    `
    WITH filtered_variants AS (
      SELECT
        pv.id AS variant_id,
        pv.product_id AS product_id
      FROM ${PRODUCT_VARIANTS_TABLE} pv
      JOIN ${PRODUCTS_TABLE} p ON p.id = pv.product_id
      LEFT JOIN ${MATERIALS_TABLE} mat_filter ON mat_filter.id = p.material_id
      WHERE 1=1
        AND (
          $1::text[] IS NULL OR EXISTS (
            SELECT 1
            FROM ecommerce.variant_attribute_values vav
            JOIN ecommerce.attribute_values av ON av.id = vav.attribute_value_id
            JOIN ecommerce.attributes a ON a.id = av.attribute_id
            WHERE vav.variant_id = pv.id
              AND a.code = 'color'
              AND lower(trim(av.value)) = ANY($1::text[])
          )
        )
        AND (
          $2::text[] IS NULL OR EXISTS (
            SELECT 1
            FROM ecommerce.variant_attribute_values vav
            JOIN ecommerce.attribute_values av ON av.id = vav.attribute_value_id
            JOIN ecommerce.attributes a ON a.id = av.attribute_id
            WHERE vav.variant_id = pv.id
              AND a.code = 'size'
              AND lower(trim(av.value)) = ANY($2::text[])
          )
        )
        AND (
          $3::text[] IS NULL OR (
            mat_filter.id IS NOT NULL
            AND lower(trim(mat_filter.name)) = ANY($3::text[])
          )
        )
    )

    SELECT
      a.code AS attribute_code,
      av.value AS value,
      COUNT(DISTINCT fv.product_id)::int AS count
    FROM filtered_variants fv
    JOIN ecommerce.variant_attribute_values vav ON vav.variant_id = fv.variant_id
    JOIN ecommerce.attribute_values av ON av.id = vav.attribute_value_id
    JOIN ecommerce.attributes a ON a.id = av.attribute_id
    WHERE a.code IN ('color','size')
    GROUP BY a.code, av.value

    UNION ALL

    SELECT
      'fabric' AS attribute_code,
      mat.name AS value,
      COUNT(DISTINCT fv.product_id)::int AS count
    FROM filtered_variants fv
    JOIN ${PRODUCTS_TABLE} p2 ON p2.id = fv.product_id
    JOIN ${MATERIALS_TABLE} mat ON mat.id = p2.material_id
    GROUP BY mat.name

    ORDER BY attribute_code ASC, count DESC, value ASC
    `,
    [colorsArr, sizesArr, fabricArr],
  );

  return rows;
};
