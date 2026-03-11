import * as z from "zod";
import { productVariantsRepository } from "../repositories/productVariants.repository.js";
const productVariantSchema = z.object({
  product_id: z.number().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0).optional(),
  attribute_value_ids: z.array(z.number().min(1)).min(1),
});

export const createProductVariant = async (req, res, next) => {
  try {
    const result = productVariantSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const {
      product_id,
      sku,
      price,
      stock = 0,
      attribute_value_ids,
    } = result.data;

    const productVariant = await productVariantsRepository(
      product_id,
      sku,
      price,
      stock,
      attribute_value_ids,
    );

    res.status(201).json(productVariant);
  } catch (error) {
    next(error);
  }
};
