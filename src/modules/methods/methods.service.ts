import { Injectable } from "@nestjs/common";
import { MethodsRepository } from "./methods.repository";
import { AccumulateMethod, GetListDto } from "src/database";
import { ErrorHelper } from "src/utils";
import { METHOD, STORE } from "src/constants";
import { IMessageResponse, IPaginationRes } from "src/interfaces";
import { CreateMethodDto, UpdateMethodDto } from "./dto";

@Injectable()
export class MethodsService {
    constructor(
        private readonly methodsRepository: MethodsRepository
    ) { }

    async getListMethods(paginateInfo: GetListDto): Promise<IPaginationRes<AccumulateMethod>> {
        const { page, limit } = paginateInfo;
        return this.methodsRepository.paginate(parseInt(page), parseInt(limit));
    }

    async findById(id: string): Promise<AccumulateMethod> {
        const method = await this.methodsRepository.findOne({
            where: {
                id
            }
        });
        if(!method) {
            ErrorHelper.BadRequestException(STORE.METHOD_NOT_FOUND);
        }
        return method;
    }

    async createMethod(body: CreateMethodDto): Promise<AccumulateMethod> {
        return this.methodsRepository.create(body);
    }

    async updateMethod(id: string, body: UpdateMethodDto): Promise<AccumulateMethod[]> {
        await this.findById(id);
        return this.methodsRepository.update(body, { where: { id } });
    }

    async deleteMethod(id: string): Promise<IMessageResponse> {
        await this.findById(id);

        const deleteResult = await this.methodsRepository.delete({ where: { id } });
        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(METHOD.DELETE_FAILED);
        }
        return {
            message: METHOD.DELETE_SUCCESS
        }
    }
}