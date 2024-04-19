import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { EStatus, REDEEM_DETAIL } from "src/constants";
import { GetListDto, RedeemDetail, RedeemItem } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { CommonHelper, ErrorHelper } from "src/utils";
import { RedeemItemsService } from "../redeem-items";
import { CreateManyRedeemDetailsDto, CreateRedeemDetailDto, RedeemItemDetail, UpdateRedeemDetailDto } from "./dto";
import { RedeemDetailsRepository } from "./redeem-details.repository";

@Injectable()
export class RedeemDetailsService {
    constructor(
        private readonly redeemDetailsRepository: RedeemDetailsRepository,
        private readonly redeemItemsService: RedeemItemsService,
        private sequelize: Sequelize
    ) { }

    async getListRedeemDetails(paginateInfo: GetListDto): Promise<IPaginationRes<RedeemDetail>> {
        const { page, limit } = paginateInfo;
        return this.redeemDetailsRepository.paginate(parseInt(page), parseInt(limit), {
            include: [
                {
                    model: RedeemItem,
                    as: 'item',
                    attributes: ['name']
                }
            ],
            attributes: { exclude: ['itemId'] },
            raw: false,
            nest: true
        });
    }

    async getRedeemDetailById(id: string): Promise<RedeemDetail> {
        const redeemDetail = await this.redeemDetailsRepository.findOne({
            where: {
                id
            },
            include: [
                {
                    model: RedeemItem,
                    as: 'item',
                    attributes: ['name']
                }
            ],
            raw: false,
            nest: true
        });
        if (!redeemDetail) {
            ErrorHelper.BadRequestException(REDEEM_DETAIL.REDEEM_DETAIL_NOT_FOUND);
        }
        return redeemDetail;
    }

    async getRedeemDetailsByRedeem(redeemId: string): Promise<RedeemDetail[]> {
        return this.redeemDetailsRepository.find({
            where: {
                redeemId,
            },
            include: [
                {
                    model: RedeemItem,
                    as: 'item',
                    attributes: ['name', 'exchangePoint', 'quantity']
                }
            ],
            raw: false,
            nest: true
        });
    }

    async paginateDetailByRedeem(paginateInfo: GetListDto, redeemId: string): Promise<IPaginationRes<RedeemDetail>> {
        const { page, limit } = paginateInfo;
        return this.redeemDetailsRepository.paginate(parseInt(page), parseInt(limit), {
            where: {
                redeemId,
            },
            include: [
                {
                    model: RedeemItem,
                    as: 'item',
                    attributes: ['name', 'exchangePoint']
                }
            ],
            raw: false,
            nest: true
        });
    }

    async createRedeemDetail(body: CreateRedeemDetailDto): Promise<RedeemDetail> {
        const item = await this.redeemItemsService.getRedeemItemById(body.itemId);

        if (!CommonHelper.isValidRedeemDate(item.expiredTime, new Date())) {
            ErrorHelper.BadRequestException(REDEEM_DETAIL.OVER_EXPIRED_TIME(item.name, item.expiredTime));
        }

        if (item.quantity === 0) {
            ErrorHelper.BadRequestException(REDEEM_DETAIL.OUT_OF_STOCK(item.name));
        }

        if (body.quantityRedeem > item.quantity) {
            ErrorHelper.BadRequestException(REDEEM_DETAIL.OVER_QUANTITY(item.name, item.quantity));
        }

        const detail = await this.redeemDetailsRepository.findOne({
            where: {
                itemId: item.id
            }
        });

        if (detail && detail.status !== EStatus.SUCCESS) {
            if (detail.quantityRedeem + body.quantityRedeem > item.quantity) {
                ErrorHelper.BadRequestException(REDEEM_DETAIL.OVER_QUANTITY(item.name, item.quantity));
            }
            await this.redeemDetailsRepository.update({
                quantityRedeem: detail.quantityRedeem + body.quantityRedeem
            },
                {
                    where: {
                        id: detail.id
                    }
                });
            return this.redeemDetailsRepository.findOne({ where: { id: detail.id } });
        }

        return this.redeemDetailsRepository.create(body);
    }

    async createManyRedeemDetails(body: CreateManyRedeemDetailsDto): Promise<RedeemDetail[]> {
        const errors: string[] = [];

        const uniqueItems: Map<string, RedeemItemDetail> = new Map();

        body.redeemItems.forEach(item => {
            const key = item.itemId;
            if (!uniqueItems.get(key)) {
                uniqueItems.set(key, item);
            } else {
                let existItem = uniqueItems.get(key);
                existItem.quantityRedeem += item.quantityRedeem;
                uniqueItems.set(key, existItem);
            }
        });

        const uniqueItemsArray = Array.from(uniqueItems.values());

        const transaction = await this.sequelize.transaction();
        try {
            for (const redeemItem of uniqueItemsArray) {
                const item = await this.redeemItemsService.getRedeemItemById(redeemItem.itemId);
                if (!CommonHelper.isValidRedeemDate(item.expiredTime, new Date())) {
                    errors.push(REDEEM_DETAIL.OVER_EXPIRED_TIME(item.name, item.expiredTime));
                    continue;
                }
                if (item.quantity === 0) {
                    errors.push(REDEEM_DETAIL.OUT_OF_STOCK(item.name));
                    continue;
                }
                if (redeemItem.quantityRedeem > item.quantity && item.quantity > 0) {
                    errors.push(REDEEM_DETAIL.OVER_QUANTITY(item.name, item.quantity));
                    continue;
                }

                const detail = await this.redeemDetailsRepository.findOne({
                    where: {
                        itemId: redeemItem.itemId,
                        redeemId: body.redeemId
                    },
                    transaction
                });

                if (detail) {
                    if (detail.status !== EStatus.SUCCESS) {
                        if (detail.quantityRedeem + redeemItem.quantityRedeem > item.quantity) {
                            errors.push(REDEEM_DETAIL.OVER_QUANTITY(item.name, item.quantity));
                        } else {
                            await this.redeemDetailsRepository.update(
                                {
                                    quantityRedeem: detail.quantityRedeem + redeemItem.quantityRedeem
                                },
                                {
                                    where: { id: detail.id }
                                },
                            );
                        }
                    }
                } else {
                    await this.redeemDetailsRepository.create({
                        ...redeemItem,
                        redeemId: body.redeemId
                    }, { transaction });
                }
            }

            if (errors.length > 0) {
                ErrorHelper.BadRequestException(errors);
            }

            await transaction.commit();
            return Promise.all(uniqueItemsArray.map(async item => this.redeemDetailsRepository.findOne({
                where: {
                    itemId: item.itemId,
                    redeemId: body.redeemId
                }
            })));
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateRedeemDetail(id: string, body: UpdateRedeemDetailDto, detail?: RedeemDetail): Promise<RedeemDetail[]> {
        const redeemDetail = detail ? detail : await this.getRedeemDetailById(id);
        let item: RedeemItem;

        if (body.itemId && body.itemId !== redeemDetail.itemId) {
            item = await this.redeemItemsService.getRedeemItemById(body.itemId);
        } else {
            item = await this.redeemItemsService.getRedeemItemById(redeemDetail.itemId);
        }

        if (body.quantityRedeem && body.quantityRedeem > item.quantity) {
            ErrorHelper.BadRequestException(REDEEM_DETAIL.OVER_QUANTITY(item.name, item.quantity));
        }

        return this.redeemDetailsRepository.update(body, { where: { id } });
    }

    async deleteRedeemDetail(id: string): Promise<IMessageResponse> {
        await this.getRedeemDetailById(id);

        const deleteResult = await this.redeemDetailsRepository.delete({ where: { id } });
        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(REDEEM_DETAIL.DELETE_FAILED);
        }
        return {
            message: REDEEM_DETAIL.DELETE_SUCCESS
        }
    }

    async updateStatusRedeemDetails(ids: string[]): Promise<void> {
        await this.redeemDetailsRepository.update(
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