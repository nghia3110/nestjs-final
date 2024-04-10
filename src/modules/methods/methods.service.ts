import { Injectable } from "@nestjs/common";
import { MethodsRepository } from "./methods.repository";
import { AccumulateMethod } from "src/database";
import { ErrorHelper } from "src/utils";
import { STORE } from "src/constants";

@Injectable()
export class MethodsService {
    constructor(
        private readonly methodsRepository: MethodsRepository
    ) { }

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
}