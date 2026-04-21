import { email, z } from "zod";
import Stripe from "stripe";
import {
  createOrderRepository,
  getAllUserOrdersRepository,
  getOrderByIdRepository,
  getOrderWithItemsRepository,
  updateOrderStatusRepository,
  updateOrderStripeIdRepository,
} from "../repositories/orders.repository.js";
import { ORDER_STATUS } from "../constants/orderStatus.js";

const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const orderItemSchema = z.object({
  variant_id: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

const orderSchema = z.object({
  shipping_first_name: z.string().min(1),
  shipping_last_name: z.string().min(1),
  shipping_cost: z.number().nonnegative(),
  shipping_email: z.string().email(),
  shipping_phone: z.string().min(1),
  shipping_city: z.string().min(1),
  shipping_address: z.string().min(1),
  shipping_postal_code: z.string().min(1),
  shipping_country: z.string().min(1),
  shipping_company: z.string().min(1).optional(),
  shipping_apartment: z.string().min(1).optional(),
  items: z.array(orderItemSchema).min(1),
});

const statusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES),
});

const parseOrderId = (value) => {
  const orderId = Number(value);
  return Number.isInteger(orderId) && orderId > 0 ? orderId : null;
};

const formatValidationIssues = (issues) =>
  issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));

export const createOrder = async (req, res, next) => {
  try {
    const result = orderSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: formatValidationIssues(result.error.issues),
      });
    }

    const orderData = result.data;

    const newOrder = await createOrderRepository({
      user_id: req.userId,
      ...orderData,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};

export const getAllUserOrders = async (req, res, next) => {
  try {
    const orders = await getAllUserOrdersRepository(req.userId);

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const orderId = parseOrderId(req.params.orderId);
    if (!orderId) {
      return res.status(400).json({ error: "Invalid order id" });
    }
    const order = await getOrderByIdRepository(orderId, req.userId);
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
    const orderId = parseOrderId(req.params.orderId);
    if (!orderId) {
      return res.status(400).json({ error: "Invalid order id" });
    }
    const order = await getOrderWithItemsRepository(orderId, req.userId);
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
    const orderId = parseOrderId(req.params.orderId);
    if (!orderId) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    const result = statusSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        issues: formatValidationIssues(result.error.issues),
      });
    }

    const updatedOrder = await updateOrderStatusRepository(
      result.data.status,
      orderId,
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export const createPaymentIntent = async (req, res, next) => {
  try {
    const orderId = parseOrderId(req.params.orderId);
    if (!orderId) {
      return res.status(400).json({ error: "Invalid order id" });
    }
    const order = await getOrderByIdRepository(orderId, req.userId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const actualAmount = Math.round(order.total_price * 100);
    let intent;
    const idempotencyKey = `order-${order.id}-payment-intent`;

    if (order.stripe_payment_intent_id) {
      intent = await stripe.paymentIntents.retrieve(
        order.stripe_payment_intent_id,
      );

      if (intent.amount !== actualAmount) {
        intent = await stripe.paymentIntents.update(
          order.stripe_payment_intent_id,
          { amount: actualAmount },
          {
            idempotencyKey: `order-${order.id}-payment-intent-update-${actualAmount}`,
          },
        );
      }
    } else {
      intent = await stripe.paymentIntents.create(
        {
          amount: actualAmount,
          currency: "usd",
          receipt_email: order.shipping.email,
          metadata: {
            orderId: order.id.toString(),
          },
        },
        {
          idempotencyKey,
        },
      );

      await updateOrderStripeIdRepository(order.id, intent.id);
    }

    return res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    next(error);
  }
};
