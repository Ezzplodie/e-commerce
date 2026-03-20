import { pool } from "../db.js";

export const createProductVariantRepository = async (
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

export const updateProductVariantRepository = async (
  variantId,
  product_id,
  sku,
  price,
  stock,
  attribute_value_ids,
) => {
  const client = await pool.connect();
  await client.query("BEGIN");
  try {
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (product_id !== undefined) {
      updateFields.push(`product_id = $${paramIndex++}`);
      updateValues.push(product_id);
    }
    if (sku !== undefined) {
      updateFields.push(`sku = $${paramIndex++}`);
      updateValues.push(sku);
    }
    if (price !== undefined) {
      updateFields.push(`price = $${paramIndex++}`);
      updateValues.push(price);
    }
    if (stock !== undefined) {
      updateFields.push(`stock = $${paramIndex++}`);
      updateValues.push(stock);
    }

    let updatedRow = null;

    if (updateFields.length > 0) {
      const { rows } = await client.query(
        `UPDATE ecommerce.product_variants SET ${updateFields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
        [...updateValues, variantId],
      );
      updatedRow = rows[0] || null;
    } else {
      const { rows } = await client.query(
        `SELECT * FROM ecommerce.product_variants WHERE id = $1`,
        [variantId],
      );
      updatedRow = rows[0] || null;
    }

    if (!updatedRow) {
      await client.query("ROLLBACK");
      return null;
    }

    if (attribute_value_ids !== undefined) {
      await client.query(
        `DELETE FROM ecommerce.variant_attribute_values WHERE variant_id = $1`,
        [variantId],
      );
      for (const attributeValueId of attribute_value_ids) {
        await client.query(
          `INSERT INTO ecommerce.variant_attribute_values (variant_id, attribute_value_id) VALUES ($1, $2)`,
          [variantId, attributeValueId],
        );
      }
    }

    await client.query("COMMIT");

    return updatedRow;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteProductVariantRepository = async (variantId) => {
  const { rows } = await pool.query(
    `DELETE FROM ecommerce.product_variants WHERE id = $1 RETURNING *`,
    [variantId],
  );
  return rows[0];
};
