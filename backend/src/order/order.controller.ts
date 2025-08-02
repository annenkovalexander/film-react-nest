import { Body, Controller, Post } from '@nestjs/common';
import { Order } from '../repository/orders.schema';
import { OrderService } from './order.service';
import { OrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async order(@Body() order: OrderDto): Promise<OrderResponseDto> {
    const serviceOrder: Order = {
      email: order.email,
      phone: order.phone,
      tickets: order.tickets.map((ticket) => ({ ...ticket })),
    };

    const orderResponse: Order =
      await this.orderService.createOrder(serviceOrder);
    return {
      total: orderResponse.tickets.length,
      items: orderResponse.tickets,
    };
  }
}
