"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import styles from "./AdminLayout.module.scss";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCatalog = pathname.startsWith("/admin/catalog");
  const isOrders = pathname.startsWith("/admin/orders");

  return (
    <div className={styles.shell}>
      <div className="container">
        <header className={styles.header}>
          <nav className={styles.tabs} aria-label="Admin sections">
            <Link
              href="/admin/catalog"
              className={`${styles.tab} ${isCatalog ? styles.tabActive : ""}`}
              aria-current={isCatalog ? "page" : undefined}
            >
              Catalog
            </Link>
            <Link
              href="/admin/orders"
              className={`${styles.tab} ${isOrders ? styles.tabActive : ""}`}
              aria-current={isOrders ? "page" : undefined}
            >
              Orders
            </Link>
          </nav>
          <Link href="/">
            <Button className={styles.backButton} variant="secondary">
              Back to home
            </Button>
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
