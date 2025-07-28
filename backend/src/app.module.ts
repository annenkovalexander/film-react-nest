import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmModule } from './repository/films.module';
import { OrderModule } from './repository/orders.module';
import { DatabaseModule } from './database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // @todo: Добавьте раздачу статических файлов из public
    MongooseModule.forRoot(process.env.DATABASE_URL),
    // MongooseModule.forRootAsync({
    //   imports: [AppConfigModule],
    //   useFactory: async (config: AppConfig) => {
    //     console.log('config: ', config);
    //     console.log('url: ', process.env.DATABASE_URL);
    //     return {
    //       uri: config.database.url + '/afisha'
    //     };
    //   },
    //   inject: ['CONFIG'],
    // }),
    OrderModule,
    FilmModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'), // корень — папка public/content
      serveRoot: '/content', // префикс URL
    }),
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
