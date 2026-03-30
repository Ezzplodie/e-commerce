import express from "express";
import multer from "multer";
import {
  createVariantImage,
  uploadVariantImage,
  updateVariantImage,
  deleteVariantImage,
} from "../controllers/variantImages.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const variantImageRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

variantImageRouter.post("/:variantId", authMiddleware, createVariantImage);
variantImageRouter.post(
  "/:variantId/upload",
  authMiddleware,
  upload.single("image"),
  uploadVariantImage,
);
variantImageRouter.patch("/:imageId", authMiddleware, updateVariantImage);
variantImageRouter.delete("/:imageId", authMiddleware, deleteVariantImage);

export default variantImageRouter;
