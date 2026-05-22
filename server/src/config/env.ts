import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().default('file:./dev.db'),
  JWT_SECRET: z.string().min(16).default('dev-only-change-this-secret'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('http://127.0.0.1:5174,http://localhost:5174'),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  AI_API_BASE_URL: z.string().optional().default(''),
  AI_API_KEY: z.string().optional().default(''),
  ENABLE_MOCK_AI: z.string().optional().default('true'),
})

export const env = envSchema.parse(process.env)

export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const enableMockAi = env.ENABLE_MOCK_AI !== 'false'
