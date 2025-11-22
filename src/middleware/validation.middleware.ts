import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues?.[0]?.message ?? 'Validation failed';
        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
};