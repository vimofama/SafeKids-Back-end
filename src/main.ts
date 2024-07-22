import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply CSRF protection middleware
  app.use(cookieParser());

  // Configurar middleware CSRF
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
      },
    }),
  );

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

  const config = new DocumentBuilder()
    .setTitle('SPAFIS')
    .setDescription('Endpoints de la API de SPAFIS.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'localhost:3000',
  });
  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`App running on port ${port}`);
}
bootstrap();
