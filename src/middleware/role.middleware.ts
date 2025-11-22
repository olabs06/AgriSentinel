import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';
import { db } from '../config/firebase';

export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ForbiddenError('User not authenticated');
      }

      const userDoc = await db.collection('users').doc(req.user.uid).get();
      const userData = userDoc.data();

      if (!userData || !roles.includes(userData.role)) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};