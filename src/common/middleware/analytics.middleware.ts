import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  private metrics = {
    totalRequests: 0,
    endpoints: {},
    statusCodes: {},
    responseTimesMs: [],
    lastReset: new Date().toISOString(),
  };

  constructor() {
    setInterval(() => this.logMetricsSummary(), 60 * 60 * 1000);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const originalEnd = res.end;
    res.end = (...args: any[]) => {
      const responseTime = Date.now() - start;

      this.metrics.totalRequests++;

      const endpoint = `${req.method} ${req.path}`;
      this.metrics.endpoints[endpoint] =
        (this.metrics.endpoints[endpoint] || 0) + 1;

      const statusCode = res.statusCode.toString();
      this.metrics.statusCodes[statusCode] =
        (this.metrics.statusCodes[statusCode] || 0) + 1;

      this.metrics.responseTimesMs.push(responseTime);

      const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('user-agent') || 'unknown',
        ip: req.ip,
      };

      console.log(`[API-ANALYTICS] ${JSON.stringify(logEntry)}`);

      return originalEnd.apply(res, args);
    };

    next();
  }

  private logMetricsSummary() {
    const avgResponseTime =
      this.metrics.responseTimesMs.length > 0
        ? this.metrics.responseTimesMs.reduce((sum, time) => sum + time, 0) /
          this.metrics.responseTimesMs.length
        : 0;

    const metricsSummary = {
      timestamp: new Date().toISOString(),
      period: `${this.metrics.lastReset} to ${new Date().toISOString()}`,
      totalRequests: this.metrics.totalRequests,
      endpointCounts: this.metrics.endpoints,
      statusCodeCounts: this.metrics.statusCodes,
      averageResponseTimeMs: avgResponseTime.toFixed(2),
    };

    console.log(`[API-METRICS-SUMMARY] ${JSON.stringify(metricsSummary)}`);
    this.metrics.responseTimesMs = [];
    this.metrics.lastReset = new Date().toISOString();
  }

  getMetrics() {
    const avgResponseTime =
      this.metrics.responseTimesMs.length > 0
        ? this.metrics.responseTimesMs.reduce((sum, time) => sum + time, 0) /
          this.metrics.responseTimesMs.length
        : 0;

    return {
      timestamp: new Date().toISOString(),
      period: `${this.metrics.lastReset} to ${new Date().toISOString()}`,
      totalRequests: this.metrics.totalRequests,
      endpointCounts: this.metrics.endpoints,
      statusCodeCounts: this.metrics.statusCodes,
      averageResponseTimeMs: avgResponseTime.toFixed(2),
    };
  }
}
