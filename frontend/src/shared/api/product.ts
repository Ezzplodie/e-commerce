import { Product } from "@/entities/product/types";

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`http://localhost:4000/products/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const productData: Product = await response.json();
  return productData;
}
console.log(getProductById(1));
