import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('API проекта "Афиша"')
    .setDescription(
      'Данный документ описывает получение списка фильмов, сеансов и заказ билетов',
    )
    .setVersion('1.0')
    .build(); // Завершаем конфигурирование вызовом build

  const document = SwaggerModule.createDocument(app, config);

  // Первый аргумент — путь, по которому будет доступна
  // веб-страница с документацией Swagger
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(3000);
}
bootstrap();
