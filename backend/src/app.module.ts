import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

import { AppConfig, configProvider } from './app.config.provider';
import { FilmModule } from './repository/films.module';
import { OrderModule } from './repository/orders.module';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { AppConfigModule } from './app.config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // @todo: Добавьте раздачу статических файлов из public
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfig) => {
        console.log('config: ', config);
        console.log('url: ', process.env);
        return {
          uri: config.database.url + '/practicum',
        };
      },
      inject: ['CONFIG'],
    }),
    OrderModule,
    FilmModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'), // корень — папка public/content
      serveRoot: '/content', // префикс URL
    }),
  ],
  controllers: [],
  providers: [configProvider, DatabaseService],
})
export class AppModule {
  constructor(private readonly databaseService: DatabaseService) {
    console.log('app module created');
  }
  async onModuleInit() {
    const databases = await this.databaseService.listDatabases();
    console.log('Список баз данных:', databases);
  }
}
