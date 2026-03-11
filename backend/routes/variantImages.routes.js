import express from "express";
import { createVariantImage } from "../controllers/variantImages.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const variantImageRouter = express.Router();
variantImageRouter.post("/:variantId", authMiddleware, createVariantImage);

export default variantImageRouter;
