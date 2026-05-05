import express from "express";

import {
  getAllColors,
  getAllFabric,
  getAllSizes,
  getFacets,
} from "../controllers/filters.controller.js";

const filtersRouter = express.Router();
// Facets endpoint (preferred)
filtersRouter.get("/", getFacets);

// Legacy endpoints (optional)
filtersRouter.get("/colors", getAllColors);
filtersRouter.get("/sizes", getAllSizes);
filtersRouter.get("/fabric", getAllFabric);

export default filtersRouter;
