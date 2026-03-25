import * as z from "zod";
import {
  createProductVariantRepository,
  updateProductVariantRepository,
  deleteProductVariantRepository,
} from "../repositories/productVariants.repository.js";

const productVariantSchema = z.object({
  product_id: z.number().min(1),
  sku: z.string().min(1),
  price: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  attribute_value_ids: z.array(z.number().min(1)).optional(),
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
      price = null,
      stock = 0,
      attribute_value_ids = [],
    } = result.data;

    const productVariant = await createProductVariantRepository(
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

const updateProductVariantSchema = productVariantSchema.partial();

export const updateProductVariant = async (req, res, next) => {
  try {
    const variantId = Number(req.params.variantId);
    if (!Number.isInteger(variantId) || variantId <= 0) {
      return res.status(400).json({ error: "Invalid variant id" });
    }

    const result = updateProductVariantSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const { product_id, sku, price, stock, attribute_value_ids } = result.data;
    const updatedVariant = await updateProductVariantRepository(
      variantId,
      product_id,
      sku,
      price,
      stock,
      attribute_value_ids,
    );

    if (!updatedVariant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json(updatedVariant);
  } catch (error) {
    next(error);
  }
};

export const deleteProductVariant = async (req, res, next) => {
  try {
    const variantId = Number(req.params.variantId);
    if (!Number.isInteger(variantId) || variantId <= 0) {
      return res.status(400).json({ error: "Invalid variant id" });
    }

    const deletedVariant = await deleteProductVariantRepository(variantId);

    if (!deletedVariant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json({
      message: "Variant deleted successfully",
      variant: deletedVariant,
    });
  } catch (error) {
    next(error);
  }
};
