"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../config/logger"));
const response_1 = require("../utils/response");
const errorHandler = (err, req, res, next) => {
    logger_1.default.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    if (err instanceof errors_1.AppError) {
        return response_1.ApiResponse.error(res, err.message, err.statusCode);
    }
    // Default error
    return response_1.ApiResponse.error(res, 'Internal server error', 500);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map