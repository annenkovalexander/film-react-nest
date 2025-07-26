//TODO реализовать DTO для /orders
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsArray,
  IsUUID,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Ticket } from 'src/repository/orders.schema';

export class OrderResponseDto {
  total: number;
  items: Ticket[];
}

export class TicketDto {
  @IsUUID()
  film: string;
  @IsDate()
  @Type(() => Date)
  daytime: Date;
  @IsString()
  day: string;
  @IsNumber()
  price: number;
  @IsNumber()
  row: number;
  @IsNumber()
  seat: number;
  @IsUUID()
  session: string;
  @IsString()
  time: string;
}

export class OrderDto {
  @IsEmail()
  email: string;
  @IsPhoneNumber()
  phone: string;
  @IsArray()
  tickets: TicketDto[];
}
