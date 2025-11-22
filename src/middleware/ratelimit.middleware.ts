import rateLimit from 'express-rate-limit';
import env from '../config/env';

export const rateLimiter = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests, please try again later',
});