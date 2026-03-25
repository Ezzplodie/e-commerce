import { pool } from "../db.js";

export const getAttributeValuesRepository = async (attributeCode) => {
  const query = `
    SELECT
      av.id,
      av.attribute_id,
      a.code AS attribute_code,
      a.name AS attribute_name,
      av.value
    FROM ecommerce.attribute_values av
    JOIN ecommerce.attributes a ON a.id = av.attribute_id
    WHERE ($1::text IS NULL OR a.code = $1)
    ORDER BY a.name ASC, av.value ASC, av.id ASC
  `;

  const { rows } = await pool.query(query, [attributeCode ?? null]);
  return rows;
};

export const createAttributeValueRepository = async (attributeCode, value) => {
  const normalizedCode = attributeCode.trim().toLowerCase();
  const trimmedValue = value.trim();

  const attributeResult = await pool.query(
    `
      SELECT id, code, name
      FROM ecommerce.attributes
      WHERE code = $1
      LIMIT 1
    `,
    [normalizedCode],
  );

  const attribute = attributeResult.rows[0];

  if (!attribute) {
    return null;
  }

  const existingResult = await pool.query(
    `
      SELECT
        av.id,
        av.attribute_id,
        a.code AS attribute_code,
        a.name AS attribute_name,
        av.value
      FROM ecommerce.attribute_values av
      JOIN ecommerce.attributes a ON a.id = av.attribute_id
      WHERE av.attribute_id = $1
        AND LOWER(av.value) = LOWER($2)
      LIMIT 1
    `,
    [attribute.id, trimmedValue],
  );

  if (existingResult.rows[0]) {
    return {
      created: false,
      value: existingResult.rows[0],
    };
  }

  const insertResult = await pool.query(
    `
      INSERT INTO ecommerce.attribute_values (attribute_id, value)
      VALUES ($1, $2)
      RETURNING id, attribute_id, value
    `,
    [attribute.id, trimmedValue],
  );

  return {
    created: true,
    value: {
      ...insertResult.rows[0],
      attribute_code: attribute.code,
      attribute_name: attribute.name,
    },
  };
};
