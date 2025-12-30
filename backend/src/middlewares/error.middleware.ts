import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("❌ ERROR:", err);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
}
