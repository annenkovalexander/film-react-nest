// repository/postgres/order.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOrderRepository } from '../../../shared/repositories/order.repository.interface';
import { IOrder } from '../../../shared/entities/order.interface';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrderPostgresRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async addOrder(order: IOrder): Promise<IOrder> {
    const orderEntity = this.orderRepository.create(order);
    const savedOrder = await this.orderRepository.save(orderEntity);
    return this.toDomain(savedOrder);
  }

  async findById(id: string): Promise<IOrder | null> {
    const order = await this.orderRepository.findOne({ where: { id } });
    return order ? this.toDomain(order) : null;
  }

  async findByEmail(email: string): Promise<IOrder[]> {
    const orders = await this.orderRepository.find({ where: { email } });
    return orders.map((order) => this.toDomain(order));
  }

  private toDomain(entity: OrderEntity): IOrder {
    return {
      id: entity.id,
      email: entity.email,
      phone: entity.phone,
      tickets: entity.tickets,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
