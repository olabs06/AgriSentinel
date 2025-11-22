import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import env from '../config/env';

export interface JWTPayload {
  uid: string;
  email: string;
  role: string;
}

export class JWTUtil {
  static sign(payload: JWTPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as StringValue,
    });
  }

  static verify(token: string): JWTPayload {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  }

  static decode(token: string): JWTPayload | null {
    return jwt.decode(token) as JWTPayload | null;
  }
}
