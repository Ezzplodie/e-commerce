import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./product.dto";

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    const dto = plainToInstance(CreateProductDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Product add failed",
        errors,
      });
    }
  }
}
