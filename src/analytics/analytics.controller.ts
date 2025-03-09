import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(ApiKeyGuard)
  @Get()
  getAnalytics() {
    return this.analyticsService.getMetrics();
  }
}
