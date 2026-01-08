import { userRepository } from './user.repository';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

export class UserService {

  [x: string]: any;

  async create(dto: CreateUserDto): Promise<User> {
    // 1️⃣ Check if email already exists
    const existing = await userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new Error('User with same email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = userRepository.create({
      email: dto.email,
      passwordHash,
    });

    return userRepository.save(user);
  }

  async login(email: string, password: string) {
    // 1️⃣ Find user
    const user = await userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash'],
    });
    if (!user) throw new Error('Invalid credentials');

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');

    // 3️⃣ Get JWT secrets from environment
    const JWT_SECRET = process.env.JWT_SECRET;
    const REFRESH_SECRET = process.env.REFRESH_SECRET;
    
    // Defaults strictly as strings to avoid "string | undefined" issues
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
    const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';

    if (!JWT_SECRET || !REFRESH_SECRET) {
      throw new Error('JWT secrets are not defined!');
    }

    // 4️⃣ Create payload
    const payload = { userId: user.id, email: user.email };

    // 5️⃣ Sign tokens
    // FIX: Cast expiresIn to 'any' to bypass strict type checks
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
  }
}