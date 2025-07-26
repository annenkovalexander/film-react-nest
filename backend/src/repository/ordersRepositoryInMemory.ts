import { Injectable } from '@nestjs/common';
import { Order } from './entities/orders';

@Injectable()
export class OrdersInMemoryRepository {
  private orders: Order[] = [];
  async addOrder(order: Order) {
    this.orders.push(order);
  }
  async getOrderById(incomingOrder: Order): Promise<Order | null> {
    const filteredOrders = this.orders.filter(
      (order) => order.getOrderId() === incomingOrder.getOrderId(),
    );
    if (filteredOrders.length === 1) return filteredOrders[0];
    else return null;
  }
}
