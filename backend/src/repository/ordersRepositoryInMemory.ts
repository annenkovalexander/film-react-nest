import { Injectable } from "@nestjs/common";
import { Order } from "./entities/orders";
import { randomUUID } from "crypto";

@Injectable()
export class OrdersInMemoryRepository {
    private orders: Order[] = [];
    addOrder(order: Order) {
        this.orders.push(order);
    }
}