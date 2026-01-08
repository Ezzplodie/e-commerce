// user.repository.ts
import { AppDataSource } from '../../config/datasource';
import { Category } from './category.entity';

export const categoryRepository = AppDataSource.getRepository(Category);
