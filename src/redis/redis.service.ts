import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setToken(key: string, value: string, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async getToken(key: string): Promise<string | undefined> {
    return await this.cacheManager.get(key);
  }

  async deleteToken(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
