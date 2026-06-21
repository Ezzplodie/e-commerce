import { parseResponse } from "@/shared/api/parseResponse";
import { API_BASE } from "@/shared/api/config";
import type { Category } from "../types";

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  return parseResponse<Category[]>(response);
}

export async function getCategoryBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<Category> {
  const response = await fetch(`${API_BASE}/categories/${encodeURIComponent(slug)}`, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  return parseResponse<Category>(response);
}

