import { Router } from "express";
import {
  getAllShippingMethods,
  getShippingMethodById,
} from "../controllers/shippingMethods.controller.js";
const shippingMethodRouter = Router();

shippingMethodRouter.get("/", getAllShippingMethods);
shippingMethodRouter.get("/:id", getShippingMethodById);

export default shippingMethodRouter;
