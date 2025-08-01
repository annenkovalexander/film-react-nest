import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
  @Prop({
    required: true,
    type: Date,
    validate: {
      validator: (v: any) => !isNaN(Date.parse(v)),
      message: (props: any) => `${props.value} не является датой!`,
    },
  })
  daytime: Date;
  @Prop({
    required: true,
    validate: {
      validator: (v: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          v,
        ),
      message: (props) => `${props.value} это не UUID!`,
    },
  })
  film: string;
  @Prop({
    required: true,
  })
  price: number;
  @Prop({
    required: true,
  })
  row: number;
  @Prop({
    required: true,
  })
  seat: number;
  @Prop({
    required: true,
    validate: {
      validator: (v: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          v,
        ),
      message: (props) => `${props.value} это не UUID!`,
    },
  })
  session: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({
    required: true,
    validate: {
      validator: (email: string): boolean =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email),
      message: () => `Должен быть указан валидный email`,
    },
  })
  email: string;
  @Prop({
    required: true,
    validate: {
      validator: (phone: string): boolean =>
        /^(\+?\d{1,3}[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/.test(phone),
      message: () => `Должен быть указан валидный phone`,
    },
  })
  phone: string;
  @Prop({
    required: true,
    default: [],
    type: [TicketSchema],
  })
  tickets: Ticket[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
