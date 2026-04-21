import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createAddress,
  getUserAddresses,
} from "../controllers/addresses.controller.js";
const addressRouter = express.Router();
addressRouter.use(authMiddleware);
addressRouter.put("/", createAddress);
addressRouter.get("/", getUserAddresses);

export default addressRouter;
