import { Injectable } from "@nestjs/common";
import { BulkCreateOptions } from "sequelize";
import { ITEM } from "src/constants";
import { GetListDto, Item, Store } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { TStore } from "src/types";
import { ErrorHelper } from "src/utils";
import { CreateItemDto, UpdateItemDto, UpdateItemQuantityDto } from "./dto";
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
            attributes: { exclude: ['storeId'] },
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
            storeId: store.id
        });
    }

    async createManyItems(body: CreateItemDto[], store: TStore): Promise<Item[]> {
        const items = body.map(item => ({
            ...item,
            storeId: store.id
        }));

        return this.itemsRepository.bulkCreate(items);
    }

    async bulkCreateItems(body: UpdateItemQuantityDto[], options: BulkCreateOptions<Item>): Promise<Item[]> {
        return this.itemsRepository.bulkCreate(body, options);
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
}