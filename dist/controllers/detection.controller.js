"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectionController = void 0;
const response_1 = require("../utils/response");
const detection_repository_1 = __importDefault(require("../repository/detection.repository"));
const ml_service_1 = __importDefault(require("../services/ml.service"));
const weather_service_1 = __importDefault(require("../services/weather.service"));
const firebase_1 = require("../config/firebase");
const logger_1 = __importDefault(require("../config/logger"));
const uuid_1 = require("uuid");
class DetectionController {
    async create(req, res, next) {
        try {
            const { cropType, farmId, location } = req.body;
            const userId = req.user.uid;
            const imageFile = req.file;
            if (!imageFile) {
                return response_1.ApiResponse.error(res, 'Image file is required', 400);
            }
            // Upload image to Firebase Storage
            const bucket = firebase_1.storage.bucket();
            const fileName = `detections/${userId}/${(0, uuid_1.v4)()}.jpg`;
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
            const prediction = await ml_service_1.default.predictDisease({
                image: base64Image,
                cropType,
                userId,
                location,
            });
            // Get weather data
            const weather = await weather_service_1.default.getWeather(location.latitude, location.longitude);
            // Calculate severity
            const severity = this.calculateSeverity(prediction.confidence, prediction.disease);
            // Create detection record
            const detection = await detection_repository_1.default.create({
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
                timestamp: new Date(),
                synced: true,
            });
            logger_1.default.info(`Detection created: ${detection.id}`);
            return response_1.ApiResponse.success(res, detection, 'Detection created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return response_1.ApiResponse.error(res, 'Detection ID is required', 400);
            }
            const detection = await detection_repository_1.default.findById(id);
            if (!detection) {
                return response_1.ApiResponse.error(res, 'Detection not found', 404);
            }
            // Check ownership
            if (detection.userId !== req.user.uid && req.user.role !== 'admin') {
                return response_1.ApiResponse.error(res, 'Unauthorized', 403);
            }
            return response_1.ApiResponse.success(res, detection);
        }
        catch (error) {
            next(error);
        }
    }
    async getMyDetections(req, res, next) {
        try {
            const userId = req.user.uid;
            const limit = parseInt(req.query.limit) || 50;
            const detections = await detection_repository_1.default.findByUserId(userId, limit);
            return response_1.ApiResponse.success(res, detections);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return response_1.ApiResponse.error(res, 'Detection ID is required', 400);
            }
            const detection = await detection_repository_1.default.findById(id);
            if (!detection) {
                return response_1.ApiResponse.error(res, 'Detection not found', 404);
            }
            // Check ownership
            if (detection.userId !== req.user.uid) {
                return response_1.ApiResponse.error(res, 'Unauthorized', 403);
            }
            await detection_repository_1.default.delete(id);
            return response_1.ApiResponse.success(res, null, 'Detection deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    calculateSeverity(confidence, disease) {
        const isHealthy = disease.toLowerCase().includes('healthy');
        if (isHealthy)
            return 'low';
        if (confidence > 0.9)
            return 'high';
        if (confidence > 0.75)
            return 'medium';
        return 'low';
    }
}
exports.DetectionController = DetectionController;
exports.default = new DetectionController();
//# sourceMappingURL=detection.controller.js.map