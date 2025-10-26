// app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

import { FilmModule } from './repository/films.module';
import { OrderModule } from './repository/orders.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseDynamicModule } from './database.dynamic.module';
import { AppConfigModule } from './app.config.module';

@Module({
  imports: [
    // ConfigModule ДОЛЖЕН БЫТЬ ПЕРВЫМ
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppConfigModule,
    DatabaseDynamicModule.forRootAsync(),
    FilmModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'),
      serveRoot: '/content',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly databaseService: DatabaseService) {
    console.log('app module created');
  }
  
  async onModuleInit() {
    console.log('AppModule initialized, checking database connection...');
    
    // Даем время на установление соединения с БД
    setTimeout(async () => {
      try {
        console.log('Getting list of databases...');
        const databases = await this.databaseService.listDatabases();
        console.log('Список баз данных:', databases);
      } catch (error) {
        console.error('Failed to list databases:', error);
      }
    }, 2000);
  }
}