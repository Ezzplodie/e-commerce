import * as z from "zod";
import {
  createProductRepository,
  getProductBySlugRepository,
  getAllProductsRepository,
  deleteProductRepository,
  updateProductRepository,
} from "../repositories/product.repository.js";
const productSchema = z.object({
  category_id: z.number().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  base_price: z.number().positive(),
});
export const createProduct = async (req, res, next) => {
  try {
    const result = productSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const { category_id, name, slug, description, base_price } = result.data;
    const product = await createProductRepository(
      category_id,
      name,
      slug,
      description,
      base_price,
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
    res.json(product);
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
    const total = total_count;
    res.json({ products: rows, page, limit, total });
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
    } = result.data;

    const updatedProduct = await updateProductRepository(
      slug,
      category_id,
      name,
      newSlug,
      description,
      base_price,
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};
