import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Order } from '../repository/orders.schema';
import { OrderRepository } from 'src/repository/ordersRepositoryInMongoDB';
import { FilmsService } from 'src/films/films.service';
import { checkOccupiedSeats } from 'src/utils/films.utils';

@Injectable()
export class OrderService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    private readonly filmService: FilmsService,
  ) {}
  async createOrder(order: Order): Promise<Order | undefined> {
    const taken = await this.filmService.getOccupatedSeats(order.tickets);
    if (!taken)
      throw new NotFoundException('Фильма на указанный сеанс не существует');
    const checkResult = checkOccupiedSeats(taken, order.tickets);
    if (!checkResult) throw new ConflictException('Места уже заняты');
    const savedOrder = await this.ordersRepository.addOrder(order);
    if (!savedOrder)
      throw new InternalServerErrorException('Сохранить заказ не удалось');
    const updatedSeats = await this.filmService.setOccupatedSeats(
      order.tickets,
    );
    if (!updatedSeats)
      throw new InternalServerErrorException('Обновить места не удалось');
    return savedOrder;
  }
}
