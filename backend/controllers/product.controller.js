import * as z from "zod";
import {
  createProductRepository,
  getProductBySlugRepository,
  getAllProductsRepository,
  deleteProductRepository,
  updateProductRepository,
} from "../repositories/product.repository.js";
import {
  mapProductImagesToResponse,
  generatePublicUrl,
} from "../services/variantImageStorage.service.js";

const normalizeProductListRow = (row) => {
  const product = { ...row };

  delete product.total_count;
  delete product.thumbnail_storage_bucket;
  delete product.thumbnail_storage_path;

  const thumbnailImageLink = row.thumbnail_storage_path
    ? generatePublicUrl(
        row.thumbnail_storage_path,
        row.thumbnail_storage_bucket ?? undefined,
      )
    : row.thumbnail_image_link || null;

  return {
    ...product,
    thumbnail_image_link: thumbnailImageLink,
    colors: Array.isArray(row.colors) ? row.colors : (row.colors ?? []),
    enabled_colors: Array.isArray(row.enabled_colors)
      ? row.enabled_colors
      : (row.enabled_colors ?? []),
  };
};

const productSchema = z.object({
  category_id: z.number().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  base_price: z.number().positive(),
  fitting: z.string().optional(),
  product_detail: z.string().optional(),
  fabric_care: z.string().optional(),
  material_id: z.union([z.number().int().positive(), z.null()]).optional(),
});
export const createProduct = async (req, res, next) => {
  try {
    const result = productSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const {
      category_id,
      name,
      slug,
      description,
      base_price,
      fitting,
      product_detail,
      fabric_care,
      material_id,
    } = result.data;
    const product = await createProductRepository(
      category_id,
      name,
      slug,
      description,
      base_price,
      fitting,
      product_detail,
      fabric_care,
      material_id,
    );
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await getProductBySlugRepository(slug);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(mapProductImagesToResponse(product));
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { rows, total_count } = await getAllProductsRepository(limit, offset);
    res.json({
      products: rows.map(normalizeProductListRow),
      page,
      limit,
      total: total_count,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedProduct = await deleteProductRepository(slug);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const updateProductSchema = productSchema.partial();

export const updateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = updateProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const {
      category_id,
      name,
      slug: newSlug,
      description,
      base_price,
      fitting,
      product_detail,
      fabric_care,
      material_id,
    } = result.data;

    const updatedProduct = await updateProductRepository(
      slug,
      category_id,
      name,
      newSlug,
      description,
      base_price,
      fitting,
      product_detail,
      fabric_care,
      material_id,
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
