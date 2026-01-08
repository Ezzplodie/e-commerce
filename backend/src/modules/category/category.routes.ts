import { Router } from 'express';
import { CategoryController } from './category.controller';

const router = Router();
const controller = new CategoryController();

router.post('/create', controller.create);
router.post('/edit/:id', controller.edit);
router.post('/category/:id', controller.findOne);
router.post('/delete/:id', controller.delete);
router.get('/', controller.findAll);

export default router;
