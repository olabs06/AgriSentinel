"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../config/logger"));
class SMSService {
    apiKey;
    baseURL = 'https://api.ng.termii.com/api';
    constructor() {
        this.apiKey = env_1.default.TERMII_API_KEY;
    }
    async sendSMS(phone, message) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/sms/send`, {
                to: this.formatPhone(phone),
                from: 'AgriSentinl',
                sms: message,
                type: 'plain',
                channel: 'generic',
                api_key: this.apiKey,
            });
            logger_1.default.info(`SMS sent to ${phone}`);
            return response.data.message === 'Successfully Sent';
        }
        catch (error) {
            logger_1.default.error('SMS error:', error.response?.data || error.message);
            return false;
        }
    }
    formatPhone(phone) {
        // Ensure Nigerian format +234...
        phone = phone.replace(/\D/g, '');
        if (phone.startsWith('0')) {
            return `+234${phone.substring(1)}`;
        }
        if (!phone.startsWith('234')) {
            return `+234${phone}`;
        }
        return `+${phone}`;
    }
}
exports.SMSService = SMSService;
exports.default = new SMSService();
//# sourceMappingURL=sms.service.js.map