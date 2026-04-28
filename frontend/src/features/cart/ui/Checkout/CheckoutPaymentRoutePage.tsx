"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCartPricing } from "../../model/cartPricing";
import { useCartStore } from "../../model/cartStore";
import { CheckoutPaymentPage } from "./CheckoutPaymentPage";
import { useCheckoutShipping } from "../../model/useCheckoutShipping";
import { createPaymentIntent } from "../../api/payment";
export function CheckoutPaymentRoutePage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const currentOrderId = useCartStore((state) => state.currentOrderId);
  const closeCart = useCartStore((state) => state.closeCart);
  const { selectedMethod, status: shippingStatus } = useCheckoutShipping();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const pricing = getCartPricing(items);
  const hasItems = items.length > 0;
  useEffect(() => {
    closeCart();
  }, [closeCart]);
  useEffect(() => {
    if (currentOrderId) {
      const fetchPaymentIntent = async () => {
        try {
          const paymentIntent = await createPaymentIntent(currentOrderId);
          if (paymentIntent.alreadyPaid) {
            router.replace("/cart/payment/success");
            return;
          }
          setClientSecret(paymentIntent.clientSecret);
        } catch (error) {
          console.error(error);
        }
      };
      fetchPaymentIntent();
    }
  }, [currentOrderId, router]);
  return (
    <>
      <CheckoutPaymentPage
        clientSecret={clientSecret}
        hasItems={hasItems}
        pricing={pricing}
        shippingPrice={
          shippingStatus === "ready" ? selectedMethod?.price : undefined
        }
      />
    </>
  );
}
