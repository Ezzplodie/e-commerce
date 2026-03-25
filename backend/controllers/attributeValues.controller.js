import * as z from "zod";
import {
  createAttributeValueRepository,
  getAttributeValuesRepository,
} from "../repositories/attributeValues.repository.js";

const attributeCodeSchema = z.object({
  code: z.string().trim().min(1).optional(),
});

const createAttributeValueSchema = z.object({
  attribute_code: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export const getAttributeValues = async (req, res, next) => {
  try {
    const result = attributeCodeSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const attributeValues = await getAttributeValuesRepository(result.data.code);
    res.json(attributeValues);
  } catch (error) {
    next(error);
  }
};

export const createAttributeValue = async (req, res, next) => {
  try {
    const result = createAttributeValueSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const createdValue = await createAttributeValueRepository(
      result.data.attribute_code,
      result.data.value,
    );

    if (!createdValue) {
      return res.status(404).json({ error: "Attribute not found" });
    }

    res.status(createdValue.created ? 201 : 200).json(createdValue.value);
  } catch (error) {
    next(error);
  }
};
