import {
  getAllCategoriesRepository,
  createCategoryRepository,
  getCategoryBySlugRepository,
  updateCategoryRepository,
  deleteCategoryRepository,
} from "../repositories/category.repository.js";
import * as z from "zod";
const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const createCategory = async (req, res, next) => {
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const { name, slug } = result.data;
    const category = await createCategoryRepository(name, slug);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesRepository();

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await getCategoryBySlugRepository(slug);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = categorySchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const { name, slug: newSlug } = result.data;
    const category = await updateCategoryRepository(slug, name, newSlug);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedCategory = await deleteCategoryRepository(slug);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(deletedCategory);
  } catch (err) {
    next(err);
  }
};
