// user.repository.ts
import { AppDataSource } from '../../config/datasource';
import { User } from './user.entity';

export const userRepository = AppDataSource.getRepository(User);
