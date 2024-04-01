import { Injectable } from "@nestjs/common";
import { EStatus, ORDER } from "src/constants";
import { GetListDto, Order, Store, User } from "src/database";
import { IMessageResponse, IOrderAmount, IPaginationRes } from "src/interfaces";
import { TStore } from "src/types";
import { ErrorHelper } from "src/utils";
import { UsersService } from "../users/users.service";
import { CreateOrderDto, UpdateOrderDto } from "./dto";
import { OrdersRepository } from "./orders.repository";
import { OrderDetailsService } from "../orderdetails/order-details.service";

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly usersService: UsersService,
        private readonly orderDetailsService: OrderDetailsService
    ) { }

    async getListOrders(paginateInfo: GetListDto): Promise<IPaginationRes<Order>> {
        const { page, limit } = paginateInfo;
        return this.ordersRepository.paginate(parseInt(page), parseInt(limit), {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName']
                },
                {
                    model: Store,
                    as: 'store',
                    attributes: ['name']
                }
            ],
            raw: false,
            nest: true
        });
    }

    async getOrderById(id: string): Promise<Order> {
        const order = await this.ordersRepository.findOne({
            where: {
                id
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName', 'rankId']
                },
                {
                    model: Store,
                    as: 'store',
                    attributes: ['name', 'methodId']
                }
            ],
            raw: false,
            nest: true
        });
        if (!order) {
            ErrorHelper.BadRequestException(ORDER.ORDER_NOT_FOUND);
        }
        return order;
    }

    async getOrdersByStore(storeId: string): Promise<Order[]> {
        return this.ordersRepository.find({
            where: { storeId }
        })
    }

    async calcOrderAmount(orderId: string): Promise<IOrderAmount> {
        const order = await this.getOrderById(orderId);
        
        const orderDetails = await this.orderDetailsService.getOrderDetailsByOrder(orderId);

        const totalAmount = orderDetails.reduce((total, currentDetail) => {
            return total + (currentDetail.quantityOrdered * currentDetail.item.price);
        }, 0);

        await this.orderDetailsService.updateItemsQuantity(orderDetails);

        const orderDetailsIds = orderDetails.map(detail => detail.id);

        await this.orderDetailsService.deleteManyOrderDetails(orderDetailsIds);

        return {
            order,
            totalAmount
        }
    }

    async createOrder(body: CreateOrderDto, store: TStore): Promise<Order> {
        await this.usersService.getUserById(body.userId);

        return this.ordersRepository.create(
            {
                ...body,
                storeId: store.id,
                status: EStatus.PENDING
            }
        )
    }

    async updateOrder(id: string, body: UpdateOrderDto, store: TStore): Promise<Order[]> {
        const order = await this.getOrderById(id);
        if (order.storeId !== store.id) {
            ErrorHelper.BadRequestException(ORDER.ORDER_NOT_FOUND);
        }

        if (body.status === order.status) {
            ErrorHelper.BadRequestException(ORDER.STATUS_NOT_CHANGED);
        }

        return this.ordersRepository.update(body, { where: { id } });
    }

    async deleteOrder(id: string, store: TStore): Promise<IMessageResponse> {
        const order = await this.getOrderById(id);
        if (order.storeId !== store.id) {
            ErrorHelper.BadRequestException(ORDER.ORDER_NOT_FOUND);
        }

        const deleteResult = await this.ordersRepository.delete({ where: { id } });
        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(ORDER.DELETE_FAILED);
        }
        return {
            message: ORDER.DELETE_SUCCESS
        }
    }
}