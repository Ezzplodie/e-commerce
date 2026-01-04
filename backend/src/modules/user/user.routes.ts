import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

router.post('/register', controller.create);
router.post('/login', controller.login);
router.get('/', controller.findAll);

export default router;
