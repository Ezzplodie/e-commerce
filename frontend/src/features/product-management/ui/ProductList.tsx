"use client";
import { useAdminProducts } from "../model/useAdminProducts";
import { Loading } from "@/shared/ui/Loading";
export const ProductList = () => {
  const { products, loading, error, page, limit, total, setPage, setLimit } =
    useAdminProducts();
  return (
    <>
      <h1>Product List</h1>
      <Loading />
      {loading && <Loading />}
      {products && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </>
  );
};
