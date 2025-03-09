import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
  }

  generateProfileCacheKey(username: string): string {
    return `github_profile_${username}`;
  }

  generateRepoCacheKey(username: string, repoName: string): string {
    return `github_repo_${username}_${repoName}`;
  }

  async invalidateGitHubCache(username: string): Promise<void> {
    await this.del(this.generateProfileCacheKey(username));
  }

  async invalidateRepoCacheKey(
    username: string,
    repoName: string,
  ): Promise<void> {
    await this.del(this.generateRepoCacheKey(username, repoName));
  }
}
