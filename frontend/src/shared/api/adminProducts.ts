export type AdminProduct = {
  id: number;
  category_id: number | null;
  category_name?: string | null;
  category_slug?: string | null;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function listProducts(): Promise<AdminProduct[]> {
  return request<AdminProduct[]>("/products");
}

export function createProduct(input: {
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
}): Promise<AdminProduct> {
  return request<AdminProduct>("/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateProduct(
  id: number,
  patch: Partial<Pick<AdminProduct, "category_id" | "name" | "slug" | "description" | "base_price">>,
): Promise<AdminProduct> {
  return request<AdminProduct>(`/products/by-id/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteProduct(id: number): Promise<void> {
  return request<void>(`/products/by-id/${id}`, { method: "DELETE" });
}

