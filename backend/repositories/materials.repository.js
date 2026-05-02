import { pool } from "../db.js";

const MATERIALS_TABLE = "ecommerce.materials";

export const listMaterialsRepository = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, description
     FROM ${MATERIALS_TABLE}
     ORDER BY name ASC`,
  );
  return rows;
};
