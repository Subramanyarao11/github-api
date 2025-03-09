import { Controller, Delete, UseGuards, Req } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Controller('admin/cache')
@UseGuards(ThrottlerGuard)
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Delete('clear')
  async clearCache(@Req() request: Request) {
    // In a real application, we would have some kind of authentication here
    // For now, we'll just check if it's from localhost
    const ip = request.ip;
    if (ip !== '127.0.0.1' && ip !== '::1') {
      return { success: false, message: 'Unauthorized' };
    }

    await this.cacheService.reset();
    return { success: true, message: 'Cache cleared successfully' };
  }
}
