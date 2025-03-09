import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { GitHubModule } from './github/github.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheModule } from './cache/cache.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
