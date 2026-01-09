import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();
const controller = new ProductController();

router.post('/create', controller.create);
router.put('/edit/:id', controller.edit);
router.get('/product/:id', controller.findOne);
router.post('/delete/:id', controller.delete);
router.get('/', controller.findAll);
router.get('/product-by-cat/:id', controller.findByCategory);

export default router;
