import { pool } from "../db.js";
import { generatePublicUrl } from "../services/variantImageStorage.service.js";

const PRODUCT_VARIANTS_TABLE = "ecommerce.product_variants";
const VARIANT_ATTRIBUTE_VALUES_TABLE = "ecommerce.variant_attribute_values";
const PRODUCTS_TABLE = "ecommerce.products";
const VARIANT_IMAGES_TABLE = "ecommerce.variant_images";
const ATTRIBUTE_VALUES_TABLE = "ecommerce.attribute_values";
const ATTRIBUTES_TABLE = "ecommerce.attributes";

const toNumber = (value) => {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const resolveImageUrl = (row) => {
  if (row.storage_path) {
    return generatePublicUrl(
      row.storage_path,
      row.storage_bucket || undefined,
    );
  }
  return row.image_link ?? null;
};

/**
 * Returns enriched variant data (product, color/size, thumbnail) for a list of variant IDs.
 * Designed for reuse by wish-list, cart, recently-viewed, and similar features
 * that store only `variant_id` and need product context for rendering.
 *
 * Order of returned rows is NOT guaranteed to match the input order.
 * Callers that need a specific order should re-map by `variant_id`.
 */
export const getVariantsByIdsRepository = async (variantIds) => {
  if (!Array.isArray(variantIds) || variantIds.length === 0) {
    return [];
  }

  const { rows } = await pool.query(
    `
    SELECT
      pv.id              AS variant_id,
      pv.product_id,
      pv.sku,
      pv.stock,
      COALESCE(pv.price, p.base_price) AS unit_price,
      p.name             AS product_name,
      p.slug             AS product_slug,
      MAX(CASE WHEN a.code = 'color' THEN av.value END) AS color,
      MAX(CASE WHEN a.code = 'size'  THEN av.value END) AS size,
      vi.image_link,
      vi.storage_bucket,
      vi.storage_path
    FROM ${PRODUCT_VARIANTS_TABLE} pv
    JOIN ${PRODUCTS_TABLE} p ON p.id = pv.product_id
    LEFT JOIN LATERAL (
      SELECT image_link, storage_bucket, storage_path
      FROM ${VARIANT_IMAGES_TABLE}
      WHERE variant_id = pv.id
      ORDER BY image_order ASC, id ASC
      LIMIT 1
    ) vi ON true
    LEFT JOIN ${VARIANT_ATTRIBUTE_VALUES_TABLE} vav ON vav.variant_id = pv.id
    LEFT JOIN ${ATTRIBUTE_VALUES_TABLE} av ON av.id = vav.attribute_value_id
    LEFT JOIN ${ATTRIBUTES_TABLE} a ON a.id = av.attribute_id
    WHERE pv.id = ANY($1::int[])
    GROUP BY
      pv.id, pv.product_id, pv.sku, pv.stock, pv.price,
      p.base_price, p.name, p.slug,
      vi.image_link, vi.storage_bucket, vi.storage_path
    `,
    [variantIds],
  );

  return rows.map((row) => ({
    variant_id: Number(row.variant_id),
    product_id: Number(row.product_id),
    product_name: row.product_name,
    product_slug: row.product_slug,
    sku: row.sku,
    price: toNumber(row.unit_price),
    stock: Number(row.stock),
    color: row.color ?? null,
    size: row.size ?? null,
    image_url: resolveImageUrl(row),
  }));
};

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
      INSERT INTO ${PRODUCT_VARIANTS_TABLE}
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
        INSERT INTO ${VARIANT_ATTRIBUTE_VALUES_TABLE}
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
        `UPDATE ${PRODUCT_VARIANTS_TABLE} SET ${updateFields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
        [...updateValues, variantId],
      );
      updatedRow = rows[0] || null;
    } else {
      const { rows } = await client.query(
        `SELECT * FROM ${PRODUCT_VARIANTS_TABLE} WHERE id = $1`,
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
        `DELETE FROM ${VARIANT_ATTRIBUTE_VALUES_TABLE} WHERE variant_id = $1`,
        [variantId],
      );
      for (const attributeValueId of attribute_value_ids) {
        await client.query(
          `INSERT INTO ${VARIANT_ATTRIBUTE_VALUES_TABLE} (variant_id, attribute_value_id) VALUES ($1, $2)`,
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
    `DELETE FROM ${PRODUCT_VARIANTS_TABLE} WHERE id = $1 RETURNING *`,
    [variantId],
  );
  return rows[0];
};
