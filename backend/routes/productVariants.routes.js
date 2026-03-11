import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createProductVariant } from "../controllers/productVariants.controller.js";

const productVariantRouter = express.Router();

productVariantRouter.post("/", authMiddleware, createProductVariant);

export default productVariantRouter;
