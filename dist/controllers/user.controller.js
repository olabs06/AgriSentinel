"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const response_1 = require("../utils/response");
const user_repository_1 = __importDefault(require("../repository/user.repository"));
class UserController {
    async getProfile(req, res, next) {
        try {
            const user = await user_repository_1.default.findById(req.user.uid);
            if (!user) {
                return response_1.ApiResponse.error(res, 'User not found', 404);
            }
            return response_1.ApiResponse.success(res, user);
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const { name, phone, location, preferredLanguage, smsEnabled } = req.body;
            await user_repository_1.default.update(req.user.uid, {
                name,
                phone,
                location,
                preferredLanguage,
                smsEnabled,
            });
            const updatedUser = await user_repository_1.default.findById(req.user.uid);
            return response_1.ApiResponse.success(res, updatedUser, 'Profile updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async addFarm(req, res, next) {
        try {
            const { name, size, crops, soilType } = req.body;
            const user = await user_repository_1.default.findById(req.user.uid);
            if (!user) {
                return response_1.ApiResponse.error(res, 'User not found', 404);
            }
            const newFarm = {
                id: `farm_${Date.now()}`,
                name,
                size,
                crops,
                soilType,
                registeredDate: new Date().toISOString(),
            };
            await user_repository_1.default.update(req.user.uid, {
                farms: [...user.farms, newFarm],
            });
            return response_1.ApiResponse.success(res, newFarm, 'Farm added successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async registerFCMToken(req, res, next) {
        try {
            const { token } = req.body;
            await user_repository_1.default.addFCMToken(req.user.uid, token);
            return response_1.ApiResponse.success(res, null, 'FCM token registered');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map