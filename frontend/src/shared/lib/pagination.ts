/** Total page count; at least 1 when total is 0 (empty list). */
export function getTotalPages(total: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  if (total <= 0) return 1;
  return Math.ceil(total / pageSize);
}

/** True when there is more than one page of results. */
export function hasMultiplePages(total: number, pageSize: number): boolean {
  return getTotalPages(total, pageSize) > 1;
}

export function clampPage(page: number, totalPages: number): number {
  const safeTotal = Math.max(1, totalPages);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(Math.floor(page), safeTotal);
}

export function parsePageParam(
  value: string | null | undefined,
  fallback = 1,
): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.floor(n);
}

export function getPageRange(
  page: number,
  pageSize: number,
  total: number,
): { from: number; to: number } {
  if (total <= 0) return { from: 0, to: 0 };
  return {
    from: (page - 1) * pageSize + 1,
    to: Math.min(page * pageSize, total),
  };
}

export function shouldShowPagination(
  total: number,
  pageSize: number,
  options?: { isLoading?: boolean },
): boolean {
  if (options?.isLoading) return false;
  if (total <= 0) return false;
  return hasMultiplePages(total, pageSize);
}
