"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const firebase_1 = require("../config/firebase");
const logger_1 = __importDefault(require("../config/logger"));
const firebase_admin_1 = require("firebase-admin");
class UserRepository {
    collection = firebase_1.db.collection('users');
    async create(uid, userData) {
        try {
            await this.collection.doc(uid).set({
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return { uid, ...userData };
        }
        catch (error) {
            logger_1.default.error('User create error:', error);
            throw error;
        }
    }
    async findById(uid) {
        try {
            const doc = await this.collection.doc(uid).get();
            if (!doc.exists)
                return null;
            return {
                uid: doc.id,
                ...doc.data(),
            };
        }
        catch (error) {
            logger_1.default.error('User find error:', error);
            throw error;
        }
    }
    async update(uid, data) {
        try {
            await this.collection.doc(uid).update({
                ...data,
                updatedAt: new Date(),
            });
        }
        catch (error) {
            logger_1.default.error('User update error:', error);
            throw error;
        }
    }
    async addFCMToken(uid, token) {
        try {
            await this.collection.doc(uid).update({
                fcmTokens: firebase_admin_1.firestore.FieldValue.arrayUnion(token),
            });
        }
        catch (error) {
            logger_1.default.error('FCM token add error:', error);
            throw error;
        }
    }
    async removeFCMToken(uid, token) {
        try {
            await this.collection.doc(uid).update({
                fcmTokens: firebase_admin_1.firestore.FieldValue.arrayRemove(token),
            });
        }
        catch (error) {
            logger_1.default.error('FCM token remove error:', error);
            throw error;
        }
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();
//# sourceMappingURL=user.repository.js.map