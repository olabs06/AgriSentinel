import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import userRepository from '../repository/user.repository';
import { ApiResponse } from '../utils/response';
import { JWTUtil } from '../utils/jwt';
import logger from '../config/logger';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, phone, location, preferredLanguage } = req.body;

      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      // Create user document
      await userRepository.create(userRecord.uid, {
        name,
        phone,
        email,
        location,
        farms: [],
        preferredLanguage: preferredLanguage || 'en',
        smsEnabled: false,
        fcmTokens: [],
        role: 'farmer',
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      });

      // Generate custom token
      const customToken = await auth.createCustomToken(userRecord.uid);

      logger.info(`User registered: ${userRecord.uid}`);

      return ApiResponse.success(
        res,
        { uid: userRecord.uid, token: customToken },
        'User registered successfully',
        201
      );
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        return ApiResponse.error(res, 'Email already exists', 400);
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken } = req.body;

      // Verify Firebase ID token
      const decodedToken = await auth.verifyIdToken(idToken);

      // Get user data
      const user = await userRepository.findById(decodedToken.uid);

      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }

      // Generate JWT
      const token = JWTUtil.sign({
        uid: user.uid,
        email: user.email,
        role: user.role,
      });

      logger.info(`User logged in: ${user.uid}`);

      return ApiResponse.success(res, {
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      // Firebase handles refresh token logic
      const customToken = await auth.createCustomToken(req.user!.uid);

      return ApiResponse.success(res, { token: customToken });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();