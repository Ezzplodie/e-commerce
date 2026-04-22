"use client";

import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { CheckoutHeader } from "@/widgets/checkout-header";
import { getCartPricing } from "../model/cartPricing";
import { useCartStore } from "../model/cartStore";
import { useCartDrawerState } from "../model/useCartDrawerState";
import styles from "./CheckoutInformationPage.module.scss";
import { ShippingForm } from "./ShippingForm";
import { CartPane } from "./CartPane";
import { createAddress, findUserAddress } from "../api/address";

const breadcrumbs = ["Cart", "Info", "Shipping", "Payment"];

export function CheckoutInformationPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const removeItem = useCartStore((state) => state.removeItem);
  const closeCart = useCartStore((state) => state.closeCart);
  const pricing = getCartPricing(items);
  const hasItems = items.length > 0;
  const [isSaveShippingInfo, setIsSaveShippingInfo] = useState<boolean>(false);
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

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting form with data:", form);
    const data = {
      ...form,
      company: form.company || undefined,
      apartment: form.apartment || undefined,
    };
    createAddress(data);
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
            <nav className={styles.breadcrumbs} aria-label="Checkout progress">
              {breadcrumbs.map((crumb, index) => (
                <span
                  key={crumb}
                  className={
                    index === 1 ? styles.breadcrumbActive : styles.breadcrumb
                  }
                >
                  {crumb}
                  {index < breadcrumbs.length - 1 ? (
                    <span className={styles.breadcrumbSlash} aria-hidden="true">
                      /
                    </span>
                  ) : null}
                </span>
              ))}
            </nav>
            <ShippingForm
              hasItems={hasItems}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              form={form}
              isSaveShippingInfo={isSaveShippingInfo}
              setIsSaveShippingInfo={setIsSaveShippingInfo}
            />
          </section>

          <CartPane
            items={items}
            hasItems={hasItems}
            pricing={pricing}
            onIncrease={increaseHandler}
            onDecrease={decreaseHandler}
            onRemove={deleteHandler}
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
