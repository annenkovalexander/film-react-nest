// shared/repositories/order.repository.interface.ts
import { IOrder } from '../entities/order.interface';

export interface IOrderRepository {
  addOrder(order: IOrder): Promise<IOrder>;
  findById(id: string): Promise<IOrder | null>;
  findByEmail(email: string): Promise<IOrder[]>;
}
