import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Validate } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
