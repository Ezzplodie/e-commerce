// user.repository.ts
import { AppDataSource } from '../../config/datasource';
import { Product } from './product.entity';

export const productRepository = AppDataSource.getRepository(Product);
