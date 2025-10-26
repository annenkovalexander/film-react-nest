import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IOrder } from '../shared/entities/order.interface';
import { FilmsService } from '../films/films.service';
import { checkOccupiedSeats } from '../utils/films.utils';
import { IOrderRepository } from 'src/shared/repositories/order.repository.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY_TOKEN')
    private readonly ordersRepository: IOrderRepository,
    private readonly filmService: FilmsService,
  ) {}

  async createOrder(order: IOrder): Promise<IOrder> {
    console.log('🛒 Creating order:', order);

    // 1. Проверяем занятые места
    const taken = await this.filmService.getOccupatedSeats(order.tickets);
    console.log('   Taken seats from DB:', taken);

    // 2. ИСПРАВЛЕНИЕ: taken может быть пустым массивом - это нормально (все места свободны)
    // Проверяем что сеанс существует другим способом
    const sessionExists = await this.filmService.getSession(
      order.tickets[0].sessionId,
    );
    if (!sessionExists) {
      console.log('   ❌ Session does not exist');
      throw new NotFoundException('Фильма на указанный сеанс не существует');
    }

    // 3. Проверяем, не заняты ли места
    const checkResult = checkOccupiedSeats(taken, order.tickets);
    console.log('   Seat check result:', checkResult);

    if (!checkResult) {
      throw new ConflictException('Места уже заняты');
    }

    // 4. Сохраняем заказ
    const savedOrder = await this.ordersRepository.addOrder(order);
    if (!savedOrder) {
      throw new InternalServerErrorException('Сохранить заказ не удалось');
    }

    // 5. Обновляем занятые места
    const updatedSeats = await this.filmService.setOccupatedSeats(
      order.tickets,
    );
    if (!updatedSeats) {
      console.error(
        'Failed to update occupied seats for order:',
        savedOrder.id,
      );
    }
    console.log('   ✅ Order created successfully:', savedOrder);
    return savedOrder;
  }
}
