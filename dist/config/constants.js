"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DETECTION_SOURCE = exports.USER_ROLES = exports.ALERT_SEVERITY = exports.LANGUAGES = exports.CROPS = void 0;
exports.CROPS = {
    CASSAVA: 'cassava',
    TOMATO: 'tomato',
    MAIZE: 'maize',
    RICE: 'rice',
    BEANS: 'beans',
};
exports.LANGUAGES = {
    ENGLISH: 'en',
    YORUBA: 'yo',
    HAUSA: 'ha',
    IGBO: 'ig',
};
exports.ALERT_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
};
exports.USER_ROLES = {
    FARMER: 'farmer',
    EXTENSION_OFFICER: 'extension_officer',
    ADMIN: 'admin',
};
exports.DETECTION_SOURCE = {
    TFLITE: 'TFLite',
    GEMMA: 'Gemma Vision',
    HYBRID: 'TFLite + Gemma',
};
//# sourceMappingURL=constants.js.map