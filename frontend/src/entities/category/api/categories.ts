import { parseResponse } from "@/shared/api/parseResponse";
import type { Category } from "../types";

const API_BASE = "http://localhost:4000";

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

