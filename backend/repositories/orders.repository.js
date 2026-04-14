import { pool } from "../db.js";
import { generatePublicUrl } from "../services/variantImageStorage.service.js";

const ORDERS_TABLE = "ecommerce.orders";
const ORDER_ITEMS_TABLE = "ecommerce.order_items";
const PRODUCTS_TABLE = "ecommerce.products";
const PRODUCT_VARIANTS_TABLE = "ecommerce.product_variants";
const VARIANT_IMAGES_TABLE = "ecommerce.variant_images";
const VARIANT_ATTRIBUTE_VALUES_TABLE = "ecommerce.variant_attribute_values";
const ATTRIBUTE_VALUES_TABLE = "ecommerce.attribute_values";
const ATTRIBUTES_TABLE = "ecommerce.attributes";

const DEFAULT_ORDER_CURRENCY = "USD";

const toNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const roundCurrency = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const createHttpError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const buildVariantNameSnapshot = ({ color, size, sku }) =>
  [color, size].filter(Boolean).join(" / ") || sku;

const resolveImageUrlSnapshot = ({
  image_link,
  storage_bucket,
  storage_path,
}) => {
  if (storage_path) {
    return generatePublicUrl(storage_path, storage_bucket || undefined);
  }

  return image_link ?? null;
};

const mapOrderSummaryRow = (row) => ({
  id: row.id,
  status: row.status,
  total_price: toNumber(row.total_price),
  shipping_cost: toNumber(row.shipping_cost),
  item_count: Number(row.item_count ?? 0),
  created_at: row.created_at,
  shipping: {
    name: row.shipping_name,
    email: row.shipping_email,
    phone: row.shipping_phone,
    city: row.shipping_city,
    address: row.shipping_address,
    zip: row.shipping_zip,
  },
});

const mapOrderItems = (rows) =>
  rows
    .filter((row) => row.item_id !== null)
    .map((row) => ({
      id: row.item_id,
      variant_id: row.variant_id,
      product_id: row.product_id,
      sku_snapshot: row.sku_snapshot,
      product_name_snapshot: row.product_name_snapshot,
      variant_name_snapshot: row.variant_name_snapshot,
      color_snapshot: row.color_snapshot,
      size_snapshot: row.size_snapshot,
      image_url_snapshot: row.image_url_snapshot,
      currency: row.currency,
      price: toNumber(row.item_price),
      quantity: row.item_quantity,
      line_total: toNumber(row.line_total),
    }));

const buildOrderWithItemsResponse = (rows) => {
  if (!rows.length) {
    return null;
  }

  const [firstRow] = rows;

  return {
    ...mapOrderSummaryRow({
      ...firstRow,
      item_count: rows.filter((row) => row.item_id !== null).length,
    }),
    items: mapOrderItems(rows),
  };
};

const fetchVariantSnapshots = async (client, variantIds) => {
  const { rows } = await client.query(
    `
      SELECT
        pv.id AS variant_id,
        pv.product_id,
        pv.sku,
        pv.stock,
        COALESCE(pv.price, p.base_price) AS unit_price,
        p.name AS product_name,
        MAX(CASE WHEN a.code = 'color' THEN av.value END) AS color,
        MAX(CASE WHEN a.code = 'size' THEN av.value END) AS size,
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
        pv.id,
        pv.product_id,
        pv.sku,
        pv.stock,
        pv.price,
        p.base_price,
        p.name,
        vi.image_link,
        vi.storage_bucket,
        vi.storage_path
    `,
    [variantIds],
  );

  return rows;
};

const buildOrderItemsPayload = async (client, items, currency) => {
  const variantIds = [...new Set(items.map((item) => item.variant_id))];
  const snapshotRows = await fetchVariantSnapshots(client, variantIds);

  if (snapshotRows.length !== variantIds.length) {
    const existingVariantIds = new Set(
      snapshotRows.map((row) => Number(row.variant_id)),
    );
    const missingVariantId = variantIds.find(
      (variantId) => !existingVariantIds.has(variantId),
    );

    throw createHttpError(`Variant ${missingVariantId} not found`, 404);
  }

  const snapshotByVariantId = new Map(
    snapshotRows.map((row) => [Number(row.variant_id), row]),
  );

  return items.map((item) => {
    const snapshot = snapshotByVariantId.get(item.variant_id);
    const availableStock = Number(snapshot.stock);

    if (!Number.isInteger(availableStock) || availableStock < item.quantity) {
      throw createHttpError(
        `Insufficient stock for variant ${item.variant_id}`,
        400,
      );
    }

    const price = toNumber(snapshot.unit_price);

    if (price === null || price < 0) {
      throw createHttpError(
        `Variant ${item.variant_id} has an invalid price`,
        400,
      );
    }

    const lineTotal = roundCurrency(price * item.quantity);

    return {
      variant_id: item.variant_id,
      product_id: snapshot.product_id,
      sku_snapshot: snapshot.sku,
      product_name_snapshot: snapshot.product_name,
      variant_name_snapshot: buildVariantNameSnapshot(snapshot),
      color_snapshot: snapshot.color ?? null,
      size_snapshot: snapshot.size ?? null,
      image_url_snapshot: resolveImageUrlSnapshot(snapshot),
      currency,
      price,
      quantity: item.quantity,
      line_total: lineTotal,
    };
  });
};

export const createOrderRepository = async ({
  user_id,
  total_price,
  shipping_cost,
  shipping_name,
  shipping_email,
  shipping_phone,
  shipping_city,
  shipping_address,
  shipping_zip,
  items,
  status = "pending",
  currency = DEFAULT_ORDER_CURRENCY,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderItems = await buildOrderItemsPayload(client, items, currency);
    const itemsSubtotal = roundCurrency(
      orderItems.reduce((sum, item) => sum + item.line_total, 0),
    );
    const normalizedShippingCost = roundCurrency(shipping_cost);
    const normalizedTotalPrice = roundCurrency(total_price);
    const minimumExpectedTotal = roundCurrency(
      itemsSubtotal + normalizedShippingCost,
    );

    if (normalizedTotalPrice < minimumExpectedTotal) {
      throw createHttpError(
        "Order total is lower than the current catalog pricing",
        400,
      );
    }

    const orderInsertResult = await client.query(
      `
        INSERT INTO ${ORDERS_TABLE} (
          user_id,
          total_price,
          shipping_cost,
          shipping_name,
          shipping_email,
          shipping_phone,
          shipping_city,
          shipping_address,
          shipping_zip,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
      [
        user_id,
        normalizedTotalPrice,
        normalizedShippingCost,
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_city,
        shipping_address,
        shipping_zip,
        status,
      ],
    );

    const order = orderInsertResult.rows[0];

    const createdOrderItems = [];

    for (const item of orderItems) {
      const insertItemResult = await client.query(
        `
          INSERT INTO ${ORDER_ITEMS_TABLE} (
            order_id,
            variant_id,
            product_id,
            sku_snapshot,
            product_name_snapshot,
            variant_name_snapshot,
            color_snapshot,
            size_snapshot,
            image_url_snapshot,
            currency,
            price,
            quantity,
            line_total
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id
        `,
        [
          order.id,
          item.variant_id,
          item.product_id,
          item.sku_snapshot,
          item.product_name_snapshot,
          item.variant_name_snapshot,
          item.color_snapshot,
          item.size_snapshot,
          item.image_url_snapshot,
          item.currency,
          item.price,
          item.quantity,
          item.line_total,
        ],
      );

      createdOrderItems.push({
        id: insertItemResult.rows[0].id,
        ...item,
      });
    }

    await client.query("COMMIT");

    return {
      ...mapOrderSummaryRow({ ...order, item_count: createdOrderItems.length }),
      items: createdOrderItems,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAllUserOrdersRepository = async (user_id) => {
  const { rows } = await pool.query(
    `
      SELECT
        o.*,
        COUNT(oi.id)::int AS item_count
      FROM ${ORDERS_TABLE} o
      LEFT JOIN ${ORDER_ITEMS_TABLE} oi ON oi.order_id = o.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC, o.id DESC
    `,
    [user_id],
  );

  return rows.map(mapOrderSummaryRow);
};

export const getOrderByIdRepository = async (order_id, user_id) => {
  const { rows } = await pool.query(
    `
      SELECT
        o.*,
        COUNT(oi.id)::int AS item_count
      FROM ${ORDERS_TABLE} o
      LEFT JOIN ${ORDER_ITEMS_TABLE} oi ON oi.order_id = o.id
      WHERE o.id = $1
        AND o.user_id = $2
      GROUP BY o.id
      LIMIT 1
    `,
    [order_id, user_id],
  );

  return rows[0] ? mapOrderSummaryRow(rows[0]) : null;
};

export const getOrderWithItemsRepository = async (order_id, user_id) => {
  const { rows } = await pool.query(
    `
      SELECT
        o.id AS id,
        o.status,
        o.total_price,
        o.shipping_cost,
        o.shipping_name,
        o.shipping_email,
        o.shipping_phone,
        o.shipping_city,
        o.shipping_address,
        o.shipping_zip,
        o.created_at,
        oi.id AS item_id,
        oi.variant_id,
        oi.product_id,
        oi.sku_snapshot,
        oi.product_name_snapshot,
        oi.variant_name_snapshot,
        oi.color_snapshot,
        oi.size_snapshot,
        oi.image_url_snapshot,
        oi.currency,
        oi.price AS item_price,
        oi.quantity AS item_quantity,
        oi.line_total
      FROM ${ORDERS_TABLE} o
      LEFT JOIN ${ORDER_ITEMS_TABLE} oi ON oi.order_id = o.id
      WHERE o.id = $1
        AND o.user_id = $2
      ORDER BY oi.id ASC
    `,
    [order_id, user_id],
  );

  return buildOrderWithItemsResponse(rows);
};

export const updateOrderStatusRepository = async (status, order_id) => {
  const { rows } = await pool.query(
    `
      WITH updated_order AS (
        UPDATE ${ORDERS_TABLE}
        SET status = $1
        WHERE id = $2
        RETURNING *
      )
      SELECT
        uo.*,
        COUNT(oi.id)::int AS item_count
      FROM updated_order uo
      LEFT JOIN ${ORDER_ITEMS_TABLE} oi ON oi.order_id = uo.id
      GROUP BY uo.id
    `,
    [status, order_id],
  );

  return rows[0] ? mapOrderSummaryRow(rows[0]) : null;
};
