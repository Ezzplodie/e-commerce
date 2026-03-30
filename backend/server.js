import express from "express";
import "dotenv/config";
import path from "node:path";
import productRouter from "./routes/product.routes.js";
import productVariantRouter from "./routes/productVariants.routes.js";
import variantImageRouter from "./routes/variantImages.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import categoryRouter from "./routes/category.routes.js";
import attributeValuesRouter from "./routes/attributeValues.routes.js";
import cors from "cors";
import { assertSupabaseStorageConfigured } from "./services/variantImageStorage.service.js";

const app = express();
assertSupabaseStorageConfigured();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3105"],
    credentials: true,
  }),
);
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/products", productRouter);
app.use("/variants", productVariantRouter);
app.use("/variant-images", variantImageRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/attribute-values", attributeValuesRouter);

app.use(errorHandler);
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 4000}`);
});
