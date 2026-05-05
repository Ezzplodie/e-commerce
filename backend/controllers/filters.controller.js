import {
  getAllColorsRepository,
  getAllFabricRepository,
  getFacetsRepository,
  getAllSizesRepository,
} from "../repositories/filters.repository.js";
import { parseProductFilters } from "../utils/filters.js";

export const getAllSizes = async (req, res, next) => {
  try {
    const sizes = await getAllSizesRepository();
    if (!sizes) {
      return res.json("No available sizes");
    }
    return res.json(sizes);
  } catch (error) {
    next(error);
  }
};

export const getAllColors = async (req, res, next) => {
  try {
    const colors = await getAllColorsRepository();
    if (!colors) {
      return res.json("No available colors");
    }
    return res.json(colors);
  } catch (error) {
    next(error);
  }
};

export const getAllFabric = async (req, res, next) => {
  try {
    const fabrics = await getAllFabricRepository();
    if (!fabrics) {
      return res.json("No available fabric");
    }
    return res.json(fabrics);
  } catch (error) {
    next(error);
  }
};

// Facets endpoint: returns available values (optionally can be extended with counts)
export const getFacets = async (req, res, next) => {
  try {
    const filters = parseProductFilters(req.query);
    const rows = await getFacetsRepository(filters);

    const facets = { color: [], size: [], fabric: [] };
    for (const r of rows) {
      const item = { value: r.value, count: r.count };
      if (r.attribute_code === "color") facets.color.push(item);
      if (r.attribute_code === "size") facets.size.push(item);
      if (r.attribute_code === "fabric") facets.fabric.push(item);
    }

    res.json({
      facets,
      selected: {
        color: filters.colors,
        size: filters.sizes,
        fabric: filters.fabric,
        sortby: filters.sortBy,
        collection: filters.collection,
      },
    });
  } catch (error) {
    next(error);
  }
};
