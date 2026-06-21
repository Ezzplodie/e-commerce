"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAdminOrdersList } from "../api/ordersAdmin";
import type { AdminOrderListItem } from "../model/types";
import {
  ORDER_STATUS_OPTIONS,
  type OrderStatusValue,
} from "../model/orderStatuses";
import { Button } from "@/shared/ui/Button";
import {
  getPageRange,
  getTotalPages,
  hasMultiplePages,
  parsePageParam,
} from "@/shared/lib/pagination";
import styles from "./AdminOrdersList.module.scss";

const DEFAULT_LIMIT = 20;

function statusBadgeClass(status: string): string {
  const key = status.toLowerCase().replace(/-/g, "_");
  const mapKey = `badge_${key}` as keyof typeof styles;
  if (mapKey in styles && mapKey !== "badge") {
    return `${styles.badge} ${styles[mapKey]}`;
  }
  return `${styles.badge} ${styles.badge_default}`;
}

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

export function AdminOrdersList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parsePageParam(searchParams.get("page"));
  const statusParam = searchParams.get("status") ?? "";
  const statusFilter = useMemo((): OrderStatusValue | "" => {
    const allowed = new Set(
      ORDER_STATUS_OPTIONS.map((o) => o.value) as string[],
    );
    if (statusParam && allowed.has(statusParam)) {
      return statusParam as OrderStatusValue;
    }
    return "";
  }, [statusParam]);

  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setQuery = useCallback(
    (next: { page?: number; status?: OrderStatusValue | "" }) => {
      const sp = new URLSearchParams(searchParams.toString());
      const p = next.page ?? page;
      const s = next.status !== undefined ? next.status : statusFilter;

      if (p <= 1) sp.delete("page");
      else sp.set("page", String(p));

      if (!s) sp.delete("status");
      else sp.set("status", s);

      const qs = sp.toString();
      router.push(qs ? `/admin/orders?${qs}` : "/admin/orders");
    },
    [router, searchParams, page, statusFilter],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAdminOrdersList({
          page,
          limit,
          status: statusFilter || undefined,
        });
        if (cancelled) return;
        setOrders(res.orders);
        setTotal(res.total);
        setLimit(res.limit);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof Error ? e.message : "Failed to load orders.";
        setError(msg);
        setOrders([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [page, limit, statusFilter]);

  const totalPages = useMemo(
    () => getTotalPages(total, limit),
    [total, limit],
  );
  const { from, to } = useMemo(
    () => getPageRange(page, limit, total),
    [page, limit, total],
  );
  const showPagination = hasMultiplePages(total, limit);

  useEffect(() => {
    if (loading || total <= 0 || page <= totalPages) return;
    setQuery({ page: totalPages });
  }, [loading, total, page, totalPages, setQuery]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Orders</h1>
      <p className={styles.subtitle}>
        Review customer orders, payment status, and fulfillment.
      </p>

      <div className={styles.toolbar}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="admin-order-status">
            Status
          </label>
          <select
            id="admin-order-status"
            className={styles.select}
            value={statusFilter}
            onChange={(e) => {
              const v = e.target.value as OrderStatusValue | "";
              setQuery({ page: 1, status: v });
            }}
          >
            <option value="">All statuses</option>
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          {error}
          {/403|Forbidden/i.test(error) ? (
            <span> You need an admin account to view this page.</span>
          ) : null}
        </div>
      )}

      {loading && <div className={styles.hint}>Loading orders…</div>}

      {!loading && !error && orders.length === 0 && (
        <div className={styles.hint}>No orders match the current filters.</div>
      )}

      {!loading && orders.length > 0 && (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Order</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Customer</th>
                  <th className={styles.th}>Items</th>
                  <th className={styles.th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.td}>
                      <Link
                        className={styles.link}
                        href={`/admin/orders/${row.id}`}
                      >
                        #{row.id}
                      </Link>
                    </td>
                    <td className={styles.td}>{formatDate(row.created_at)}</td>
                    <td className={styles.td}>
                      <span className={statusBadgeClass(row.status)}>
                        {row.status}
                      </span>
                    </td>
                    <td className={styles.td}>
                      {row.customer_email ?? row.shipping?.email ?? "—"}
                    </td>
                    <td className={styles.td}>{row.item_count}</td>
                    <td className={styles.td}>{formatMoney(row.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination ? (
            <div className={styles.pagination}>
              <Button
                type="button"
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setQuery({ page: page - 1 })}
              >
                Previous
              </Button>
              <span className={styles.pageInfo}>
                {from}–{to} of {total} (page {page} of {totalPages})
              </span>
              <Button
                type="button"
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setQuery({ page: page + 1 })}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
