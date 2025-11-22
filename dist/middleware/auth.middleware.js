"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const firebase_1 = require("../config/firebase");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../config/logger"));
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            throw new errors_1.UnauthorizedError('No token provided');
        }
        // Verify Firebase ID token
        const decodedToken = await firebase_1.auth.verifyIdToken(token);
        // Attach user info to request
        const { uid, email, ...rest } = decodedToken;
        req.user = {
            ...rest,
            uid,
            email: email,
        };
        next();
    }
    catch (error) {
        logger_1.default.error('Authentication error:', error);
        next(new errors_1.UnauthorizedError('Invalid token'));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map