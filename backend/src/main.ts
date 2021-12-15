import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder();

  config.setTitle("Pong");

  const doc = SwaggerModule.createDocument(app, config.build()) 
  SwaggerModule.setup('api', app, doc);
  await app.listen(5000);
}
bootstrap();
