import { Injectable } from "@nestjs/common";
import { StoresRepository } from "./stores.repository";
import { IPaginationRes } from "src/interfaces";
import { AccumulateMethod, Store } from "src/database";
import { CreateStoreDto, GetListStoresDto, UpdateStoreDto } from "./dto";
import { EncryptHelper, ErrorHelper } from "src/utils";
import { EMAIL, STORE } from "src/constants";
import { MethodsService } from "../methods/methods.service";

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly methodsService: MethodsService
    ) { }

    async getListStores(paginateInfo: GetListStoresDto): Promise<IPaginationRes<Store>> {
        const { page, limit } = paginateInfo;
        return this.storesRepository.paginate(parseInt(page), parseInt(limit), {
            include: [{
                model: AccumulateMethod,
                as: 'method'
            }],
            attributes: { exclude: ['password', 'methodId'] },
            raw: false,
            nest: true
        });
    }

    async getStoreById(id: string): Promise<Store> {
        return await this.storesRepository.findOne({
            where: {
                id
            },
            include: [{
                model: AccumulateMethod,
                as: 'method'
            }],
            attributes: { exclude: ['password', 'methodId'] },
            raw: false,
            nest: true
        });
    }

    async createStore(body: CreateStoreDto): Promise<Store> {
        const store = await this.storesRepository.findOne({
            where: {
                email: body.email
            }
        });
        if (store) {
            ErrorHelper.ConflictException(EMAIL.EMAIL_EXIST);
        }

        const method = await this.methodsService.findById(body.methodId);
        if (!method) {
            ErrorHelper.NotFoundException(STORE.METHOD_NOT_FOUND);
        }

        const hashPassword = await EncryptHelper.hash(body.password);

        return await this.storesRepository.create(
            {
                ...body,
                password: hashPassword,
                isVerified: true,
                isApproved: true
            })
    }

    async updateStore(id: string, body: UpdateStoreDto): Promise<Store[]> {
        const store = await this.storesRepository.findOne({
            where: {
                id
            }
        });
        if (!store) {
            ErrorHelper.BadRequestException(STORE.STORE_NOT_FOUND);
        }

        if (body.email && body.email !== store.email) {
            const findStore = await this.storesRepository.findOne({
                where: {
                    email: body.email
                }
            });
            if (findStore) {
                ErrorHelper.ConflictException(EMAIL.EMAIL_EXIST);
            }
        }

        if (body.methodId && body.methodId !== store.methodId) {
            const method = await this.methodsService.findById(body.methodId);
            if (!method) {
                ErrorHelper.NotFoundException(STORE.METHOD_NOT_FOUND);
            }
        }

        return await this.storesRepository.update(body, { where: { id } });
    }

    async deleteStore(id: string): Promise<number> {
        const store = await this.storesRepository.findOne({
            where: {
                id
            }
        });

        if (!store) {
            ErrorHelper.BadRequestException(STORE.STORE_NOT_FOUND);
        }

        return await this.storesRepository.delete({ where: { id } });
    }

    async approveStore(id: string): Promise<Store[]> {
        const store = await this.storesRepository.findOne({
            where: { id }
        });
        if (!store) {
            ErrorHelper.NotFoundException(STORE.STORE_NOT_FOUND);
        }

        return this.storesRepository.update({ isApproved: true }, { where: { id } });
    }
}