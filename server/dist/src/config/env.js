"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    REDIS_URL: zod_1.z.string().min(1, 'REDIS_URL is required'),
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_REFRESH_SECRET: zod_1.z
        .string()
        .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
    AWS_ACCESS_KEY: zod_1.z.string().min(1, 'AWS_ACCESS_KEY is required'),
    AWS_SECRET_KEY: zod_1.z.string().min(1, 'AWS_SECRET_KEY is required'),
    AWS_BUCKET: zod_1.z.string().min(1, 'AWS_BUCKET is required'),
    STRIPE_SECRET: zod_1.z.string().min(1, 'STRIPE_SECRET is required'),
});
const validateEnv = (config) => exports.envSchema.parse(config);
exports.validateEnv = validateEnv;
//# sourceMappingURL=env.js.map