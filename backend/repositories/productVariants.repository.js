import { pool } from "../db.js";

export const productVariantsRepository = async (
  product_id,
  sku,
  price,
  stock,
  attribute_value_ids,
) => {
  const client = await pool.connect();
  await client.query("BEGIN");
  try {
    const variantResult = await client.query(
      `
      INSERT INTO ecommerce.product_variants
      (product_id, sku, price, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [product_id, sku, price, stock],
    );

    const variantId = variantResult.rows[0].id;

    for (const attributeValueId of attribute_value_ids) {
      await client.query(
        `
        INSERT INTO ecommerce.variant_attribute_values
        (variant_id, attribute_value_id)
        VALUES ($1, $2)
        `,
        [variantId, attributeValueId],
      );
    }

    await client.query("COMMIT");

    return {
      id: variantId,
      product_id,
      sku,
      price,
      stock,
      attribute_value_ids,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
