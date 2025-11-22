"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detection_controller_1 = __importDefault(require("../controllers/detection.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, upload_middleware_1.upload.single('image'), detection_controller_1.default.create);
router.get('/', auth_middleware_1.authenticate, detection_controller_1.default.getMyDetections);
router.get('/:id', auth_middleware_1.authenticate, detection_controller_1.default.getById);
router.delete('/:id', auth_middleware_1.authenticate, detection_controller_1.default.delete);
exports.default = router;
//# sourceMappingURL=detection.routes.js.map