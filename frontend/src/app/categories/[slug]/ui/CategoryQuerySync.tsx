"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CategoryQuerySync({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = searchParams.get("category");
    if (current === slug) return;

    const next = new URLSearchParams(searchParams.toString());
    next.set("category", slug);

    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [router, pathname, searchParams, slug]);

  return null;
}

