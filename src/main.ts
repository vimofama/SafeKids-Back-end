import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { nestCsrf, CsrfFilter } from 'ncsrf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add CSRF protection
  app.use(cookieParser());
  app.use(nestCsrf());
  app.useGlobalFilters(new CsrfFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS to allow requests from the frontend
  app.enableCors({
    origin: 'http://localhost:5173/',
    credentials: true,
  });
  const port = process.env.PORT || 3005;
  await app.listen(port);
}
bootstrap();
