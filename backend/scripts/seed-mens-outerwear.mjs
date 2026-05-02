/**
 * Seed demo catalog: products + variants only (same flow as admin: attribute_value links).
 * No variant_images — add photos in the admin panel.
 *
 * Requires: DATABASE_URL in .env
 * Run: npm run seed:outerwear
 * Idempotent: skips products whose slug already exists.
 */

import "dotenv/config";
import pkg from "pg";

import { createProductVariantRepository } from "../repositories/productVariants.repository.js";

const { Pool } = pkg;

/** Colors / sizes must exist as ecommerce.attribute_values (attribute_id 1 = color, 2 = size). */
const COLORS = [
  "Navy",
  "Charcoal",
  "Olive",
  "Black",
  "Slate",
  "Cognac",
  "Gray",
  "Camel",
  "Rust",
];

const SIZES = ["S", "M", "L", "XL"];

/**
 * 4 products × 5 variants (distinct color + size per SKU).
 * Adjust category_id / material_id to match your DB.
 */
const PRODUCTS = [
  {
    slug: "catalog-wool-peacoat",
    category_id: 8,
    name: "Wool Peacoat",
    description: "Double-breasted peacoat with anchor buttons and wide lapels.",
    base_price: 289,
    fitting:
      "Tailored shoulders with room to layer a lightweight sweater underneath.",
    product_detail:
      "Dense wool blend blocks wind and holds shape. Interior welt pockets for essentials.",
    fabric_care: "Dry clean only. Steam to refresh. Store on a wide hanger.",
    material_id: 3,
    variants: [
      { sku: "CAT-WPC-NAV-S", stock: 12, color: "Navy", size: "S" },
      { sku: "CAT-WPC-NAV-M", stock: 18, color: "Navy", size: "M" },
      { sku: "CAT-WPC-NAV-L", stock: 14, color: "Navy", size: "L" },
      { sku: "CAT-WPC-CHR-M", stock: 10, color: "Charcoal", size: "M" },
      { sku: "CAT-WPC-CHR-XL", stock: 8, color: "Charcoal", size: "XL" },
    ],
  },
  {
    slug: "catalog-shell-parka",
    category_id: 11,
    name: "Technical Shell Parka",
    description: "Water-resistant shell with adjustable hood and storm flap.",
    base_price: 349,
    fitting: "Relaxed fit; size down if you prefer a closer silhouette.",
    product_detail:
      "Sealed seams and two-way zip for commuting in wet weather. Packable hood.",
    fabric_care: "Machine wash cold gentle. Hang dry. Do not iron shell.",
    material_id: 1,
    variants: [
      { sku: "CAT-PRK-OLV-M", stock: 16, color: "Olive", size: "M" },
      { sku: "CAT-PRK-OLV-L", stock: 14, color: "Olive", size: "L" },
      { sku: "CAT-PRK-BLK-S", stock: 11, color: "Black", size: "S" },
      { sku: "CAT-PRK-BLK-XL", stock: 9, color: "Black", size: "XL" },
      { sku: "CAT-PRK-SLT-M", stock: 13, color: "Slate", size: "M" },
    ],
  },
  {
    slug: "catalog-leather-moto",
    category_id: 12,
    name: "Leather Moto Jacket",
    description: "Full-grain leather moto jacket with asymmetric zip.",
    base_price: 479,
    fitting: "Slim fit through chest and sleeves.",
    product_detail:
      "Quilted shoulder panels and zip cuffs. Bi-swing back for mobility.",
    fabric_care: "Professional leather care only. Condition twice a year.",
    material_id: 6,
    variants: [
      { sku: "CAT-MTO-BLK-S", stock: 7, color: "Black", size: "S" },
      { sku: "CAT-MTO-BLK-M", stock: 10, color: "Black", size: "M" },
      { sku: "CAT-MTO-BLK-L", stock: 8, color: "Black", size: "L" },
      { sku: "CAT-MTO-COG-M", stock: 6, color: "Cognac", size: "M" },
      { sku: "CAT-MTO-COG-L", stock: 5, color: "Cognac", size: "L" },
    ],
  },
  {
    slug: "catalog-wool-blazer",
    category_id: 10,
    name: "Wool Blazer",
    description: "Half-canvassed wool blazer with patch pockets.",
    base_price: 298,
    fitting: "Tailored fit with natural shoulder line.",
    product_detail:
      "Horn buttons and Bemberg lining. Works with dress shirts or knits.",
    fabric_care: "Dry clean sparingly. Press on wool with a pressing cloth.",
    material_id: 3,
    variants: [
      { sku: "CAT-BLZ-NAV-M", stock: 11, color: "Navy", size: "M" },
      { sku: "CAT-BLZ-NAV-L", stock: 9, color: "Navy", size: "L" },
      { sku: "CAT-BLZ-GRY-M", stock: 8, color: "Gray", size: "M" },
      { sku: "CAT-BLZ-GRY-XL", stock: 6, color: "Gray", size: "XL" },
      { sku: "CAT-BLZ-CML-L", stock: 7, color: "Camel", size: "L" },
    ],
  },
];

async function ensureAttributeValues(pool) {
  const rows = [];
  for (const c of COLORS) {
    rows.push([1, c]);
  }
  for (const s of SIZES) {
    rows.push([2, s]);
  }
  for (const [attribute_id, value] of rows) {
    await pool.query(
      `INSERT INTO ecommerce.attribute_values (attribute_id, value)
       SELECT $1::integer, $2::varchar
       WHERE NOT EXISTS (
         SELECT 1 FROM ecommerce.attribute_values e
         WHERE e.attribute_id = $1::integer AND e.value = $2::varchar
       )`,
      [attribute_id, value],
    );
  }
}

async function loadAttributeMaps(pool) {
  const { rows } = await pool.query(
    `SELECT id, attribute_id, value FROM ecommerce.attribute_values
     WHERE attribute_id IN (1, 2)`,
  );
  const colors = new Map();
  const sizes = new Map();
  for (const r of rows) {
    if (r.attribute_id === 1) {
      colors.set(r.value, r.id);
    } else {
      sizes.set(r.value, r.id);
    }
  }
  return { colors, sizes };
}

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await ensureAttributeValues(pool);
    const { colors, sizes } = await loadAttributeMaps(pool);

    let inserted = 0;
    let skipped = 0;
    let variantsCreated = 0;

    for (const p of PRODUCTS) {
      const exists = await pool.query(
        `SELECT id FROM ecommerce.products WHERE slug = $1`,
        [p.slug],
      );
      if (exists.rows.length > 0) {
        skipped += 1;
        console.warn(`Skip (exists): ${p.slug}`);
        continue;
      }

      const { rows: prodRows } = await pool.query(
        `INSERT INTO ecommerce.products (
          category_id, name, description, base_price, slug,
          fitting, product_detail, fabric_care, material_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id`,
        [
          p.category_id,
          p.name,
          p.description,
          p.base_price,
          p.slug,
          p.fitting,
          p.product_detail,
          p.fabric_care,
          p.material_id,
        ],
      );
      const productId = prodRows[0].id;

      for (const v of p.variants) {
        const colorId = colors.get(v.color);
        const sizeId = sizes.get(v.size);
        if (!colorId || !sizeId) {
          throw new Error(
            `Missing attribute_value for ${v.color} / ${v.size} (${v.sku})`,
          );
        }

        await createProductVariantRepository(
          productId,
          v.sku,
          null,
          v.stock,
          [colorId, sizeId],
        );
        variantsCreated += 1;
        console.info(`Variant ${v.sku} (product ${productId})`);
      }

      inserted += 1;
    }

    console.info(
      `Done. Products inserted: ${inserted}, skipped: ${skipped}, variants: ${variantsCreated}.`,
    );
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
