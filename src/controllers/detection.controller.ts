import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response';
import detectionRepository from '../repository/detection.repository';
import mlService from '../services/ml.service';
import weatherService from '../services/weather.service';
import { storage } from '../config/firebase';
import logger from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

export class DetectionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { cropType, farmId, location } = req.body;
      const userId = req.user!.uid;
      const imageFile = req.file;

      if (!imageFile) {
        return ApiResponse.error(res, 'Image file is required', 400);
      }

      // Upload image to Firebase Storage
      const bucket = storage.bucket();
      const fileName = `detections/${userId}/${uuidv4()}.jpg`;
      const file = bucket.file(fileName);

      await file.save(imageFile.buffer, {
        metadata: {
          contentType: imageFile.mimetype,
        },
      });

      const imageUrl = `gs://${bucket.name}/${fileName}`;

      // Convert image to base64 for ML service
      const base64Image = imageFile.buffer.toString('base64');

      // Get ML prediction
      const prediction = await mlService.predictDisease({
        image: base64Image,
        cropType,
        userId,
        location,
      });

      // Get weather data
      const weather = await weatherService.getWeather(
        location.latitude,
        location.longitude
      );

      // Calculate severity
      const severity = this.calculateSeverity(
        prediction.confidence,
        prediction.disease
      );

      // Create detection record
      const detection = await detectionRepository.create({
        userId,
        farmId,
        cropType,
        disease: prediction.disease,
        confidence: prediction.confidence,
        severity,
        imageUrl,
        location,
        analysisSource: prediction.source,
        advice: prediction.advice,
        treatment: prediction.treatment,
        weather,
        timestamp: new Date() as any,
        synced: true,
      });

      logger.info(`Detection created: ${detection.id}`);

      return ApiResponse.success(
        res,
        detection,
        'Detection created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.error(res, 'Detection ID is required', 400);
      }

      const detection = await detectionRepository.findById(id);

      if (!detection) {
        return ApiResponse.error(res, 'Detection not found', 404);
      }

      // Check ownership
      if (detection.userId !== req.user!.uid && req.user!.role !== 'admin') {
        return ApiResponse.error(res, 'Unauthorized', 403);
      }

      return ApiResponse.success(res, detection);
    } catch (error) {
      next(error);
    }
  }

  async getMyDetections(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.uid;
      const limit = parseInt(req.query.limit as string) || 50;

      const detections = await detectionRepository.findByUserId(userId, limit);

      return ApiResponse.success(res, detections);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return ApiResponse.error(res, 'Detection ID is required', 400);
      }

      const detection = await detectionRepository.findById(id);

      if (!detection) {
        return ApiResponse.error(res, 'Detection not found', 404);
      }

      // Check ownership
      if (detection.userId !== req.user!.uid) {
        return ApiResponse.error(res, 'Unauthorized', 403);
      }

      await detectionRepository.delete(id);

      return ApiResponse.success(res, null, 'Detection deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  private calculateSeverity(
    confidence: number,
    disease: string
  ): 'low' | 'medium' | 'high' {
    const isHealthy = disease.toLowerCase().includes('healthy');
    
    if (isHealthy) return 'low';
    if (confidence > 0.9) return 'high';
    if (confidence > 0.75) return 'medium';
    return 'low';
  }
}

export default new DetectionController();
