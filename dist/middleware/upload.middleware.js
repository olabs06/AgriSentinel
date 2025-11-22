"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../utils/errors");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(new errors_1.ValidationError('Only image files are allowed'));
        return;
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter,
});
//# sourceMappingURL=upload.middleware.js.map