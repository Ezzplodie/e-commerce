import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createCategory,
  getAllCategories,
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/", authMiddleware, createCategory);
categoryRouter.get("/", getAllCategories);

export default categoryRouter;
