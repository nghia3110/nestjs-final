import { Injectable } from "@nestjs/common";
import { EStatus } from "src/constants";
import { GetListDto, Store, User } from "src/database";
import { IPaginationRes } from "src/interfaces";
import { MethodDetailsService } from "../method-details";
import { OrdersService } from '../orders';
import { UsersService } from "../users";

@Injectable()
export class UserOrderService {
    constructor(
        private readonly usersService: UsersService,
        private readonly ordersService: OrdersService,
        private readonly methodDetailsService: MethodDetailsService
    ) { }

    async getUsersInStore(storeId: string, paginateInfo: GetListDto): Promise<IPaginationRes<User>> {
        const orders = await this.ordersService.getOrdersByStore(storeId);

        const userIds = orders.map(order => order.userId);

        return this.usersService.getUsersByIds(userIds, paginateInfo);
    }

    async processOrder(orderId: string, store: Store, userId: string): Promise<void> {
        const user = await this.usersService.getUserById(userId);
        const orderAmount = await this.ordersService.calcOrderAmount(orderId);

        await this.ordersService.updateOrder(orderId,
            {
                status: EStatus.SUCCESS
            },
            store.id);

        const methodDetail = await this.methodDetailsService.getMethodDetail(store.methodId, user.rankId);
        const bonusPoints = this.ordersService.calculatePoints(methodDetail, orderAmount);

        await this.usersService.updateUser(user.id, {
            totalPoints: user.totalPoints + bonusPoints,
            currentPoints: user.currentPoints + bonusPoints
        });

        await this.usersService.checkPromoteRank(user.id);
    }
}