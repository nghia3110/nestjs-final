import { Injectable } from "@nestjs/common";
import md5 from 'md5';
import moment from "moment";

import {
    ACCESS_TOKEN_EXPIRE_TIME,
    ACCESS_TOKEN_SECRET_KEY,
    APPLICATION, EMAIL,
    OTP,
    OTP_TIME_EXPIRE,
    REFRESH_TOKEN_EXPIRE_TIME,
    REFRESH_TOKEN_SECRET_KEY,
    SECRET_KEY_SEND_GMAIL,
    STORE
} from "src/constants";
import { AccumulateMethod, Store } from "src/database";
import {
    IHashResponse,
    ILoginResponse,
    IMessageResponse,
    IPaginationRes,
    IToken,
    IVerifyOTPResponse
} from "src/interfaces";
import {
    CommonHelper,
    EncryptHelper,
    ErrorHelper,
    SendEmailHelper,
    TokenHelper
} from "src/utils";
import { MethodsService } from "../methods/methods.service";
import { CreateStoreDto, GetListStoresDto, UpdateStoreDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { StoresRepository } from "./stores.repository";

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
        const store = await this.storesRepository.findOne({
            where: {
                id
            },
            include: [{
                model: AccumulateMethod,
                as: 'method'
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
        if(!store) {
            ErrorHelper.BadRequestException(STORE.STORE_NOT_FOUND);
        }
        return store;
    }

    async checkExistEmail(email: string): Promise<void> {
        const store = await this.storesRepository.findOne({
            where: { email }
        });

        if(store) {
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

        if(deleteResult <= 0) {
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

    async login(body: LoginDto): Promise<ILoginResponse<Store>> {
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
            }
        );
        delete store.password;
        return {
            token,
            item: store,
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