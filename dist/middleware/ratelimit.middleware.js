"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = __importDefault(require("../config/env"));
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(env_1.default.RATE_LIMIT_WINDOW_MS),
    max: parseInt(env_1.default.RATE_LIMIT_MAX_REQUESTS),
    message: 'Too many requests, please try again later',
});
//# sourceMappingURL=ratelimit.middleware.js.map