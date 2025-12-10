"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const createRedisClient = (configService) => {
    const url = configService.get('REDIS_URL');
    if (!url) {
        throw new Error('REDIS_URL is not set');
    }
    return new ioredis_1.default(url, {
        lazyConnect: true,
        maxRetriesPerRequest: 2,
    });
};
exports.createRedisClient = createRedisClient;
//# sourceMappingURL=redis.js.map