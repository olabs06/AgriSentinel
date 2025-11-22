"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const firebase_1 = require("../config/firebase");
const user_repository_1 = __importDefault(require("../repository/user.repository"));
const response_1 = require("../utils/response");
const jwt_1 = require("../utils/jwt");
const logger_1 = __importDefault(require("../config/logger"));
class AuthController {
    async register(req, res, next) {
        try {
            const { email, password, name, phone, location, preferredLanguage } = req.body;
            // Create Firebase Auth user
            const userRecord = await firebase_1.auth.createUser({
                email,
                password,
                displayName: name,
            });
            // Create user document
            await user_repository_1.default.create(userRecord.uid, {
                name,
                phone,
                email,
                location,
                farms: [],
                preferredLanguage: preferredLanguage || 'en',
                smsEnabled: false,
                fcmTokens: [],
                role: 'farmer',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            // Generate custom token
            const customToken = await firebase_1.auth.createCustomToken(userRecord.uid);
            logger_1.default.info(`User registered: ${userRecord.uid}`);
            return response_1.ApiResponse.success(res, { uid: userRecord.uid, token: customToken }, 'User registered successfully', 201);
        }
        catch (error) {
            if (error.code === 'auth/email-already-exists') {
                return response_1.ApiResponse.error(res, 'Email already exists', 400);
            }
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { idToken } = req.body;
            // Verify Firebase ID token
            const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
            // Get user data
            const user = await user_repository_1.default.findById(decodedToken.uid);
            if (!user) {
                return response_1.ApiResponse.error(res, 'User not found', 404);
            }
            // Generate JWT
            const token = jwt_1.JWTUtil.sign({
                uid: user.uid,
                email: user.email,
                role: user.role,
            });
            logger_1.default.info(`User logged in: ${user.uid}`);
            return response_1.ApiResponse.success(res, {
                user,
                token,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            // Firebase handles refresh token logic
            const customToken = await firebase_1.auth.createCustomToken(req.user.uid);
            return response_1.ApiResponse.success(res, { token: customToken });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map