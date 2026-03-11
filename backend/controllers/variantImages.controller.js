import * as z from "zod";
import { variantImagesRepository } from "../repositories/variantImages.repository.js";
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
    const { variantId } = req.params;
    const { image_link, image_order } = result.data;
    const variantImage = await variantImagesRepository(
      variantId,
      image_link,
      image_order,
    );
    res.status(201).json(variantImage);
  } catch (err) {
    next(err);
  }
};
