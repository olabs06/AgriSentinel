"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const detection_routes_1 = __importDefault(require("./detection.routes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// API routes
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/detections', detection_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map