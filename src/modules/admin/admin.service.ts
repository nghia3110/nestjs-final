import { Injectable } from "@nestjs/common";
import { CreateStoreDto, StoresService, UpdateStoreDto } from "../stores";
import { CreateUserDto, UpdateUserDto, UsersService } from "../users";
import { GetListDto, Store, User } from "src/database";
import { IMessageResponse, IPaginationRes } from "src/interfaces";

@Injectable()
export class AdminService {
    constructor(
        private readonly usersService: UsersService,
        private readonly storesService: StoresService
    ) { }

    async getListUsers(paginateInfo: GetListDto): Promise<IPaginationRes<User>> {
        return this.usersService.getListUsers(paginateInfo);
    }

    async getUserById(id: string): Promise<User> {
        return this.usersService.getUserById(id);
    }
    async createUser(body: CreateUserDto): Promise<User> {
        return this.usersService.createUser(body);
    }

    async updateUser(id: string, body: UpdateUserDto): Promise<User[]> {
        return this.usersService.updateUser(id, body);
    }

    async deleteUser(id: string): Promise<IMessageResponse> {
        return this.usersService.deleteUser(id);
    }

    async getListStores(paginateInfo: GetListDto): Promise<IPaginationRes<Store>> {
        return this.storesService.getListStores(paginateInfo);
    }

    async getStoreById(id: string): Promise<Store> {
        return this.storesService.getStoreById(id);
    }

    async createStore(body: CreateStoreDto): Promise<Store> {
        return this.storesService.createStore(body);
    }

    async updateStore(id: string, body: UpdateStoreDto): Promise<Store[]> {
        return this.storesService.updateStore(id, body)
    }

    async deleteStore(id: string): Promise<IMessageResponse> {
        return this.storesService.deleteStore(id)
    }

    async approveStore(id: string): Promise<Store[]> {
        return this.storesService.approveStore(id);
    }
}