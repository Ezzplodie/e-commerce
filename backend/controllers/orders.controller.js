import { z } from "zod";
import {
  createOrderRepository,
  getAllUserOrdersRepository,
  getOrderByIdRepository,
  getOrderWithItemsRepository,
  updateOrderStatusRepository,
} from "../repositories/orders.repository.js";
import { ORDER_STATUS } from "../constants/orderStatus.js";

const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);

const orderSchema = z.object({
  total_price: z.number().nonnegative(),
  shipping_cost: z.number().nonnegative(),
  shipping_name: z.string().min(1),
  shipping_email: z.string().email(),
  shipping_phone: z.string().min(1),
  shipping_city: z.string().min(1),
  shipping_address: z.string().min(1),
  shipping_zip: z.string().min(1),
  items: z.array(
    z.object({
      variant_id: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().positive(),
    }),
  ),
});

export const createOrder = async (req, res, next) => {
  try {
    const result = orderSchema.safeParse(req.body);

    if (!result.success) {
      console.error("Validation error", result.error.issues);

      return res.status(400).json({
        error: "Validation failed",
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      });
    }

    const orderData = result.data;

    const newOrder = await createOrderRepository({
      user_id: req.userId,
      ...orderData,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Critical Error createOrder:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    next(err);
  }
};

export const getAllUserOrders = async (req, res, next) => {
  try {
    console.log(`Fetching orders for user ${req.userId}`);
    const orders = await getAllUserOrdersRepository(req.userId);
    if (!orders) {
      return res.status(404).json({ error: "No orders found for this user" });
    }
    res.json(orders);
  } catch (err) {
    console.error("Critical Error getAllUserOrders:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    next(err);
  }
};
