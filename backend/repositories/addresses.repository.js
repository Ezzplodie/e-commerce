import { pool } from "../db.js";

const ADDRESSES_TABLE = "ecommerce.addresses";

export const createAddressRepository = async (addressData) => {
  const { rows } = await pool.query(
    `INSERT INTO ${ADDRESSES_TABLE} (user_id, 
    first_name, 
    last_name, email, phone, city, 
    postal_code, country, company, address, 
    apartment) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (user_id) 
    DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, email = EXCLUDED.email, phone = EXCLUDED.phone, city = EXCLUDED.city, postal_code = EXCLUDED.postal_code, country = EXCLUDED.country, company = EXCLUDED.company, address = EXCLUDED.address, apartment = EXCLUDED.apartment RETURNING *`,
    [
      addressData.user_id,
      addressData.first_name,
      addressData.last_name,
      addressData.email,
      addressData.phone,
      addressData.city,
      addressData.postal_code,
      addressData.country,
      addressData.company,
      addressData.address,
      addressData.apartment,
    ],
  );

  return rows[0];
};

export const getUserAddressesRepository = async (userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${ADDRESSES_TABLE} WHERE user_id = $1`,
    [userId],
  );
  return rows[0];
};
