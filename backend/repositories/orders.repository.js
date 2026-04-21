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

function toNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function calcTotalPrice(items, shippingCost) {
  let total = shippingCost;

  for (const item of items) {
    total += item.line_total;
  }

  return roundMoney(total);
}
function buildShippingInfo(row) {
  return {
    firstName: row.shipping_first_name,
    lastName: row.shipping_last_name,
    email: row.shipping_email,
    shipping_country: row.shipping_country,
    shipping_company: row.shipping_company,
    phone: row.shipping_phone,
    city: row.shipping_city,
    shipping_apartmentment: row.shipping_apartment,
    address: row.shipping_address,
    postal_code: row.shipping_postal_code,
  };
}

function mapOrderSummary(row) {
  return {
    id: row.id,
    status: row.status,
    total_price: toNumber(row.total_price),
    shipping_cost: toNumber(row.shipping_cost),
    item_count: Number(row.item_count ?? 0),
    created_at: row.created_at,
    shipping: buildShippingInfo(row),
  };
}

function mapOrderItem(row) {
  return {
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
  };
}

function mapOrderWithItems(rows) {
  if (rows.length === 0) {
    return null;
  }

  const order = mapOrderSummary({
    ...rows[0],
    item_count: 0,
  });

  const items = [];

  for (const row of rows) {
    if (row.item_id === null) {
      continue;
    }

    items.push(mapOrderItem(row));
  }

  return {
    ...order,
    item_count: items.length,
    items,
  };
}

function buildVariantName(snapshot) {
  const parts = [];

  if (snapshot.color) {
    parts.push(snapshot.color);
  }

  if (snapshot.size) {
    parts.push(snapshot.size);
  }

  if (parts.length > 0) {
    return parts.join(" / ");
  }

  return snapshot.sku;
}

function resolveImageUrl(snapshot) {
  if (snapshot.storage_path) {
    return generatePublicUrl(
      snapshot.storage_path,
      snapshot.storage_bucket || undefined,
    );
  }

  return snapshot.image_link ?? null;
}

function getUniqueVariantIds(items) {
  const variantIds = [];

  for (const item of items) {
    if (!variantIds.includes(item.variant_id)) {
      variantIds.push(item.variant_id);
    }
  }

  return variantIds;
}

async function getVariantSnapshots(client, variantIds) {
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
}

function findMissingVariantId(variantIds, snapshotRows) {
  const existingVariantIds = new Set();

  for (const row of snapshotRows) {
    existingVariantIds.add(Number(row.variant_id));
  }

  return variantIds.find((variantId) => !existingVariantIds.has(variantId));
}

function buildSnapshotByVariantId(snapshotRows) {
  const snapshotsByVariantId = {};

  for (const row of snapshotRows) {
    snapshotsByVariantId[Number(row.variant_id)] = row;
  }

  return snapshotsByVariantId;
}

function buildOrderItem(item, snapshot, currency) {
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

  return {
    variant_id: item.variant_id,
    product_id: snapshot.product_id,
    sku_snapshot: snapshot.sku,
    product_name_snapshot: snapshot.product_name,
    variant_name_snapshot: buildVariantName(snapshot),
    color_snapshot: snapshot.color ?? null,
    size_snapshot: snapshot.size ?? null,
    image_url_snapshot: resolveImageUrl(snapshot),
    currency,
    price,
    quantity: item.quantity,
    line_total: roundMoney(price * item.quantity),
  };
}

async function buildOrderItems(client, items, currency) {
  const variantIds = getUniqueVariantIds(items);
  const snapshotRows = await getVariantSnapshots(client, variantIds);

  if (snapshotRows.length !== variantIds.length) {
    const missingVariantId = findMissingVariantId(variantIds, snapshotRows);
    throw createHttpError(`Variant ${missingVariantId} not found`, 404);
  }

  const snapshotsByVariantId = buildSnapshotByVariantId(snapshotRows);
  const orderItems = [];

  for (const item of items) {
    const snapshot = snapshotsByVariantId[item.variant_id];
    orderItems.push(buildOrderItem(item, snapshot, currency));
  }

  return orderItems;
}

function calculateItemsSubtotal(orderItems) {
  let subtotal = 0;

  for (const item of orderItems) {
    subtotal += item.line_total;
  }

  return roundMoney(subtotal);
}

async function insertOrder(client, orderData) {
  const { rows } = await client.query(
    `
      INSERT INTO ${ORDERS_TABLE} (
        user_id,
        shipping_first_name,
        shipping_last_name,
        total_price,
        shipping_cost,
        shipping_email,
        shipping_phone,
        shipping_city,
        shipping_address,
        shipping_postal_code,
        shipping_country,
        shipping_company,
        shipping_apartment,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `,
    [
      orderData.user_id,
      orderData.shipping_first_name,
      orderData.shipping_last_name,
      orderData.total_price,
      orderData.shipping_cost,
      orderData.shipping_email,
      orderData.shipping_phone,
      orderData.shipping_city,
      orderData.shipping_address,
      orderData.shipping_postal_code,
      orderData.shipping_country,
      orderData.shipping_company,
      orderData.shipping_apartment,
      orderData.status,
    ],
  );

  return rows[0];
}

async function insertOrderItems(client, orderId, orderItems) {
  const createdOrderItems = [];

  for (const item of orderItems) {
    const { rows } = await client.query(
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
        orderId,
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
      id: rows[0].id,
      ...item,
    });
  }

  return createdOrderItems;
}

export const createOrderRepository = async ({
  user_id,
  shipping_cost,
  shipping_first_name,
  shipping_last_name,
  shipping_email,
  shipping_phone,
  shipping_city,
  shipping_address,
  shipping_postal_code,
  shipping_country,
  shipping_company,
  shipping_apartment,
  items,
  status = "pending",
  currency = DEFAULT_ORDER_CURRENCY,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderItems = await buildOrderItems(client, items, currency);
    const normalizedShippingCost = roundMoney(shipping_cost ?? 0);
    const normalizedTotalPrice = calcTotalPrice(
      orderItems,
      normalizedShippingCost,
    );

    const order = await insertOrder(client, {
      user_id,
      total_price: normalizedTotalPrice,
      shipping_cost: normalizedShippingCost,
      shipping_first_name,
      shipping_last_name,
      shipping_email,
      shipping_phone,
      shipping_city,
      shipping_address,
      shipping_postal_code,
      shipping_country,
      shipping_company,
      shipping_apartment,
      status,
    });

    const createdOrderItems = await insertOrderItems(
      client,
      order.id,
      orderItems,
    );

    await client.query("COMMIT");

    return {
      ...mapOrderSummary({
        ...order,
        item_count: createdOrderItems.length,
      }),
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

  return rows.map(mapOrderSummary);
};

export const getOrderByIdRepository = async (order_id, user_id, ide) => {
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

  return rows[0] ? mapOrderSummary(rows[0]) : null;
};

export const getOrderWithItemsRepository = async (order_id, user_id) => {
  const { rows } = await pool.query(
    `
      SELECT
        o.id AS id,
        o.status,
        o.total_price,
        o.shipping_cost,
        o.shipping_first_name,
        o.shipping_last_name,
        o.shipping_email,
        o.shipping_phone,
        o.shipping_city,
        o.shipping_address,
        o.shipping_postal_code,
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

  return mapOrderWithItems(rows);
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

  return rows[0] ? mapOrderSummary(rows[0]) : null;
};

export const updateOrderStripeIdRepository = async (order_id, intent_id) => {
  const { rows } = await pool.query(
    `
      UPDATE ${ORDERS_TABLE}
      SET stripe_payment_intent_id = $1
      WHERE id = $2
      RETURNING *
    `,
    [intent_id, order_id],
  );

  return rows[0];
};
