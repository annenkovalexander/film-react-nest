import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './orders.schema';
import { OrderService } from 'src/order/order.service';
import { OrderController } from 'src/order/order.controller';
import { OrderRepository } from './ordersRepositoryInMongoDB';
import { FilmModule } from './films.module';
import { AppConfig, configProvider } from 'src/app.config.provider';
import { AppConfigModule } from 'src/app.config.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        { 
          imports: [AppConfigModule],
          name: Order.name,
          useFactory: (config: AppConfig) => {
            const collectionName = config.database.orders_collection;
            return OrderSchema.set('collection', collectionName);
          },
          inject: ['CONFIG']
        }
    ]),
    FilmModule,
  ],
  providers: [OrderService, OrderRepository, configProvider],
  controllers: [OrderController],
})
export class OrderModule {}
