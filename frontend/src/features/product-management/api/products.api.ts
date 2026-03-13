import { ProductsResponse } from "@/entities/product/types";

export const getProducts = async (
  limit: number,
  page: number,
): Promise<ProductsResponse> => {
  try {
    const response = await fetch(
      `http://localhost:4000/products?limit=${limit}&page=${page}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const products = await response.json();
    return products;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};
