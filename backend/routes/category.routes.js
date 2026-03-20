import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/", authMiddleware, createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:slug", getCategoryBySlug);
categoryRouter.patch("/:slug", authMiddleware, updateCategory);
categoryRouter.delete("/:slug", authMiddleware, deleteCategory);

export default categoryRouter;
