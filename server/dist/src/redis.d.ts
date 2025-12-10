import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare const createRedisClient: (configService: ConfigService) => Redis;
