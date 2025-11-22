import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  
  // Firebase
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string(),
  
  // ML Service
  ML_SERVICE_URL: z.string().url(),
  ML_SERVICE_API_KEY: z.string(),
  
  // External APIs
  GOOGLE_WEATHER_API_KEY: z.string(),
  TERMII_API_KEY: z.string(),
  NASC_API_KEY: z.string().optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Storage
  STORAGE_BUCKET: z.string(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  
  // BigQuery (Optional)
  BIGQUERY_PROJECT_ID: z.string().optional(),
  BIGQUERY_DATASET: z.string().optional(),
});

const env = envSchema.parse(process.env);

export default env;
