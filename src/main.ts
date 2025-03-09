import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RateLimitInterceptor } from './common/interceptors/rate-limit-interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new RateLimitInterceptor());

  const config = new DocumentBuilder()
    .setTitle('GitHub API Integration')
    .setDescription(
      'API for fetching GitHub profile and repository information',
    )
    .setVersion('1.0')
    .addTag('github')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
