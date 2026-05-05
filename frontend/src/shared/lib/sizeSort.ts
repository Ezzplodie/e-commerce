/** Canonical order for letter / acronym clothing sizes (case-insensitive rank). */
export const SIZE_ORDER = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
] as const;

export function getSizeSortRank(size: string): number {
  const rank = (SIZE_ORDER as readonly string[]).indexOf(
    size.trim().toUpperCase(),
  );
  return rank === -1 ? Number.POSITIVE_INFINITY : rank;
}

/** Comparator for `.sort()` — known sizes first in SIZE_ORDER, then locale. */
export function compareSizes(a: string, b: string): number {
  const rankDiff = getSizeSortRank(a) - getSizeSortRank(b);
  if (rankDiff !== 0) return rankDiff;
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}
