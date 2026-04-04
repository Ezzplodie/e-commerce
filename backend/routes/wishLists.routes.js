import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createWishList,
  getWishListByUserId,
  deleteWishList,
} from "../controllers/wishList.controller.js";

const wishListRouter = express.Router();
wishListRouter.use(authMiddleware);

wishListRouter.post("/", createWishList);
wishListRouter.get("/", getWishListByUserId);
wishListRouter.delete("/:variantId", deleteWishList);
