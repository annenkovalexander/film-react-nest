import { Module } from '@nestjs/common';
import {ServeStaticModule} from "@nestjs/serve-static";
import {ConfigModule} from "@nestjs/config";
import * as path from "node:path";

import {configProvider} from "./app.config.provider";
import { FilmController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { FilmsInMemoryRepository } from './repository/filmsRepositioryInMemory';
import { OrdersInMemoryRepository } from './repository/ordersRepositoryInMemory';

// console.log('dirname: ', path.join(__dirname, '../public/content/afisha'));

@Module({
  imports: [
	ConfigModule.forRoot({
          isGlobal: true,
          cache: true
      }),
      // @todo: Добавьте раздачу статических файлов из public
      ServeStaticModule.forRoot({
        rootPath: path.join(__dirname, '..', 'public', 'content'),  // корень — папка public/content
        serveRoot: '/content',                                 // префикс URL
      }),
      
  ],
  controllers: [FilmController, OrderController],
  providers: [configProvider, FilmsService, OrderService, FilmsInMemoryRepository, OrdersInMemoryRepository],
})
export class AppModule {}
