import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createAttributeValue,
  getAttributeValues,
} from "../controllers/attributeValues.controller.js";

const attributeValuesRouter = express.Router();

attributeValuesRouter.get("/", getAttributeValues);
attributeValuesRouter.post("/", authMiddleware, createAttributeValue);

export default attributeValuesRouter;
