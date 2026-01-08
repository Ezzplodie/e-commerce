import { productRepository } from './product.repository';
import { CreateProductDto, EditProductDto } from './product.dto';
import { Product } from './product.entity';

export class ProductService {

  async create(dto: CreateProductDto): Promise<Product> {
    const product = productRepository.create({
      ...dto, 
    });

    return await productRepository.save(product);
  }


  async edit(product_id: number, dto: EditProductDto): Promise<Product> {
    const product = await productRepository.findOne({
      where: { id: product_id }, 
    });

    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, dto);

    return await productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await productRepository.find();
  }


  async findOne(product_id: number): Promise<Product | null> {
    return await productRepository.findOne({
      where: { id: product_id },
    });
  }

  async delete(product_id: number): Promise<void> {
    const product = await productRepository.findOne({
      where: { id: product_id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    await productRepository.remove(product);
  }

  async getProductByCategory(cat_id: number): Promise<Product[]> {
    return await productRepository.find({
      where: {category_id: cat_id},
   });
  }
}
