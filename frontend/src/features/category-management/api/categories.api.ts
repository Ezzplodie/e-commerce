import { Category } from "@/entities/category/types";
import { CategoryDto, UpdateCategoryDto } from "../types";
import { parseResponse } from "@/shared/api/parseResponse";
import { API_BASE } from "@/shared/api/config";

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/categories`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse<Category[]>(response);
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
