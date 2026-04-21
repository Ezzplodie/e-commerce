import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import { errorHandler } from "./middleware/errorHandler.js";
import {
  attributeValuesRouter,
  authRouter,
  categoryRouter,
  productRouter,
  productVariantRouter,
  variantImageRouter,
  wishListRouter,
  orderRouter,
  webhookRouter,
  addressRouter,
} from "./routes/index.js";
import { assertSupabaseStorageConfigured } from "./services/variantImageStorage.service.js";

const app = express();
assertSupabaseStorageConfigured();
app.use(webhookRouter);
app.use("/stripe", webhookRouter);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3105"],
    credentials: true,
  }),
);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/products", productRouter);
app.use("/variants", productVariantRouter);
app.use("/variant-images", variantImageRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/attribute-values", attributeValuesRouter);
app.use("/wish-lists", wishListRouter);
app.use("/orders", orderRouter);
app.use("/addresses", addressRouter);

app.use(errorHandler);
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 4000}`);
});
