import dotenv from 'dotenv';
import app from './app';
import { AppDataSource } from './config/datasource';


dotenv.config(); // 👈 MUST be called

console.log('Current directory:', process.cwd());
console.log('DB URL:', process.env.DATABASE_URL);

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to Supabase Postgres');
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });
