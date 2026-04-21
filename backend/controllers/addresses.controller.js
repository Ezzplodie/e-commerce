import { z } from "zod";
import {
  createAddressRepository,
  getUserAddressesRepository,
} from "../repositories/addresses.repository.js";

const addressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  country: z.string().min(1),
  company: z.string().min(1).optional(),
  address: z.string().min(1),
  apartment: z.string().min(1).optional(),
  postal_code: z.string().min(1),
  city: z.string().min(1),
});
export const createAddress = async (req, res, next) => {
  try {
    const result = addressSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    }
    const addressData = result.data;
    const newAddress = await createAddressRepository({
      user_id: req.userId,
      ...addressData,
    });
    res.status(201).json(newAddress);
  } catch (error) {
    next(error);
  }
};

export const getUserAddresses = async (req, res, next) => {
  try {
    const userAddresses = await getUserAddressesRepository(req.userId);
    res.json(userAddresses);
  } catch (error) {
    next(error);
  }
};
