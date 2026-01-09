import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ProductService } from './product.service';
import { CreateProductDto, EditProductDto } from './product.dto';

const productService = new ProductService();

export class ProductController {

  async create(req: Request, res: Response) {
    const dto = plainToInstance(CreateProductDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    try {
      const product = await productService.create(dto);
      return res.status(201).json(product);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }


  async edit(req: Request, res: Response) {
    const productId = Number(req.params.id); 
    const dto = plainToInstance(EditProductDto, req.body);
    const errors = await validate(dto, { skipMissingProperties: true });

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    try {
      const updatedProduct = await productService.edit(productId, dto);
      return res.json(updatedProduct);
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }


  async findAll(req: Request, res: Response) {
    try {
      const products = await productService.findAll();
      return res.json(products);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }




  async findOne(req: Request, res: Response) {
    const productId = Number(req.params.id);

    try {
      const product = await productService.findOne(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(product);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }


    async findByCategory(req: Request, res: Response) {
    const catId = Number(req.params.id);

    try {
      const product = await productService.getProductByCategory(catId);

      if (!product) {
        return res.status(404).json({ message: 'Products not found' });
      }

      return res.json(product);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }


async delete(req: Request, res: Response) {
  const productId = Number(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }

  try {
    await productService.delete(productId);
    return res.status(204).send();
  } catch (err: any) {
    if (err.message === 'Product not found') {
      return res.status(404).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  }
}


}
