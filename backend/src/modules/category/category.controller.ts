import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from './category.service';
import { CreateCategoryDto, EditCategoryDto } from './category.dto';
import { EditProductDto } from '../products/product.dto';

const categoryService = new CategoryService();

export class CategoryController {

  async create(req: Request, res: Response) {
    const dto = plainToInstance(CreateCategoryDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    try {
      const product = await categoryService.create(dto);
      return res.status(201).json(product);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }


  async edit(req: Request, res: Response) {
    const catId = Number(req.params.id); 
    const dto = plainToInstance(EditProductDto, req.body);
    const errors = await validate(dto, { skipMissingProperties: true });

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    try {
      const updatedProduct = await categoryService.edit(catId, dto);
      return res.json(updatedProduct);
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }


  async findAll(req: Request, res: Response) {
    try {
      const products = await categoryService.findAll();
      return res.json(products);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }




  async findOne(req: Request, res: Response) {
    const catId = Number(req.params.id);

    try {
      const category = await categoryService.findOne(catId);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.json(category);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }


async delete(req: Request, res: Response) {
  const catId = Number(req.params.id);

  if (isNaN(catId)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }

  try {
    await categoryService.delete(catId);
    return res.status(204).send();
  } catch (err: any) {
    if (err.message === 'Category not found') {
      return res.status(404).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  }
}


}
