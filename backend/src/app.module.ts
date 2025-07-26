import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { AppConfig, configProvider } from './app.config.provider';
import { FilmModule } from './repository/films.module';
import { OrderModule } from './repository/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // @todo: Добавьте раздачу статических файлов из public
    MongooseModule.forRootAsync({
      useFactory: async (config: AppConfig) => ({
        uri: config.database.url,
      }),
      inject: ['CONFIG'],
    }),
    FilmModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'), // корень — папка public/content
      serveRoot: '/content', // префикс URL
    }),
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
