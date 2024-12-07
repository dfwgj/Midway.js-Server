import { Provide, Inject } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class CustomRedisService {
    @Inject()
    redisService: RedisService;

    async set(key: string, value: string, expireInSeconds?: number) {
        if (expireInSeconds) {
            return await this.redisService.set(key, value, 'EX', 12 * 60 * 60);
        }
        return await this.redisService.set(key, value);
    }
    async get(key: string) {
        const cachedValue = await this.redisService.get(key);
        if (cachedValue) {
            return JSON.parse(cachedValue);  // 可将 JSON.parse 提取到更通用的地方
        }
        return null;
    }

    async del(key: string) {
        return await this.redisService.del(key);
    }
}
