import Link from "next/link";
import type { ReactNode } from "react";

interface CheckoutReturnLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function CheckoutReturnLink({
  href,
  className,
  children,
}: CheckoutReturnLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

