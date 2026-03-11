import {
  getAllCategoriesRepository,
  createCategoryRepository,
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
