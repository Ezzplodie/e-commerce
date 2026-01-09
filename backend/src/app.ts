import express, { Application, Request, Response } from 'express';

import userRoutes from './modules/user/user.routes';
import productRoutes from './modules/products/product.routes';
import categoryRoutes from './modules/category/category.routes';

const app: Application = express();

app.use(express.json());



app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);



export default app;
