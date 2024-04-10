import { Injectable } from "@nestjs/common";
import { REDEEM } from "src/constants";
import { GetListDto, Redeem, RedeemDetail, Store, User } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { ErrorHelper } from "src/utils";
import {
    CreateManyDetailsDto,
    CreateRedeemDetailDto,
    RedeemDetailsService,
    UpdateRedeemDetailDto
} from "../redeem-details";
import { RedeemItemsService } from "../redeem-items";
import { CreateRedeemDto, UpdateRedeemDto } from "./dto";
import { RedeemsRepository } from "./redeems.repository";

@Injectable()
export class RedeemsService {
    constructor(
        private readonly redeemsRepository: RedeemsRepository,
        private readonly redeemDetailsService: RedeemDetailsService,
        private readonly redeemItemsService: RedeemItemsService,
    ) { }

    async getListRedeems(paginateInfo: GetListDto): Promise<IPaginationRes<Redeem>> {
        const { page, limit } = paginateInfo;
        return this.redeemsRepository.paginate(parseInt(page), parseInt(limit), {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName']
                },
                {
                    model: Store,
                    as: 'store',
                    attributes: ['name']
                }
            ],
            raw: false,
            nest: true
        });
    }

    async getRedeemById(id: string): Promise<Redeem> {
        const redeem = await this.redeemsRepository.findOne({
            where: {
                id
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName']
                },
                {
                    model: Store,
                    as: 'store',
                    attributes: ['name']
                }
            ],
            raw: false,
            nest: true
        });
        if (!redeem) {
            ErrorHelper.BadRequestException(REDEEM.REDEEM_NOT_FOUND);
        }
        return redeem;
    }

    async getRedeemsByUser(paginateInfo: GetListDto, userId: string): Promise<IPaginationRes<Redeem>> {
        const { page, limit } = paginateInfo;
        return this.redeemsRepository.paginate(parseInt(page), parseInt(limit), {
            where: {
                userId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'lastName']
                },
                {
                    model: Store,
                    as: 'store',
                    attributes: ['name']
                }
            ],
            attributes: { exclude: ['userId', 'storeId'] },
            raw: false,
            nest: true
        });
    }

    async calcRedeemPoints(redeemId: string): Promise<number> {
        const redeemDetails = await this.redeemDetailsService.getRedeemDetailsByRedeem(redeemId);

        const totalPoints = redeemDetails.reduce((total, currentDetail) => {
            return total + currentDetail.quantityRedeem;
        }, 0);

        await this.redeemItemsService.updateRedeemItemsQuantity(redeemDetails);

        const redeemDetailsIds = redeemDetails.map(detail => detail.id);

        await this.redeemDetailsService.updateStatusRedeemDetails(redeemDetailsIds);

        return totalPoints;
    }

    async createRedeem(body: CreateRedeemDto, userId: string): Promise<Redeem> {
        return this.redeemsRepository.create(
            {
                ...body,
                userId,
            }
        )
    }

    async updateRedeem(id: string, body: UpdateRedeemDto, userId: string): Promise<Redeem[]> {
        const redeem = await this.getRedeemById(id);
        if (redeem.userId !== userId) {
            ErrorHelper.BadRequestException(REDEEM.REDEEM_NOT_FOUND);
        }

        if (body.status === redeem.status) {
            ErrorHelper.BadRequestException(REDEEM.STATUS_NOT_CHANGED);
        }

        return this.redeemsRepository.update(body, { where: { id } });
    }

    async deleteRedeem(id: string, userId: string): Promise<IMessageResponse> {
        const redeem = await this.getRedeemById(id);
        if (redeem.userId !== userId) {
            ErrorHelper.BadRequestException(REDEEM.REDEEM_NOT_FOUND);
        }

        const deleteResult = await this.redeemsRepository.delete({ where: { id } });
        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(REDEEM.DELETE_FAILED);
        }
        return {
            message: REDEEM.DELETE_SUCCESS
        }
    }

    async createRedeemDetail(body: CreateRedeemDetailDto): Promise<RedeemDetail> {
        await this.getRedeemById(body.redeemId);

        return this.redeemDetailsService.createRedeemDetail(body);
    }

    async createManyRedeemDetails(body: CreateManyDetailsDto): Promise<RedeemDetail[]> {
        await this.getRedeemById(body.redeemId);

        return this.redeemDetailsService.createManyRedeemDetails(body);
    }

    async updateRedeemDetail(id: string, body: UpdateRedeemDetailDto): Promise<RedeemDetail[]> {
        const redeemDetail = await this.redeemDetailsService.getRedeemDetailById(id);

        if (body.redeemId && body.redeemId !== redeemDetail.redeemId) {
            await this.getRedeemById(body.redeemId);
        }

        return this.redeemDetailsService.updateRedeemDetail(id, body, redeemDetail);
    }
}