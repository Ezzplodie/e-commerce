import { CreateProductDto } from "./product.dto";
import { Product } from "./product.entity";
import { productRepository } from "./product.repository";
export class ProductService {
  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await productRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new Error(`product with slug ${dto.slug} already exists`);
    }

    const product = productRepository.create(dto);
    return await productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await productRepository.find();
  }
}
