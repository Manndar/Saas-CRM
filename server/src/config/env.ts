import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  AWS_ACCESS_KEY: z.string().min(1, 'AWS_ACCESS_KEY is required'),
  AWS_SECRET_KEY: z.string().min(1, 'AWS_SECRET_KEY is required'),
  AWS_BUCKET: z.string().min(1, 'AWS_BUCKET is required'),
  STRIPE_SECRET: z.string().min(1, 'STRIPE_SECRET is required'),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): Env =>
  envSchema.parse(config);
