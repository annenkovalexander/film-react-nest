// order/order.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderService } from './order.service';
import {
  OrderDto,
  OrderResponseDto,
  TicketDto,
  TicketResponseDto,
} from './dto/order.dto';
import { IOrder, ITicket } from '../shared/entities/order.interface';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заказ билетов' })
  @ApiResponse({
    status: 201,
    description: 'Заказ создан',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 409, description: 'Места уже заняты' })
  async order(@Body() order: OrderDto): Promise<OrderResponseDto> {
    const serviceOrder: IOrder = {
      email: order.email,
      phone: order.phone,
      tickets: order.tickets.map((ticket) => this.convertToITicket(ticket)),
    };

    const orderResponse: IOrder =
      await this.orderService.createOrder(serviceOrder);

    return {
      total: orderResponse.tickets.length,
      items: orderResponse.tickets.map((ticket) =>
        this.convertToResponseTicket(ticket),
      ),
    };
  }

  private convertToITicket(ticket: TicketDto): ITicket {
    return {
      sessionId: ticket.session, // преобразуем session в sessionId
      row: ticket.row,
      seat: ticket.seat,
      film: ticket.film,
      daytime: ticket.daytime,
      price: ticket.price,
    };
  }

  private convertToResponseTicket(ticket: ITicket): TicketResponseDto {
    return {
      film: ticket.film || '',
      session: ticket.sessionId, // преобразуем sessionId обратно в session
      daytime: ticket.daytime || new Date(),
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price || 0,
    };
  }
}
