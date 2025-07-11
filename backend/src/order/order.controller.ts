import { Body, Controller, Post } from '@nestjs/common';
import { Order } from 'src/repository/types/orders';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    constructor (private readonly orderService: OrderService) {}
    @Post()
    order(@Body() order: Order)  {
        return this.orderService.createOrder(order);
    }
}
