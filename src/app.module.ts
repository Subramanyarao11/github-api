import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { GitHubModule } from './github/github.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheModule } from './cache/cache.module';
import { AnalyticsMiddleware } from './common/middleware/analytics.middleware';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttle.ttl') || 60,
          limit: config.get('throttle.limit') || 10,
        },
      ],
      inject: [ConfigService],
    }),
    NestCacheModule.register({
      isGlobal: true,
      ttl: 60 * 2000, // set to 2mins (in ms)
      max: 100,
    }),
    GitHubModule,
    CacheModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnalyticsMiddleware).forRoutes('*');
  }
}
