import axios from 'axios';
import env from '../config/env';
import logger from '../config/logger';
import { MLPredictionRequest, MLPredictionResponse } from '../types/api';

export class MLService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = env.ML_SERVICE_URL;
    this.apiKey = env.ML_SERVICE_API_KEY;
  }

  async predictDisease(
    request: MLPredictionRequest
  ): Promise<MLPredictionResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/predict`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
          },
          timeout: 30000, // 30 seconds
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('ML Service error:', error.message);
      throw new Error('Failed to get prediction from ML service');
    }
  }

  async getModelInfo(cropType: string) {
    try {
      const response = await axios.get(
        `${this.baseURL}/models/${cropType}/info`,
        {
          headers: { 'X-API-Key': this.apiKey },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get model info:', error);
      throw error;
    }
  }
}

export default new MLService();
