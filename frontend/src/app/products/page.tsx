import { ProductsRoutePage } from "@/widgets/products";
import { Suspense } from "react";

export default function ProductsPageRoute() {
  return (
    <Suspense fallback={null}>
      <ProductsRoutePage />
    </Suspense>
  );
}
