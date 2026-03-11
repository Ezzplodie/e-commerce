import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProductBySlug,
  createProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
const productRouter = express.Router();

productRouter.post("/", authMiddleware, createProduct);
productRouter.get("/:slug", getProductBySlug);
productRouter.get("/", getAllProducts);

export default productRouter;
