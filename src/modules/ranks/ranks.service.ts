import { Injectable } from "@nestjs/common";
import { RanksRepository } from "./ranks.repository";
import { Rank } from "src/database";

@Injectable()
export class RanksService {
    constructor(private readonly ranksRepository: RanksRepository) { }

    async findById(id: string): Promise<Rank> {
        return this.ranksRepository.findOne({
            where: {
                id
            }
        });
    }

    async findByName(name: string): Promise<Rank> {
        return this.ranksRepository.findOne({
            where: {
                name
            }
        });
    }
}