"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = __importDefault(require("../config/env"));
const firebase_1 = require("../config/firebase");
const logger_1 = __importDefault(require("../config/logger"));
class WeatherService {
    apiKey;
    cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours
    constructor() {
        this.apiKey = env_1.default.GOOGLE_WEATHER_API_KEY;
    }
    async getWeather(latitude, longitude) {
        // Check cache first
        const cacheKey = `${latitude}_${longitude}`.replace(/\./g, '_');
        const cached = await this.getCachedWeather(cacheKey);
        if (cached) {
            return cached;
        }
        // Fetch from API
        try {
            const response = await axios_1.default.get('https://weather.googleapis.com/v1/forecast', {
                params: {
                    latitude,
                    longitude,
                    key: this.apiKey,
                },
            });
            const weatherData = {
                temperature: response.data.current.temperature,
                humidity: response.data.current.humidity,
                condition: response.data.current.condition,
                precipitation: response.data.current.precipitation || 0,
                forecast: response.data.forecast?.slice(0, 7),
            };
            // Cache the result
            await this.cacheWeather(cacheKey, weatherData);
            return weatherData;
        }
        catch (error) {
            logger_1.default.error('Weather API error:', error);
            throw new Error('Failed to fetch weather data');
        }
    }
    async getCachedWeather(cacheKey) {
        try {
            const doc = await firebase_1.db.collection('weather_cache').doc(cacheKey).get();
            if (!doc.exists)
                return null;
            const data = doc.data();
            const expiresAt = data.expiresAt.toDate();
            if (expiresAt < new Date()) {
                return null;
            }
            return data.current;
        }
        catch (error) {
            logger_1.default.error('Cache read error:', error);
            return null;
        }
    }
    async cacheWeather(cacheKey, weather) {
        try {
            await firebase_1.db.collection('weather_cache').doc(cacheKey).set({
                current: weather,
                lastUpdated: new Date(),
                expiresAt: new Date(Date.now() + this.cacheExpiry),
            });
        }
        catch (error) {
            logger_1.default.error('Cache write error:', error);
        }
    }
}
exports.WeatherService = WeatherService;
exports.default = new WeatherService();
//# sourceMappingURL=weather.service.js.map