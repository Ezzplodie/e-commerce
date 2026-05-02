import express from "express";
import { listMaterials } from "../controllers/materials.controller.js";

const materialsRouter = express.Router();

materialsRouter.get("/", listMaterials);

export default materialsRouter;
