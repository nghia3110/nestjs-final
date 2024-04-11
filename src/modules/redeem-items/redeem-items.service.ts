import { Injectable } from "@nestjs/common";
import { GetListDto, RedeemDetail, RedeemItem, Store } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { CreateArrayRedeemItemDto, CreateRedeemItemDto, UpdateRedeemItemDto } from "./dto";
import { ErrorHelper } from "src/utils";
import { DEFAULT_ITEM_IMAGE, ITEM } from "src/constants";
import { RedeemItemsRepository } from "./redeem-items.repository";
import { TStore } from "src/types";

@Injectable()
export class RedeemItemsService {
    constructor(
        private readonly redeemItemsRepository: RedeemItemsRepository,
    ) { }

    async getListRedeemItems(paginateInfo: GetListDto): Promise<IPaginationRes<RedeemItem>> {
        const { page, limit } = paginateInfo;
        return this.redeemItemsRepository.paginate(parseInt(page), parseInt(limit), {
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

    async getRedeemItemById(id: string): Promise<RedeemItem> {
        const item = await this.redeemItemsRepository.findOne({
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

    async getRedeemItemsByStore(storeId: string, paginateInfo: GetListDto): Promise<IPaginationRes<RedeemItem>> {
        const { page, limit } = paginateInfo;
        return this.redeemItemsRepository.paginate(parseInt(page), parseInt(limit), {
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

    async createRedeemItem(body: CreateRedeemItemDto, store: TStore): Promise<RedeemItem> {
        return this.redeemItemsRepository.create(
            {
                ...body,
                photo: DEFAULT_ITEM_IMAGE,       
                storeId: store.id
            });
    }

    async createManyRedeemItems(body: CreateArrayRedeemItemDto, store: TStore): Promise<RedeemItem[]> {
        const items = body.items.map(item => ({
            ...item,
            photo: DEFAULT_ITEM_IMAGE,
            storeId: store.id
        }));

        return this.redeemItemsRepository.bulkCreate(items);
    }

    async updateRedeemItem(id: string, body: UpdateRedeemItemDto, store: TStore): Promise<RedeemItem[]> {
        const item = await this.getRedeemItemById(id);

        if (item.storeId !== store.id) {
            ErrorHelper.BadRequestException(ITEM.ITEM_NOT_FOUND);
        }

        return this.redeemItemsRepository.update(body, { where: { id } });
    }

    async deleteRedeemItem(id: string, store: TStore): Promise<IMessageResponse> {
        const item = await this.getRedeemItemById(id);

        if (item.storeId !== store.id) {
            ErrorHelper.BadRequestException(ITEM.ITEM_NOT_FOUND);
        }

        await this.redeemItemsRepository.delete({ where: { id } });
        return {
            message: ITEM.DELETE_SUCCESS
        }
    }

    async updateRedeemItemsQuantity(redeemDetails: RedeemDetail[]): Promise<void> {
        for (const detail of redeemDetails) {
            await this.redeemItemsRepository.getModel().decrement('quantity', {
                by: detail.quantityRedeem,
                where: { id: detail.itemId },
            });
        }
    }

    async saveImageForItem(itemId: string, imageUrl: string): Promise<RedeemItem[]> {
        await this.getRedeemItemById(itemId);
        return this.redeemItemsRepository.update({ photo: imageUrl }, { where: { id: itemId } });
    }
}