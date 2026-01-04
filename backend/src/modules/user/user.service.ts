import { userRepository } from './user.repository';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

export class UserService {
  async create(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = userRepository.create({
      email: dto.email,
      passwordHash,
    });

    return userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return userRepository.find();
  }
}
