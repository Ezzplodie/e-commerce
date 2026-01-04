import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    // 1️⃣ Transform + validate
    const dto = plainToInstance(CreateUserDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    const user = await userService.create({
      email: dto.email,
      password: dto.password,   
    });

    return res.status(201).json(user);
  }

  async findAll(req: Request, res: Response) {
    const users = await userService.findAll();
    return res.json(users);
  }
}
