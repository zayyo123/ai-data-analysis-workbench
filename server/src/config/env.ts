import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().default('file:./dev.db'),
  JWT_SECRET: z.string().min(16).default('dev-only-change-this-secret'),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('http://127.0.0.1:5174,http://localhost:5174'),
  AI_API_BASE_URL: z.string().optional().default(''),
  AI_API_KEY: z.string().optional().default(''),
  ENABLE_MOCK_AI: z.string().optional().default('true'),
})

export const env = envSchema.parse(process.env)

export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const enableMockAi = env.ENABLE_MOCK_AI !== 'false'
