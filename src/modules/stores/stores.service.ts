import { Injectable } from "@nestjs/common";
import md5 from 'md5';
import moment from "moment";

import { Sequelize } from "sequelize-typescript";
import {
    ACCESS_TOKEN_EXPIRE_TIME,
    APPLICATION, EMAIL,
    EStatus,
    ORDER,
    OTP,
    OTP_TIME_EXPIRE,
    REFRESH_TOKEN_EXPIRE_TIME,
    REFRESH_TOKEN_SECRET_KEY,
    SECRET_KEY_SEND_GMAIL,
    STORE,
    STORE_ACCESS_TOKEN_SECRET_KEY
} from "src/constants";
import {
    AccumulateMethod,
    GetListDto,
    Store,
    User,
} from "src/database";
import {
    IHashResponse,
    ILoginResponse,
    IMessageResponse,
    IPaginationRes,
    IProcessOrderRes,
    IToken,
} from "src/interfaces";
import {
    CommonHelper,
    EncryptHelper,
    ErrorHelper,
    SendEmailHelper,
    TokenHelper
} from "src/utils";
import { MethodsService } from "../methods";
import { OrdersService } from "../orders";
import { CreateStoreDto, UpdateStoreDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { StoresRepository } from "./stores.repository";
import { UsersService } from "../users";
import { MethodDetailsService } from "../method-details";

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly methodsService: MethodsService,
        private readonly ordersService: OrdersService,
        private readonly usersService: UsersService,
        private readonly methodDetailsService: MethodDetailsService,
        private sequelize: Sequelize
    ) { }

    async getListStores(paginateInfo: GetListDto): Promise<IPaginationRes<Store>> {
        const { page, limit } = paginateInfo;
        return this.storesRepository.paginate(parseInt(page), parseInt(limit), {
            include: [{
                model: AccumulateMethod,
                as: 'method',
                attributes: ['name']
            }],
            attributes: { exclude: ['password', 'methodId'] },
            order: [['name', 'DESC']],
            raw: false,
            nest: true
        });
    }

    async getStoreById(id: string): Promise<Store> {
        const store = await this.storesRepository.findOne({
            where: {
                id
            },
            include: [{
                model: AccumulateMethod,
                as: 'method',
                attributes: ['name']
            }],
            attributes: { exclude: ['password'] },
            raw: false,
            nest: true
        });
        if (!store) {
            ErrorHelper.BadRequestException(STORE.STORE_NOT_FOUND);
        }
        return store;
    }

    async getStoreByEmail(email: string): Promise<Store> {
        const store = await this.storesRepository.findOne({
            where: { email }
        });
        if (!store) {
            ErrorHelper.BadRequestException(STORE.STORE_NOT_FOUND);
        }
        return store;
    }

    async getUsersInStore(storeId: string, paginateInfo: GetListDto): Promise<IPaginationRes<User>> {
        const orders = await this.ordersService.getOrdersByStore(storeId);

        const userIds = orders.map(order => order.userId);

        return this.usersService.getUsersByIds(userIds, paginateInfo);
    }

    async checkExistEmail(email: string): Promise<void> {
        const store = await this.storesRepository.findOne({
            where: { email }
        });

        if (store) {
            ErrorHelper.BadRequestException(EMAIL.EMAIL_EXIST);
        }
    }

    async createStore(body: CreateStoreDto): Promise<Store> {
        await this.checkExistEmail(body.email);

        await this.methodsService.findById(body.methodId);

        const hashPassword = await EncryptHelper.hash(body.password);

        const newStore = await this.storesRepository.create(
            {
                ...body,
                password: hashPassword,
                isVerified: true,
                isApproved: true
            });
        return this.storesRepository.findOne({
            where: {
                id: newStore.id
            },
            include: [{
                model: AccumulateMethod,
                as: 'method',
                attributes: ['name']
            }],
            attributes: { exclude: ['password'] },
            raw: false,
            nest: true
        })
    }

    async updateStore(id: string, body: UpdateStoreDto): Promise<Store> {
        const store = await this.getStoreById(id);

        if (body.email && body.email !== store.email) {
            await this.checkExistEmail(body.email);
        }

        if (body.methodId && body.methodId !== store.methodId) {
            await this.methodsService.findById(body.methodId);
        }

        await this.storesRepository.update(body, { where: { id } });
        return this.storesRepository.findOne({
            where: {
                id
            },
            include: [{
                model: AccumulateMethod,
                as: 'method',
                attributes: ['name']
            }],
            attributes: { exclude: ['password'] },
            raw: false,
            nest: true
        })
    }

    async deleteStore(id: string): Promise<IMessageResponse> {
        await this.getStoreById(id);

        const deleteResult = await this.storesRepository.delete({ where: { id } });

        if (deleteResult <= 0) {
            ErrorHelper.BadRequestException(STORE.DELETE_FAILED);
        }

        return {
            message: STORE.DELETE_SUCCESS
        }
    }

    async approveStore(id: string): Promise<Store> {
        await this.getStoreById(id);

        await this.storesRepository.update({ isApproved: true }, { where: { id } });
        return this.storesRepository.findOne({
            where: {
                id: id
            },
            include: [{
                model: AccumulateMethod,
                as: 'method',
                attributes: ['name']
            }],
            attributes: { exclude: ['password'] },
            raw: false,
            nest: true
        })
    }

    async completeOrder(orderId: string, storeId: string): Promise<IProcessOrderRes> {
        const order = await this.ordersService.getOrderById(orderId);

        if (order.storeId !== storeId) {
            ErrorHelper.BadRequestException(ORDER.ORDER_NOT_FOUND);
        }

        if (order.status === EStatus.SUCCESS) {
            ErrorHelper.BadRequestException(ORDER.ORDER_ALREADY_SUCCESS);
        }

        const store = await this.getStoreById(storeId);

        const transaction = await this.sequelize.transaction();
        try {
            const user = await this.usersService.getUserById(order.userId);
            const orderAmount = await this.ordersService.calcOrderAmount(orderId);

            await this.ordersService.processOrder(orderId);

            const methodDetail = await this.methodDetailsService.getMethodDetail(store.methodId, user.rankId);
            const bonusPoints = this.ordersService.calculatePoints(methodDetail, orderAmount);

            await this.usersService.updateUser(user.id, {
                totalPoints: user.totalPoints + bonusPoints,
                currentPoints: user.currentPoints + bonusPoints
            });

            await this.usersService.checkPromoteRank(user.id);

            await transaction.commit();
            return {
                totalAmount: orderAmount,
                bonusPoints,
                status: EStatus.SUCCESS
            }
        } catch (error) {
            await transaction.rollback();
            ErrorHelper.BadRequestException(error);
        }
    }

    async register(body: CreateStoreDto): Promise<IHashResponse> {
        await this.checkExistEmail(body.email);

        await this.methodsService.findById(body.methodId);

        const hashPassword = await EncryptHelper.hash(body.password);

        const newStore = await this.storesRepository.create(
            {
                ...body,
                password: hashPassword
            });

        const hashCode = await this.sendOTP(newStore.email);

        return {
            hash: hashCode.hash
        };
    }

    async login(body: LoginDto): Promise<ILoginResponse> {
        const { password, email } = body;

        const store = await this.getStoreByEmail(email);

        const isValidPassword = await EncryptHelper.compare(
            password,
            store.password,
        );
        if (!isValidPassword)
            ErrorHelper.BadRequestException(STORE.INVALID_PASSWORD);

        if (!store.isVerified) {
            ErrorHelper.BadRequestException(STORE.STORE_NOT_VERIFIED);
        }

        if (!store.isApproved) {
            ErrorHelper.BadRequestException(STORE.STORE_NOT_APPROVED);
        }

        const token = this.generateToken(
            {
                id: store.id,
                isStore: true
            }
        );
        delete store.password;
        return {
            token
        };
    }

    private generateToken(payload: object): IToken {
        const { token: accessToken, expires } = TokenHelper.generate(
            payload,
            STORE_ACCESS_TOKEN_SECRET_KEY,
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

    async sendOTP(email: string): Promise<IHashResponse> {
        await this.storesRepository.findOne({
            where: {
                email
            }
        });

        const OTP = CommonHelper.generateOTP();
        SendEmailHelper.sendOTP({
            to: email,
            subject: 'Confirm OTP',
            OTP,
        });

        const hashCode = CommonHelper.hashData(
            JSON.stringify({
                otp: OTP,
                time: moment().add(OTP_TIME_EXPIRE, 'second').valueOf(),
                email,
            }),
        );
        return {
            hash: hashCode
        };
    }

    async verifyOTP(otp: string, hash: string): Promise<IMessageResponse> {
        const checkHashInfo = CommonHelper.checkHashData(hash);
        if (!checkHashInfo) {
            ErrorHelper.BadRequestException(APPLICATION.VERIFY_FAIL);
        }

        const hashInfo = JSON.parse(checkHashInfo);
        if (hashInfo.time < new Date().getTime()) {
            ErrorHelper.InternalServerErrorException(OTP.OTP_TIMEOUT);
        }

        if (otp !== hashInfo.otp) {
            ErrorHelper.InternalServerErrorException(OTP.OTP_INVALID);
        }

        await this.storesRepository.update(
            { isVerified: true },
            {
                where: {
                    email: hashInfo.email
                }
            });
        return {
            message: APPLICATION.VERIFY_OTP_SUCCESS
        };
    }
}