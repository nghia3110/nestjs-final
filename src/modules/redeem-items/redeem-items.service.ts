import { Injectable } from "@nestjs/common";
import { GetListDto, RedeemItem, Store } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { CreateRedeemItemDto, UpdateRedeemItemDto } from "./dto";
import { ErrorHelper } from "src/utils";
import { ITEM } from "src/constants";
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
                attributes: ['id', 'name']
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
        const expiredTime = new Date(body.expiredTime);
        if(expiredTime < new Date()) {
            ErrorHelper.BadRequestException(ITEM.INVALID_EXPIRED_TIME);
        }
        return this.redeemItemsRepository.create(
            {
                ...body,
                storeId: store.id
            });
    }

    async createManyRedeemItems(body: CreateRedeemItemDto[], store: TStore): Promise<RedeemItem[]> {
        const items = body.map(item => ({
            ...item,
            storeId: store.id
        }));

        return this.redeemItemsRepository.bulkCreate(items);
    }

    async updateRedeemItem(id: string, body: UpdateRedeemItemDto, store: TStore): Promise<RedeemItem[]> {
        const item = await this.getRedeemItemById(id);

        if(item.storeId !== store.id) {
            ErrorHelper.BadRequestException(ITEM.ITEM_NOT_FOUND);
        }

        return this.redeemItemsRepository.update(body, { where: { id } });
    }

    async deleteRedeemItem(id: string, store: TStore): Promise<IMessageResponse> {
        const item = await this.getRedeemItemById(id);

        if(item.storeId !== store.id) {
            ErrorHelper.BadRequestException(ITEM.ITEM_NOT_FOUND);
        }

        const deleteResult = await this.redeemItemsRepository.delete({ where: { id } });
        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(ITEM.DELETE_FAILED);
        }
        return {
            message: ITEM.DELETE_SUCCESS
        }
    }
}