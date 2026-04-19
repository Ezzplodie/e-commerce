import express from "express";
import authMiddleware, {
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import {
  createOrder,
  getAllUserOrders,
  getOrderById,
  getOrderWithItems,
  updateOrderStatus,
  createPaymentIntent,
} from "../controllers/orders.controller.js";

const orderRouter = express.Router();

orderRouter.use(authMiddleware);
orderRouter.post("/", createOrder);
orderRouter.post("/:orderId/create-payment-intent", createPaymentIntent);
orderRouter.get("/", getAllUserOrders);
orderRouter.get("/:orderId", getOrderById);
orderRouter.get("/:orderId/items", getOrderWithItems);
orderRouter.patch("/:orderId/status", adminMiddleware, updateOrderStatus);

export default orderRouter;
