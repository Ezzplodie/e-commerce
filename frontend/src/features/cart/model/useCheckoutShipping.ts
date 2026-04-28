import { useEffect, useMemo, useState } from "react";
import type { ShippingMethod } from "./types";
import { useCartStore } from "./cartStore";
import { getAllShippingMethods } from "../api/shippingMethods";

function pickDefaultMethodId(methods: ShippingMethod[]): number | null {
  if (methods.length === 0) return null;
  const nonExpress = methods.find((m) => !/express/i.test(m.name ?? ""));
  return (nonExpress ?? methods[0]).id;
}

export function useCheckoutShipping() {
  const shippingMethods = useCartStore((s) => s.shippingMethods);
  console.log("shippingMethods", shippingMethods);
  const selectedShippingMethodId = useCartStore(
    (s) => s.selectedShippingMethodId,
  );
  const setShippingMethods = useCartStore((s) => s.setShippingMethods);
  const setSelectedShippingMethodId = useCartStore(
    (s) => s.setSelectedShippingMethodId,
  );

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setStatus("loading");
        setError(null);
        const methods = await getAllShippingMethods();
        if (cancelled) return;

        setShippingMethods(methods);

        const hasValidSelection =
          selectedShippingMethodId !== null &&
          methods.some((m) => m.id === selectedShippingMethodId);

        if (!hasValidSelection) {
          setSelectedShippingMethodId(pickDefaultMethodId(methods));
        }

        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setError(
          e instanceof Error ? e.message : "Failed to load shipping methods",
        );
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    selectedShippingMethodId,
    setSelectedShippingMethodId,
    setShippingMethods,
  ]);

  const selectedMethod = useMemo(
    () =>
      shippingMethods.find((m) => m.id === selectedShippingMethodId) ?? null,
    [selectedShippingMethodId, shippingMethods],
  );

  return {
    shippingMethods,
    selectedShippingMethodId,
    selectedMethod,
    setSelectedShippingMethodId,
    status,
    error,
  };
}
