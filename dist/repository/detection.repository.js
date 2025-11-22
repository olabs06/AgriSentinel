"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectionRepository = void 0;
const firebase_1 = require("../config/firebase");
const logger_1 = __importDefault(require("../config/logger"));
class DetectionRepository {
    collection = firebase_1.db.collection('detections');
    async create(detection) {
        try {
            const docRef = await this.collection.add({
                ...detection,
                timestamp: new Date(),
            });
            return {
                id: docRef.id,
                ...detection,
            };
        }
        catch (error) {
            logger_1.default.error('Detection create error:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists)
                return null;
            return {
                id: doc.id,
                ...doc.data(),
            };
        }
        catch (error) {
            logger_1.default.error('Detection find error:', error);
            throw error;
        }
    }
    async findByUserId(userId, limit = 50) {
        try {
            const snapshot = await this.collection
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            logger_1.default.error('Detection query error:', error);
            throw error;
        }
    }
    async findRecent(cropType, disease, location, days = 7) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            let query = this.collection
                .where('cropType', '==', cropType)
                .where('disease', '==', disease)
                .where('location.state', '==', location.state)
                .where('timestamp', '>=', cutoffDate);
            if (location.lga) {
                query = query.where('location.lga', '==', location.lga);
            }
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            logger_1.default.error('Detection recent query error:', error);
            throw error;
        }
    }
    async update(id, data) {
        try {
            await this.collection.doc(id).update({
                ...data,
                updatedAt: new Date(),
            });
        }
        catch (error) {
            logger_1.default.error('Detection update error:', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            await this.collection.doc(id).delete();
        }
        catch (error) {
            logger_1.default.error('Detection delete error:', error);
            throw error;
        }
    }
}
exports.DetectionRepository = DetectionRepository;
exports.default = new DetectionRepository();
//# sourceMappingURL=detection.repository.js.map