"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./config/logger"));
const PORT = env_1.default.PORT || 3000;
const server = app_1.default.listen(PORT, () => {
    logger_1.default.info(`🚀 AgriSentinel API running on port ${PORT}`);
    logger_1.default.info(`📝 Environment: ${env_1.default.NODE_ENV}`);
    logger_1.default.info(`🔥 Firebase Project: ${env_1.default.FIREBASE_PROJECT_ID}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger_1.default.info('HTTP server closed');
        process.exit(0);
    });
});
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('Unhandled Rejection:', reason);
    process.exit(1);
});
exports.default = server;
//# sourceMappingURL=server.js.map