import express from "express";
import multer from "multer";
import {
  deleteVariantImage,
  updateVariantImage,
  uploadVariantImage,
} from "../controllers/variantImages.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  MAX_VARIANT_IMAGE_SIZE_BYTES,
} from "../services/variantImageStorage.service.js";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const variantImageRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_VARIANT_IMAGE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      const error = new Error("Unsupported image type");
      error.status = 400;
      cb(error);
      return;
    }

    cb(null, true);
  },
});

variantImageRouter.post(
  "/:variantId/upload",
  authMiddleware,
  upload.single("image"),
  uploadVariantImage,
);
variantImageRouter.patch("/:imageId", authMiddleware, updateVariantImage);
variantImageRouter.delete("/:imageId", authMiddleware, deleteVariantImage);

export default variantImageRouter;
