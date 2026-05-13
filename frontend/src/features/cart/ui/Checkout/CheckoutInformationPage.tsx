"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { CheckoutHeader } from "@/widgets/checkout-header";
import { getCartPricing } from "../../model/cartPricing";
import { useCartStore } from "../../model/cartStore";
import { useCartDrawerState } from "../../model/useCartDrawerState";
import styles from "./CheckoutInformationPage.module.scss";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs";
import { ShippingForm } from "./ShippingForm";
import { CartPane } from "./CartPane";
import { createAddress, findUserAddress } from "../../api/address";
import { useCheckoutShipping } from "../../model/useCheckoutShipping";

const checkoutSteps: BreadcrumbItem[] = [
  { label: "Cart", href: "/cart" },
  { label: "Info" },
  { label: "Shipping" },
  { label: "Payment" },
];

export function CheckoutInformationPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const removeItem = useCartStore((state) => state.removeItem);
  const closeCart = useCartStore((state) => state.closeCart);
  const { selectedMethod, status: shippingStatus } = useCheckoutShipping();
  const pricing = getCartPricing(items);
  const hasItems = items.length > 0;
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    postal_code: "",
    country: "",
    company: "",
    address: "",
    apartment: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasItems) return;

    const data = {
      ...form,
      company: form.company || undefined,
      apartment: form.apartment || undefined,
    };

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await createAddress(data);
      router.push("/cart/shipping");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save address";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const {
    increaseHandler,
    decreaseHandler,
    deleteHandler,
    confirmationDialog,
  } = useCartDrawerState({
    onRemoveItem: (item) => removeItem(item.id),
    onQuantityChange: (item, quantity) => updateQuantity(item.id, quantity),
  });

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    const loadUserAddress = async () => {
      try {
        const address = await findUserAddress();
        if (address) {
          setForm({
            first_name: address.first_name,
            last_name: address.last_name,
            email: address.email,
            phone: address.phone,
            city: address.city,
            postal_code: address.postal_code,
            country: address.country,
            company: address.company || "",
            address: address.address,
            apartment: address.apartment || "",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadUserAddress();
  }, []);
  return (
    <>
      <CheckoutHeader />
      <main className={styles.page}>
        <div className={`${styles.content} container`}>
          <section
            className={styles.checkoutPane}
            aria-label="Checkout information"
          >
            <Breadcrumbs
              items={checkoutSteps}
              ariaLabel="Checkout progress"
              className={styles.breadcrumbs}
            />
            {submitError ? (
              <div className={styles.submitError} role="alert">
                {submitError}
              </div>
            ) : null}
            <ShippingForm
              hasItems={hasItems}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              form={form}
            />
          </section>

          <CartPane
            items={items}
            hasItems={hasItems}
            pricing={pricing}
            onIncrease={increaseHandler}
            onDecrease={decreaseHandler}
            onRemove={deleteHandler}
            shippingPrice={selectedMethod?.price}
            shippingState={
              shippingStatus === "loading"
                ? "calculating"
                : shippingStatus === "error"
                  ? "error"
                  : selectedMethod
                    ? "selected"
                    : "not_selected"
            }
          />
        </div>
      </main>

      <ConfirmDialog
        open={confirmationDialog.open}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        confirmLabel="Remove Item"
        cancelLabel="Keep Item"
        onCancel={confirmationDialog.onCancel}
        onConfirm={confirmationDialog.onConfirm}
      />
    </>
  );
}

