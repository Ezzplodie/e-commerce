import bcrypt from "bcrypt";
import { createUser, findByEmail } from "./user.repository";
import { CreateUserDTO, User } from "./user.types";

export class UserService {
  async register(data: CreateUserDTO): Promise<User> {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const existingUser = await findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return createUser(email, passwordHash);
  }
}
