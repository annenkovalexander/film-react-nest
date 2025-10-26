import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/orders.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderMongoRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async addOrder(order: Order): Promise<OrderDocument> {
    const createdOrder = new this.orderModel(order);
    return createdOrder.save();
  }
}
