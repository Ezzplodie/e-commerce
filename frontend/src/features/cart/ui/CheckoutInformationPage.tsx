"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CloseStrokeIcon } from "@/shared/assets/icons";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { formatPrice } from "@/shared/lib/formatters";
import { CheckoutHeader } from "@/widgets/checkout-header";
import { resolveCartItemImage } from "../lib/resolveCartItemImage";
import { getCartPricing } from "../model/cartPricing";
import type { CartItemData } from "../model/types";
import { useCartStore } from "../model/cartStore";
import { useCartDrawerState } from "../model/useCartDrawerState";
import { CartQuantityControl } from "./CartQuantityControl";
import styles from "./CheckoutInformationPage.module.scss";
import { ShippingForm } from "./ShippingForm";
import { createAddress, findUserAddress } from "../api/address";

const moneyWithCents = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
};

const breadcrumbs = ["Cart", "Info", "Shipping", "Payment"];

function formatItemPrice(value: number) {
  return Number.isInteger(value) ? `$ ${value}` : `$ ${value.toFixed(2)}`;
}

function CartSummaryItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItemData;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  const linePrice = item.price * item.quantity;

  return (
    <li className={styles.summaryItem}>
      <div className={styles.summaryImageWrap}>
        <Image
          src={resolveCartItemImage(item.image)}
          alt=""
          aria-hidden="true"
          fill
          quality={70}
          sizes="142px"
          className={styles.summaryImage}
        />
        <span className={styles.quantityBadge}>
          {item.badgeLabel ?? item.quantity}
        </span>
      </div>

      <div className={styles.itemDetails}>
        <h3 className={styles.itemTitle}>{item.title}</h3>
        <p className={styles.itemMeta}>Size: {item.size}</p>
        <p className={styles.itemMeta}>Color: {item.color}</p>
        <CartQuantityControl
          itemName={item.title}
          quantity={item.quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          className={styles.checkoutQuantity}
        />
      </div>

      <button
        type="button"
        className={styles.removeItemButton}
        onClick={onRemove}
        aria-label={`Remove ${item.title} from cart`}
      >
        <CloseStrokeIcon width={24} height={24} aria-hidden="true" />
      </button>

      <strong className={styles.itemPrice}>{formatItemPrice(linePrice)}</strong>
    </li>
  );
}

export function CheckoutInformationPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const removeItem = useCartStore((state) => state.removeItem);
  const closeCart = useCartStore((state) => state.closeCart);
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
      console.log("Loaded user address:", address);
    } catch (error) {
      console.error("Error loading user address:", error);
    }
  };

  useEffect(() => {
    closeCart();
  }, [closeCart]);
  useEffect(() => {
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
            />
          </section>

          <aside className={styles.cartPane} aria-label="Your cart">
            <div className={styles.cartContent}>
              <h2 className={styles.cartTitle}>Your Cart</h2>

              {hasItems ? (
                <ul className={styles.summaryList}>
                  {items.map((item) => (
                    <CartSummaryItem
                      key={item.id}
                      item={item}
                      onDecrease={() => decreaseHandler(item)}
                      onIncrease={() => increaseHandler(item)}
                      onRemove={() => deleteHandler(item)}
                    />
                  ))}
                </ul>
              ) : (
                <div className={styles.emptySummary}>
                  <h3>Your Cart Is Empty</h3>
                  <p>Add items to your cart before continuing to shipping.</p>
                  <Link href="/products">Shop New In</Link>
                </div>
              )}

              {hasItems && (
                <div className={styles.totalsContainer}>
                  <dl className={styles.totals}>
                    <div>
                      <dt>Subtotal ({pricing.itemCount})</dt>
                      <dd>{formatPrice(pricing.subtotal, moneyWithCents)}</dd>
                    </div>

                    <div>
                      <dt>Tax</dt>
                      <dd>{formatPrice(pricing.tax, moneyWithCents)}</dd>
                    </div>

                    <div>
                      <dt>Shipping</dt>
                      <dd>
                        {pricing.shipping === 0
                          ? "Free"
                          : formatPrice(pricing.shipping, moneyWithCents)}
                      </dd>
                    </div>

                    <div className={styles.totalRow}>
                      <dt>Total Orders:</dt>
                      <dd>{formatPrice(pricing.total, moneyWithCents)}</dd>
                    </div>
                  </dl>
                  <p className={styles.totalNote}>
                    The total amount you pay includes all applicable customs
                    duties & taxes. We guarantee no additional charges on
                    delivery
                  </p>
                </div>
              )}
            </div>
          </aside>
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
