import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response';
import userRepository from '../repository/user.repository';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userRepository.findById(req.user!.uid);

      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }

      return ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, location, preferredLanguage, smsEnabled } = req.body;

      await userRepository.update(req.user!.uid, {
        name,
        phone,
        location,
        preferredLanguage,
        smsEnabled,
      });

      const updatedUser = await userRepository.findById(req.user!.uid);

      return ApiResponse.success(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async addFarm(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, size, crops, soilType } = req.body;

      const user = await userRepository.findById(req.user!.uid);

      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }

      const newFarm = {
        id: `farm_${Date.now()}`,
        name,
        size,
        crops,
        soilType,
        registeredDate: new Date().toISOString(),
      };

      await userRepository.update(req.user!.uid, {
        farms: [...user.farms, newFarm],
      });

      return ApiResponse.success(res, newFarm, 'Farm added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async registerFCMToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      await userRepository.addFCMToken(req.user!.uid, token);

      return ApiResponse.success(res, null, 'FCM token registered');
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();