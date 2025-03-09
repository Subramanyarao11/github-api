import { Injectable } from '@nestjs/common';
import { AnalyticsMiddleware } from '../common/middleware/analytics.middleware';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsMiddleware: AnalyticsMiddleware) {}

  getMetrics() {
    return this.analyticsMiddleware.getMetrics();
  }
}
