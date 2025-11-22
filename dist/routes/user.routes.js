"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/profile', auth_middleware_1.authenticate, user_controller_1.default.getProfile);
router.put('/profile', auth_middleware_1.authenticate, user_controller_1.default.updateProfile);
router.post('/farms', auth_middleware_1.authenticate, user_controller_1.default.addFarm);
router.post('/fcm-token', auth_middleware_1.authenticate, user_controller_1.default.registerFCMToken);
exports.default = router;
//# sourceMappingURL=user.routes.js.map