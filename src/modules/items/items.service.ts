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
            order: [['name', 'ASC']],
            raw: false,
            nest: true
        });
    }

    async createItem(body: CreateItemDto, store: TStore): Promise<Item> {
        const existItem = await this.itemsRepository.findOne({
            where: {
                name: body.name,
                storeId: store.id
            }
        });
        if (existItem) {
            if (existItem.price === body.price) {
                await this.itemsRepository.update({
                    quantityInStock: existItem.quantityInStock + body.quantityInStock
                },
                    {
                        where: {
                            id: existItem.id
                        }
                    });
            } else {
                await this.itemsRepository.update(body, { where: { id: existItem.id } });
            }
            return this.getItemById(existItem.id);
        }
        const newItem = await this.itemsRepository.create({
            ...body,
            photo: DEFAULT_ITEM_IMAGE,
            storeId: store.id
        });
        return this.getItemById(newItem.id);
    }

    async createManyItems(body: CreateArrayItemDto, store: TStore): Promise<Item[]> {
        const uniqueItems: Map<string, CreateItemDto> = new Map();
        
        body.items.forEach(item => {
            const key = item.name;
            if (!uniqueItems.has(key)) {
                uniqueItems.set(key, item);
            } else {
                let existingItem = uniqueItems.get(key);
                if(existingItem.price !== item.price) {
                    ErrorHelper.BadRequestException(ITEM.ADD_MANY_ITEMS_FAILED);
                } else {
                    existingItem.quantityInStock += item.quantityInStock;
                    uniqueItems.set(key, existingItem);
                }
            }
        });

        const uniqueItemsArray = Array.from(uniqueItems.values());

        const items = await Promise.all(uniqueItemsArray.map(async (item) => {
            const existItem = await this.itemsRepository.findOne({
                where: {
                    name: item.name,
                    storeId: store.id
                }
            });
            if (existItem) {
                if (existItem.price === item.price) {
                    return {
                        ...existItem,
                        quantityInStock: item.quantityInStock + existItem.quantityInStock
                    }
                } else {
                    return { ...existItem, ...item };
                }
            }
            return {
                ...item,
                photo: DEFAULT_ITEM_IMAGE,
                storeId: store.id
            }
        }));

        return this.itemsRepository.bulkCreate(items, {
            updateOnDuplicate: ['quantityInStock', 'price', 'description']
        });
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