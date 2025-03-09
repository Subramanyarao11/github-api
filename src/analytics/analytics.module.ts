import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsMiddleware } from 'src/common/middleware/analytics.middleware';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsMiddleware],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
