import { z } from 'zod';
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        test: "test";
        production: "production";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_URL: z.ZodString;
    REDIS_URL: z.ZodString;
    JWT_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    AWS_ACCESS_KEY: z.ZodString;
    AWS_SECRET_KEY: z.ZodString;
    AWS_BUCKET: z.ZodString;
    STRIPE_SECRET: z.ZodString;
}, z.core.$strip>;
export type Env = z.infer<typeof envSchema>;
export declare const validateEnv: (config: Record<string, unknown>) => Env;
