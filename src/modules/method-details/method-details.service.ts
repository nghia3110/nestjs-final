import { Injectable } from "@nestjs/common";
import { MethodDetailsRepository } from "./method-details.repository";
import { AccumulateMethod, GetListDto, MethodDetail, Rank } from "src/database";
import { ErrorHelper } from "src/utils";
import { METHOD, METHOD_DETAIL } from "src/constants";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { CreateMethodDetailDto, UpdateMethodDetailDto } from "./dto";
import { MethodsService } from "../methods";
import { RanksService } from "../ranks/ranks.service";

@Injectable()
export class MethodDetailsService {
    constructor(
        private readonly methodDetailsRepository: MethodDetailsRepository,
        private readonly methodsService: MethodsService,
        private readonly ranksService: RanksService
    ) { }

    async getListMethodDetails(paginateInfo: GetListDto): Promise<IPaginationRes<MethodDetail>> {
        const { page, limit } = paginateInfo;
        return this.methodDetailsRepository.paginate(parseInt(page), parseInt(limit), {
            include: [
                {
                    model: AccumulateMethod,
                    as: 'method',
                    attributes: ['name']
                },
                {
                    model: Rank,
                    as: 'rank',
                    attributes: ['name']
                }
            ],
            attributes: { exclude: ['rankId', 'methodId'] },
            order: [['createdAt', 'ASC']],
            raw: false,
            nest: true
        });
    }

    async getMethodDetailById(id: string): Promise<MethodDetail> {
        const methodDetail = await this.methodDetailsRepository.findOne({
            where: {
                id
            }
        });
        if(!methodDetail) {
            ErrorHelper.BadRequestException(METHOD_DETAIL.METHOD_DETAIL_NOT_FOUND);
        }
        return methodDetail;
    }

    async getMethodDetail(methodId: string, rankId: string): Promise<MethodDetail> {
        const detail = await this.methodDetailsRepository.findOne({
            where: {
                methodId,
                rankId
            }
        });
        if (!detail) {
            ErrorHelper.BadRequestException(METHOD_DETAIL.METHOD_DETAIL_NOT_FOUND);
        }
        return detail;
    }

    async createMethodDetail(body: CreateMethodDetailDto): Promise<MethodDetail> {
        await Promise.all([
            this.methodsService.findById(body.methodId),
            this.ranksService.findById(body.rankId)
        ]);

        return this.methodDetailsRepository.create(body);
    }

    async updateMethodDetail(id: string, body: UpdateMethodDetailDto): Promise<MethodDetail[]> {
        const methodDetail = await this.getMethodDetailById(id);

        if(body.methodId && methodDetail.methodId !== body.methodId) {
            await this.methodsService.findById(body.methodId);
        }

        if(body.rankId && methodDetail.rankId !== body.rankId) {
            await this.ranksService.findById(body.rankId);
        }

        return this.methodDetailsRepository.update(body, { where: { id } });
    }

    async deleteMethodDetail(id: string): Promise<IMessageResponse> {
        await this.getMethodDetailById(id);

        const deleteResult = await this.methodDetailsRepository.delete({ where: { id } });
        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(METHOD.DELETE_FAILED);
        }
        return {
            message: METHOD.DELETE_SUCCESS
        }
    }
}