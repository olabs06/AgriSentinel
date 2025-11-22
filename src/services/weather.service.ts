import axios from 'axios';
import env from '../config/env';
import { WeatherData } from '../types/models';
import { db } from '../config/firebase';
import logger from '../config/logger';

export class WeatherService {
  private apiKey: string;
  private cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours

  constructor() {
    this.apiKey = env.GOOGLE_WEATHER_API_KEY;
  }

  async getWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherData> {
    // Check cache first
    const cacheKey = `${latitude}_${longitude}`.replace(/\./g, '_');
    const cached = await this.getCachedWeather(cacheKey);

    if (cached) {
      return cached;
    }

    // Fetch from API
    try {
      const response = await axios.get(
        'https://weather.googleapis.com/v1/forecast',
        {
          params: {
            latitude,
            longitude,
            key: this.apiKey,
          },
        }
      );

      const weatherData: WeatherData = {
        temperature: response.data.current.temperature,
        humidity: response.data.current.humidity,
        condition: response.data.current.condition,
        precipitation: response.data.current.precipitation || 0,
        forecast: response.data.forecast?.slice(0, 7),
      };

      // Cache the result
      await this.cacheWeather(cacheKey, weatherData);

      return weatherData;
    } catch (error) {
      logger.error('Weather API error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  private async getCachedWeather(
    cacheKey: string
  ): Promise<WeatherData | null> {
    try {
      const doc = await db.collection('weather_cache').doc(cacheKey).get();

      if (!doc.exists) return null;

      const data = doc.data()!;
      const expiresAt = data.expiresAt.toDate();

      if (expiresAt < new Date()) {
        return null;
      }

      return data.current;
    } catch (error) {
      logger.error('Cache read error:', error);
      return null;
    }
  }

  private async cacheWeather(cacheKey: string, weather: WeatherData) {
    try {
      await db.collection('weather_cache').doc(cacheKey).set({
        current: weather,
        lastUpdated: new Date(),
        expiresAt: new Date(Date.now() + this.cacheExpiry),
      });
    } catch (error) {
      logger.error('Cache write error:', error);
    }
  }
}

export default new WeatherService();
