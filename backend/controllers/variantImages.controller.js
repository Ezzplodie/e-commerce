import * as z from "zod";
import {
  createVariantImageRepository,
  deleteVariantImageRepository,
  getVariantImageRepository,
  updateVariantImageRepository,
} from "../repositories/variantImages.repository.js";
import {
  deleteStoredVariantImage,
  mapVariantImageRecordToResponse,
  uploadVariantImageFile,
} from "../services/variantImageStorage.service.js";

const updateVariantImageSchema = z.object({
  image_order: z.number().int().min(0),
});

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

    const updatedImage = await updateVariantImageRepository(
      imageId,
      result.data.image_order,
    );

    if (!updatedImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.json(mapVariantImageRecordToResponse(updatedImage));
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

    const existingImage = await getVariantImageRepository(imageId);

    if (!existingImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    await deleteStoredVariantImage(existingImage);

    const deletedImage = await deleteVariantImageRepository(imageId);

    if (!deletedImage) {
      const error = new Error(
        "Image record could not be deleted after storage removal",
      );
      error.status = 500;
      throw error;
    }

    res.json({
      message: "Image deleted successfully",
      image: mapVariantImageRecordToResponse(deletedImage),
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

    const parsedOrder = Number(req.body.image_order);
    const image_order =
      Number.isInteger(parsedOrder) && parsedOrder >= 0 ? parsedOrder : 0;

    const uploadedFile = await uploadVariantImageFile(variantId, req.file);

    let variantImage;

    try {
      variantImage = await createVariantImageRepository(variantId, {
        storage_bucket: uploadedFile.storage_bucket,
        storage_path: uploadedFile.storage_path,
        content_type: uploadedFile.content_type,
        file_size: uploadedFile.file_size,
        image_order,
      });
    } catch (error) {
      await deleteStoredVariantImage(uploadedFile);
      throw error;
    }

    res.status(201).json(mapVariantImageRecordToResponse(variantImage));
  } catch (err) {
    next(err);
  }
};
