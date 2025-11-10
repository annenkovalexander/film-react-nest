// app.module.ts
import { Inject, LoggerService, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

import { FilmModule } from './repository/films.module';
import { OrderModule } from './repository/orders.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseDynamicModule } from './database.dynamic.module';
import { AppConfigModule } from './app.config.module';
import { LoggerProvider } from './utils/Loggers/logger.provider';
import { LoggerModule } from './utils/Loggers/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppConfigModule,
    DatabaseDynamicModule.forRootAsync(),
    FilmModule,
    OrderModule,
    LoggerModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'),
      serveRoot: '/content',
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [],
  providers: [LoggerProvider],
  exports: [LoggerProvider]
})
export class AppModule {
  constructor(@Inject('APP_LOGGER') private readonly logger: LoggerService, private readonly databaseService: DatabaseService) {
    logger.log('App is started creating...')
  }

  async onModuleInit() {
    this.logger.log('AppModule initialized, checking database connection...');

    // Даем время на установление соединения с БД 
    setTimeout(async () => {
      try {
        this.logger.log('Getting list of databases...');
        const databases = await this.databaseService.listDatabases(this.logger);
        this.logger.log('Список баз данных:', databases);
      } catch (error) {
        this.logger.error('Failed to list databases:', error);
      }
    }, 2000);
  }
}
