import { Router } from 'express';
import detectionController from '../controllers/detection.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post(
  '/',
  authenticate,
  upload.single('image'),
  detectionController.create
);

router.get('/', authenticate, detectionController.getMyDetections);
router.get('/:id', authenticate, detectionController.getById);
router.delete('/:id', authenticate, detectionController.delete);

export default router;