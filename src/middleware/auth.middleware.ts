import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { UnauthorizedError } from '../utils/errors';
import logger from '../config/logger';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Attach user info to request
    const { uid, email, ...rest } = decodedToken as any;
    req.user = {
      ...rest,
      uid,
      email: email!,
    } as any;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(new UnauthorizedError('Invalid token'));
  }
};