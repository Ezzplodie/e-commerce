import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProductBySlug,
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const productRouter = express.Router();

productRouter.post("/", authMiddleware, createProduct);
productRouter.get("/:slug", getProductBySlug);
productRouter.get("/", getAllProducts);
productRouter.patch("/:slug", authMiddleware, updateProduct);
productRouter.delete("/:slug", authMiddleware, deleteProduct);

export default productRouter;
