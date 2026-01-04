import 'dotenv/config'; // <--- CRITICAL: Loads .env file immediately
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../modules/user/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  schema: 'clothes_shop', // Ensure this schema exists in Supabase!
  entities: [User],
  synchronize: false,
  ssl: true, // Enable SSL generally
  extra: {
    ssl: {
      rejectUnauthorized: false, // Required for Supabase to accept the connection
    },
  },
});