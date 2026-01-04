import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

router.post('/', controller.create);
router.get('/', controller.findAll);

export default router;
