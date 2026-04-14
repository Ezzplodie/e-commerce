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

const orderParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const orderItemSchema = z.object({
  variant_id: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative().optional(),
});

const orderSchema = z
  .object({
    total_price: z.coerce.number().positive(),
    shipping_cost: z.coerce.number().min(0).default(0),
    shipping_name: z.string().trim().min(2),
    shipping_email: z.string().trim().email(),
    shipping_phone: z.string().trim().min(10),
    shipping_city: z.string().trim().min(1),
    shipping_address: z.string().trim().min(5),
    shipping_zip: z.string().trim().min(1),
    items: z.array(orderItemSchema).min(1),
  })
  .superRefine((data, ctx) => {
    const seenVariantIds = new Set();

    for (const [index, item] of data.items.entries()) {
      if (seenVariantIds.has(item.variant_id)) {
        ctx.addIssue({
          code: "custom",
          path: ["items", index, "variant_id"],
          message: "Duplicate variant_id values are not allowed",
        });
      }

      seenVariantIds.add(item.variant_id);
    }
  });

const updateOrderStatusSchema = z.object({
  status: z
    .string()
    .trim()
    .refine((value) => ORDER_STATUS_VALUES.includes(value), {
      message: "Invalid order status",
    }),
});

export const createOrder = async (req, res, next) => {
  try {
    const result = orderSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: result.error.issues,
      });
    }

    const order = await createOrderRepository({
      user_id: req.userId,
      ...result.data,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllUserOrders = async (req, res, next) => {
  try {
    const orders = await getAllUserOrdersRepository(req.userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const paramsResult = orderParamsSchema.safeParse(req.params);

    if (!paramsResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: paramsResult.error.issues,
      });
    }

    const order = await getOrderByIdRepository(
      paramsResult.data.id,
      req.userId,
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderWithItems = async (req, res, next) => {
  try {
    const paramsResult = orderParamsSchema.safeParse(req.params);

    if (!paramsResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: paramsResult.error.issues,
      });
    }

    const order = await getOrderWithItemsRepository(
      paramsResult.data.id,
      req.userId,
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const paramsResult = orderParamsSchema.safeParse(req.params);

    if (!paramsResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: paramsResult.error.issues,
      });
    }

    const bodyResult = updateOrderStatusSchema.safeParse(req.body);

    if (!bodyResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: bodyResult.error.issues,
      });
    }

    const updatedOrder = await updateOrderStatusRepository(
      bodyResult.data.status,
      paramsResult.data.id,
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
