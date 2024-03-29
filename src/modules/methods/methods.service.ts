import { Injectable } from "@nestjs/common";
import { MethodsRepository } from "./methods.repository";
import { AccumulateMethod } from "src/database";

@Injectable()
export class MethodsService {
    constructor(
        private readonly methodsRepository: MethodsRepository
    ) { }

    async findById(id: string): Promise<AccumulateMethod> {
        return await this.methodsRepository.findOne({
            where: {
                id
            }
        });
    }
}