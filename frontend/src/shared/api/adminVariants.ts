export type AdminVariantImage = {
  id: number;
  variant_id: number;
  image_link: string;
  image_order: number | null;
};

export type AdminVariant = {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  images?: AdminVariantImage[];
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

export function listVariants(productId?: number): Promise<AdminVariant[]> {
  const query = productId ? `?product_id=${productId}` : "";
  return request<AdminVariant[]>(`/variants${query}`);
}

export function getVariant(id: number): Promise<AdminVariant> {
  return request<AdminVariant>(`/variants/${id}`);
}

export function createVariant(input: {
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  attribute_value_ids: number[];
}): Promise<AdminVariant> {
  return request<AdminVariant>("/variants", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateVariant(
  id: number,
  patch: Partial<Pick<AdminVariant, "sku" | "price" | "stock">>,
): Promise<AdminVariant> {
  return request<AdminVariant>(`/variants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteVariant(id: number): Promise<void> {
  return request<void>(`/variants/${id}`, { method: "DELETE" });
}

export function listVariantImages(variantId: number): Promise<AdminVariantImage[]> {
  return request<AdminVariantImage[]>(`/variants/${variantId}/images`);
}

export function createVariantImage(input: {
  variant_id: number;
  image_link: string;
  image_order?: number;
}): Promise<AdminVariantImage> {
  const { variant_id, ...rest } = input;
  return request<AdminVariantImage>(`/variants/${variant_id}/images`, {
    method: "POST",
    body: JSON.stringify(rest),
  });
}

export function updateVariantImage(
  imageId: number,
  patch: Partial<Pick<AdminVariantImage, "image_link" | "image_order">>,
): Promise<AdminVariantImage> {
  return request<AdminVariantImage>(`/variants/images/${imageId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteVariantImage(imageId: number): Promise<void> {
  return request<void>(`/variants/images/${imageId}`, { method: "DELETE" });
}

