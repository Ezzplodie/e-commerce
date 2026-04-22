import {
  getAllShippingMethodsRepository,
  getShippingMethodByIdRepository,
} from "../repositories/shippingMethods.repository.js";

export const getAllShippingMethods = async (req, res, next) => {
  try {
    const shippingMethods = await getAllShippingMethodsRepository();
    res.json(shippingMethods);
  } catch (error) {
    next(error);
  }
};

export const getShippingMethodById = async (req, res, next) => {
  try {
    const shippingMethod = await getShippingMethodByIdRepository(req.params.id);
    if (!shippingMethod) {
      return res.status(404).json({ message: "Shipping method not found" });
    }
    res.json(shippingMethod);
  } catch (error) {
    next(error);
  }
};
