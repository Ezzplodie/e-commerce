import fs from "node:fs/promises";
import * as z from "zod";
import {
  createVariantImageRepository,
  updateVariantImageRepository,
  deleteVariantImageRepository,
} from "../repositories/variantImages.repository.js";

const variantImageSchema = z.object({
  image_link: z.string().min(1),
  image_order: z.number().int().min(0),
});

export const createVariantImage = async (req, res, next) => {
  try {
    const result = variantImageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const variantId = Number(req.params.variantId);
    if (!Number.isInteger(variantId) || variantId <= 0) {
      return res.status(400).json({ error: "Invalid variant id" });
    }

    const { image_link, image_order } = result.data;
    const variantImage = await createVariantImageRepository(
      variantId,
      image_link,
      image_order,
    );
    res.status(201).json(variantImage);
  } catch (err) {
    next(err);
  }
};

const updateVariantImageSchema = variantImageSchema.partial();

export const updateVariantImage = async (req, res, next) => {
  try {
    const imageId = Number(req.params.imageId);
    if (!Number.isInteger(imageId) || imageId <= 0) {
      return res.status(400).json({ error: "Invalid image id" });
    }

    const result = updateVariantImageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const { image_link, image_order } = result.data;

    const updatedImage = await updateVariantImageRepository(
      imageId,
      image_link,
      image_order,
    );

    if (!updatedImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json(updatedImage);
  } catch (err) {
    next(err);
  }
};

export const deleteVariantImage = async (req, res, next) => {
  try {
    const imageId = Number(req.params.imageId);
    if (!Number.isInteger(imageId) || imageId <= 0) {
      return res.status(400).json({ error: "Invalid image id" });
    }

    const deletedImage = await deleteVariantImageRepository(imageId);

    if (!deletedImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json({
      message: "Image deleted successfully",
      image: deletedImage,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadVariantImage = async (req, res, next) => {
  try {
    const variantId = Number(req.params.variantId);
    if (!Number.isInteger(variantId) || variantId <= 0) {
      return res.status(400).json({ error: "Invalid variant id" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const parsedOrder = Number(req.body.image_order);
    const image_order =
      Number.isInteger(parsedOrder) && parsedOrder >= 0 ? parsedOrder : 0;

    const imageLink = `/uploads/variants/${req.file.filename}`;

    const variantImage = await createVariantImageRepository(
      variantId,
      imageLink,
      image_order,
    );

    res.status(201).json(variantImage);
  } catch (err) {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (_cleanupError) {
        // Ignore cleanup failures and surface the original upload error.
      }
    }

    next(err);
  }
};
