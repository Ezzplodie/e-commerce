import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../controllers/productVariants.controller.js";

const productVariantRouter = express.Router();

productVariantRouter.post("/", authMiddleware, createProductVariant);
productVariantRouter.patch("/:variantId", authMiddleware, updateProductVariant);
productVariantRouter.delete("/:variantId", authMiddleware, deleteProductVariant);

export default productVariantRouter;
