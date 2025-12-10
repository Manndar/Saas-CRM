import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const createRedisClient = (configService: ConfigService): Redis => {
  const url = configService.get<string>('REDIS_URL');

  if (!url) {
    throw new Error('REDIS_URL is not set');
  }

  return new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  });
};
