import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OrdersInMemoryRepository } from 'src/repository/ordersRepositoryInMemory';
import { Order, OrderResult } from 'src/repository/entities/orders';

@Injectable()
export class OrderService {
    constructor (private readonly ordersRepository: OrdersInMemoryRepository) {}
    createOrder(order: Order): OrderResult {
        this.ordersRepository.addOrder(order);
        return {
            total: order.tickets.length,
            items: order.tickets.map(ticket => ({
                id: randomUUID(),
                ...ticket
            }))
        };
    }
}
