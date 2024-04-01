import { Injectable } from "@nestjs/common";
import { MethodDetailsRepository } from "./method-details.repository";
import { MethodDetail } from "src/database";
import { ErrorHelper } from "src/utils";
import { METHOD_DETAIL } from "src/constants";

@Injectable()
export class MethodDetailsService {
    constructor(
        private readonly methodDetailsRepository: MethodDetailsRepository
    ) { }

    async getMethodDetail(methodId: string, rankId: string): Promise<MethodDetail>{
        const detail = await this.methodDetailsRepository.findOne({
            where: {
                methodId,
                rankId
            }
        });
        if(!detail) {
            ErrorHelper.BadRequestException(METHOD_DETAIL.METHOD_DETAIL_NOT_FOUND);
        }
        return detail;
    }
}