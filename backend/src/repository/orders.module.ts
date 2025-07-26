import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './orders.schema';
import { OrderService } from 'src/order/order.service';
import { OrderController } from 'src/order/order.controller';
import { OrderRepository } from './ordersRepositoryInMongoDB';
import { FilmModule } from './films.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    FilmModule,
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
