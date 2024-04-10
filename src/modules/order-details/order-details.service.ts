import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { EStatus, ORDER_DETAIL } from "src/constants";
import { GetListDto, Item, OrderDetail, User } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { ErrorHelper } from "src/utils";
import { ItemsService } from "../items/items.service";
import { OrdersService } from "../orders/orders.service";
import { CreateManyDetailsDto, CreateOrderDetailDto, UpdateOrderDetailDto } from "./dto";
import { OrderDetailsRepository } from "./order-details.repository";
import { Op } from "sequelize";

@Injectable()
export class OrderDetailsService {
    constructor(
        private readonly orderDetailsRepository: OrderDetailsRepository,
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
        @Inject(forwardRef(() => ItemsService))
        private readonly itemsService: ItemsService
    ) { }

    async getListOrderDetails(paginateInfo: GetListDto): Promise<IPaginationRes<OrderDetail>> {
        const { page, limit } = paginateInfo;
        return this.orderDetailsRepository.paginate(parseInt(page), parseInt(limit), {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName']
                },
                {
                    model: Item,
                    as: 'item',
                    attributes: ['name']
                }
            ],
            raw: false,
            nest: true
        });
    }

    async getOrderDetailById(id: string): Promise<OrderDetail> {
        const orderDetail = await this.orderDetailsRepository.findOne({
            where: {
                id
            }
        });
        if (!orderDetail) {
            ErrorHelper.BadRequestException(ORDER_DETAIL.ORDER_DETAIL_NOT_FOUND);
        }
        return orderDetail;
    }

    async getOrderDetailsByOrder(orderId: string): Promise<OrderDetail[]> {
        return this.orderDetailsRepository.find({
            where: {
                orderId,
            },
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: ['name', 'price', 'quantityInStock']
                }
            ],
            raw: false,
            nest: true
        });
    }

    async createOrderDetail(body: CreateOrderDetailDto): Promise<OrderDetail> {
        await this.ordersService.getOrderById(body.orderId);

        const item = await this.itemsService.getItemById(body.itemId);

        if (body.quantityOrdered > item.quantityInStock) {
            ErrorHelper.BadRequestException(ORDER_DETAIL.OVER_QUANTITY(item.name, item.quantityInStock));
        }

        return this.orderDetailsRepository.create(body);
    }

    async createManyOrderDetails(body: CreateManyDetailsDto): Promise<OrderDetail[]> {
        await this.ordersService.getOrderById(body.orderId);

        const items = body.orderedItems.map(async (orderedItem) => {
            const item = await this.itemsService.getItemById(orderedItem.itemId);
            if (orderedItem.quantityOrdered > item.quantityInStock) {
                ErrorHelper.BadRequestException(ORDER_DETAIL.OVER_QUANTITY(item.name, item.quantityInStock));
            }
            return {
                ...item,
                orderId: body.orderId
            }
        });

        return this.orderDetailsRepository.bulkCreate(items);
    }

    async updateOrderDetail(id: string, body: UpdateOrderDetailDto): Promise<OrderDetail[]> {
        const orderDetail = await this.getOrderDetailById(id);

        if (body.orderId && body.orderId !== orderDetail.orderId) {
            await this.ordersService.getOrderById(body.orderId);
        }

        if (body.itemId && body.itemId !== orderDetail.itemId) {
            await this.itemsService.getItemById(body.itemId);
        }

        const item = await this.itemsService.getItemById(orderDetail.itemId);
        if (body.quantityOrdered && body.quantityOrdered > item.quantityInStock) {
            ErrorHelper.BadRequestException(ORDER_DETAIL.OVER_QUANTITY(item.name, item.quantityInStock));
        }

        return this.orderDetailsRepository.update(body, { where: { id } });
    }

    async deleteOrderDetail(id: string): Promise<IMessageResponse> {
        await this.getOrderDetailById(id);

        const deleteResult = await this.orderDetailsRepository.delete({ where: { id } });
        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(ORDER_DETAIL.DELETE_FAILED);
        }
        return {
            message: ORDER_DETAIL.DELETE_SUCCESS
        }
    }

    async updateStatusOrderDetails(ids: string[]): Promise<void> {
        await this.orderDetailsRepository.update(
            {
                status: EStatus.SUCCESS
            },
            {
                where: {
                    id: { [Op.in]: ids }
                }
            }
        );
    }
}