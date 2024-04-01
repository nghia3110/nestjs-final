import { Injectable } from "@nestjs/common";
import { ItemsRepository } from "./items.repository";
import { GetListDto, Item, Store } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { CreateItemDto, UpdateItemDto, UpdateItemQuantityDto } from "./dto";
import { StoresService } from "../stores/stores.service";
import { ErrorHelper } from "src/utils";
import { ITEM, STORE } from "src/constants";
import { BulkCreateOptions } from "sequelize";

@Injectable()
export class ItemsService {
    constructor(
        private readonly itemsRepository: ItemsRepository,
        private readonly storesService: StoresService
    ) { }

    async getListItems(paginateInfo: GetListDto): Promise<IPaginationRes<Item>> {
        const { page, limit } = paginateInfo;
        return this.itemsRepository.paginate(parseInt(page), parseInt(limit), {
            include: [{
                model: Store,
                as: 'store',
                attributes: ['id','name']
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
        if(!item) {
            ErrorHelper.BadRequestException(ITEM.ITEM_NOT_FOUND);
        }
        return item;
    }

    async getItemByStore(storeId: string): Promise<Item[]> {
        return this.itemsRepository.find({
            where: {
                storeId
            }
        })
    }

    async checkStoreExist(storeId: string): Promise<void> {
        const store = await this.storesService.getStoreById(storeId);
        if (!store) {
            ErrorHelper.NotFoundException(STORE.STORE_NOT_FOUND);
        }
    }

    async createItem(body: CreateItemDto): Promise<Item> {
        await this.checkStoreExist(body.storeId);
        return this.itemsRepository.create(body);
    }

    async bulkCreateItems(body: UpdateItemQuantityDto[], options: BulkCreateOptions<Item>): Promise<Item[]> {
        return this.itemsRepository.bulkCreate(body, options);
    }

    async updateItem(id: string, body: UpdateItemDto): Promise<Item[]> {
        const item = await this.getItemById(id);

        if (body.storeId && body.storeId !== item.storeId) {
            await this.checkStoreExist(body.storeId);
        }

        return this.itemsRepository.update(body, { where: { id } });
    }

    async deleteItem(id: string): Promise<IMessageResponse> {
        await this.getItemById(id);

        const deleteResult = await this.itemsRepository.delete({ where: { id } });
        if(deleteResult <= 0) {
            ErrorHelper.BadRequestException(ITEM.DELETE_FAILED);
        }
        return {
            message: ITEM.DELETE_SUCCESS
        }
    }
}