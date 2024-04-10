import { Injectable } from "@nestjs/common";
import md5 from 'md5';
import moment from "moment";

import {
    ACCESS_TOKEN_EXPIRE_TIME,
    ACCESS_TOKEN_SECRET_KEY,
    AMOUNT_INCREASE_POINT,
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
    Item,
    MethodDetail,
    Order,
    RedeemItem,
    Store,
    User
} from "src/database";
import {
    IHashResponse,
    ILoginResponse,
    IMessageResponse,
    IPaginationRes,
    IToken,
    IVerifyOTPResponse
} from "src/interfaces";
import { TStore } from "src/types";
import {
    CommonHelper,
    EncryptHelper,
    ErrorHelper,
    SendEmailHelper,
    TokenHelper
} from "src/utils";
import { ItemsService } from "../items/items.service";
import { MethodDetailsService } from "../method-details/method-details.service";
import { MethodsService } from "../methods/methods.service";
import { OrdersService } from "../orders/orders.service";
import { RedeemItemsService } from "../redeem-items/redeem-items.service";
import { UsersService } from "../users/users.service";
import { CreateStoreDto, UpdateStoreDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { StoresRepository } from "./stores.repository";

@Injectable()
export class StoresService {
    constructor(
        private readonly storesRepository: StoresRepository,
        private readonly methodsService: MethodsService,
        private readonly usersService: UsersService,
        private readonly ordersService: OrdersService,
        private readonly methodDetailsService: MethodDetailsService,
        private readonly itemsService: ItemsService,
        private readonly redeemItemsService: RedeemItemsService
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

        return this.storesRepository.create(
            {
                ...body,
                password: hashPassword,
                isVerified: true,
                isApproved: true
            })
    }

    async updateStore(id: string, body: UpdateStoreDto): Promise<Store[]> {
        const store = await this.getStoreById(id);

        if (body.email && body.email !== store.email) {
            await this.checkExistEmail(body.email);
        }

        if (body.methodId && body.methodId !== store.methodId) {
            await this.methodsService.findById(body.methodId);
        }

        return this.storesRepository.update(body, { where: { id } });
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

    async approveStore(id: string): Promise<Store[]> {
        await this.getStoreById(id);

        return this.storesRepository.update({ isApproved: true }, { where: { id } });
    }

    async getAllUsersInStore(paginateInfo: GetListDto, store: TStore): Promise<IPaginationRes<User>> {
        return this.usersService.getUsersByStore(store.id, paginateInfo);
    }

    async getAllOrdersInStore(paginateInfo: GetListDto, store: TStore): Promise<IPaginationRes<Order>> {
        return this.ordersService.paginateOrdersInStore(store.id, paginateInfo);
    }

    async getAllItemsInStore(paginateInfo: GetListDto, store: TStore): Promise<IPaginationRes<Item>> {
        return this.itemsService.getItemsByStore(store.id, paginateInfo);
    }

    async getAllRedeemItemsInStore(paginateInfo: GetListDto, store: TStore): Promise<IPaginationRes<RedeemItem>> {
        return this.redeemItemsService.getRedeemItemsByStore(store.id, paginateInfo);
    }

    async completeOrder(orderId: string, storePayload: TStore): Promise<IMessageResponse> {
        const order = await this.ordersService.getOrderById(orderId);

        if (order.storeId !== storePayload.id) {
            ErrorHelper.BadRequestException(ORDER.ORDER_NOT_FOUND);
        }

        if(order.status === EStatus.SUCCESS) {
            ErrorHelper.BadRequestException(ORDER.ORDER_ALREADY_SUCCESS);
        }

        const [user, store] = await Promise.all([
            this.usersService.getUserById(order.userId),
            this.getStoreById(order.storeId)
        ]);

        const orderAmount = await this.ordersService.calcOrderAmount(orderId);

        await this.ordersService.updateOrder(order.id,
            {
                status: EStatus.SUCCESS
            },
            storePayload);

        const amount = orderAmount.totalAmount;
        const methodDetail = await this.methodDetailsService.getMethodDetail(store.methodId, user.rankId);
        const bonusPoints = this.calculatePoints(methodDetail, amount);

        await this.usersService.updateUser(user.id, {
            totalPoints: user.totalPoints + bonusPoints,
            currentPoints: user.currentPoints + bonusPoints
        });

        await this.usersService.checkPromoteRank(user.id);

        return {
            message: STORE.COMPLETE_ORDER_SUCCESS
        }
    }

    private calculatePoints(methodDetail: MethodDetail, amount: number): number {
        let bonusPoints: number;

        if (methodDetail.fixedPoint > 0) {
            bonusPoints = Math.floor(amount / AMOUNT_INCREASE_POINT) * methodDetail.fixedPoint;
        } else {
            if (amount < AMOUNT_INCREASE_POINT) {
                bonusPoints = Math.min(methodDetail.maxPoint, Math.round(amount * 0.001) * (methodDetail.percentage / 100));
            } else {
                const r = Math.floor(amount / AMOUNT_INCREASE_POINT);
                bonusPoints = methodDetail.maxPoint * r +
                    Math.min(methodDetail.maxPoint, Math.round((amount - r * AMOUNT_INCREASE_POINT) * 0.001) * (methodDetail.percentage / 100));
            }
        }

        return Math.round(bonusPoints);
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

        const hashCode = md5(
            newStore.email + SECRET_KEY_SEND_GMAIL
        );

        return {
            hash: hashCode
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

    async sendOTP(email: string, hash: string): Promise<IHashResponse> {
        const checkHash = md5(
            email + SECRET_KEY_SEND_GMAIL,
        );

        if (checkHash !== hash) {
            ErrorHelper.InternalServerErrorException(APPLICATION.HASH_IS_NOT_CORRECT);
        }

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
                isVerified: false,
            }),
        );
        return {
            hash: hashCode
        };
    }

    async verifyOTP(otp: string, hash: string): Promise<IVerifyOTPResponse> {
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

        await this.getStoreByEmail(hashInfo.email);

        await this.storesRepository.update(
            { isVerified: true },
            {
                where: {
                    email: hashInfo.email
                }
            });
        return {
            email: hashInfo.email,
            isVerified: true
        }
    }
}