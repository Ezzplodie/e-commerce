import {
  Product,
  ProductVariant,
  ProductsResponse,
  VariantImage,
} from "@/entities/product/types";
import {
  AttributeValue,
  AttributeValueDto,
  Category,
  CategoryDto,
  ProductDto,
  UpdateVariantImageDto,
  UpdateCategoryDto,
  UpdateProductDto,
  UpdateVariantDto,
  VariantDto,
} from "../types";

const API_BASE = "http://localhost:4000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

export const getProducts = async (
  limit: number,
  page: number,
  signal?: AbortSignal,
): Promise<ProductsResponse> => {
  const response = await fetch(
    `${API_BASE}/products?limit=${limit}&page=${page}`,
    {
      method: "GET",
      credentials: "include",
      signal,
    },
  );

  return parseResponse<ProductsResponse>(response);
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/${slug}`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Product>(response);
};

export const createProduct = async (
  productData: ProductDto,
): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(productData),
  });

  return parseResponse<Product>(response);
};

export const updateProduct = async (
  slug: string,
  productData: UpdateProductDto,
): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(productData),
  });

  return parseResponse<Product>(response);
};

export const deleteProduct = async (slug: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/products/${slug}`, {
    method: "DELETE",
    credentials: "include",
  });

  await parseResponse(response);
};

export const createVariant = async (
  variantData: VariantDto,
): Promise<ProductVariant> => {
  const response = await fetch(`${API_BASE}/variants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(variantData),
  });

  return parseResponse<ProductVariant>(response);
};

export const updateVariant = async (
  variantId: number,
  variantData: UpdateVariantDto,
): Promise<ProductVariant> => {
  const response = await fetch(`${API_BASE}/variants/${variantId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(variantData),
  });

  return parseResponse<ProductVariant>(response);
};

export const deleteVariant = async (variantId: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/variants/${variantId}`, {
    method: "DELETE",
    credentials: "include",
  });

  await parseResponse(response);
};

export const uploadVariantImage = async (
  variantId: number,
  file: File,
  imageOrder = 0,
) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("image_order", String(imageOrder));

  const response = await fetch(
    `${API_BASE}/variant-images/${variantId}/upload`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  return parseResponse(response);
};

export const updateVariantImage = async (
  imageId: number,
  imageData: UpdateVariantImageDto,
): Promise<VariantImage> => {
  const response = await fetch(`${API_BASE}/variant-images/${imageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(imageData),
  });

  return parseResponse<VariantImage>(response);
};

export const deleteVariantImage = async (imageId: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/variant-images/${imageId}`, {
    method: "DELETE",
    credentials: "include",
  });

  await parseResponse(response);
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/categories`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Category[]>(response);
};

export const getAttributeValues = async (
  attributeCode?: string,
): Promise<AttributeValue[]> => {
  const query = attributeCode
    ? `?code=${encodeURIComponent(attributeCode)}`
    : "";
  const response = await fetch(`${API_BASE}/attribute-values${query}`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<AttributeValue[]>(response);
};

export const createAttributeValue = async (
  attributeValueData: AttributeValueDto,
): Promise<AttributeValue> => {
  const response = await fetch(`${API_BASE}/attribute-values`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(attributeValueData),
  });

  return parseResponse<AttributeValue>(response);
};

export const createCategory = async (
  categoryData: CategoryDto,
): Promise<Category> => {
  const response = await fetch(`${API_BASE}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(categoryData),
  });

  return parseResponse<Category>(response);
};

export const updateCategory = async (
  slug: string,
  categoryData: UpdateCategoryDto,
): Promise<Category> => {
  const response = await fetch(`${API_BASE}/categories/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(categoryData),
  });

  return parseResponse<Category>(response);
};

export const deleteCategory = async (slug: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/categories/${slug}`, {
    method: "DELETE",
    credentials: "include",
  });

  await parseResponse(response);
};

export const toAbsoluteImageUrl = (imageLink: string) => {
  if (!imageLink) {
    return "";
  }

  if (imageLink.startsWith("http://") || imageLink.startsWith("https://")) {
    return imageLink;
  }

  return `${API_BASE}${imageLink}`;
};
