import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/farms', authenticate, userController.addFarm);
router.post('/fcm-token', authenticate, userController.registerFCMToken);

export default router;