import { useState } from "react";
import { Product } from "@/entities/product/types";
export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  return {};
};
