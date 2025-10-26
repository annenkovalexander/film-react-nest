// shared/entities/order.interface.ts
export interface IOrder {
  id?: string;
  email: string;
  phone: string;
  tickets: ITicket[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITicket {
  sessionId: string;
  row: number;
  seat: number;
  film: string;
  daytime: Date;
  price: number;
}
