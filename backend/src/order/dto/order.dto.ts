// order/dto/order.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class TicketResponseDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'ID фильма',
  })
  film: string;

  @ApiProperty({
    example: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
    description: 'ID сеанса',
  })
  session: string;

  @ApiProperty({
    example: '2023-05-29T10:30:00.001Z',
    description: 'Время сеанса',
  })
  daytime: Date;

  @ApiProperty({ example: 2, description: 'Ряд' })
  row: number;

  @ApiProperty({ example: 5, description: 'Место' })
  seat: number;

  @ApiProperty({ example: 350, description: 'Цена билета' })
  price: number;
}

export class TicketDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'ID фильма',
  })
  film: string;

  @ApiProperty({
    example: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
    description: 'ID сеанса',
  })
  session: string;

  @ApiProperty({
    example: '2023-05-29T10:30:00.001Z',
    description: 'Время сеанса',
  })
  daytime: Date;

  @ApiProperty({ example: 2, description: 'Ряд' })
  row: number;

  @ApiProperty({ example: 5, description: 'Место' })
  seat: number;

  @ApiProperty({ example: 350, description: 'Цена билета' })
  price: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: 2, description: 'Количество билетов' })
  total: number;

  @ApiProperty({ type: [TicketResponseDto], description: 'Список билетов' })
  items: TicketResponseDto[];
}

export class OrderDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({ example: '+79991234567', description: 'Телефон пользователя' })
  phone: string;

  @ApiProperty({
    type: [TicketDto],
    description: 'Список билетов',
    example: [
      {
        film: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        session: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
        daytime: '2023-05-29T10:30:00.001Z',
        row: 2,
        seat: 5,
        price: 350,
      },
    ],
  })
  tickets: TicketDto[];
}
