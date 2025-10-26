// repository/orders.module.ts
import { Module } from '@nestjs/common';
import { OrderService } from '../order/order.service'; // новый сервис
import { OrderController } from '../order/order.controller'; // новый контроллер
import { DatabaseDynamicModule } from 'src/database.dynamic.module';
import { FilmModule } from './films.module'; // или '../films/films.module'

@Module({
  imports: [DatabaseDynamicModule.forRootAsync(), FilmModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
