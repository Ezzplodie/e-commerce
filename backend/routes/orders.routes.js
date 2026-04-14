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
} from "../controllers/orders.controller.js";

const orderRouter = express.Router();
orderRouter.use(authMiddleware);
orderRouter.post("/", createOrder);
orderRouter.get("/", getAllUserOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.get("/:id/items", getOrderWithItems);
orderRouter.patch("/:id/status", adminMiddleware, updateOrderStatus);

export default orderRouter;
