import { Injectable } from "@nestjs/common";
import { EStatus, ORDER_DETAIL } from "src/constants";
import { GetListDto, Item, OrderDetail } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { ErrorHelper } from "src/utils";
import { ItemsService } from "../items";
import { CreateManyDetailsDto, CreateOrderDetailDto, OrderedItemDetail, UpdateOrderDetailDto } from "./dto";
import { OrderDetailsRepository } from "./order-details.repository";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class OrderDetailsService {
    constructor(
        private readonly orderDetailsRepository: OrderDetailsRepository,
        private readonly itemsService: ItemsService,
        private sequelize: Sequelize
    ) { }

    async getListOrderDetails(paginateInfo: GetListDto): Promise<IPaginationRes<OrderDetail>> {
        const { page, limit } = paginateInfo;
        return this.orderDetailsRepository.paginate(parseInt(page), parseInt(limit), {
            include: [
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
            },
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: ['name']
                }
            ],
            raw: false,
            nest: true
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

    async paginateDetailByOrder(paginateInfo: GetListDto, orderId: string): Promise<IPaginationRes<OrderDetail>> {
        const { page, limit } = paginateInfo;
        return this.orderDetailsRepository.paginate(parseInt(page), parseInt(limit), {
            where: {
                orderId,
            },
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: ['name', 'price']
                }
            ],
            raw: false,
            nest: true
        });
    }

    async createOrderDetail(body: CreateOrderDetailDto): Promise<OrderDetail> {
        const item = await this.itemsService.getItemById(body.itemId);

        if (item.quantityInStock === 0) {
            ErrorHelper.BadRequestException(`Item ${item.name} is out of stock!`);
        }

        if (body.quantityOrdered > item.quantityInStock) {
            ErrorHelper.BadRequestException(ORDER_DETAIL.OVER_QUANTITY(item.name, item.quantityInStock));
        }

        const detail = await this.orderDetailsRepository.findOne({
            where: {
                itemId: item.id,
                orderId: body.orderId
            }
        });

        if (detail && detail.status !== EStatus.SUCCESS) {
            if (detail.quantityOrdered + body.quantityOrdered > item.quantityInStock) {
                ErrorHelper.BadRequestException(ORDER_DETAIL.OVER_QUANTITY(item.name, item.quantityInStock));
            }
            await this.orderDetailsRepository.update({
                quantityOrdered: detail.quantityOrdered + body.quantityOrdered
            },
                {
                    where: { id: detail.id }
                });
            return this.getOrderDetailById(detail.id);
        }

        const newDetail = await this.orderDetailsRepository.create(body);
        return this.getOrderDetailById(newDetail.id);
    }

    async createManyOrderDetails(body: CreateManyDetailsDto): Promise<OrderDetail[]> {
        const errors: string[] = [];

        const uniqueItems: Map<string, OrderedItemDetail> = new Map();

        body.orderedItems.forEach(item => {
            const key = item.itemId;
            if (!uniqueItems.get(key)) {
                uniqueItems.set(key, item);
            } else {
                let existItem = uniqueItems.get(key);
                existItem.quantityOrdered += item.quantityOrdered;
                uniqueItems.set(key, existItem);
            }
        });

        const uniqueItemsArray = Array.from(uniqueItems.values());

        const transaction = await this.sequelize.transaction();
        try {
            for (const orderedItem of uniqueItemsArray) {
                const item = await this.itemsService.getItemById(orderedItem.itemId);
                if (item.quantityInStock === 0) {
                    errors.push(ORDER_DETAIL.OUT_OF_STOCK(item.name));
                    continue;

                }
                if (orderedItem.quantityOrdered > item.quantityInStock && item.quantityInStock > 0) {
                    errors.push(ORDER_DETAIL.OVER_QUANTITY(item.name, item.quantityInStock));
                    continue;
                }

                const detail = await this.orderDetailsRepository.findOne({
                    where: {
                        itemId: orderedItem.itemId,
                        orderId: body.orderId
                    },
                    transaction
                });

                if (detail) {
                    if (detail.status !== EStatus.SUCCESS) {
                        if (detail.quantityOrdered + orderedItem.quantityOrdered > item.quantityInStock) {
                            errors.push(ORDER_DETAIL.OVER_QUANTITY(item.name, item.quantityInStock));
                        } else {
                            await this.orderDetailsRepository.update(
                                {
                                    quantityOrdered: detail.quantityOrdered + orderedItem.quantityOrdered
                                },
                                {
                                    where: { id: detail.id },
                                    transaction
                                },
                            );
                        }
                    }
                } else {
                    await this.orderDetailsRepository.create({
                        ...orderedItem,
                        orderId: body.orderId
                    }, { transaction });
                }
            }

            if (errors.length > 0) {
                ErrorHelper.BadRequestException(errors);
            }

            await transaction.commit();
            return Promise.all(uniqueItemsArray.map(async item => this.orderDetailsRepository.findOne({
                where: {
                    itemId: item.itemId,
                    orderId: body.orderId
                }
            })));
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    }

    async updateOrderDetail(id: string, body: UpdateOrderDetailDto, detail?: OrderDetail): Promise<OrderDetail[]> {
        const orderDetail = detail ? detail : await this.getOrderDetailById(id);
        let item: Item;
        if (body.itemId && body.itemId !== orderDetail.itemId) {
            item = await this.itemsService.getItemById(body.itemId);
        } else {
            item = await this.itemsService.getItemById(orderDetail.itemId);
        }
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