const normalizeParam = (v) => String(v).trim().toLowerCase();

const toArray = (value) => {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
};

export const parseProductFilters = (query) => {
  const colors = toArray(query.color).map(normalizeParam).filter(Boolean);
  const sizes = toArray(query.size).map(normalizeParam).filter(Boolean);
  const fabric = toArray(query.fabric).map(normalizeParam).filter(Boolean);

  const categoryRaw = query.category ?? null;
  const sortByRaw = query.sortby ?? query.sortBy ?? null;
  const collectionRaw = query.collection ?? null;

  const category = categoryRaw ? normalizeParam(categoryRaw) : null;
  const sortBy = sortByRaw ? normalizeParam(sortByRaw) : null;
  const collection = collectionRaw ? normalizeParam(collectionRaw) : null;

  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const offset =
    query.offset != null
      ? Math.max(parseInt(query.offset, 10) || 0, 0)
      : (page - 1) * limit;

  return {
    colors,
    sizes,
    fabric,
    category,
    sortBy,
    collection,
    limit,
    offset,
    page,
  };
};

export const sortByToOrderBy = (sortBy) => {
  // Whitelist only.
  switch (sortBy) {
    case "price_low_high":
      return `p.base_price ASC, p.id DESC`;
    case "price_high_low":
      return `p.base_price DESC, p.id DESC`;
    case "best_seller":
      // Placeholder: if you have a sales metric, swap it in.
      return `total_stock DESC, p.id DESC`;
    case "featured":
    default:
      return `p.id DESC`;
  }
};

