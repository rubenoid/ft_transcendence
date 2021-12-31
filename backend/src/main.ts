import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(cookieParser())
  app.useStaticAssets(join(__dirname, "..", "static"));
  const config = new DocumentBuilder();

  config.setTitle("Pong");

  const doc = SwaggerModule.createDocument(app, config.build()) 
  SwaggerModule.setup('api', app, doc);
  await app.listen(5000);
}
bootstrap();
