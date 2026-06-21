"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchAdminOrderWithItems,
  patchOrderStatus,
} from "../api/ordersAdmin";
import type { AdminOrderWithItems } from "../model/types";
import {
  ORDER_STATUS_OPTIONS,
  type OrderStatusValue,
} from "../model/orderStatuses";
import { Button } from "@/shared/ui/Button";
import styles from "./AdminOrderDetail.module.scss";

function formatMoney(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatShipping(order: AdminOrderWithItems): string[] {
  const s = order.shipping;
  const lines: string[] = [];
  const name = [s.firstName, s.lastName].filter(Boolean).join(" ");
  if (name) lines.push(name);
  if (s.email) lines.push(s.email);
  if (s.phone) lines.push(s.phone);
  const street = [s.address, s.shipping_apartmentment].filter(Boolean).join(
    ", ",
  );
  if (street) lines.push(street);
  const cityLine = [s.city, s.postal_code].filter(Boolean).join(", ");
  if (cityLine) lines.push(cityLine);
  if (s.shipping_country) lines.push(s.shipping_country);
  if (s.shipping_company) lines.push(s.shipping_company);
  return lines;
}

type Props = {
  orderId: string;
};

export function AdminOrderDetail({ orderId }: Props) {
  const idNum = Number(orderId);
  const invalidId = !Number.isInteger(idNum) || idNum <= 0;

  const [order, setOrder] = useState<AdminOrderWithItems | null>(null);
  const [loading, setLoading] = useState(!invalidId);
  const [error, setError] = useState<string | null>(
    invalidId ? "Invalid order id." : null,
  );
  const [statusDraft, setStatusDraft] = useState<OrderStatusValue | "">("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    if (invalidId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminOrderWithItems(idNum);
        if (cancelled) return;
        setOrder(data);
        setStatusDraft(data.status as OrderStatusValue);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof Error ? e.message : "Failed to load order.";
        setError(msg);
        setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [idNum, invalidId]);

  const dirty =
    order &&
    statusDraft &&
    statusDraft !== (order.status as OrderStatusValue);

  async function handleSaveStatus() {
    if (!order || !statusDraft) return;
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      const updated = await patchOrderStatus(order.id, statusDraft);
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: updated.status,
            }
          : prev,
      );
      setSaveOk(true);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not update status.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (invalidId) {
    return (
      <div className={styles.page}>
        <div className={styles.error} role="alert">
          Invalid order id.
        </div>
        <Link className={styles.backLink} href="/admin/orders">
          ← Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.backRow}>
        <Link className={styles.backLink} href="/admin/orders">
          ← Back to orders
        </Link>
      </div>

      {loading && <div className={styles.hint}>Loading order…</div>}

      {error && (
        <div className={styles.error} role="alert">
          {error}
          {/403|Forbidden/i.test(error) ? (
            <span> You need an admin account to view this order.</span>
          ) : null}
        </div>
      )}

      {!loading && order && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Order #{order.id}</h1>
            <p className={styles.meta}>
              Placed {formatDate(order.created_at)} ·{" "}
              {formatMoney(order.total_price)} total · Shipping{" "}
              {formatMoney(order.shipping_cost)}
            </p>
          </div>

          <section className={styles.section} aria-labelledby="ship-label">
            <h2 className={styles.sectionTitle} id="ship-label">
              Shipping
            </h2>
            <div className={styles.card}>
              {formatShipping(order).map((line, i) => (
                <p key={`${i}-${line}`} className={styles.addressLine}>
                  {line}
                </p>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="items-label">
            <h2 className={styles.sectionTitle} id="items-label">
              Line items
            </h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th} scope="col" aria-label="Image" />
                    <th className={styles.th} scope="col">
                      Product
                    </th>
                    <th className={styles.th} scope="col">
                      SKU
                    </th>
                    <th className={styles.th} scope="col">
                      Qty
                    </th>
                    <th className={styles.th} scope="col">
                      Price
                    </th>
                    <th className={styles.th} scope="col">
                      Line
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.td}>
                        {item.image_url_snapshot ? (
                          // eslint-disable-next-line @next/next/no-img-element -- snapshot URLs may be arbitrary / external
                          <img
                            className={styles.thumb}
                            src={item.image_url_snapshot}
                            alt=""
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div
                            className={styles.thumb}
                            aria-hidden
                            style={{ display: "inline-block" }}
                          />
                        )}
                      </td>
                      <td className={styles.td}>
                        <strong>{item.product_name_snapshot}</strong>
                        <div>
                          {[item.color_snapshot, item.size_snapshot]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      </td>
                      <td className={styles.td}>{item.sku_snapshot}</td>
                      <td className={styles.td}>{item.quantity}</td>
                      <td className={styles.td}>{formatMoney(item.price)}</td>
                      <td className={styles.td}>
                        {formatMoney(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="status-label">
            <h2 className={styles.sectionTitle} id="status-label">
              Order status
            </h2>
            <div className={styles.statusRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="order-status-select">
                  Status
                </label>
                <select
                  id="order-status-select"
                  className={styles.select}
                  value={statusDraft}
                  onChange={(e) => {
                    setSaveOk(false);
                    setStatusDraft(e.target.value as OrderStatusValue);
                  }}
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                variant="primary"
                disabled={!dirty || saving}
                onClick={() => void handleSaveStatus()}
              >
                {saving ? "Saving…" : "Save status"}
              </Button>
            </div>
            {dirty && (
              <p className={styles.saveHint}>
                You have unsaved changes to the order status.
              </p>
            )}
            {saveError && (
              <div className={styles.error} role="alert">
                {saveError}
              </div>
            )}
            {saveOk && !saveError && (
              <div className={styles.success} role="status">
                Status updated.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
