import express from "express";
import "dotenv/config";
import productRouter from "./routes/product.routes.js";
import productVariantRouter from "./routes/productVariants.routes.js";
import variantImageRouter from "./routes/variantImages.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import categoryRouter from "./routes/category.routes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/products", productRouter);
app.use("/variants", productVariantRouter);
app.use("/variant-images", variantImageRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);

app.use(errorHandler);
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 4000}`);
});
