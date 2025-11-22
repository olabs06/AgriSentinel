import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import detectionRoutes from './detection.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/detections', detectionRoutes);

export default router;