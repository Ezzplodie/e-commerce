import { pool } from "../db.js";
const SHIPPING_METHODS_TABLE = "ecommerce.shipping_methods";

export const getAllShippingMethodsRepository = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, CAST(price AS DECIMAL(10, 2)) AS price, estimated_days FROM ${SHIPPING_METHODS_TABLE}`,
  );
  return rows;
};

export const getShippingMethodByIdRepository = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, name, CAST(price AS DECIMAL(10, 2)) AS price, estimated_days FROM ${SHIPPING_METHODS_TABLE} WHERE id = $1`,
    [id],
  );
  return rows[0];
};
