export interface CreateUserDTO {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  created_at: Date;
}
