import { Injectable } from "@nestjs/common";
import { CreateOrderDto, OrdersService } from "../orders";
import { CreateRedeemDto, RedeemsService } from "../redeems";
import { StoresService } from "../stores";
import { UsersService } from "../users";
import { Order, Redeem } from "src/database";

@Injectable()
export class OrderRedeemService {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly redeemsService: RedeemsService,
        private readonly storesService: StoresService,
        private readonly usersService: UsersService,
    ) {}

    async createOrder(body: CreateOrderDto, storeId: string): Promise<Order> {
        await this.usersService.getUserById(body.userId);
        return this.ordersService.createOrder(body, storeId);
    }

    async createRedeem(body: CreateRedeemDto, userId: string): Promise<Redeem> {
        await this.storesService.getStoreById(body.storeId);
        return this.redeemsService.createRedeem(body, userId);
    }
}