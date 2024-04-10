import { Injectable } from "@nestjs/common";
import { EStatus, REDEEM_DETAIL } from "src/constants";
import { GetListDto, RedeemDetail, RedeemItem } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { ErrorHelper } from "src/utils";
import { CreateManyDetailsDto, CreateRedeemDetailDto, UpdateRedeemDetailDto } from "./dto";
import { RedeemDetailsRepository } from "./redeem-details.repository";
import { Op } from "sequelize";
import { RedeemItemsService } from "../redeem-items";

@Injectable()
export class RedeemDetailsService {
    constructor(
        private readonly redeemDetailsRepository: RedeemDetailsRepository,
        private readonly redeemItemsService: RedeemItemsService
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
            attributes: {exclude: ['itemId']},
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
            attributes: {exclude: ['itemId']},
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
                    attributes: ['name', 'exchangePoint', 'quantityRedeem']
                }
            ],
            raw: false,
            nest: true
        });
    }

    async createRedeemDetail(body: CreateRedeemDetailDto): Promise<RedeemDetail> {
        const item = await this.redeemItemsService.getRedeemItemById(body.itemId);

        if (body.quantityRedeem > item.quantity) {
            ErrorHelper.BadRequestException(REDEEM_DETAIL.OVER_QUANTITY(item.name, item.quantity));
        }

        return this.redeemDetailsRepository.create(body);
    }

    async createManyRedeemDetails(body: CreateManyDetailsDto): Promise<RedeemDetail[]> {
        const errors: string[] = [];
        const itemsPromise = body.redeemItems.map(async (redeemItem) => {
            const item = await this.redeemItemsService.getRedeemItemById(redeemItem.itemId);
            if (redeemItem.quantityRedeem > item.quantity) {
                errors.push(REDEEM_DETAIL.OVER_QUANTITY(item.name, item.quantity));
            }
            return {
                ...redeemItem,
                redeemId: body.redeemId
            }
        });

        const items = await Promise.all(itemsPromise);
        
        if(errors.length > 0) {
            ErrorHelper.BadRequestException(errors.join('\n'));
        }
        
        return this.redeemDetailsRepository.bulkCreate(items);
    }

    async updateRedeemDetail(id: string, body: UpdateRedeemDetailDto, detail?: RedeemDetail): Promise<RedeemDetail[]> {
        const redeemDetail = detail ? detail : await this.getRedeemDetailById(id);

        if (body.itemId && body.itemId !== redeemDetail.itemId) {
            await this.redeemItemsService.getRedeemItemById(body.itemId);
        }

        const item = await this.redeemItemsService.getRedeemItemById(redeemDetail.itemId);
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