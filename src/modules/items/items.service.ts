import { Injectable } from "@nestjs/common";
import { DEFAULT_ITEM_IMAGE, ITEM } from "src/constants";
import { GetListDto, Item, OrderDetail, Store } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { TStore } from "src/types";
import { ErrorHelper } from "src/utils";
import { CreateArrayItemDto, CreateItemDto, UpdateItemDto } from "./dto";
import { ItemsRepository } from "./items.repository";

@Injectable()
export class ItemsService {
    constructor(
        private readonly itemsRepository: ItemsRepository,
    ) { }

    async getListItems(paginateInfo: GetListDto): Promise<IPaginationRes<Item>> {
        const { page, limit } = paginateInfo;
        return this.itemsRepository.paginate(parseInt(page), parseInt(limit), {
            include: [{
                model: Store,
                as: 'store',
                attributes: ['id', 'name']
            }],
            attributes: { exclude: ['storeId'] },
            order: [['createdAt', 'ASC']],
            raw: false,
            nest: true
        });
    }

    async getItemById(id: string): Promise<Item> {
        const item = await this.itemsRepository.findOne({
            where: { id },
            include: [{
                model: Store,
                as: 'store',
                attributes: ['name']
            }],
            raw: false,
            nest: true
        });
        if (!item) {
            ErrorHelper.BadRequestException(ITEM.ITEM_NOT_FOUND);
        }
        return item;
    }

    async getItemsByStore(storeId: string, paginateInfo: GetListDto): Promise<IPaginationRes<Item>> {
        const { page, limit } = paginateInfo;
        return this.itemsRepository.paginate(parseInt(page), parseInt(limit), {
            where: {
                storeId
            },
            include: [{
                model: Store,
                as: 'store',
                attributes: ['name']
            }],
            attributes: { exclude: ['storeId'] },
            raw: false,
            nest: true
        });
    }

    async createItem(body: CreateItemDto, store: TStore): Promise<Item> {
        return this.itemsRepository.create({
            ...body,
            photo: DEFAULT_ITEM_IMAGE,
            storeId: store.id
        });
    }

    async createManyItems(body: CreateArrayItemDto, store: TStore): Promise<Item[]> {
        const items = body.items.map(item => ({
            ...item,
            photo: DEFAULT_ITEM_IMAGE,
            storeId: store.id
        }));

        return this.itemsRepository.bulkCreate(items);
    }

    async updateItemsQuantity(orderDetails: OrderDetail[]): Promise<void> {
        for (const detail of orderDetails) {
            await this.itemsRepository.getModel().decrement('quantityInStock', {
                by: detail.quantityOrdered,
                where: { id: detail.itemId },
            });
        }
    }

    async updateItem(id: string, body: UpdateItemDto, store: TStore): Promise<Item[]> {
        const item = await this.getItemById(id);

        if (item.storeId !== store.id) {
            ErrorHelper.BadRequestException(ITEM.ITEM_NOT_FOUND);
        }

        return this.itemsRepository.update(body, { where: { id } });
    }

    async deleteItem(id: string, store: TStore): Promise<IMessageResponse> {
        const item = await this.getItemById(id);

        if (item.storeId !== store.id) {
            ErrorHelper.BadRequestException(ITEM.ITEM_NOT_FOUND);
        }

        const deleteResult = await this.itemsRepository.delete({ where: { id } });
        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(ITEM.DELETE_FAILED);
        }
        return {
            message: ITEM.DELETE_SUCCESS
        }
    }

    async saveImageForItem(itemId: string, imageUrl: string): Promise<Item[]> {
        await this.getItemById(itemId);
        return this.itemsRepository.update({ photo: imageUrl }, { where: { id: itemId } });
    }
}