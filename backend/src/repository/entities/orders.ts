// type Ticket = {
//     day: string;
//     daytime: string;
//     film: string;
//     price: number;
//     row: number;
//     seat: number;
//     session: string;
//     time: string;
// }

import { randomUUID } from 'crypto';

// export type Order = {
//     email: string;
//     phone: string;
//     tickets: Ticket[]
// }

export class Ticket {
  private id: string;
  public film: string;
  public session: string;
  public daytime: string;
  public row: number;
  public seat: number;
  public price: number;
  constructor(props: {
    film: string;
    session: string;
    daytime: Date;
    row: number;
    seat: number;
    price: number;
  }) {
    Object.assign(this, props);
    this.id = randomUUID();
    this.validate();
  }

  private validate() {
    if (this.row <= 0 || this.seat <= 0)
      throw new Error('Некорректный выбор места');
    if (this.price <= 0)
      throw new Error('Цена должна быть положительным числом');
  }
}

export class Order {
  private id: string;
  private createdAt: string;
  constructor(
    public email: string,
    public phone: string,
    public tickets: Ticket[],
  ) {
    this.id = randomUUID();
    this.createdAt = new Date().toISOString();
    this.validate();
  }
  private validate() {
    if (this.tickets.length === 0)
      throw new Error('В заказе должны быть билеты');
  }

  public getOrderId() {
    return this.id;
  }
}
