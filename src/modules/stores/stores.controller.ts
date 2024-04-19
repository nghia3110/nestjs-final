import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetListDto } from 'src/database';
import { TStore } from 'src/types';
import { Store, StoreGuard, UuidParam } from 'src/utils';
import { ItemsService } from '../items';
import { OrdersService } from '../orders';
import { RedeemItemsService } from '../redeem-items';
import {
    CreateStoreDto,
} from './dto';
import { LoginDto } from './dto/login.dto';
import { SendOTPDto, VerifyOTPDto } from './dto/otp.dto';
import { StoresService } from './stores.service';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
    constructor(
        private storesService: StoresService,
        private ordersService: OrdersService,
        private itemsService: ItemsService,
        private redeemItemsService: RedeemItemsService
    ) { }

    @ApiOperation({ summary: 'API get users in store' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Get('/users')
    @HttpCode(200)
    async getUsersInStore(
        @Store() store: TStore,
        @Query() query: GetListDto,
    ) {
        return this.storesService.getUsersInStore(store.id, query);
    }

    @ApiOperation({ summary: 'API get orders in store' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Get('/orders')
    @HttpCode(200)
    async getOrdersInStore(
        @Store() store: TStore,
        @Query() query: GetListDto,
    ) {
        return this.ordersService.paginateOrdersInStore(store.id, query);
    }

    @ApiOperation({ summary: 'API get items in store' })
    @UseGuards(StoreGuard)
    @ApiBearerAuth()
    @Get('/items')
    @HttpCode(200)
    async getItemsInStore(
        @Query() query: GetListDto,
        @Store() store: TStore
    ) {
        return this.itemsService.getItemsByStore(store.id, query);
    }

    @ApiOperation({ summary: 'API get redeem items in store' })
    @UseGuards(StoreGuard)
    @ApiBearerAuth()
    @Get('/redeem-items')
    @HttpCode(200)
    async getRedeemItemsInStore(
        @Query() query: GetListDto,
        @Store() store: TStore
    ) {
        return this.redeemItemsService.getRedeemItemsByStore(store.id, query);
    }

    @ApiOperation({ summary: 'API get list order detail' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Get('/orders/:id/order-details')
    @HttpCode(200)
    async getDetails(
        @Query() query: GetListDto,
        @UuidParam('id') orderId: string,
        @Store() store: TStore) {
        return this.ordersService.getDetails(query, orderId, store.id);
    }

    @ApiOperation({ summary: 'API complete order' })
    @ApiBearerAuth()
    @UseGuards(StoreGuard)
    @Put('/orders/:id/complete')
    @HttpCode(201)
    async completeOrder(@UuidParam('id') orderId: string, @Store() store: TStore) {
        return this.storesService.completeOrder(orderId, store.id);
    }

    @ApiOperation({ summary: 'API login store' })
    @ApiBody({
        type: LoginDto,
        required: true,
        description: 'Login store'
    })
    @Post("/login")
    @HttpCode(201)
    async login(@Body() payload: LoginDto) {
        return this.storesService.login(payload);
    }

    @ApiOperation({ summary: 'API register store' })
    @ApiBody({
        type: CreateStoreDto,
        required: true,
        description: 'Register store'
    })
    @Post("/register")
    @HttpCode(201)
    async register(@Body() payload: CreateStoreDto) {
        return this.storesService.register(payload);
    }

    @ApiOperation({ summary: 'API send OTP' })
    @ApiBody({
        type: SendOTPDto,
        required: true,
        description: 'Send OTP',
    })
    @Post('/send-otp')
    @HttpCode(200)
    async sendOtp(@Body() payload: SendOTPDto) {
        const { email } = payload;
        const result = await this.storesService.sendOTP(email);
        return result;
    }

    @ApiOperation({ summary: 'API verify OTP' })
    @ApiBody({
        type: VerifyOTPDto,
        required: true,
        description: 'Verify OTP',
    })
    @Post('/verify-otp')
    @HttpCode(200)
    async verifyOtp(@Body() payload: VerifyOTPDto) {
        const { otp, hash } = payload;
        const result = await this.storesService.verifyOTP(otp, hash);
        return result;
    }
}