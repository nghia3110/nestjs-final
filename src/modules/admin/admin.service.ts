import { Injectable } from "@nestjs/common";
import { CreateStoreDto, StoresService, UpdateStoreDto } from "../stores";
import { CreateUserDto, UpdateUserDto, UsersService } from "../users";
import { GetListDto, Store, User } from "src/database";
import { ILoginResponse, IMessageResponse, IPaginationRes, IToken } from "src/interfaces";
import { LoginAdminDto } from "./dto";
import { EncryptHelper, ErrorHelper, TokenHelper } from "src/utils";
import { ACCESS_TOKEN_EXPIRE_TIME, ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_SECRET_KEY, USER } from "src/constants";

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

    async updateUser(id: string, body: UpdateUserDto): Promise<User> {
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

    async updateStore(id: string, body: UpdateStoreDto): Promise<Store> {
        return this.storesService.updateStore(id, body)
    }

    async deleteStore(id: string): Promise<IMessageResponse> {
        return this.storesService.deleteStore(id)
    }

    async approveStore(id: string): Promise<Store> {
        return this.storesService.approveStore(id);
    }

    async login(body: LoginAdminDto): Promise<ILoginResponse> {
        const { password, email } = body;

        const admin = await this.usersService.getUserByEmail(email);

        const isValidPassword = await EncryptHelper.compare(
            password,
            admin.password,
        );
        if (!isValidPassword) {
            ErrorHelper.BadRequestException(USER.INVALID_PASSWORD);
        }

        const token = this.generateToken({
            id: admin.id,
            isAdmin: true
        });

        return {
            token
        };
    }

    private generateToken(payload: object): IToken {
        const { token: accessToken, expires } = TokenHelper.generate(
            payload,
            ACCESS_TOKEN_SECRET_KEY,
            ACCESS_TOKEN_EXPIRE_TIME,
        );
        const { token: refreshToken } = TokenHelper.generate(
            payload,
            REFRESH_TOKEN_SECRET_KEY,
            REFRESH_TOKEN_EXPIRE_TIME,
        );

        return {
            accessToken,
            expires,
            refreshToken,
        };
    }
}