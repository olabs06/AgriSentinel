"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCMService = void 0;
const firebase_1 = require("../config/firebase");
const logger_1 = __importDefault(require("../config/logger"));
class FCMService {
    async sendNotification(tokens, title, body, data) {
        try {
            const message = {
                notification: {
                    title,
                    body,
                },
                data: data || {},
                tokens,
            };
            const response = await firebase_1.messaging.sendEachForMulticast(message);
            logger_1.default.info(`FCM sent: ${response.successCount}/${tokens.length}`);
            return response.successCount;
        }
        catch (error) {
            logger_1.default.error('FCM error:', error);
            return 0;
        }
    }
    async sendToTopic(topic, title, body, data) {
        try {
            await firebase_1.messaging.send({
                topic,
                notification: { title, body },
                data: data || {},
            });
            logger_1.default.info(`FCM sent to topic: ${topic}`);
        }
        catch (error) {
            logger_1.default.error('FCM topic error:', error);
        }
    }
}
exports.FCMService = FCMService;
exports.default = new FCMService();
//# sourceMappingURL=fcm.service.js.map