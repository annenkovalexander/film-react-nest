import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../repository/orders.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async addOrder(order: Order): Promise<OrderDocument> {
    const createdOrder = new this.orderModel(order);
    return createdOrder.save();
  }
}
