import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { AMOUNT_INCREASE_POINT, ORDER } from "src/constants";
import { GetListDto, MethodDetail, Order, OrderDetail, Store, User } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { ErrorHelper } from "src/utils";
import { ItemsService } from "../items";
import {
    CreateManyDetailsDto,
    CreateOrderDetailDto,
    OrderDetailsService,
    UpdateOrderDetailDto
} from "../order-details";
import { UsersService } from "../users";
import { CreateOrderDto, UpdateOrderDto } from "./dto";
import { OrdersRepository } from "./orders.repository";

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => OrderDetailsService))
        private readonly orderDetailsService: OrderDetailsService,
        private readonly itemsService: ItemsService,
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

    async paginateOrdersInStore(storeId: string, paginateInfo: GetListDto): Promise<IPaginationRes<Order>> {
        const { page, limit } = paginateInfo;
        return this.ordersRepository.paginate(parseInt(page), parseInt(limit), {
            where: {
                storeId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName']
                }
            ],
            attributes: { exclude: ['storeId'] },
            raw: false,
            nest: true
        });
    }

    calculatePoints(methodDetail: MethodDetail, amount: number): number {
        let bonusPoints: number;

        if (methodDetail.fixedPoint > 0) {
            bonusPoints = Math.floor(amount / AMOUNT_INCREASE_POINT) * methodDetail.fixedPoint;
        } else {
            if (amount < AMOUNT_INCREASE_POINT) {
                bonusPoints = Math.min(methodDetail.maxPoint, Math.round(amount * 0.001) * (methodDetail.percentage / 100));
            } else {
                const r = Math.floor(amount / AMOUNT_INCREASE_POINT);
                bonusPoints = methodDetail.maxPoint * r +
                    Math.min(methodDetail.maxPoint, Math.round((amount - r * AMOUNT_INCREASE_POINT) * 0.001) * (methodDetail.percentage / 100));
            }
        }

        return Math.round(bonusPoints);
    }

    async calcOrderAmount(orderId: string): Promise<number> {
        const orderDetails = await this.orderDetailsService.getOrderDetailsByOrder(orderId);

        const totalAmount = orderDetails.reduce((total, currentDetail) => {
            return total + (currentDetail.quantityOrdered * currentDetail.item.price);
        }, 0);

        await this.itemsService.updateItemsQuantity(orderDetails);

        const orderDetailsIds = orderDetails.map(detail => detail.id);

        await this.orderDetailsService.updateStatusOrderDetails(orderDetailsIds);

        return totalAmount;
    }

    async createOrder(body: CreateOrderDto, storeId: string): Promise<Order> {
        await this.usersService.getUserById(body.userId);
        return this.ordersRepository.create(
            {
                ...body,
                storeId,
            }
        )
    }

    async updateOrder(id: string, body: UpdateOrderDto, storeId: string): Promise<Order[]> {
        const order = await this.getOrderById(id);
        if (order.storeId !== storeId) {
            ErrorHelper.BadRequestException(ORDER.ORDER_NOT_FOUND);
        }

        if (body.status === order.status) {
            ErrorHelper.BadRequestException(ORDER.STATUS_NOT_CHANGED);
        }

        return this.ordersRepository.update(body, { where: { id } });
    }

    async deleteOrder(id: string, storeId: string): Promise<IMessageResponse> {
        const order = await this.getOrderById(id);
        if (order.storeId !== storeId) {
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

    async createOrderDetail(body: CreateOrderDetailDto): Promise<OrderDetail> {
        await this.getOrderById(body.orderId);
        return this.orderDetailsService.createOrderDetail(body);
    }

    async createManyOrderDetails(body: CreateManyDetailsDto): Promise<OrderDetail[]> {
        await this.getOrderById(body.orderId);
        return this.orderDetailsService.createManyOrderDetails(body);
    }

    async updateOrderDetails(id: string, body: UpdateOrderDetailDto): Promise<OrderDetail[]> {
        const orderDetail = await this.orderDetailsService.getOrderDetailById(id);
        if (body.orderId && body.orderId !== orderDetail.orderId) {
            await this.getOrderById(body.orderId);
        }
        return this.orderDetailsService.updateOrderDetail(id, body, orderDetail);
    }
}