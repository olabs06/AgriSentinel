"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    // Firebase
    FIREBASE_PROJECT_ID: zod_1.z.string(),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().email(),
    FIREBASE_PRIVATE_KEY: zod_1.z.string(),
    // ML Service
    ML_SERVICE_URL: zod_1.z.string().url(),
    ML_SERVICE_API_KEY: zod_1.z.string(),
    // External APIs
    GOOGLE_WEATHER_API_KEY: zod_1.z.string(),
    TERMII_API_KEY: zod_1.z.string(),
    NASC_API_KEY: zod_1.z.string().optional(),
    // JWT
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Storage
    STORAGE_BUCKET: zod_1.z.string(),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().default('900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().default('100'),
    // BigQuery (Optional)
    BIGQUERY_PROJECT_ID: zod_1.z.string().optional(),
    BIGQUERY_DATASET: zod_1.z.string().optional(),
});
const env = envSchema.parse(process.env);
exports.default = env;
//# sourceMappingURL=env.js.map