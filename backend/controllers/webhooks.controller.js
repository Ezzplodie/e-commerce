import Stripe from "stripe";
import { ORDER_STATUS } from "../constants/orderStatus.js";
import {
  payOrderAndDecrementStockRepository,
  updateOrderStatusRepository,
} from "../repositories/orders.repository.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function parseOrderId(value) {
  const orderId = Number(value);
  return Number.isInteger(orderId) && orderId > 0 ? orderId : null;
}

export const handleStripeWebhook = async (req, res, next) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("Received Stripe webhook event:", event.type);
    console.log(event.data.object);
    console.log(event);
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = parseOrderId(paymentIntent.metadata?.orderId);

        if (!orderId) {
          return res.json({ received: true });
        }

        const updatedOrder = await payOrderAndDecrementStockRepository(orderId);

        if (!updatedOrder) {
          return res.json({ received: true });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = parseOrderId(paymentIntent.metadata?.orderId);
        if (!orderId) {
          return res.json({ received: true });
        }

        const updatedOrder = await updateOrderStatusRepository(
          ORDER_STATUS.FAILED,
          orderId,
        );

        if (!updatedOrder) {
          return res.json({ received: true });
        }

        return res.json({ received: true });
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};
