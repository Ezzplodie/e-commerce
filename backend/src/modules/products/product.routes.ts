import { Router } from "express";
import { ProductController } from "./product.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = Router();
const controller = new ProductController();

/* ---------- ADMIN ONLY ---------- */
router.post("/create", authMiddleware, adminMiddleware, controller.create);
router.put("/edit/:id", authMiddleware, adminMiddleware, controller.edit);
router.post("/delete/:id", authMiddleware, adminMiddleware, controller.delete);

/* ---------- PUBLIC ---------- */
router.get("/", controller.findAll);
router.get("/product/:id", controller.findOne);
router.get("/product-by-cat/:id", controller.findByCategory);

export default router;
