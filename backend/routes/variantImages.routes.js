import express from "express";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import {
  createVariantImage,
  uploadVariantImage,
  updateVariantImage,
  deleteVariantImage,
} from "../controllers/variantImages.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const variantImageRouter = express.Router();

const uploadDir = path.resolve(process.cwd(), "uploads", "variants");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

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
