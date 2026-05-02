import {
  Product,
  ProductVariant,
  VariantImage,
} from "@/entities/product/types";
import {
  AttributeValue,
  AttributeValueDto,
  Material,
  ProductDto,
  UpdateVariantImageDto,
  UpdateProductDto,
  UpdateVariantDto,
  VariantDto,
} from "../types";
import { parseResponse } from "@/shared/api/parseResponse";
import { getProductBySlug, getProducts, toAbsoluteImageUrl } from "@/entities/product/api";

const API_BASE = "http://localhost:4000";

export const getMaterials = async (): Promise<Material[]> => {
  const response = await fetch(`${API_BASE}/materials`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Material[]>(response);
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

export { getProductBySlug, getProducts, toAbsoluteImageUrl };
