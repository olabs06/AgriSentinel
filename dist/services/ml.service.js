"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../config/logger"));
class MLService {
    baseURL;
    apiKey;
    constructor() {
        this.baseURL = env_1.default.ML_SERVICE_URL;
        this.apiKey = env_1.default.ML_SERVICE_API_KEY;
    }
    async predictDisease(request) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/predict`, request, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                },
                timeout: 30000, // 30 seconds
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('ML Service error:', error.message);
            throw new Error('Failed to get prediction from ML service');
        }
    }
    async getModelInfo(cropType) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/models/${cropType}/info`, {
                headers: { 'X-API-Key': this.apiKey },
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to get model info:', error);
            throw error;
        }
    }
}
exports.MLService = MLService;
exports.default = new MLService();
//# sourceMappingURL=ml.service.js.map