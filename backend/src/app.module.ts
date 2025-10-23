// app.module.ts
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { DatabaseDynamicModule } from './database.dynamic.module';
import { configProvider, AppConfig } from './app.config.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseDynamicModule.forRoot({
      database: {
        driver: process.env.DATABASE_DRIVER,
        url: process.env.DATABASE_URL,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database_name: process.env.DATABASE_NAME,
        films_collection: process.env.FILMS_COLLECTION,
        orders_collection: process.env.ORDERS_COLLECTION,
      },
    } as AppConfig),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'),
      serveRoot: '/content',
    }),
  ],
  controllers: [],
  providers: [
    configProvider,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject('CONFIG') private readonly config: AppConfig,
  ) {}

  async onModuleInit() {
    try {
      console.log('Используемый драйвер БД:', this.config.database.driver);
      // Если нужно использовать IDatabaseService, можно получить его через модуль
      // или перенести логику в отдельный сервис
    } catch (error) {
      console.error('Ошибка при инициализации модуля:', error);
    }
  }
}
